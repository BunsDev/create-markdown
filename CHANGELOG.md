# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Frontmatter parsing support
- Markdown validation utilities
- Nested list support improvements

---

## [0.2.0] - 2026-01-20

### Added - Complete Block-Based Architecture

This release introduces a complete block-based markdown notes system with zero dependencies.

#### Core Types (`src/types/index.ts`)
- `BlockType` union with 11 block types: paragraph, heading, bulletList, numberedList, checkList, codeBlock, blockquote, table, image, divider, callout
- `Block<T>` generic interface with id, type, content, children, and props
- `TextSpan` and `InlineStyle` for rich text formatting
- `Document` interface for complete document representation

#### Block Factory Functions (`src/core/blocks.ts`)
- `createBlock()` - Generic block creator
- `paragraph()`, `heading()`, `h1()`-`h6()` - Text blocks
- `bulletList()`, `numberedList()`, `checkList()` - List blocks
- `codeBlock()`, `blockquote()`, `divider()` - Structural blocks
- `image()`, `table()`, `callout()` - Rich content blocks
- Inline helpers: `bold()`, `italic()`, `code()`, `link()`, `strikethrough()`, `highlight()`

#### Document Management (`src/core/document.ts`)
- `createDocument()`, `emptyDocument()`, `cloneDocument()`
- CRUD operations: `insertBlock()`, `appendBlock()`, `removeBlock()`, `updateBlock()`
- Query operations: `findBlock()`, `getBlockIndex()`, `findBlocksByType()`
- Bulk operations: `setBlocks()`, `clearBlocks()`, `filterBlocks()`, `mapBlocks()`

#### Markdown Parser (`src/parsers/`)
- `parse()` / `markdownToBlocks()` - Parse markdown strings to blocks
- `markdownToDocument()` - Parse to full Document object
- Line tokenizer with support for all common markdown constructs
- Inline style parser with nesting support

#### Markdown Serializer (`src/serializers/markdown.ts`)
- `stringify()` / `blocksToMarkdown()` - Serialize blocks to markdown
- `documentToMarkdown()` - Serialize Document objects
- Configurable options: lineEnding, listIndent, headingStyle, codeBlockStyle

#### React Components (`src/react/`) - Optional
- `BlockRenderer` - Render blocks as React elements
- `BlockElement` - Render single blocks with custom renderers
- `InlineContent` - Render styled text spans

#### React Hooks (`src/react/hooks.ts`) - Optional
- `useDocument()` - Full document state management
- `useMarkdown()` - Bidirectional markdown/blocks state
- `useBlockEditor()` - Selection and editing operations

#### Convenience Functions
- `fromMarkdown(markdown)` - Quick parse to Document
- `toMarkdown(blocks)` - Quick serialize to string

---

[Unreleased]: https://github.com/BunsDev/create-markdown/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/BunsDev/create-markdown/releases/tag/v0.2.0
