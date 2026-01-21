# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Additional markdown element builders (headings, lists, tables, etc.)
- Frontmatter parsing support
- Markdown validation utilities

---

## [0.1.0] - 2026-01-20

### Added
- Initial release of `create-markdown`
- `createMarkdown()` function for creating markdown documents
- `MarkdownOptions` interface with `strict` and `lineEnding` options
- `MarkdownDocument` interface with `content` and `meta` properties
- Dual ESM/CommonJS module support
- Full TypeScript type definitions
- Cross-platform line ending normalization

### Technical
- Built with Bun for fast builds
- Zero runtime dependencies
- Node.js 18+ support

---

[Unreleased]: https://github.com/BunsDev/create-markdown/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/BunsDev/create-markdown/releases/tag/v0.1.0
