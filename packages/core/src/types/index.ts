/**
 * create-markdown - Type Definitions
 * Block-based document structure for markdown notes
 */

// ============================================================================
// Block Types
// ============================================================================

/**
 * All supported block types in the document
 */
export type BlockType =
  | 'paragraph'
  | 'heading'
  | 'bulletList'
  | 'numberedList'
  | 'checkList'
  | 'codeBlock'
  | 'blockquote'
  | 'table'
  | 'image'
  | 'divider'
  | 'callout';

/**
 * Callout variants for styled callout blocks
 */
export type CalloutType = 'info' | 'warning' | 'tip' | 'danger' | 'note';

// ============================================================================
// Inline Styles
// ============================================================================

/**
 * Link data for inline links
 */
export interface LinkData {
  url: string;
  title?: string;
}

/**
 * Inline styles that can be applied to text spans
 */
export interface InlineStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  highlight?: boolean;
  link?: LinkData;
}

/**
 * A span of text with optional inline styles
 */
export interface TextSpan {
  text: string;
  styles: InlineStyle;
}

// ============================================================================
// Block Properties
// ============================================================================

/**
 * Properties for heading blocks
 */
export interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * Properties for code blocks
 */
export interface CodeBlockProps {
  language?: string;
}

/**
 * Properties for checklist items
 */
export interface CheckListProps {
  checked: boolean;
}

/**
 * Properties for image blocks
 */
export interface ImageProps {
  url: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
}

/**
 * Properties for callout blocks
 */
export interface CalloutProps {
  type: CalloutType;
}

/**
 * Properties for table blocks
 */
export interface TableProps {
  headers: string[];
  rows: string[][];
  alignments?: ('left' | 'center' | 'right' | null)[];
}

/**
 * Empty props for blocks that don't need additional properties
 */
export interface EmptyProps {}

/**
 * Map of block types to their property interfaces
 */
export interface BlockPropsMap {
  paragraph: EmptyProps;
  heading: HeadingProps;
  bulletList: EmptyProps;
  numberedList: EmptyProps;
  checkList: CheckListProps;
  codeBlock: CodeBlockProps;
  blockquote: EmptyProps;
  table: TableProps;
  image: ImageProps;
  divider: EmptyProps;
  callout: CalloutProps;
}

/**
 * Get the props type for a specific block type
 */
export type BlockProps<T extends BlockType> = BlockPropsMap[T];

// ============================================================================
// Block Structure
// ============================================================================

/**
 * Block in the document
 * @template T - The block type
 */
export interface Block<T extends BlockType = BlockType> {
  /** Unique identifier for the block */
  id: string;
  /** The type of block */
  type: T;
  /** Inline content (text spans with styles) */
  content: TextSpan[];
  /** Nested child blocks (for lists, etc.) */
  children: Block[];
  /** Type-specific properties */
  props: BlockProps<T>;
}

/**
 * Type-safe block creators
 */
export type ParagraphBlock = Block<'paragraph'>;
export type HeadingBlock = Block<'heading'>;
export type BulletListBlock = Block<'bulletList'>;
export type NumberedListBlock = Block<'numberedList'>;
export type CheckListBlock = Block<'checkList'>;
export type CodeBlockBlock = Block<'codeBlock'>;
export type BlockquoteBlock = Block<'blockquote'>;
export type TableBlock = Block<'table'>;
export type ImageBlock = Block<'image'>;
export type DividerBlock = Block<'divider'>;
export type CalloutBlock = Block<'callout'>;

// ============================================================================
// Document Structure
// ============================================================================

/**
 * Document metadata
 */
export interface DocumentMeta {
  /** Document title */
  title?: string;
  /** Document description */
  description?: string;
  /** Author information */
  author?: string;
  /** Creation timestamp */
  createdAt?: Date;
  /** Last modification timestamp */
  updatedAt?: Date;
  /** Custom metadata fields */
  [key: string]: unknown;
}

/**
 * Complete markdown document
 */
export interface Document {
  /** Document version for migrations */
  version: number;
  /** Array of blocks in the document */
  blocks: Block[];
  /** Document metadata */
  meta: DocumentMeta;
}

// ============================================================================
// Options Types
// ============================================================================

/**
 * Options for markdown serialization
 */
export interface MarkdownSerializeOptions {
  /** Line ending character(s) */
  lineEnding?: '\n' | '\r\n';
  /** Number of spaces for list indentation */
  listIndent?: number;
  /** Heading style */
  headingStyle?: 'atx' | 'setext';
  /** Code block style */
  codeBlockStyle?: 'fenced' | 'indented';
  /** Bullet character for unordered lists */
  bulletChar?: '-' | '*' | '+';
  /** Emphasis character for bold/italic */
  emphasisChar?: '*' | '_';
}

/**
 * Options for markdown parsing
 */
export interface MarkdownParseOptions {
  /** Custom ID generator function */
  generateId?: () => string;
  /** Enable strict parsing mode */
  strict?: boolean;
}

/**
 * Options for document creation
 */
export interface DocumentOptions {
  /** Initial metadata */
  meta?: Partial<DocumentMeta>;
  /** Custom ID generator */
  generateId?: () => string;
}

