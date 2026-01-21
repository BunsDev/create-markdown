/**
 * create-markdown/react
 * React components and hooks for create-markdown
 */

// Components
export {
  BlockRenderer,
  BlockElement,
  InlineContent,
} from './block-renderer';

export type {
  BlockRendererProps,
  BlockRenderers,
  SingleBlockProps,
} from './block-renderer';

// Hooks
export {
  useDocument,
  useMarkdown,
  useBlockEditor,
} from './hooks';

export type {
  UseDocumentReturn,
  UseMarkdownReturn,
  UseBlockEditorReturn,
} from './hooks';

// Re-export types that are commonly needed with React components
export type {
  Block,
  BlockType,
  Document,
  TextSpan,
  InlineStyle,
} from '../types';

// Re-export block factories for convenience
export {
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
  text,
  bold,
  italic,
  code,
  link,
} from '../core/blocks';
