/**
 * create-markdown - Utility Functions
 * Core utilities for block manipulation and markdown handling
 */

import type { Block, BlockType, TextSpan } from '../types/index';

// ============================================================================
// ID Generation
// ============================================================================

/**
 * Characters used for ID generation (URL-safe)
 */
const ID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const ID_LENGTH = 8;

/**
 * Generates a unique ID for blocks
 * Nano ID-style implementation without dependencies
 */
export function generateId(length: number = ID_LENGTH): string {
  let id = '';
  const charsLength = ID_CHARS.length;
  
  for (let i = 0; i < length; i++) {
    id += ID_CHARS.charAt(Math.floor(Math.random() * charsLength));
  }
  
  return id;
}

// ============================================================================
// Deep Clone
// ============================================================================

/**
 * Deep clones a block and all its children
 * Generates new IDs for cloned blocks to ensure uniqueness
 */
export function deepClone<T extends BlockType>(
  block: Block<T>,
  regenerateIds: boolean = true
): Block<T> {
  return {
    id: regenerateIds ? generateId() : block.id,
    type: block.type,
    content: block.content.map((span) => ({
      text: span.text,
      styles: { ...span.styles },
    })),
    children: block.children.map((child) => deepClone(child, regenerateIds)),
    props: { ...block.props } as Block<T>['props'],
  };
}

/**
 * Deep clones an array of blocks
 */
export function deepCloneBlocks(
  blocks: Block[],
  regenerateIds: boolean = true
): Block[] {
  return blocks.map((block) => deepClone(block, regenerateIds));
}

// ============================================================================
// Line Ending Normalization
// ============================================================================

/**
 * Normalizes line endings to LF (\n)
 */
export function normalizeLineEndings(text: string): string {
  return text.replace(/\r\n|\r/g, '\n');
}

/**
 * Converts line endings to the specified format
 */
export function convertLineEndings(
  text: string,
  lineEnding: '\n' | '\r\n'
): string {
  const normalized = normalizeLineEndings(text);
  if (lineEnding === '\r\n') {
    return normalized.replace(/\n/g, '\r\n');
  }
  return normalized;
}

// ============================================================================
// Markdown Escaping
// ============================================================================

/**
 * Characters that need escaping in markdown
 */
const MARKDOWN_ESCAPE_CHARS = /[\\`*_{}[\]()#+\-.!|]/g;

/**
 * Escapes special markdown characters in text
 */
export function escapeMarkdown(text: string): string {
  return text.replace(MARKDOWN_ESCAPE_CHARS, '\\$&');
}

/**
 * Unescapes markdown escape sequences
 */
export function unescapeMarkdown(text: string): string {
  return text.replace(/\\([\\`*_{}[\]()#+\-.!|])/g, '$1');
}

/**
 * Escapes text for use inside code blocks (minimal escaping)
 */
export function escapeCodeBlock(text: string): string {
  // Only need to escape backticks that would close the code block
  return text.replace(/```/g, '\\`\\`\\`');
}

// ============================================================================
// Text Helpers
// ============================================================================

/**
 * Trims trailing whitespace from each line
 */
export function trimTrailingWhitespace(text: string): string {
  return text
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n');
}

/**
 * Removes leading/trailing blank lines
 */
export function trimBlankLines(text: string): string {
  const lines = text.split('\n');
  
  // Find first non-blank line
  let start = 0;
  while (start < lines.length && lines[start].trim() === '') {
    start++;
  }
  
  // Find last non-blank line
  let end = lines.length - 1;
  while (end >= start && lines[end].trim() === '') {
    end--;
  }
  
  return lines.slice(start, end + 1).join('\n');
}

/**
 * Indents each line of text by the specified number of spaces
 */
export function indent(text: string, spaces: number): string {
  const padding = ' '.repeat(spaces);
  return text
    .split('\n')
    .map((line) => (line.trim() ? padding + line : line))
    .join('\n');
}

// ============================================================================
// Content Helpers
// ============================================================================

/**
 * Extracts plain text from an array of text spans
 */
export function spansToPlainText(spans: TextSpan[]): string {
  return spans.map((span) => span.text).join('');
}

/**
 * Creates a simple text span with no styles
 */
export function plainSpan(text: string): TextSpan {
  return { text, styles: {} };
}

/**
 * Creates an array with a single plain text span
 */
export function plainContent(text: string): TextSpan[] {
  return [plainSpan(text)];
}

/**
 * Checks if a block has any content
 */
export function hasContent(block: Block): boolean {
  return (
    block.content.length > 0 &&
    block.content.some((span) => span.text.length > 0)
  );
}

/**
 * Checks if a block has children
 */
export function hasChildren(block: Block): boolean {
  return block.children.length > 0;
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validates a heading level
 */
export function isValidHeadingLevel(level: number): level is 1 | 2 | 3 | 4 | 5 | 6 {
  return Number.isInteger(level) && level >= 1 && level <= 6;
}

/**
 * Validates a block type
 */
export function isValidBlockType(type: string): type is BlockType {
  const validTypes: BlockType[] = [
    'paragraph',
    'heading',
    'bulletList',
    'numberedList',
    'checkList',
    'codeBlock',
    'blockquote',
    'table',
    'image',
    'divider',
    'callout',
  ];
  return validTypes.includes(type as BlockType);
}
