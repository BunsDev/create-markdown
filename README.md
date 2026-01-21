# create-markdown

Markdown package to enable creating markdown interfaces seamlessly because it is complicated and annoying asf.

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
```

## License

MIT
