# @create-markdown/preview

Framework-agnostic HTML rendering for @create-markdown with syntax highlighting (Shiki) and diagram support (Mermaid).

## Installation

```bash
# Using pnpm
pnpm add @create-markdown/preview

# Using npm
npm install @create-markdown/preview

# Optional: Install plugins
pnpm add shiki
```

## Quick Start

### Basic HTML Rendering

```typescript
import { markdownToHTML } from '@create-markdown/preview';
import DOMPurify from 'dompurify';

const html = await markdownToHTML(`
# Hello World

This is **bold** and *italic* text.
`);

const preview = document.getElementById('preview');

if (preview) {
  preview.innerHTML = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}
```

Sanitize untrusted content before rendering it. Direct DOM assignment is only appropriate when you fully trust the markdown source.

### With Syntax Highlighting (Shiki)

```typescript
import { renderAsync, shikiPlugin } from '@create-markdown/preview';
import { parse } from '@create-markdown/core';

const blocks = parse(`
\`\`\`typescript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`
`);

const html = await renderAsync(blocks, {
  plugins: [shikiPlugin({ theme: 'github-dark' })],
});
```

### With Mermaid Diagrams

```typescript
import { renderAsync } from '@create-markdown/preview';
import { mermaidPlugin } from '@create-markdown/preview-mermaid';
import { parse } from '@create-markdown/core';

const blocks = parse(`
\`\`\`mermaid
flowchart LR
  A[Start] --> B[Process]
  B --> C[End]
\`\`\`
`);

const html = await renderAsync(blocks, {
  plugins: [
    mermaidPlugin({
      theme: 'default',
      config: { securityLevel: 'strict' },
    }),
  ],
});
```

Install Mermaid support only when you need it:

```bash
pnpm add @create-markdown/preview-mermaid mermaid
```

Use Mermaid's stricter security mode when diagram text can come from users. Only opt into looser Mermaid settings for fully trusted content.

### Web Component

```html
<script type="module">
  import { registerPreviewElement } from '@create-markdown/preview';
  registerPreviewElement();
</script>

<markdown-preview theme="github">
# Hello World

This is rendered as HTML automatically!
</markdown-preview>
```

With plugins:

```typescript
import { registerPreviewElement, shikiPlugin } from '@create-markdown/preview';
import { mermaidPlugin } from '@create-markdown/preview-mermaid';

registerPreviewElement({
  plugins: [
    shikiPlugin(),
    mermaidPlugin(),
  ],
});
```

The web component renders trusted content by default, so sanitize user-provided markdown before passing it to the element.

## API

### `blocksToHTML(blocks, options?)`

Converts blocks to HTML string synchronously.

### `markdownToHTML(markdown, options?)`

Converts markdown string to HTML.

### `renderAsync(blocks, options?)`

Async version that initializes plugins before rendering.

### Plugins

- `shikiPlugin(options?)` - Syntax highlighting with Shiki
- `mermaidPlugin(options?)` - Mermaid diagram rendering via `@create-markdown/preview-mermaid`

### Themes

CSS themes are available at:

- `@create-markdown/preview/themes/github.css`
- `@create-markdown/preview/themes/github-dark.css`
- `@create-markdown/preview/themes/minimal.css`

## Options

```typescript
interface PreviewOptions {
  classPrefix?: string;       // CSS class prefix (default: 'cm-')
  theme?: string;             // Theme name
  linkTarget?: '_blank' | '_self';
  sanitize?: boolean | ((html: string) => string);
  plugins?: PreviewPlugin[];  // Plugins for enhanced rendering
}
```

## License

MIT
