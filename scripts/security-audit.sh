#!/usr/bin/env bash
set -euo pipefail

# ─── Colors & helpers ────────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'

info()    { printf "${BLUE}ℹ${RESET}  %s\n" "$*"; }
success() { printf "${GREEN}✔${RESET}  %s\n" "$*"; }
warn()    { printf "${YELLOW}⚠${RESET}  %s\n" "$*"; }
error()   { printf "${RED}✖${RESET}  %s\n" "$*"; }
step()    { printf "\n${BOLD}${CYAN}▸ %s${RESET}\n" "$*"; }
divider() { printf "${DIM}─────────────────────────────────────────────────────${RESET}\n"; }

PASS=0
WARN=0
FAIL=0

record_pass() { ((PASS++)); success "$*"; }
record_warn() { ((WARN++)); warn "$*"; }
record_fail() { ((FAIL++)); error "$*"; }

# ─── Locate root ─────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT"

# ─── Options ──────────────────────────────────────────────────────────────────

STRICT=false
VERBOSE=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --strict)  STRICT=true; shift ;;
    --verbose) VERBOSE=true; shift ;;
    -h|--help)
      printf "Usage: %s [--strict] [--verbose]\n" "$(basename "$0")"
      printf "  --strict   Exit non-zero on any warning or failure\n"
      printf "  --verbose  Show detailed output for each check\n"
      exit 0
      ;;
    *) error "Unknown option: $1"; exit 1 ;;
  esac
done

# ─── Banner ──────────────────────────────────────────────────────────────────

printf "\n${BOLD}${CYAN}"
printf "  ╭─────────────────────────────────────╮\n"
printf "  │  create-markdown security audit      │\n"
printf "  ╰─────────────────────────────────────╯\n"
printf "${RESET}\n"

# ─── Collect publishable packages ────────────────────────────────────────────

PUBLISHABLE_DIRS=()
PUBLISHABLE_NAMES=()

for pkg_dir in packages/*/; do
  pkg_json="$pkg_dir/package.json"
  [[ -f "$pkg_json" ]] || continue
  is_private="$(node -p "require('./$pkg_json').private || false")"
  [[ "$is_private" == "true" ]] && continue
  pkg_name="$(node -p "require('./$pkg_json').name")"
  PUBLISHABLE_DIRS+=("$pkg_dir")
  PUBLISHABLE_NAMES+=("$pkg_name")
done

# ═══════════════════════════════════════════════════════════════════════════════
# 1. GIT STATE
# ═══════════════════════════════════════════════════════════════════════════════

step "1/8  Git state"

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$BRANCH" == "main" ]]; then
  record_pass "On branch main"
else
  record_warn "On branch $BRANCH (not main)"
fi

if [[ -z "$(git status --porcelain)" ]]; then
  record_pass "Working tree is clean"
else
  record_warn "Working tree has uncommitted changes"
  if $VERBOSE; then git status --short; fi
fi

if git log -1 --format='%G?' 2>/dev/null | grep -qE '^[GU]$'; then
  record_pass "Latest commit is signed"
else
  record_warn "Latest commit is not GPG-signed"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# 2. DEPENDENCY VULNERABILITY AUDIT
# ═══════════════════════════════════════════════════════════════════════════════

step "2/8  Dependency vulnerabilities"

if command -v npm &>/dev/null; then
  AUDIT_TMP="$(mktemp)"
  npm audit --json > "$AUDIT_TMP" 2>/dev/null || true

  VULN_COUNTS="$(node -e "
    const fs = require('fs');
    try {
      const d = JSON.parse(fs.readFileSync('$AUDIT_TMP', 'utf8'));
      const m = d.metadata?.vulnerabilities || {};
      const c = m.critical || 0, h = m.high || 0;
      const total = c + h + (m.moderate || 0) + (m.low || 0) + (m.info || 0);
      console.log(c + ' ' + h + ' ' + total);
    } catch { console.log('-1 0 0'); }
  " 2>/dev/null || echo "-1 0 0")"

  read -r CRITICAL HIGH TOTAL_VULNS <<< "$VULN_COUNTS"
  rm -f "$AUDIT_TMP"

  if [[ "$CRITICAL" == "-1" ]]; then
    record_warn "Could not parse npm audit output"
  elif [[ "$CRITICAL" -gt 0 ]]; then
    record_fail "npm audit: ${CRITICAL} critical, ${HIGH} high (${TOTAL_VULNS} total)"
    if $VERBOSE; then npm audit 2>/dev/null || true; fi
  elif [[ "$HIGH" -gt 0 ]]; then
    record_warn "npm audit: ${HIGH} high-severity vulnerabilities (${TOTAL_VULNS} total)"
  elif [[ "$TOTAL_VULNS" -gt 0 ]]; then
    record_warn "npm audit: ${TOTAL_VULNS} vulnerabilities (none critical/high)"
  else
    record_pass "npm audit: no known vulnerabilities"
  fi
else
  record_warn "npm not found — skipping dependency audit"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# 3. SENSITIVE FILE DETECTION
# ═══════════════════════════════════════════════════════════════════════════════

step "3/8  Sensitive files in publish artifacts"

SENSITIVE_PATTERNS=(
  '.env'
  '.env.*'
  '*.pem'
  '*.key'
  '*.p12'
  '*.pfx'
  '*.keystore'
  'credentials.json'
  'service-account*.json'
  '.npmrc'
  '.netrc'
  'id_rsa'
  'id_ed25519'
  '*.secret'
)

SENSITIVE_FOUND=false

for pkg_dir in "${PUBLISHABLE_DIRS[@]}"; do
  pkg_name="$(node -p "require('./$pkg_dir/package.json').name")"
  FILES_FIELD="$(node -p "
    const f = require('./$pkg_dir/package.json').files;
    f ? f.join(',') : '__all__';
  ")"

  for pattern in "${SENSITIVE_PATTERNS[@]}"; do
    if [[ "$FILES_FIELD" == "__all__" ]]; then
      while IFS= read -r -d '' f; do
        SENSITIVE_FOUND=true
        record_fail "Sensitive file would be published: ${f}"
      done < <(find "$pkg_dir" -name "$pattern" -not -path "*/node_modules/*" -print0 2>/dev/null)
    else
      IFS=',' read -ra dirs <<< "$FILES_FIELD"
      for d in "${dirs[@]}"; do
        target="$pkg_dir$d"
        if [[ -d "$target" ]]; then
          while IFS= read -r -d '' f; do
            SENSITIVE_FOUND=true
            record_fail "Sensitive file would be published: ${f}"
          done < <(find "$target" -name "$pattern" -print0 2>/dev/null)
        fi
      done
    fi
  done
done

if ! $SENSITIVE_FOUND; then
  record_pass "No sensitive files detected in publish artifacts"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# 4. HARDCODED SECRETS SCAN
# ═══════════════════════════════════════════════════════════════════════════════

step "4/8  Hardcoded secrets in source"

SECRET_PATTERNS=(
  # API keys / tokens with common prefixes
  'AKIA[0-9A-Z]{16}'                          # AWS Access Key
  'sk-[a-zA-Z0-9]{20,}'                       # OpenAI / Stripe secret
  'ghp_[a-zA-Z0-9]{36}'                       # GitHub PAT
  'gho_[a-zA-Z0-9]{36}'                       # GitHub OAuth
  'glpat-[a-zA-Z0-9\-]{20,}'                  # GitLab PAT
  'npm_[a-zA-Z0-9]{36}'                       # npm token
  'xox[bpsar]-[a-zA-Z0-9\-]+'                 # Slack token
  # Generic patterns
  '-----BEGIN (RSA |EC |DSA )?PRIVATE KEY-----'
  'password\s*[:=]\s*["\x27][^"\x27]{8,}["\x27]'
)

SECRETS_FOUND=false

for pat in "${SECRET_PATTERNS[@]}"; do
  if grep -rPn "$pat" packages/*/src/ --include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx' 2>/dev/null | grep -v 'node_modules' | grep -v '\.test\.' | grep -v '__tests__' | head -5 | while IFS= read -r line; do
    SECRETS_FOUND=true
    record_fail "Potential secret: ${line}"
  done; then
    SECRETS_FOUND=true
  fi
done

if ! $SECRETS_FOUND; then
  record_pass "No hardcoded secrets detected"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# 5. DANGEROUS CODE PATTERNS
# ═══════════════════════════════════════════════════════════════════════════════

step "5/8  Dangerous code patterns"

DANGEROUS_PATS=(
  '[^a-zA-Z]eval\s*\('
  'new\s+Function\s*\('
  '\.innerHTML\s*='
  'dangerouslySetInnerHTML'
  'document\.write\s*\('
  'child_process'
  'execSync\s*\(|exec\s*\('
  '__proto__'
)
DANGEROUS_LABELS=(
  'eval() usage'
  'new Function() constructor'
  'Direct innerHTML assignment'
  'dangerouslySetInnerHTML usage'
  'document.write() usage'
  'child_process import'
  'Shell exec call'
  '__proto__ access (prototype pollution)'
)

DANGEROUS_FOUND=false

for idx in "${!DANGEROUS_PATS[@]}"; do
  pat="${DANGEROUS_PATS[$idx]}"
  label="${DANGEROUS_LABELS[$idx]}"
  hits="$(grep -rPn "$pat" packages/*/src/ --include='*.ts' --include='*.tsx' --include='*.js' 2>/dev/null | grep -v 'node_modules' || true)"

  if [[ -n "$hits" ]]; then
    DANGEROUS_FOUND=true
    count="$(echo "$hits" | wc -l | tr -d ' ')"
    record_warn "${label} — ${count} occurrence(s)"
    if $VERBOSE; then
      echo "$hits" | head -10 | while IFS= read -r line; do
        printf "    ${DIM}%s${RESET}\n" "$line"
      done
    fi
  fi
done

if ! $DANGEROUS_FOUND; then
  record_pass "No dangerous code patterns detected"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# 6. PACKAGE PUBLISH CONTENTS
# ═══════════════════════════════════════════════════════════════════════════════

step "6/8  Package publish contents"

for i in "${!PUBLISHABLE_DIRS[@]}"; do
  pkg_dir="${PUBLISHABLE_DIRS[$i]}"
  pkg_name="${PUBLISHABLE_NAMES[$i]}"

  FILES_FIELD="$(node -p "
    const f = require('./$pkg_dir/package.json').files;
    f ? JSON.stringify(f) : 'null';
  ")"

  if [[ "$FILES_FIELD" == "null" ]]; then
    record_warn "${pkg_name}: no \"files\" field — entire directory will be published"
  else
    record_pass "${pkg_name}: \"files\" field restricts published contents"
  fi

  HAS_PREPUB="$(node -p "
    const s = require('./$pkg_dir/package.json').scripts || {};
    !!(s.preinstall || s.postinstall || s.prepack || s.prepare) ? 'true' : 'false';
  ")"

  if [[ "$HAS_PREPUB" == "true" ]]; then
    record_warn "${pkg_name}: has lifecycle scripts (preinstall/postinstall/prepack/prepare)"
    if $VERBOSE; then
      node -e "
        const s = require('./$pkg_dir/package.json').scripts || {};
        for (const k of ['preinstall','postinstall','prepack','prepare'])
          if (s[k]) console.log('    ' + k + ': ' + s[k]);
      "
    fi
  fi
done

# ═══════════════════════════════════════════════════════════════════════════════
# 7. TYPESCRIPT STRICT MODE
# ═══════════════════════════════════════════════════════════════════════════════

step "7/8  TypeScript strict mode"

for pkg_dir in packages/*/; do
  tsconfig="$pkg_dir/tsconfig.json"
  [[ -f "$tsconfig" ]] || continue

  pkg_name="$(basename "$pkg_dir")"
  IS_STRICT="$(node -p "
    try {
      const c = JSON.parse(require('fs').readFileSync('$tsconfig','utf8')
        .replace(/\/\/.*$/gm,'').replace(/\/\*[\s\S]*?\*\//g,''));
      c.compilerOptions?.strict === true ? 'true' : 'false';
    } catch { 'unknown'; }
  " 2>/dev/null || echo "unknown")"

  if [[ "$IS_STRICT" == "true" ]]; then
    record_pass "${pkg_name}: strict mode enabled"
  elif [[ "$IS_STRICT" == "unknown" ]]; then
    record_warn "${pkg_name}: could not parse tsconfig.json"
  else
    record_warn "${pkg_name}: strict mode is not enabled"
  fi
done

# ═══════════════════════════════════════════════════════════════════════════════
# 8. LOCKFILE INTEGRITY
# ═══════════════════════════════════════════════════════════════════════════════

step "8/8  Lockfile & supply chain"

if [[ -f "pnpm-lock.yaml" ]]; then
  record_pass "Lockfile present (pnpm-lock.yaml)"
elif [[ -f "package-lock.json" ]]; then
  record_pass "Lockfile present (package-lock.json)"
else
  record_fail "No lockfile found — dependency resolution is non-deterministic"
fi

ALLOW_SCRIPTS="$(node -p "
  try {
    const pkg = require('./package.json');
    pkg.trustedDependencies ? JSON.stringify(pkg.trustedDependencies) : 'none';
  } catch { 'unknown'; }
" 2>/dev/null || echo "unknown")"

if [[ "$ALLOW_SCRIPTS" != "none" && "$ALLOW_SCRIPTS" != "unknown" ]]; then
  record_warn "trustedDependencies configured: $ALLOW_SCRIPTS"
fi

# Check .npmrc for registry overrides
if [[ -f ".npmrc" ]]; then
  if grep -qE '^registry\s*=' .npmrc 2>/dev/null; then
    REGISTRY="$(grep -E '^registry\s*=' .npmrc | head -1)"
    if echo "$REGISTRY" | grep -qv 'registry.npmjs.org'; then
      record_warn "Custom npm registry configured: ${REGISTRY}"
    else
      record_pass "npm registry is default (registry.npmjs.org)"
    fi
  fi
else
  record_pass "No .npmrc overrides"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# SUMMARY
# ═══════════════════════════════════════════════════════════════════════════════

step "Audit summary"
divider

printf "  ${GREEN}✔ Passed:${RESET}   %d\n" "$PASS"
printf "  ${YELLOW}⚠ Warnings:${RESET} %d\n" "$WARN"
printf "  ${RED}✖ Failures:${RESET} %d\n" "$FAIL"
echo ""

if [[ "$FAIL" -gt 0 ]]; then
  printf "${BOLD}${RED}"
  printf "  ╭─────────────────────────────────────╮\n"
  printf "  │    AUDIT FAILED — do not release     │\n"
  printf "  ╰─────────────────────────────────────╯\n"
  printf "${RESET}\n"
  printf "  ${DIM}Fix all failures before publishing.${RESET}\n"
  printf "  ${DIM}Run with --verbose for details.${RESET}\n\n"
  exit 1
elif [[ "$WARN" -gt 0 ]]; then
  if $STRICT; then
    printf "${BOLD}${YELLOW}"
    printf "  ╭─────────────────────────────────────╮\n"
    printf "  │   AUDIT BLOCKED (--strict mode)      │\n"
    printf "  ╰─────────────────────────────────────╯\n"
    printf "${RESET}\n"
    printf "  ${DIM}Resolve warnings or remove --strict.${RESET}\n\n"
    exit 1
  else
    printf "${BOLD}${YELLOW}"
    printf "  ╭─────────────────────────────────────╮\n"
    printf "  │    AUDIT PASSED with warnings        │\n"
    printf "  ╰─────────────────────────────────────╯\n"
    printf "${RESET}\n"
    printf "  ${DIM}Review warnings before publishing.${RESET}\n\n"
    exit 0
  fi
else
  printf "${BOLD}${GREEN}"
  printf "  ╭─────────────────────────────────────╮\n"
  printf "  │       AUDIT PASSED — all clear       │\n"
  printf "  ╰─────────────────────────────────────╯\n"
  printf "${RESET}\n"
  exit 0
fi
