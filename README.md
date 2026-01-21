# create-markdown

[![npm version](https://img.shields.io/npm/v/create-markdown.svg)](https://www.npmjs.com/package/create-markdown)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Markdown package to enable creating markdown interfaces seamlessly because it is complicated and annoying asf.

📦 **[View on npm](https://www.npmjs.com/package/create-markdown)**

## Installation

```bash
# Using bun (recommended)
bun add create-markdown

# Using npm
npm install create-markdown

# Using yarn
yarn add create-markdown

# Using pnpm
pnpm add create-markdown
```

## Usage

### ESM (recommended)

```typescript
import { createMarkdown } from 'create-markdown';

const doc = createMarkdown('# Hello World');
console.log(doc.content);
```

### Default Export

```typescript
import createMarkdown from 'create-markdown';

const doc = createMarkdown('# Hello World');
console.log(doc.content);
```

### CommonJS

```javascript
const { createMarkdown } = require('create-markdown');

const doc = createMarkdown('# Hello World');
console.log(doc.content);
```

### With Options

```typescript
import { createMarkdown, type MarkdownOptions } from 'create-markdown';

const options: MarkdownOptions = {
  strict: true,
  lineEnding: '\n',
};

const doc = createMarkdown('# My Document', options);
```

## API

### `createMarkdown(content?, options?)`

Creates a new markdown document.

**Parameters:**
- `content` (string, optional): Initial markdown content
- `options` (MarkdownOptions, optional): Configuration options
  - `strict` (boolean): Enable strict parsing mode
  - `lineEnding` (string): Custom line ending (default: `'\n'`)

**Returns:** `MarkdownDocument`
- `content` (string): Raw markdown content
- `meta` (Record<string, unknown>): Document metadata

### `VERSION`

Package version string.

```typescript
import { VERSION } from 'create-markdown';

console.log(VERSION); // '0.1.1'
```

## Development

```bash
# Install dependencies
bun install

# Build the package
bun run build

# Watch mode during development
bun run dev

# Clean build artifacts
bun run clean

# Run the playground
bun run playground
```

## Requirements

- Node.js 20+
- Bun 1.0+ (for development)

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release history.

## License

MIT
