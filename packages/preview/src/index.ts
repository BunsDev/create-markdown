/**
 * @create-markdown/preview
 * Framework-agnostic HTML rendering for @create-markdown
 * Supports syntax highlighting (Shiki) and diagrams (Mermaid)
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

// Mermaid plugin
export { mermaidPlugin, createMermaidPlugin } from './plugins/mermaid';
export type { MermaidPluginOptions } from './plugins/mermaid';

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

export const VERSION = '2.0.2';
