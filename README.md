# create-markdown

[![npm version](https://img.shields.io/npm/v/create-markdown.svg)](https://www.npmjs.com/package/create-markdown)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A complete block-based markdown notes package with zero dependencies. Parse, create, and serialize markdown with full TypeScript support.

📦 **[View on npm](https://www.npmjs.com/package/create-markdown)**

## Features

- 🧱 **Block-based architecture** - Work with structured blocks instead of raw strings
- 🔄 **Bidirectional conversion** - Parse markdown to blocks, serialize blocks to markdown
- 📝 **Rich inline styles** - Bold, italic, code, links, strikethrough, highlights
- ⚛️ **React components** - Optional React bindings for rendering and editing
- ✨ **Live WYSIWYG editing** - Interactive playground with real-time markdown rendering
- 🪶 **Zero dependencies** - Core package has no runtime dependencies
- 🔒 **Full TypeScript** - Complete type definitions with generics
- 🚀 **Framework ready** - Works with Next.js, Vite, Remix, Astro, and more

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

## Quick Start

### Parse Markdown to Blocks

```typescript
import { parse } from 'create-markdown';

const blocks = parse(`# Hello World

This is **bold** and *italic* text.

- Item one
- Item two
`);

console.log(blocks);
// [
//   { type: 'heading', props: { level: 1 }, content: [...] },
//   { type: 'paragraph', content: [...] },
//   { type: 'bulletList', children: [...] }
// ]
```

### Create Blocks Programmatically

```typescript
import { h1, paragraph, bulletList, bold, italic, spans } from 'create-markdown';

const blocks = [
  h1('My Document'),
  paragraph(spans(
    bold('Important: '),
    { text: 'This is ', styles: {} },
    italic('really'),
    { text: ' cool!', styles: {} }
  )),
  bulletList(['First item', 'Second item', 'Third item']),
];
```

### Serialize Blocks to Markdown

```typescript
import { stringify, h1, paragraph, codeBlock } from 'create-markdown';

const markdown = stringify([
  h1('Hello'),
  paragraph('World'),
  codeBlock('console.log("Hi!");', 'javascript'),
]);

console.log(markdown);
// # Hello
//
// World
//
// ```javascript
// console.log("Hi!");
// ```
```

### Document Management

```typescript
import { 
  createDocument, 
  appendBlock, 
  removeBlock, 
  findBlock,
  paragraph 
} from 'create-markdown';

// Create a document
let doc = createDocument([paragraph('First paragraph')]);

// Add a block
doc = appendBlock(doc, paragraph('Second paragraph'));

// Find a block
const block = findBlock(doc, 'some-id');

// Remove a block
doc = removeBlock(doc, 'some-id');
```

## React Components

Optional React bindings are available via a separate import:

```tsx
import { BlockRenderer, useDocument, useMarkdown } from 'create-markdown/react';
import { paragraph, h1 } from 'create-markdown/react';

function Editor() {
  const { blocks, appendBlock, toMarkdown } = useDocument();
  
  return (
    <div>
      <BlockRenderer blocks={blocks} />
      <button onClick={() => appendBlock(paragraph('New paragraph'))}>
        Add Paragraph
      </button>
      <button onClick={() => console.log(toMarkdown())}>
        Export Markdown
      </button>
    </div>
  );
}

function MarkdownEditor() {
  const { markdown, blocks, setMarkdown } = useMarkdown('# Hello');
  
  return (
    <div>
      <textarea 
        value={markdown} 
        onChange={(e) => setMarkdown(e.target.value)} 
      />
      <BlockRenderer blocks={blocks} />
    </div>
  );
}
```

## Block Types

| Type | Factory Function | Description |
|------|-----------------|-------------|
| `paragraph` | `paragraph(content)` | Text paragraph |
| `heading` | `heading(level, content)` or `h1`-`h6` | Heading levels 1-6 |
| `bulletList` | `bulletList(items)` | Unordered list |
| `numberedList` | `numberedList(items)` | Ordered list |
| `checkList` | `checkList(items)` | Task list with checkboxes |
| `codeBlock` | `codeBlock(code, language?)` | Fenced code block |
| `blockquote` | `blockquote(content)` | Block quote |
| `image` | `image(url, alt?)` | Image |
| `divider` | `divider()` | Horizontal rule |
| `table` | `table(headers, rows)` | Table with headers |
| `callout` | `callout(type, content)` | Callout/admonition |

## Inline Styles

```typescript
import { bold, italic, code, link, strikethrough, highlight } from 'create-markdown';

// Create styled text spans
const content = [
  bold('Bold text'),
  italic('Italic text'),
  code('inline code'),
  link('Click here', 'https://example.com'),
  strikethrough('deleted'),
  highlight('highlighted'),
];
```

## API Reference

### Parsing

- `parse(markdown)` - Parse markdown string to blocks
- `markdownToBlocks(markdown, options?)` - Full parser with options
- `markdownToDocument(markdown)` - Parse to a Document object

### Serialization

- `stringify(blocks)` - Serialize blocks to markdown
- `blocksToMarkdown(blocks, options?)` - Full serializer with options
- `documentToMarkdown(doc)` - Serialize a Document

### Document Operations

- `createDocument(blocks?, options?)` - Create a new document
- `insertBlock(doc, block, index?)` - Insert block at position
- `appendBlock(doc, block)` - Add block at end
- `removeBlock(doc, blockId)` - Remove block by ID
- `updateBlock(doc, blockId, updates)` - Update block properties
- `moveBlock(doc, blockId, newIndex)` - Reorder blocks
- `findBlock(doc, blockId)` - Find block by ID

### React Hooks

- `useDocument(initialBlocks?)` - Full document state management
- `useMarkdown(initialMarkdown?)` - Bidirectional markdown/blocks
- `useBlockEditor(doc)` - Selection and editing operations

## Integration

For detailed framework-specific setup guides, see the **[Integration Guide](./INTEGRATION.md)**.

Quick links:
- [Next.js (App Router)](./INTEGRATION.md#nextjs-app-router)
- [Next.js (Pages Router)](./INTEGRATION.md#nextjs-pages-router)
- [Vite + React](./INTEGRATION.md#vite--react)
- [Remix](./INTEGRATION.md#remix)
- [Astro](./INTEGRATION.md#astro)
- [Node.js / Server-side](./INTEGRATION.md#nodejs--server-side)

## Playground

The package includes a full WYSIWYG playground editor demonstrating all features:

```bash
# Run the interactive playground
bun run playground
```

**Playground Features:**
- Click-to-edit blocks with live markdown rendering
- Markdown shortcuts (`#` headings, `-` lists, `>` quotes, ``` code, `---` dividers)
- Inline formatting (`**bold**`, `*italic*`, `` `code` ``, `~~strike~~`, `==highlight==`, `[link](url)`)
- Keyboard shortcuts (Cmd/Ctrl+B, Cmd/Ctrl+I, Cmd/Ctrl+U)
- List item management with Enter/Backspace/Tab
- Dark/light theme toggle
- Export to markdown

## Development

```bash
# Install dependencies
bun install

# Build the package
bun run build

# Type check
bun run typecheck

# Run the playground
bun run playground
```

## Requirements

- Node.js 20+
- Bun 1.0+ (for development)
- React 18+ (optional, for React components)

## Documentation

| Document | Description |
|----------|-------------|
| [README.md](./README.md) | Quick start and API overview |
| [INTEGRATION.md](./INTEGRATION.md) | Framework-specific setup guides |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contribution guidelines |
| [CHANGELOG.md](./CHANGELOG.md) | Version history |

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release history.

## License

MIT
