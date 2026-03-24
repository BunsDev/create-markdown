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

confirm() {
  local prompt="$1"
  local default="${2:-y}"
  local yn
  if [[ "$default" == "y" ]]; then
    printf "${BOLD}?${RESET} %s ${DIM}[Y/n]${RESET} " "$prompt"
  else
    printf "${BOLD}?${RESET} %s ${DIM}[y/N]${RESET} " "$prompt"
  fi
  read -r yn
  yn="${yn:-$default}"
  [[ "$yn" =~ ^[Yy] ]]
}

pick_one() {
  local prompt="$1"
  shift
  local options=("$@")
  printf "\n${BOLD}?${RESET} %s\n" "$prompt"
  for i in "${!options[@]}"; do
    printf "  ${CYAN}%d)${RESET} %s\n" "$((i + 1))" "${options[$i]}"
  done
  local choice
  while true; do
    printf "  ${DIM}→${RESET} "
    read -r choice
    if [[ "$choice" =~ ^[0-9]+$ ]] && (( choice >= 1 && choice <= ${#options[@]} )); then
      PICKED="${options[$((choice - 1))]}"
      return 0
    fi
    printf "  ${RED}Invalid choice. Pick 1–%d.${RESET}\n" "${#options[@]}"
  done
}

# ─── Sync VERSION constants ──────────────────────────────────────────────────

sync_version_constants() {
  for pkg_dir in packages/*/; do
    pkg_json="$pkg_dir/package.json"
    [[ -f "$pkg_json" ]] || continue

    pkg_ver="$(node -p "require('./$pkg_json').version")"

    for src_file in "$pkg_dir"src/index.ts "$pkg_dir"src/index.js; do
      [[ -f "$src_file" ]] || continue
      if grep -q "VERSION\s*=" "$src_file"; then
        sed -i '' "s/VERSION\s*=\s*['\"][^'\"]*['\"]/VERSION = '${pkg_ver}'/" "$src_file"
        info "Synced VERSION in $src_file → $pkg_ver"
      fi
    done
  done
}

# ─── Locate root ─────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT"

# ─── Banner ──────────────────────────────────────────────────────────────────

printf "\n${BOLD}${CYAN}"
printf "  ╭─────────────────────────────────────╮\n"
printf "  │   create-markdown release manager    │\n"
printf "  ╰─────────────────────────────────────╯\n"
printf "${RESET}\n"

# ─── Preflight checks ───────────────────────────────────────────────────────

step "Preflight checks"

# Git status
if [[ -n "$(git status --porcelain)" ]]; then
  error "Working tree is dirty. Commit or stash changes first."
  git status --short
  echo ""
  if ! confirm "Continue anyway?" "n"; then
    exit 1
  fi
  warn "Proceeding with dirty working tree"
else
  success "Working tree is clean"
fi

# Current branch
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$BRANCH" != "main" ]]; then
  warn "On branch ${BOLD}$BRANCH${RESET} (not main)"
  if ! confirm "Release from this branch?" "n"; then
    exit 1
  fi
else
  success "On branch ${BOLD}main${RESET}"
fi

# npm auth
if ! npm whoami &>/dev/null; then
  error "Not logged in to npm. Run: npm login"
  exit 1
fi
NPM_USER="$(npm whoami)"
success "Authenticated to npm as ${BOLD}$NPM_USER${RESET}"

# ─── Security audit ─────────────────────────────────────────────────────────

step "Security audit"

AUDIT_SCRIPT="$SCRIPT_DIR/security-audit.sh"
if [[ -x "$AUDIT_SCRIPT" ]]; then
  if confirm "Run security audit before release?"; then
    if bash "$AUDIT_SCRIPT"; then
      success "Security audit passed"
    else
      AUDIT_EXIT=$?
      error "Security audit failed (exit $AUDIT_EXIT)"
      if ! confirm "Continue despite audit failure?" "n"; then
        exit 1
      fi
      warn "Proceeding despite audit failure"
    fi
  else
    warn "Skipped security audit"
  fi
else
  warn "Security audit script not found at $AUDIT_SCRIPT — skipping"
fi

# ─── Show current versions ──────────────────────────────────────────────────

step "Current package versions"
divider

PUBLISHABLE_DIRS=()
PUBLISHABLE_NAMES=()
PUBLISHABLE_VERSIONS=()

for pkg_dir in packages/*/; do
  pkg_json="$pkg_dir/package.json"
  [[ -f "$pkg_json" ]] || continue

  is_private="$(node -p "require('./$pkg_json').private || false")"
  [[ "$is_private" == "true" ]] && continue

  pkg_name="$(node -p "require('./$pkg_json').name")"
  pkg_ver="$(node -p "require('./$pkg_json').version")"

  PUBLISHABLE_DIRS+=("$pkg_dir")
  PUBLISHABLE_NAMES+=("$pkg_name")
  PUBLISHABLE_VERSIONS+=("$pkg_ver")

  printf "  ${BOLD}%-30s${RESET} ${GREEN}v%s${RESET}\n" "$pkg_name" "$pkg_ver"
done

divider

if [[ ${#PUBLISHABLE_NAMES[@]} -eq 0 ]]; then
  error "No publishable packages found"
  exit 1
fi

# ─── Release mode ────────────────────────────────────────────────────────────

step "Release mode"
pick_one "How do you want to release?" \
  "Changeset flow  — create changeset, version, then publish" \
  "Direct publish  — bump versions and publish immediately" \
  "Publish only    — publish whatever is already built (no version bump)" \
  "Dry run         — full flow without actually publishing"

MODE="$PICKED"

# ─── Changeset flow ─────────────────────────────────────────────────────────

if [[ "$MODE" == *"Changeset flow"* ]]; then
  step "Creating changeset"
  info "This will open an interactive prompt to describe your changes."
  echo ""

  npx changeset

  if ! confirm "Apply version bumps now?"; then
    success "Changeset created. Run 'pnpm run version-packages' when ready."
    exit 0
  fi

  step "Applying version bumps"
  npx changeset version

  step "Review changes"
  git diff --stat
  echo ""
  git diff -- '*/package.json' '*/CHANGELOG.md' | head -80
  echo ""

  if ! confirm "Commit version bumps and publish?"; then
    warn "Aborted. Version files updated but not committed."
    exit 1
  fi

  step "Syncing VERSION constants"
  sync_version_constants
  success "VERSION constants synced"

  step "Building all packages"
  pnpm run build
  success "Build complete"

  step "Running checks"
  if confirm "Run typecheck before publish?" "y"; then
    pnpm run typecheck
    success "Typecheck passed"
  fi

  if confirm "Run tests before publish?" "y"; then
    pnpm run test
    success "Tests passed"
  fi

  step "Committing version bumps"
  git add .
  git commit -m "chore: release packages"
  success "Committed"

  step "Publishing to npm"
  npx changeset publish
  success "Published to npm"

  step "Pushing to git"
  git push origin "$BRANCH"
  git push origin --tags
  success "Pushed commits and tags"

# ─── Direct publish ─────────────────────────────────────────────────────────

elif [[ "$MODE" == *"Direct publish"* ]]; then

  step "Select packages to bump"

  SELECTED_INDICES=()
  for i in "${!PUBLISHABLE_NAMES[@]}"; do
    if confirm "Bump ${BOLD}${PUBLISHABLE_NAMES[$i]}${RESET} (v${PUBLISHABLE_VERSIONS[$i]})?"; then
      SELECTED_INDICES+=("$i")
    fi
  done

  if [[ ${#SELECTED_INDICES[@]} -eq 0 ]]; then
    warn "No packages selected. Aborting."
    exit 0
  fi

  pick_one "Bump type for selected packages:" "patch" "minor" "major" "prerelease"
  BUMP_TYPE="$PICKED"

  PREID=""
  if [[ "$BUMP_TYPE" == "prerelease" ]]; then
    printf "  ${BOLD}?${RESET} Pre-release tag ${DIM}(e.g. alpha, beta, rc)${RESET}: "
    read -r PREID
    PREID="${PREID:-alpha}"
  fi

  step "Computing new versions"

  bump_version() {
    local ver="$1" type="$2" preid="$3"
    node -e "
      const [major, minor, patch] = '$ver'.replace(/-.+/, '').split('.').map(Number);
      const type = '$type';
      const preid = '$preid';
      if (type === 'major') console.log((major+1)+'.0.0');
      else if (type === 'minor') console.log(major+'.'+(minor+1)+'.0');
      else if (type === 'patch') console.log(major+'.'+minor+'.'+(patch+1));
      else if (type === 'prerelease') {
        const pre = '$ver'.includes('-') ? '' : '-' + preid + '.0';
        if (pre) console.log(major+'.'+minor+'.'+(patch+1)+'-'+preid+'.0');
        else {
          const m = '$ver'.match(/-(\w+)\.(\d+)/);
          console.log(major+'.'+minor+'.'+patch+'-'+(m?m[1]:preid)+'.'+(m?Number(m[2])+1:0));
        }
      }
    "
  }

  NEW_VERSIONS=()
  for i in "${SELECTED_INDICES[@]}"; do
    new_ver="$(bump_version "${PUBLISHABLE_VERSIONS[$i]}" "$BUMP_TYPE" "$PREID")"
    NEW_VERSIONS+=("$new_ver")
    printf "  ${BOLD}%-30s${RESET} ${DIM}v%s${RESET} → ${GREEN}v%s${RESET}\n" \
      "${PUBLISHABLE_NAMES[$i]}" "${PUBLISHABLE_VERSIONS[$i]}" "$new_ver"
  done
  echo ""

  if ! confirm "Apply these version bumps?"; then
    warn "Aborted."
    exit 1
  fi

  step "Updating package.json files"
  for idx in "${!SELECTED_INDICES[@]}"; do
    i="${SELECTED_INDICES[$idx]}"
    pkg_json="${PUBLISHABLE_DIRS[$i]}package.json"
    node -e "
      const fs = require('fs');
      const pkg = JSON.parse(fs.readFileSync('$pkg_json', 'utf8'));
      pkg.version = '${NEW_VERSIONS[$idx]}';
      fs.writeFileSync('$pkg_json', JSON.stringify(pkg, null, 2) + '\n');
    "
    success "Updated ${PUBLISHABLE_NAMES[$i]} → v${NEW_VERSIONS[$idx]}"
  done

  step "Syncing VERSION constants"
  sync_version_constants
  success "VERSION constants synced"

  step "Building all packages"
  pnpm run build
  success "Build complete"

  step "Running checks"
  if confirm "Run typecheck before publish?" "y"; then
    pnpm run typecheck
    success "Typecheck passed"
  fi

  if confirm "Run tests before publish?" "y"; then
    pnpm run test
    success "Tests passed"
  fi

  step "Committing and tagging"
  TAG_VERSION="${NEW_VERSIONS[0]}"
  git add .

  COMMIT_MSG="release:"
  for idx in "${!SELECTED_INDICES[@]}"; do
    i="${SELECTED_INDICES[$idx]}"
    COMMIT_MSG+=" ${PUBLISHABLE_NAMES[$i]}@${NEW_VERSIONS[$idx]}"
  done
  git commit -m "$COMMIT_MSG"

  for idx in "${!SELECTED_INDICES[@]}"; do
    i="${SELECTED_INDICES[$idx]}"
    tag="${PUBLISHABLE_NAMES[$i]}@${NEW_VERSIONS[$idx]}"
    git tag -a "$tag" -m "Release $tag"
    success "Tagged $tag"
  done

  step "Publishing to npm"
  for idx in "${!SELECTED_INDICES[@]}"; do
    i="${SELECTED_INDICES[$idx]}"
    pkg_dir="${PUBLISHABLE_DIRS[$i]}"
    info "Publishing ${PUBLISHABLE_NAMES[$i]}..."
    (cd "$pkg_dir" && npm publish --access public)
    success "Published ${PUBLISHABLE_NAMES[$i]}@${NEW_VERSIONS[$idx]}"
  done

  step "Pushing to git"
  git push origin "$BRANCH"
  git push origin --tags
  success "Pushed commits and tags"

# ─── Publish only ────────────────────────────────────────────────────────────

elif [[ "$MODE" == *"Publish only"* ]]; then

  step "Building all packages"
  pnpm run build
  success "Build complete"

  step "Publishing with Changesets"
  npx changeset publish
  success "Published"

  step "Pushing tags"
  git push origin --tags
  success "Done"

# ─── Dry run ─────────────────────────────────────────────────────────────────

elif [[ "$MODE" == *"Dry run"* ]]; then

  step "Building all packages"
  pnpm run build
  success "Build complete"

  step "Running checks"
  pnpm run typecheck
  success "Typecheck passed"

  pnpm run test
  success "Tests passed"

  step "Dry-run publish (nothing will be uploaded)"
  for i in "${!PUBLISHABLE_NAMES[@]}"; do
    pkg_dir="${PUBLISHABLE_DIRS[$i]}"
    info "Dry-run: ${PUBLISHABLE_NAMES[$i]}"
    (cd "$pkg_dir" && npm publish --access public --dry-run 2>&1) || true
    echo ""
  done

  success "Dry run complete — no packages were published"
fi

# ─── Summary ─────────────────────────────────────────────────────────────────

step "Done!"

printf "\n${BOLD}${CYAN}"
printf "  ╭─────────────────────────────────────╮\n"
printf "  │         Release complete! 🎉        │\n"
printf "  ╰─────────────────────────────────────╯\n"
printf "${RESET}\n"

printf "  ${DIM}Published packages:${RESET}\n"
for i in "${!PUBLISHABLE_NAMES[@]}"; do
  ver="$(node -p "require('./${PUBLISHABLE_DIRS[$i]}package.json').version")"
  printf "    ${GREEN}•${RESET} %s ${DIM}v%s${RESET}\n" "${PUBLISHABLE_NAMES[$i]}" "$ver"
done
printf "\n  ${DIM}npm: https://www.npmjs.com/search?q=create-markdown${RESET}\n\n"
