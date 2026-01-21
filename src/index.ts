/**
 * create-markdown
 * Complete block-based markdown notes package
 * Zero dependencies, full TypeScript support
 */

// ============================================================================
// Types
// ============================================================================

export type {
  // Block types
  BlockType,
  Block,
  ParagraphBlock,
  HeadingBlock,
  BulletListBlock,
  NumberedListBlock,
  CheckListBlock,
  CodeBlockBlock,
  BlockquoteBlock,
  TableBlock,
  ImageBlock,
  DividerBlock,
  CalloutBlock,
  CalloutType,

  // Block properties
  BlockProps,
  BlockPropsMap,
  HeadingProps,
  CodeBlockProps,
  CheckListProps,
  ImageProps,
  CalloutProps,
  TableProps,
  EmptyProps,

  // Inline styles
  InlineStyle,
  TextSpan,
  LinkData,

  // Document types
  Document,
  DocumentMeta,
  DocumentOptions,

  // Options
  MarkdownSerializeOptions,
  MarkdownParseOptions,
} from './types';

// ============================================================================
// Core - Utilities
// ============================================================================

export {
  generateId,
  deepClone,
  deepCloneBlocks,
  normalizeLineEndings,
  convertLineEndings,
  escapeMarkdown,
  unescapeMarkdown,
  escapeCodeBlock,
  trimTrailingWhitespace,
  trimBlankLines,
  indent,
  spansToPlainText,
  plainSpan,
  plainContent,
  hasContent,
  hasChildren,
  isValidHeadingLevel,
  isValidBlockType,
} from './core/utils';

// ============================================================================
// Core - Block Factories
// ============================================================================

export {
  // Generic creator
  createBlock,

  // Inline content helpers
  text,
  bold,
  italic,
  code,
  strikethrough,
  underline,
  highlight,
  link,
  styled,
  spans,

  // Block factories
  paragraph,
  heading,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  bulletList,
  numberedList,
  checkListItem,
  checkList,
  codeBlock,
  blockquote,
  divider,
  image,
  callout,
  infoCallout,
  warningCallout,
  tipCallout,
  dangerCallout,
  noteCallout,
  table,

  // Block modification
  appendContent,
  prependContent,
  setContent,
  addChildren,
  updateProps,
} from './core/blocks';

// ============================================================================
// Core - Document Management
// ============================================================================

export {
  DOCUMENT_VERSION,

  // Document creation
  createDocument,
  emptyDocument,
  cloneDocument,

  // Block CRUD
  insertBlock,
  appendBlock,
  prependBlock,
  insertBlocks,
  removeBlock,
  removeBlocks,
  updateBlock,
  replaceBlock,
  moveBlock,
  swapBlocks,

  // Block queries
  findBlock,
  getBlockIndex,
  getBlockAt,
  getFirstBlock,
  getLastBlock,
  findBlocksByType,
  hasBlock,
  getBlockCount,
  isEmpty,

  // Content operations
  setBlockContent,
  appendBlockContent,

  // Metadata operations
  updateMeta,
  setMetaField,
  getMetaField,

  // Bulk operations
  clearBlocks,
  setBlocks,
  filterBlocks,
  mapBlocks,
} from './core/document';

// ============================================================================
// Serializers
// ============================================================================

export {
  blocksToMarkdown,
  documentToMarkdown,
  serializeBlock,
  serializeInlineContent,
  serializeSpan,
  stringify,
} from './serializers/markdown';

// ============================================================================
// Parsers
// ============================================================================

export {
  markdownToBlocks,
  markdownToDocument,
  parse,
  parseInlineContent,
} from './parsers/markdown';

export {
  tokenize,
  groupTokens,
  isListToken,
  isCodeToken,
} from './parsers/tokenizer';

export type { Token, TokenType, TokenMeta } from './parsers/tokenizer';

// ============================================================================
// Convenience API
// ============================================================================

import type { Block } from './types';
import { markdownToBlocks } from './parsers/markdown';
import { blocksToMarkdown } from './serializers/markdown';
import { createDocument as createDoc } from './core/document';

/**
 * Creates a document from markdown string with full block parsing
 *
 * @example
 * ```ts
 * const doc = fromMarkdown('# Hello\n\nWorld');
 * console.log(doc.blocks); // [HeadingBlock, ParagraphBlock]
 * ```
 */
export function fromMarkdown(markdown: string) {
  const blocks = markdownToBlocks(markdown);
  return createDoc(blocks);
}

/**
 * Converts a document or blocks to markdown string
 *
 * @example
 * ```ts
 * import { h1, paragraph, toMarkdown } from 'create-markdown';
 *
 * const blocks = [h1('Hello'), paragraph('World')];
 * console.log(toMarkdown(blocks)); // "# Hello\n\nWorld"
 * ```
 */
export function toMarkdown(blocksOrDoc: Block[] | { blocks: Block[] }): string {
  const blocks = Array.isArray(blocksOrDoc) ? blocksOrDoc : blocksOrDoc.blocks;
  return blocksToMarkdown(blocks);
}

// ============================================================================
// Package Info
// ============================================================================

/**
 * Package version
 */
export const VERSION = '0.2.0';
