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

## [0.3.0] - 2026-01-27

### Changed
- Version bump for `create-markdown` convenience package from 0.1.0 to 0.3.0
- Aligned version with monorepo packages

---

## [0.2.2] - 2026-01-21

### Changed
- Maintenance release with documentation updates

---

## [0.2.1] - 2026-01-20

### Added
- Live inline markdown rendering in playground editor
- Real-time markdown pattern detection (`**bold**`, `*italic*`, `` `code` ``, `~~strikethrough~~`, `==highlight==`, `[link](url)`)
- Block conversion shortcuts (type `#` for headings, `-` for lists, `>` for blockquotes, ``` for code blocks, `---` for dividers)
- List item management (Enter to add, Backspace to remove, Tab for indent/outdent)
- Arrow key navigation between blocks and list items
- Keyboard shortcuts (Cmd/Ctrl+B for bold, Cmd/Ctrl+I for italic, Cmd/Ctrl+U for underline)

### Fixed
- Improved cursor position preservation during inline markdown rendering
- Fixed list item content synchronization on Enter key press
- Fixed blur handler to prevent content loss during list operations
- Improved HTML-to-spans parsing to preserve link styles

### Changed
- Enhanced playground with full WYSIWYG editing capabilities
- Improved content editable handling with atomic updates
- Updated inline pattern detection to avoid partial matches

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

[Unreleased]: https://github.com/BunsDev/create-markdown/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/BunsDev/create-markdown/compare/v0.2.2...v0.3.0
[0.2.2]: https://github.com/BunsDev/create-markdown/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/BunsDev/create-markdown/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/BunsDev/create-markdown/releases/tag/v0.2.0
