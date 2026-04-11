/**
 * @create-markdown/preview
 * Framework-agnostic HTML rendering for @create-markdown
 * Supports optional syntax highlighting (Shiki)
 */

// ============================================================================
// HTML Serialization
// ============================================================================

export {
  blocksToHTML,
  markdownToHTML,
  renderAsync,
} from './html-serializer';

// ============================================================================
// Apply Theme (works with any parser's HTML output)
// ============================================================================

export {
  applyPreviewTheme,
  type ApplyThemeOptions,
} from './apply-theme';

// ============================================================================
// Plugin Types
// ============================================================================

export type {
  PreviewPlugin,
  PreviewOptions,
  BlockHTMLRenderers,
  ResolvedPreviewOptions,
} from './plugins/types';

// ============================================================================
// Themes
// ============================================================================

export {
  themeNames,
  getThemePath,
  themes,
  type ThemeName,
} from './themes';

// ============================================================================
// Plugins (lazy imports to avoid requiring peer deps)
// ============================================================================

// Shiki plugin
export { shikiPlugin, createShikiPlugin } from './plugins/shiki';
export type { ShikiPluginOptions } from './plugins/shiki';

// KaTeX plugin
export { katexPlugin } from './plugins/katex';
export type { KaTeXPluginOptions } from './plugins/katex';

// Copy button plugin
export { copyButtonPlugin } from './plugins/copy-button';
export type { CopyButtonPluginOptions } from './plugins/copy-button';

// Heading anchors plugin
export { headingAnchorsPlugin } from './plugins/heading-anchors';
export type { HeadingAnchorsPluginOptions } from './plugins/heading-anchors';

// Table of contents plugin
export { tocPlugin, extractToc, renderToc } from './plugins/toc';
export type { TocPluginOptions, TocItem } from './plugins/toc';

// ============================================================================
// Web Component
// ============================================================================

export {
  registerPreviewElement,
  autoRegister,
  MarkdownPreviewElement,
} from './web-component';
export type { RegisterOptions, ShadowModeOption } from './web-component';

// ============================================================================
// Re-exports from core (type-only, no runtime dependency)
// ============================================================================

export type { Block, TextSpan, BlockType } from '@create-markdown/core';

// ============================================================================
// Package Info
// ============================================================================

export const VERSION = '2.0.3';
