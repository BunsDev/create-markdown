# @create-markdown

[![npm version](https://img.shields.io/npm/v/create-markdown.svg)](https://www.npmjs.com/package/create-markdown)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
---
Lightweight, block-based markdown solution (_zero dependencies_). Parse, create, serialize, and render markdown with TypeScript support.

## Packages
| Package | Version | Description | Downloads (monthly)
|---------|---------|-------------|-------------|
| [@create-markdown/core](./packages/core) | 2.0.3 | Zero-dependency parsing and serialization | [![npm downloads](https://img.shields.io/npm/dm/@create-markdown/core?style=for-the-badge&color=black)](https://www.npmjs.com/package/@create-markdown/core)
| [@create-markdown/react](./packages/react) | 2.0.3 | React components and hooks | [![npm downloads](https://img.shields.io/npm/dm/@create-markdown/react?style=for-the-badge&color=black)](https://www.npmjs.com/package/@create-markdown/react)
| [@create-markdown/preview](./packages/preview) | 2.0.3 | HTML rendering with themes, plugins, and BYO-parser support | [![npm downloads](https://img.shields.io/npm/dm/@create-markdown/preview?style=for-the-badge&color=black)](https://www.npmjs.com/package/@create-markdown/preview)
| [@create-markdown/mdx](./packages/mdx) | 2.0.3 | MDX conversion | [![npm downloads](https://img.shields.io/npm/dm/@create-markdown/mdx?style=for-the-badge&color=black)](https://www.npmjs.com/package/@create-markdown/mdx)
| [create-markdown](./packages/create-markdown) | 2.0.3 | Convenience bundle | [![npm downloads](https://img.shields.io/npm/dm/create-markdown?style=for-the-badge&color=black)](https://www.npmjs.com/package/create-markdown)

## Key Features
- **Block-based architecture**: Work with structured blocks instead of raw strings
- **Bidirectional conversion**: Parse markdown to blocks, serialize blocks to markdown
- **Rich inline styles**: Bold, italic, code, links, strikethrough, highlights
- **React components**: Optional React bindings for rendering and editing
- **HTML preview**: Framework-agnostic HTML rendering with themes
- **BYO parser**: Use `applyPreviewTheme()` with `marked`, `markdown-it`, `remark`, or any parser -- no lock-in to `@create-markdown/core`
- **CSS custom property theming**: `system.css` theme integrates with any design system via `--cm-*` variables
- **Syntax highlighting**: Shiki plugin for code blocks
- **Diagrams**: Mermaid plugin for flowcharts, sequence diagrams, etc.
- **Web Component**: `<markdown-preview>` custom element with optional light DOM mode
- **BYO sanitizer**: Plug in DOMPurify or any sanitizer function
- **Theme CSS as strings**: Import theme CSS as string constants for CSS-in-JS or web components
- **Zero dependencies**: Core package has no runtime dependencies
- **Full TypeScript**: Complete type definitions with generics

## Installation
```bash
# Install individual packages (recommended)
pnpm add @create-markdown/core
pnpm add @create-markdown/react
pnpm add @create-markdown/preview

# Or install the convenience bundle
pnpm add create-markdown
```

## Quick Start

### Parse and Serialize Markdown
```typescript
import { parse, stringify, h1, paragraph } from '@create-markdown/core';

// Parse markdown to blocks
const blocks = parse('# Hello\n\nWorld');

// Create blocks programmatically
const doc = [
  h1('Hello'),
  paragraph('World'),
];

// Serialize back to markdown
const markdown = stringify(doc);
```

### Use with Any Markdown Parser

`@create-markdown/preview` works with any parser's HTML output -- no need to switch to `@create-markdown/core`:

```typescript
import { applyPreviewTheme } from '@create-markdown/preview';
import { marked } from 'marked';

const raw = marked.parse('# Hello\n\nSome **bold** text.');
const themed = applyPreviewTheme(raw); // wraps elements with cm-* classes
```

Pair with any theme CSS (`github.css`, `github-dark.css`, `minimal.css`, or `system.css`) and the styled output just works.
Sanitize untrusted HTML before assigning the themed output to the DOM.

### React Components

```tsx
import { BlockRenderer, useDocument, paragraph } from '@create-markdown/react';

function Editor() {
  const doc = useDocument([paragraph('Start typing...')]);
  
  return (
    <div>
      <BlockRenderer blocks={doc.blocks} />
      <button onClick={() => doc.appendBlock(paragraph('New paragraph'))}>
        Add Paragraph
      </button>
    </div>
  );
}
```

### HTML Preview with Plugins

```typescript
import { renderAsync, shikiPlugin } from '@create-markdown/preview';
import { mermaidPlugin } from '@create-markdown/preview-mermaid';
import { parse } from '@create-markdown/core';

const blocks = parse(`
# Code Example

\`\`\`typescript
const x = 42;
\`\`\`

\`\`\`mermaid
flowchart LR
  A --> B --> C
\`\`\`
`);

const html = await renderAsync(blocks, {
  plugins: [shikiPlugin(), mermaidPlugin()],
});
```

Preview output is intended for trusted content by default. If the markdown or generated HTML can come from users, sanitize it before rendering.

### CSS Custom Property Theming

The `system.css` theme uses CSS custom properties so it adapts to any design system:

```css
/* Set once -- the theme adapts to light and dark mode automatically */
:root {
  --cm-text: #1f2328;
  --cm-bg: #ffffff;
  --cm-border: #d1d9e0;
  --cm-code-bg: #f6f8fa;
  --cm-link: #0969da;
}

@media (prefers-color-scheme: dark) {
  :root {
    --cm-text: #e6edf3;
    --cm-bg: #0d1117;
    --cm-border: #30363d;
    --cm-code-bg: #161b22;
    --cm-link: #58a6ff;
  }
}
```

```typescript
import '@create-markdown/preview/themes/system.css';
```

### BYO Sanitizer

Pass any sanitizer function when rendering untrusted content:

```typescript
import { blocksToHTML } from '@create-markdown/preview';
import DOMPurify from 'dompurify';

const html = blocksToHTML(blocks, {
  sanitize: (html) => DOMPurify.sanitize(html, { USE_PROFILES: { html: true } }),
});
```

### Theme CSS as Strings

Import theme CSS as string constants for CSS-in-JS, bundlers that struggle with CSS imports, or web components:

```typescript
import { themes } from '@create-markdown/preview/themes';

// themes.github, themes.githubDark, themes.minimal, themes.system
const style = document.createElement('style');
style.textContent = themes.githubDark;
document.head.appendChild(style);
```

### Web Component

```html
<script type="module">
  import { registerPreviewElement } from '@create-markdown/preview';
  registerPreviewElement();
</script>

<markdown-preview theme="github-dark">
# Hello World

This renders automatically!
</markdown-preview>
```

Use `shadowMode: 'none'` to render in the light DOM and inherit page styles:

```typescript
registerPreviewElement({ shadowMode: 'none' });
```

The web component also assumes trusted markdown by default, so sanitize user-provided content before passing it in.

## Documentation

| Document | Description |
|----------|-------------|
| [packages/core/README.md](./packages/core/README.md) | Core API reference |
| [packages/react/README.md](./packages/react/README.md) | React components guide |
| [packages/preview/README.md](./packages/preview/README.md) | Preview and plugins guide |
| [ROADMAP.md](./docs/ROADMAP.md) | Feature roadmap |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contribution guidelines |
| [INTEGRATION.md](./docs/INTEGRATION.md) | Framework integrations |

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm run build

# Run tests
pnpm run test

# Type check
pnpm run typecheck

# Run the playground
pnpm run playground
```

## Monorepo Structure

```
create-markdown/
├── packages/
│   ├── core/              # @create-markdown/core
│   ├── react/             # @create-markdown/react
│   ├── preview/           # @create-markdown/preview
│   ├── mdx/               # @create-markdown/mdx
│   ├── create-markdown/   # Convenience bundle
│   └── docs/              # Documentation site
├── playground/            # Demo application
├── scripts/               # Release and utility scripts
└── .github/               # CI/CD workflows
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT
