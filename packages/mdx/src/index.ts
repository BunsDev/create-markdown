/**
 * @create-markdown/mdx
 * Convert markdown blocks to MDX with component mappings
 */

// ============================================================================
// Serialization
// ============================================================================

export { blocksToMDX, blocksToMDXWithMeta } from './serializer';

// ============================================================================
// Conversion Utilities
// ============================================================================

export {
  markdownToMDX,
  markdownToMDXWithMeta,
  convertFile,
  convertDirectory,
  docsPreset,
  minimalPreset,
} from './converter';

// ============================================================================
// Types
// ============================================================================

export type {
  ComponentMappings,
  MDXFrontmatter,
  MDXSerializeOptions,
  ResolvedMDXOptions,
  MDXConversionResult,
  ConvertOptions,
} from './types';

// ============================================================================
// Re-exports from core for convenience
// ============================================================================

export { parse, stringify } from '@create-markdown/core';
export type { Block, TextSpan, BlockType } from '@create-markdown/core';

// ============================================================================
// Package Info
// ============================================================================

/**
 * Package version
 */
export const VERSION = '0.2.0';
