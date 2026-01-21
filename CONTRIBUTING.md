# Contributing to create-markdown

First off, thanks for taking the time to contribute! 🎉

This package is published on npm: **[create-markdown](https://www.npmjs.com/package/create-markdown)**

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Style Guide](#style-guide)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Code of Conduct

Be respectful, inclusive, and constructive. We're all here to build something useful together.

---

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/create-markdown.git
   cd create-markdown
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/BunsDev/create-markdown.git
   ```

---

## Development Setup

This project uses [Bun](https://bun.sh) as its package manager and build tool.

### Prerequisites

- **Bun** v1.0.0 or higher
- **Node.js** 18+ (for compatibility testing)

### Install Dependencies

```bash
bun install
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `bun run build` | Build ESM, CJS, and type definitions |
| `bun run build:esm` | Build ESM module only |
| `bun run build:cjs` | Build CommonJS module only |
| `bun run build:types` | Generate TypeScript declarations |
| `bun run dev` | Watch mode for development |
| `bun run clean` | Remove build artifacts |

### Project Structure

```
create-markdown/
├── src/
│   └── index.ts      # Main source file
├── dist/             # Built output (gitignored)
├── package.json
├── tsconfig.json
└── README.md
```

---

## Making Changes

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Use descriptive branch names:
- `feature/add-table-builder` ✅
- `fix/line-ending-windows` ✅
- `update` ❌

### 2. Make Your Changes

- Keep changes focused and atomic
- Add/update TypeScript types as needed
- Ensure exports are properly configured

### 3. Test Your Changes

```bash
# Build the package
bun run build

# Test in a local project
cd /path/to/test-project
bun add /path/to/create-markdown
```

### 4. Commit Your Changes

Write clear, concise commit messages:

```bash
git commit -m "feat: add heading builder function"
git commit -m "fix: handle empty content edge case"
git commit -m "docs: update API documentation"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/) when possible:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks

---

## Pull Request Process

1. **Update documentation** if you're adding new features
2. **Update the CHANGELOG.md** under the `[Unreleased]` section
3. **Ensure the build passes**: `bun run build`
4. **Push to your fork** and create a Pull Request

### PR Title Format

```
feat: add table builder function
fix: resolve Windows line ending issue
docs: improve API examples
```

### PR Description Template

```markdown
## What does this PR do?

Brief description of changes.

## Why is this change needed?

Context and motivation.

## How to test?

Steps to verify the changes work.

## Checklist

- [ ] Code builds without errors
- [ ] Types are properly exported
- [ ] CHANGELOG.md updated
- [ ] Documentation updated (if needed)
```

---

## Style Guide

### TypeScript

- Use explicit types for function parameters and return values
- Prefer interfaces over type aliases for object shapes
- Document public APIs with JSDoc comments

```typescript
/**
 * Creates a markdown heading
 * @param text - The heading text
 * @param level - Heading level (1-6)
 * @returns Formatted heading string
 */
export function heading(text: string, level: 1 | 2 | 3 | 4 | 5 | 6 = 1): string {
  return `${'#'.repeat(level)} ${text}`;
}
```

### Formatting

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in multiline structures
- Keep lines under 100 characters when practical

---

## Reporting Bugs

### Before Submitting

1. Check the [existing issues](https://github.com/BunsDev/create-markdown/issues)
2. Ensure you're using the latest version

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
```typescript
// Minimal code to reproduce
import { createMarkdown } from 'create-markdown';
// ...
```

**Expected behavior**
What you expected to happen.

**Environment**
- Package version: 0.1.0
- Node.js version: 20.x
- Bun version: 1.x
- OS: macOS/Windows/Linux
```

---

## Suggesting Features

We welcome feature suggestions! Please open an issue with:

1. **Clear description** of the proposed feature
2. **Use case** - Why is this feature needed?
3. **Proposed API** (if applicable)

```markdown
**Feature Request: Table Builder**

I'd like a function to easily create markdown tables.

**Use Case**
Converting arrays of data to markdown tables for documentation.

**Proposed API**
```typescript
import { table } from 'create-markdown';

const md = table({
  headers: ['Name', 'Type'],
  rows: [
    ['content', 'string'],
    ['meta', 'object'],
  ],
});
```
```

---

## Questions?

Feel free to open an issue for any questions about contributing.

**Package on npm:** [https://www.npmjs.com/package/create-markdown](https://www.npmjs.com/package/create-markdown)

Thanks for contributing! 🚀
