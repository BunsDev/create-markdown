/**
 * create-markdown
 * A minimal markdown package for creating and manipulating markdown content
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Options for markdown creation
 */
export interface MarkdownOptions {
  /** Enable strict parsing mode */
  strict?: boolean;
  /** Custom line ending (default: '\n') */
  lineEnding?: string;
}

/**
 * Represents a markdown document
 */
export interface MarkdownDocument {
  /** Raw markdown content */
  content: string;
  /** Document metadata */
  meta?: Record<string, unknown>;
}

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Creates a new markdown document
 * @param content - Initial markdown content
 * @param options - Configuration options
 * @returns A new MarkdownDocument instance
 */
export function createMarkdown(
  content: string = '',
  options: MarkdownOptions = {}
): MarkdownDocument {
  const { lineEnding = '\n' } = options;
  
  return {
    content: content.replace(/\r\n|\r/g, lineEnding),
    meta: {},
  };
}

/**
 * Package version
 */
export const VERSION = '0.1.1';

// ============================================================================
// Default Export
// ============================================================================

export default createMarkdown;
