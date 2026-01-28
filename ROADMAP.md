# @create-markdown Roadmap

This document outlines the planned features and development stages for the @create-markdown package ecosystem.

## Overview

The @create-markdown project provides a complete block-based markdown solution with:

- **@create-markdown/core** - Zero-dependency parsing and serialization
- **@create-markdown/preview** - Framework-agnostic HTML rendering with plugins
- **@create-markdown/react** - React components and hooks
- **create-markdown** - Convenience bundle

---

## Stage 0: Foundation (Current)

**Status: Complete**

The foundation stage establishes the monorepo structure and core infrastructure.

### Completed

- [x] Monorepo setup with Turborepo
- [x] Package extraction and restructuring
  - [x] @create-markdown/core (v0.1.0)
  - [x] @create-markdown/react (v0.1.0)
  - [x] @create-markdown/preview (v0.1.0)
  - [x] create-markdown bundle (v0.1.0)
- [x] CI/CD pipelines with GitHub Actions
- [x] Changesets for version management
- [x] Open source documentation (CODE_OF_CONDUCT, SECURITY, templates)

---

## Stage 1: Core Stabilization

**Status: In Progress**

Focus on stabilizing the core package with comprehensive testing and documentation.

### Goals

- [ ] Full test coverage (80%+ target)
- [ ] API documentation with TypeDoc
- [ ] Performance benchmarks
- [ ] Example projects

### Features

- [ ] Frontmatter parsing support
- [ ] Markdown validation utilities
- [ ] Custom block type registration API
- [ ] Improved nested list support

---

## Stage 2: Preview Package Enhancement

**Status: In Progress**

Enhance the preview package with additional plugins and features.

### Completed

- [x] `blocksToHTML()` serializer
- [x] Built-in CSS themes (GitHub, GitHub Dark, Minimal)
- [x] Shiki syntax highlighting plugin
- [x] Mermaid diagram plugin
- [x] Web Component `<markdown-preview>`

### Planned

- [ ] KaTeX math rendering plugin
- [ ] Table of contents generation
- [ ] Heading anchor links
- [ ] Copy code button
- [ ] Line numbers for code blocks
- [ ] Diff/patch highlighting
- [ ] Additional themes (Dracula, One Dark, Nord)

---

## Stage 3: React Integration

**Status: Planned**

Enhance React integration with advanced features and developer experience.

### Goals

- [ ] Plugin integration for Shiki/Mermaid in BlockRenderer
- [ ] SSR/RSC (React Server Components) support
- [ ] Storybook component library
- [ ] React Native support (experimental)

### Features

- [ ] `<CodeBlock>` component with Shiki
- [ ] `<MermaidDiagram>` component
- [ ] `<MarkdownEditor>` full editor component
- [ ] Selection and cursor management
- [ ] Undo/redo history hook
- [ ] Collaborative editing hooks (CRDT-ready)

---

## Stage 4: Extended Features

**Status: Planned**

Add advanced features for power users and specific use cases.

### Features

- [ ] Footnotes support
- [ ] Definition lists
- [ ] Abbreviations
- [ ] Emoji shortcodes (`:smile:`)
- [ ] Task list progress tracking
- [ ] Block metadata (custom attributes)
- [ ] Block comments/annotations
- [ ] Import/export formats (HTML, DOCX, PDF)

### Plugins

- [ ] Prism.js alternative syntax highlighting
- [ ] PlantUML diagrams
- [ ] Chart.js integration
- [ ] Excalidraw embedding
- [ ] YouTube/Vimeo embeds
- [ ] Twitter/X embeds
- [ ] CodeSandbox/StackBlitz embeds

---

## Stage 5: Framework Expansion

**Status: Planned**

Expand framework support beyond React.

### Packages

- [ ] @create-markdown/vue (v0.1.0)
  - [ ] Vue 3 Composition API
  - [ ] Nuxt.js integration
- [ ] @create-markdown/svelte (v0.1.0)
  - [ ] Svelte 5 runes
  - [ ] SvelteKit integration
- [ ] @create-markdown/solid (v0.1.0)
  - [ ] SolidStart integration
- [ ] @create-markdown/angular (v0.1.0)
  - [ ] Standalone components

---

## Stage 6: Advanced Features

**Status: Future**

Long-term vision for advanced capabilities.

### Collaborative Editing

- [ ] CRDT-based real-time sync
- [ ] Yjs integration
- [ ] Cursor presence
- [ ] Comments and suggestions
- [ ] Version history

### Developer Experience

- [ ] LSP (Language Server Protocol) support
- [ ] VS Code extension
- [ ] Cursor/editor integrations
- [ ] CLI tools for conversion

### Platform

- [ ] Plugin marketplace/registry
- [ ] Block template library
- [ ] Theme builder
- [ ] Online playground with sharing

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Prioritization

Features are prioritized based on:
1. Community demand (GitHub issues, discussions)
2. Alignment with project goals
3. Implementation complexity
4. Maintainability

### Proposing Features

1. Check existing issues and this roadmap
2. Open a feature request issue
3. Discuss in GitHub Discussions
4. Submit a PR (for smaller features)

---

## Version Policy

- **Major (1.0.0)**: Breaking API changes
- **Minor (0.x.0)**: New features, non-breaking
- **Patch (0.0.x)**: Bug fixes, documentation

All packages in the ecosystem are versioned together using Changesets.

---

## Timeline

We do not provide specific timelines. Features are released when ready. Track progress in:

- [GitHub Issues](https://github.com/BunsDev/create-markdown/issues)
- [GitHub Discussions](https://github.com/BunsDev/create-markdown/discussions)
- [Changelog](./CHANGELOG.md)
