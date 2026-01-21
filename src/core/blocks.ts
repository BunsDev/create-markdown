/**
 * create-markdown - Block Factory Functions
 * Create and manipulate block structures
 */

import type {
  Block,
  BlockType,
  TextSpan,
  InlineStyle,
  HeadingBlock,
  ParagraphBlock,
  BulletListBlock,
  NumberedListBlock,
  CheckListBlock,
  CodeBlockBlock,
  BlockquoteBlock,
  ImageBlock,
  DividerBlock,
  CalloutBlock,
  CalloutType,
  TableBlock,
} from '../types';
import { generateId, plainContent, plainSpan } from './utils';

// ============================================================================
// Generic Block Creator
// ============================================================================

/**
 * Creates: block with the specified type and properties
 */
export function createBlock<T extends BlockType>(
  type: T,
  content: TextSpan[] = [],
  props: Block<T>['props'] = {} as Block<T>['props'],
  children: Block[] = []
): Block<T> {
  return {
    id: generateId(),
    type,
    content,
    children,
    props,
  };
}

// ============================================================================
// Inline Content Helpers (Text Spans)
// ============================================================================

/**
 * Creates: plain text span with no styles
 */
export function text(content: string): TextSpan {
  return plainSpan(content);
}

/**
 * Creates: bold text span
 */
export function bold(content: string): TextSpan {
  return { text: content, styles: { bold: true } };
}

/**
 * Creates: italic text span
 */
export function italic(content: string): TextSpan {
  return { text: content, styles: { italic: true } };
}

/**
 * Creates: inline code text span
 */
export function code(content: string): TextSpan {
  return { text: content, styles: { code: true } };
}

/**
 * Creates: strikethrough text span
 */
export function strikethrough(content: string): TextSpan {
  return { text: content, styles: { strikethrough: true } };
}

/**
 * Creates: underlined text span
 */
export function underline(content: string): TextSpan {
  return { text: content, styles: { underline: true } };
}

/**
 * Creates: highlighted text span
 */
export function highlight(content: string): TextSpan {
  return { text: content, styles: { highlight: true } };
}

/**
 * Creates: link text span
 */
export function link(content: string, url: string, title?: string): TextSpan {
  return {
    text: content,
    styles: { link: { url, title } },
  };
}

/**
 * Creates: text span with custom styles
 */
export function styled(content: string, styles: InlineStyle): TextSpan {
  return { text: content, styles };
}

/**
 * Combines multiple text spans into a content array
 */
export function spans(...textSpans: TextSpan[]): TextSpan[] {
  return textSpans;
}

// ============================================================================
// Block Factory Functions
// ============================================================================

/**
 * Creates: paragraph block
 */
export function paragraph(content: string | TextSpan[]): ParagraphBlock {
  const textContent = typeof content === 'string' ? plainContent(content) : content;
  return createBlock('paragraph', textContent, {});
}

/**
 * Creates: heading block
 */
export function heading(
  level: 1 | 2 | 3 | 4 | 5 | 6,
  content: string | TextSpan[]
): HeadingBlock {
  const textContent = typeof content === 'string' ? plainContent(content) : content;
  return createBlock('heading', textContent, { level });
}

// Convenience functions for each heading level
export const h1 = (content: string | TextSpan[]) => heading(1, content);
export const h2 = (content: string | TextSpan[]) => heading(2, content);
export const h3 = (content: string | TextSpan[]) => heading(3, content);
export const h4 = (content: string | TextSpan[]) => heading(4, content);
export const h5 = (content: string | TextSpan[]) => heading(5, content);
export const h6 = (content: string | TextSpan[]) => heading(6, content);

/**
 * Creates: bullet list block with items
 */
export function bulletList(items: (string | TextSpan[] | Block)[]): BulletListBlock {
  const children = items.map((item) => {
    if (typeof item === 'string') {
      return paragraph(item);
    }
    if (Array.isArray(item)) {
      return paragraph(item);
    }
    return item;
  });
  
  return createBlock('bulletList', [], {}, children);
}

/**
 * Creates: numbered list block with items
 */
export function numberedList(items: (string | TextSpan[] | Block)[]): NumberedListBlock {
  const children = items.map((item) => {
    if (typeof item === 'string') {
      return paragraph(item);
    }
    if (Array.isArray(item)) {
      return paragraph(item);
    }
    return item;
  });
  
  return createBlock('numberedList', [], {}, children);
}

/**
 * Creates: checklist item
 */
export function checkListItem(
  content: string | TextSpan[],
  checked: boolean = false
): CheckListBlock {
  const textContent = typeof content === 'string' ? plainContent(content) : content;
  return createBlock('checkList', textContent, { checked });
}

/**
 * Creates: checklist with multiple items
 */
export function checkList(
  items: { content: string | TextSpan[]; checked?: boolean }[]
): Block[] {
  return items.map((item) => checkListItem(item.content, item.checked ?? false));
}

/**
 * Creates: code block
 */
export function codeBlock(code: string, language?: string): CodeBlockBlock {
  return createBlock('codeBlock', plainContent(code), { language });
}

/**
 * Creates: blockquote
 */
export function blockquote(content: string | TextSpan[]): BlockquoteBlock {
  const textContent = typeof content === 'string' ? plainContent(content) : content;
  return createBlock('blockquote', textContent, {});
}

/**
 * Creates: horizontal divider
 */
export function divider(): DividerBlock {
  return createBlock('divider', [], {});
}

/**
 * Creates: image block
 */
export function image(
  url: string,
  alt?: string,
  options?: { title?: string; width?: number; height?: number }
): ImageBlock {
  return createBlock('image', [], {
    url,
    alt,
    title: options?.title,
    width: options?.width,
    height: options?.height,
  });
}

/**
 * Creates: callout block
 */
export function callout(
  type: CalloutType,
  content: string | TextSpan[]
): CalloutBlock {
  const textContent = typeof content === 'string' ? plainContent(content) : content;
  return createBlock('callout', textContent, { type });
}

// Convenience functions for each callout type
export const infoCallout = (content: string | TextSpan[]) => callout('info', content);
export const warningCallout = (content: string | TextSpan[]) => callout('warning', content);
export const tipCallout = (content: string | TextSpan[]) => callout('tip', content);
export const dangerCallout = (content: string | TextSpan[]) => callout('danger', content);
export const noteCallout = (content: string | TextSpan[]) => callout('note', content);

/**
 * Creates: table block
 */
export function table(
  headers: string[],
  rows: string[][],
  alignments?: ('left' | 'center' | 'right' | null)[]
): TableBlock {
  return createBlock('table', [], {
    headers,
    rows,
    alignments,
  });
}

// ============================================================================
// Block Modification Helpers
// ============================================================================

/**
 * Adds: content to an existing block
 */
export function appendContent<T extends BlockType>(
  block: Block<T>,
  ...newSpans: TextSpan[]
): Block<T> {
  return {
    ...block,
    content: [...block.content, ...newSpans],
  };
}

/**
 * Prepends: content to an existing block
 */
export function prependContent<T extends BlockType>(
  block: Block<T>,
  ...newSpans: TextSpan[]
): Block<T> {
  return {
    ...block,
    content: [...newSpans, ...block.content],
  };
}

/**
 * Replaces: the content of a block
 */
export function setContent<T extends BlockType>(
  block: Block<T>,
  content: TextSpan[]
): Block<T> {
  return {
    ...block,
    content,
  };
}

/**
 * Adds: children to a block
 */
export function addChildren<T extends BlockType>(
  block: Block<T>,
  ...newChildren: Block[]
): Block<T> {
  return {
    ...block,
    children: [...block.children, ...newChildren],
  };
}

/**
 * Updates: block properties
 */
export function updateProps<T extends BlockType>(
  block: Block<T>,
  props: Partial<Block<T>['props']>
): Block<T> {
  return {
    ...block,
    props: { ...block.props, ...props },
  };
}
