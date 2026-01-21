# Integration Guide

Complete guide for integrating `create-markdown` into your project.

## Table of Contents

- [Framework Integrations](#framework-integrations)
  - [Next.js (App Router)](#nextjs-app-router)
  - [Next.js (Pages Router)](#nextjs-pages-router)
  - [Vite + React](#vite--react)
  - [Remix](#remix)
  - [Astro](#astro)
  - [Node.js / Server-side](#nodejs--server-side)
- [Common Patterns](#common-patterns)
  - [Building a Markdown Editor](#building-a-markdown-editor)
  - [Rendering Markdown Content](#rendering-markdown-content)
  - [Server-side Markdown Processing](#server-side-markdown-processing)
  - [Custom Block Renderers](#custom-block-renderers)
- [TypeScript Configuration](#typescript-configuration)
- [Bundle Size Optimization](#bundle-size-optimization)
- [Troubleshooting](#troubleshooting)

---

## Framework Integrations

### Next.js (App Router)

#### Installation

```bash
bun add create-markdown
# or
npm install create-markdown
```

#### Client Components

For interactive editors, use the `'use client'` directive:

```tsx
// app/components/markdown-editor.tsx
'use client';

import { useDocument, useBlockEditor, BlockRenderer } from 'create-markdown/react';
import { h1, paragraph, bulletList } from 'create-markdown/react';

export function MarkdownEditor() {
  const doc = useDocument([
    h1('Welcome'),
    paragraph('Start editing...'),
  ]);
  
  const editor = useBlockEditor(doc);

  return (
    <div>
      <BlockRenderer 
        blocks={doc.blocks}
        onBlockClick={(block) => editor.selectBlock(block.id)}
      />
      <button onClick={() => doc.appendBlock(paragraph('New paragraph'))}>
        Add Paragraph
      </button>
      <button onClick={() => console.log(doc.toMarkdown())}>
        Export
      </button>
    </div>
  );
}
```

#### Server Components

For static markdown rendering:

```tsx
// app/blog/[slug]/page.tsx
import { parse } from 'create-markdown';
import { BlockRenderer } from 'create-markdown/react';

async function getPost(slug: string) {
  const content = await fs.readFile(`./content/${slug}.md`, 'utf-8');
  return parse(content);
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const blocks = await getPost(params.slug);
  
  return (
    <article>
      <BlockRenderer blocks={blocks} />
    </article>
  );
}
```

#### API Routes

Process markdown in API routes:

```ts
// app/api/markdown/route.ts
import { parse, stringify } from 'create-markdown';

export async function POST(request: Request) {
  const { markdown } = await request.json();
  const blocks = parse(markdown);
  
  // Process blocks...
  
  return Response.json({ blocks });
}
```

---

### Next.js (Pages Router)

```tsx
// pages/editor.tsx
import dynamic from 'next/dynamic';

// Dynamic import for client-only editor
const MarkdownEditor = dynamic(
  () => import('../components/markdown-editor'),
  { ssr: false }
);

export default function EditorPage() {
  return <MarkdownEditor />;
}
```

```tsx
// components/markdown-editor.tsx
import { useDocument, BlockRenderer } from 'create-markdown/react';
import { h1, paragraph } from 'create-markdown/react';

export default function MarkdownEditor() {
  const doc = useDocument([h1('Hello'), paragraph('World')]);
  
  return <BlockRenderer blocks={doc.blocks} />;
}
```

For SSG/SSR markdown rendering:

```tsx
// pages/blog/[slug].tsx
import { GetStaticProps, GetStaticPaths } from 'next';
import { parse } from 'create-markdown';
import { BlockRenderer } from 'create-markdown/react';
import type { Block } from 'create-markdown';

interface Props {
  blocks: Block[];
}

export default function BlogPost({ blocks }: Props) {
  return <BlockRenderer blocks={blocks} />;
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const content = await fs.readFile(`./content/${params.slug}.md`, 'utf-8');
  const blocks = parse(content);
  
  return { props: { blocks } };
};
```

---

### Vite + React

```tsx
// src/App.tsx
import { useDocument, BlockRenderer } from 'create-markdown/react';
import { h1, paragraph, bulletList } from 'create-markdown/react';

function App() {
  const doc = useDocument([
    h1('My Document'),
    paragraph('Edit me!'),
    bulletList(['Item 1', 'Item 2', 'Item 3']),
  ]);

  return (
    <div className="app">
      <BlockRenderer blocks={doc.blocks} />
      <button onClick={() => {
        const md = doc.toMarkdown();
        navigator.clipboard.writeText(md);
      }}>
        Copy as Markdown
      </button>
    </div>
  );
}

export default App;
```

#### Vite Configuration

No special configuration needed. The package exports ESM and CJS:

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

---

### Remix

```tsx
// app/routes/editor.tsx
import { useDocument, BlockRenderer } from 'create-markdown/react';
import { h1, paragraph } from 'create-markdown/react';

export default function Editor() {
  const doc = useDocument([h1('Remix Editor'), paragraph('Start writing...')]);
  
  return (
    <div>
      <BlockRenderer blocks={doc.blocks} />
    </div>
  );
}
```

For loader-based markdown:

```tsx
// app/routes/blog.$slug.tsx
import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { parse } from 'create-markdown';
import { BlockRenderer } from 'create-markdown/react';
import type { Block } from 'create-markdown';

export async function loader({ params }: LoaderFunctionArgs) {
  const content = await fs.readFile(`./content/${params.slug}.md`, 'utf-8');
  const blocks = parse(content);
  return json({ blocks });
}

export default function BlogPost() {
  const { blocks } = useLoaderData<{ blocks: Block[] }>();
  return <BlockRenderer blocks={blocks} />;
}
```

---

### Astro

#### Static Markdown Pages

```astro
---
// src/pages/blog/[slug].astro
import { parse } from 'create-markdown';
import BlockRenderer from '../components/BlockRenderer.tsx';

const { slug } = Astro.params;
const content = await Astro.glob(`../content/${slug}.md`);
const blocks = parse(content.rawContent());
---

<article>
  <BlockRenderer blocks={blocks} client:load />
</article>
```

#### React Component in Astro

```tsx
// src/components/BlockRenderer.tsx
import { BlockRenderer as CMBlockRenderer } from 'create-markdown/react';
import type { Block } from 'create-markdown';

interface Props {
  blocks: Block[];
}

export default function BlockRenderer({ blocks }: Props) {
  return <CMBlockRenderer blocks={blocks} />;
}
```

```ts
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
});
```

---

### Node.js / Server-side

For CLI tools, scripts, or server processing:

```ts
// scripts/process-markdown.ts
import { parse, stringify, h1, paragraph } from 'create-markdown';
import fs from 'fs/promises';

async function processMarkdown(inputPath: string, outputPath: string) {
  const content = await fs.readFile(inputPath, 'utf-8');
  const blocks = parse(content);
  
  // Add a title if missing
  if (blocks[0]?.type !== 'heading') {
    blocks.unshift(h1('Untitled Document'));
  }
  
  // Serialize back to markdown
  const output = stringify(blocks);
  await fs.writeFile(outputPath, output);
}

processMarkdown('./input.md', './output.md');
```

#### Express.js API

```ts
// server.ts
import express from 'express';
import { parse, stringify } from 'create-markdown';

const app = express();
app.use(express.json());

app.post('/api/parse', (req, res) => {
  const { markdown } = req.body;
  const blocks = parse(markdown);
  res.json({ blocks });
});

app.post('/api/stringify', (req, res) => {
  const { blocks } = req.body;
  const markdown = stringify(blocks);
  res.json({ markdown });
});

app.listen(3000);
```

---

## Common Patterns

### Building a Markdown Editor

Complete example of a WYSIWYG markdown editor:

```tsx
'use client';

import { useState, useCallback } from 'react';
import { 
  useDocument, 
  useBlockEditor,
  BlockRenderer 
} from 'create-markdown/react';
import { 
  h1, h2, paragraph, bulletList, codeBlock, blockquote 
} from 'create-markdown/react';
import type { Block, TextSpan } from 'create-markdown';

export function MarkdownEditor() {
  const doc = useDocument([
    h1('My Document'),
    paragraph('Click to edit...'),
  ]);
  
  const editor = useBlockEditor(doc);
  const [preview, setPreview] = useState(false);

  const handleAddBlock = useCallback((type: string) => {
    switch (type) {
      case 'h1': doc.appendBlock(h1('')); break;
      case 'h2': doc.appendBlock(h2('')); break;
      case 'paragraph': doc.appendBlock(paragraph('')); break;
      case 'bullet': doc.appendBlock(bulletList([''])); break;
      case 'code': doc.appendBlock(codeBlock('')); break;
      case 'quote': doc.appendBlock(blockquote('')); break;
    }
  }, [doc]);

  const handleExport = useCallback(() => {
    const markdown = doc.toMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  }, [doc]);

  return (
    <div className="editor">
      {/* Toolbar */}
      <div className="toolbar">
        <button onClick={() => handleAddBlock('h1')}>H1</button>
        <button onClick={() => handleAddBlock('h2')}>H2</button>
        <button onClick={() => handleAddBlock('paragraph')}>¶</button>
        <button onClick={() => handleAddBlock('bullet')}>•</button>
        <button onClick={() => handleAddBlock('code')}>{'</>'}</button>
        <button onClick={() => handleAddBlock('quote')}>"</button>
        <span className="separator" />
        <button onClick={() => setPreview(!preview)}>
          {preview ? 'Edit' : 'Preview'}
        </button>
        <button onClick={handleExport}>Export</button>
      </div>

      {/* Content */}
      <div className="content">
        {preview ? (
          <pre>{doc.toMarkdown()}</pre>
        ) : (
          <BlockRenderer 
            blocks={doc.blocks}
            onBlockClick={(block) => editor.selectBlock(block.id)}
          />
        )}
      </div>
    </div>
  );
}
```

---

### Rendering Markdown Content

For read-only markdown display:

```tsx
import { parse } from 'create-markdown';
import { BlockRenderer } from 'create-markdown/react';

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export function MarkdownViewer({ content, className }: MarkdownViewerProps) {
  const blocks = parse(content);
  
  return (
    <article className={className}>
      <BlockRenderer blocks={blocks} />
    </article>
  );
}
```

---

### Server-side Markdown Processing

Transform markdown in build pipelines:

```ts
import { parse, stringify, createDocument } from 'create-markdown';
import type { Block } from 'create-markdown';

// Extract headings for TOC
function extractHeadings(blocks: Block[]) {
  return blocks
    .filter(b => b.type === 'heading')
    .map(b => ({
      level: b.props.level,
      text: b.content.map(s => s.text).join(''),
      id: b.id,
    }));
}

// Add IDs to headings
function addHeadingIds(blocks: Block[]): Block[] {
  return blocks.map(block => {
    if (block.type === 'heading') {
      const text = block.content.map(s => s.text).join('');
      const id = text.toLowerCase().replace(/\s+/g, '-');
      return { ...block, props: { ...block.props, id } };
    }
    return block;
  });
}

// Process markdown file
async function processFile(content: string) {
  const blocks = parse(content);
  const withIds = addHeadingIds(blocks);
  const toc = extractHeadings(withIds);
  const markdown = stringify(withIds);
  
  return { markdown, toc, blocks: withIds };
}
```

---

### Custom Block Renderers

Override default rendering for specific block types:

```tsx
import { BlockRenderer, BlockElement } from 'create-markdown/react';
import type { Block, BlockRenderers } from 'create-markdown/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const customRenderers: BlockRenderers = {
  // Custom code block with syntax highlighting
  codeBlock: ({ block }) => {
    const language = block.props?.language || 'text';
    const code = block.content.map(s => s.text).join('');
    
    return (
      <SyntaxHighlighter language={language} style={vscDarkPlus}>
        {code}
      </SyntaxHighlighter>
    );
  },
  
  // Custom callout styling
  callout: ({ block }) => {
    const type = block.props?.type || 'info';
    const icons = { info: 'ℹ️', warning: '⚠️', tip: '💡', danger: '🚨' };
    
    return (
      <div className={`callout callout-${type}`}>
        <span className="callout-icon">{icons[type]}</span>
        <div className="callout-content">
          <BlockElement block={block} />
        </div>
      </div>
    );
  },
  
  // Custom image with lazy loading
  image: ({ block }) => (
    <figure>
      <img 
        src={block.props.url} 
        alt={block.props.alt || ''} 
        loading="lazy"
      />
      {block.props.alt && <figcaption>{block.props.alt}</figcaption>}
    </figure>
  ),
};

export function CustomRenderer({ blocks }: { blocks: Block[] }) {
  return <BlockRenderer blocks={blocks} renderers={customRenderers} />;
}
```

---

## TypeScript Configuration

### Recommended tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node"]
  }
}
```

### Type Imports

```ts
import type { 
  Block, 
  TextSpan, 
  Document, 
  BlockType,
  HeadingBlock,
  ParagraphBlock,
} from 'create-markdown';

import type {
  UseDocumentReturn,
  UseBlockEditorReturn,
  BlockRenderers,
} from 'create-markdown/react';
```

---

## Bundle Size Optimization

### Import Only What You Need

```ts
// ✅ Good - tree-shakeable
import { parse, stringify } from 'create-markdown';
import { h1, paragraph } from 'create-markdown';

// ❌ Avoid - imports everything
import * as CM from 'create-markdown';
```

### Separate React Import

The React components are in a separate entry point for projects that don't need them:

```ts
// Core only (no React dependency)
import { parse, stringify } from 'create-markdown';

// With React components
import { BlockRenderer, useDocument } from 'create-markdown/react';
```

---

## Troubleshooting

### "Module not found: create-markdown/react"

Ensure your bundler supports the `exports` field in package.json. For older setups:

```ts
// Alternative import path
import { BlockRenderer } from 'create-markdown/dist/react';
```

### SSR Hydration Mismatch

The library generates unique IDs for blocks. For SSR, pass stable IDs:

```ts
const blocks = [
  { ...h1('Title'), id: 'title-1' },
  { ...paragraph('Content'), id: 'content-1' },
];
```

### contentEditable Issues

When building custom editors with `contentEditable`, ensure you:

1. Use `suppressContentEditableWarning` in React
2. Sync content on blur, not on every keystroke
3. Handle paste events to strip formatting

```tsx
<div
  contentEditable
  suppressContentEditableWarning
  onBlur={(e) => handleUpdate(e.currentTarget.innerHTML)}
/>
```

### Block ID Collisions

Each block needs a unique ID. The library generates UUIDs by default, but if you're creating blocks programmatically in bulk:

```ts
import { generateId } from 'create-markdown';

const blocks = items.map((item, index) => ({
  ...paragraph(item.text),
  id: `block-${index}-${generateId()}`,
}));
```

---

## Need Help?

- 📖 [API Reference](./README.md#api-reference)
- 🐛 [Report Issues](https://github.com/BunsDev/create-markdown/issues)
- 💬 [Discussions](https://github.com/BunsDev/create-markdown/discussions)
