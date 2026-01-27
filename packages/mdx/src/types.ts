/**
 * @create-markdown/mdx - Type Definitions
 * Options and component mappings for MDX serialization
 */

/**
 * Component name mappings for MDX output
 * Allows customizing which React components are used for each block type
 */
export interface ComponentMappings {
  /** Component for code blocks (e.g., 'CodeBlock', 'Shiki') */
  codeBlock?: string;
  /** Component for callouts/alerts (e.g., 'Callout', 'Alert') */
  callout?: string;
  /** Component for tables (e.g., 'Table', 'DataTable') */
  table?: string;
  /** Component for images (e.g., 'Image' for Next.js) */
  image?: string;
  /** Component for headings with anchor links (e.g., 'Heading') */
  heading?: string;
  /** Component for links (e.g., 'Link' for Next.js) */
  link?: string;
  /** Component for blockquotes (e.g., 'Blockquote') */
  blockquote?: string;
}

/**
 * Frontmatter metadata for MDX files
 */
export interface MDXFrontmatter {
  /** Page title */
  title?: string;
  /** Page description for SEO */
  description?: string;
  /** Author name */
  author?: string;
  /** Publication date */
  date?: string;
  /** Custom metadata fields */
  [key: string]: unknown;
}

/**
 * Options for MDX serialization
 */
export interface MDXSerializeOptions {
  /** Custom component mappings for block types */
  components?: ComponentMappings;
  /** Whether to use JSX syntax for certain elements */
  useJSX?: boolean;
  /** Import statements to prepend to the MDX file */
  imports?: string[];
  /** Frontmatter metadata to include */
  frontmatter?: MDXFrontmatter;
  /** Whether to extract title from first H1 heading */
  extractTitle?: boolean;
  /** Line ending character */
  lineEnding?: '\n' | '\r\n';
}

/**
 * Resolved options with defaults applied
 */
export interface ResolvedMDXOptions {
  components: ComponentMappings;
  useJSX: boolean;
  imports: string[];
  frontmatter: MDXFrontmatter;
  extractTitle: boolean;
  lineEnding: '\n' | '\r\n';
}

/**
 * Result of MDX conversion with extracted metadata
 */
export interface MDXConversionResult {
  /** The converted MDX string */
  content: string;
  /** Extracted title from first H1 (if extractTitle is true) */
  title?: string;
  /** All headings found in the document (for TOC generation) */
  headings: Array<{
    level: number;
    text: string;
    id: string;
  }>;
}

/**
 * Options for batch file conversion
 */
export interface ConvertOptions extends MDXSerializeOptions {
  /** Whether to overwrite existing files */
  overwrite?: boolean;
  /** File extension for output files */
  extension?: '.mdx' | '.md';
}
