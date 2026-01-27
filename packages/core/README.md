# @create-markdown/core

Block-based markdown parsing and serialization with zero dependencies.

## Installation

```bash
# Using bun
bun add @create-markdown/core

# Using npm
npm install @create-markdown/core

# Using yarn
yarn add @create-markdown/core

# Using pnpm
pnpm add @create-markdown/core
```

## Quick Start

### Parse Markdown to Blocks

```typescript
import { parse } from '@create-markdown/core';

const blocks = parse(`# Hello World

This is **bold** and *italic* text.

- Item one
- Item two
`);
```

### Create Blocks Programmatically

```typescript
import { h1, paragraph, bulletList, bold, italic, spans } from '@create-markdown/core';

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
import { stringify, h1, paragraph, codeBlock } from '@create-markdown/core';

const markdown = stringify([
  h1('Hello'),
  paragraph('World'),
  codeBlock('console.log("Hi!");', 'javascript'),
]);
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

## License

MIT
