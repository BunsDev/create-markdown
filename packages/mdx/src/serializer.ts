/**
 * @create-markdown/mdx - MDX Serializer
 * Convert blocks to MDX with component support
 */

import type {
  Block,
  TextSpan,
  HeadingBlock,
  CodeBlockBlock,
  CalloutBlock,
  TableBlock,
  ImageBlock,
  CheckListBlock,
} from '@create-markdown/core';

import type {
  MDXSerializeOptions,
  ResolvedMDXOptions,
  MDXConversionResult,
  MDXFrontmatter,
} from './types';

// ============================================================================
// Default Options
// ============================================================================

const DEFAULT_OPTIONS: ResolvedMDXOptions = {
  components: {},
  useJSX: true,
  imports: [],
  frontmatter: {},
  extractTitle: true,
  lineEnding: '\n',
};

/**
 * Resolves options with defaults
 */
function resolveOptions(options?: MDXSerializeOptions): ResolvedMDXOptions {
  return {
    ...DEFAULT_OPTIONS,
    ...options,
    components: { ...DEFAULT_OPTIONS.components, ...options?.components },
    frontmatter: { ...DEFAULT_OPTIONS.frontmatter, ...options?.frontmatter },
    imports: options?.imports ?? DEFAULT_OPTIONS.imports,
  };
}

// ============================================================================
// Main Serializer
// ============================================================================

/**
 * Converts blocks to MDX string
 */
export function blocksToMDX(
  blocks: Block[],
  options?: MDXSerializeOptions
): string {
  const result = blocksToMDXWithMeta(blocks, options);
  return result.content;
}

/**
 * Converts blocks to MDX string with extracted metadata
 */
export function blocksToMDXWithMeta(
  blocks: Block[],
  options?: MDXSerializeOptions
): MDXConversionResult {
  const opts = resolveOptions(options);
  const parts: string[] = [];
  const headings: MDXConversionResult['headings'] = [];
  let extractedTitle: string | undefined;

  // Extract title from first H1 if enabled
  if (opts.extractTitle && blocks.length > 0) {
    const firstBlock = blocks[0];
    if (firstBlock.type === 'heading' && (firstBlock as HeadingBlock).props.level === 1) {
      extractedTitle = spansToPlainText(firstBlock.content);
    }
  }

  // Build frontmatter
  const frontmatter: MDXFrontmatter = {
    ...opts.frontmatter,
  };
  if (extractedTitle && !frontmatter.title) {
    frontmatter.title = extractedTitle;
  }

  // Add frontmatter if present
  if (Object.keys(frontmatter).length > 0) {
    parts.push(serializeFrontmatter(frontmatter, opts.lineEnding));
  }

  // Add imports
  if (opts.imports.length > 0) {
    parts.push(opts.imports.join(opts.lineEnding));
    parts.push('');
  }

  // Serialize blocks
  for (const block of blocks) {
    const serialized = serializeBlock(block, opts, headings);
    if (serialized) {
      parts.push(serialized);
    }
  }

  return {
    content: parts.join(opts.lineEnding + opts.lineEnding),
    title: extractedTitle,
    headings,
  };
}

// ============================================================================
// Frontmatter Serialization
// ============================================================================

/**
 * Serializes frontmatter to YAML format
 */
function serializeFrontmatter(
  meta: MDXFrontmatter,
  lineEnding: string
): string {
  const lines = ['---'];

  for (const [key, value] of Object.entries(meta)) {
    if (value === undefined || value === null) continue;

    if (typeof value === 'string') {
      // Escape quotes in strings
      const escaped = value.replace(/"/g, '\\"');
      lines.push(`${key}: "${escaped}"`);
    } else if (typeof value === 'boolean' || typeof value === 'number') {
      lines.push(`${key}: ${value}`);
    } else if (Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const item of value) {
        lines.push(`  - "${item}"`);
      }
    } else {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    }
  }

  lines.push('---');
  return lines.join(lineEnding);
}

// ============================================================================
// Block Serialization
// ============================================================================

/**
 * Serializes a single block to MDX
 */
function serializeBlock(
  block: Block,
  opts: ResolvedMDXOptions,
  headings: MDXConversionResult['headings']
): string {
  switch (block.type) {
    case 'heading':
      return serializeHeading(block as HeadingBlock, opts, headings);

    case 'paragraph':
      return serializeInlineContent(block.content, opts);

    case 'codeBlock':
      return serializeCodeBlock(block as CodeBlockBlock, opts);

    case 'callout':
      return serializeCallout(block as CalloutBlock, opts);

    case 'table':
      return serializeTable(block as TableBlock, opts);

    case 'image':
      return serializeImage(block as ImageBlock, opts);

    case 'bulletList':
      return serializeBulletList(block, opts);

    case 'numberedList':
      return serializeNumberedList(block, opts);

    case 'checkList':
      return serializeCheckList(block as CheckListBlock, opts);

    case 'blockquote':
      return serializeBlockquote(block, opts);

    case 'divider':
      return '---';

    default:
      return serializeInlineContent(block.content, opts);
  }
}

/**
 * Serializes heading block
 */
function serializeHeading(
  block: HeadingBlock,
  opts: ResolvedMDXOptions,
  headings: MDXConversionResult['headings']
): string {
  const content = serializeInlineContent(block.content, opts);
  const level = block.props.level;
  const id = slugify(spansToPlainText(block.content));

  // Track heading for TOC
  headings.push({
    level,
    text: spansToPlainText(block.content),
    id,
  });

  // If custom Heading component, use JSX
  if (opts.components.heading && opts.useJSX) {
    return `<${opts.components.heading} level={${level}} id="${id}">${content}</${opts.components.heading}>`;
  }

  return `${'#'.repeat(level)} ${content}`;
}

/**
 * Serializes code block
 */
function serializeCodeBlock(
  block: CodeBlockBlock,
  opts: ResolvedMDXOptions
): string {
  const code = spansToPlainText(block.content);
  const lang = block.props.language || '';

  // If custom CodeBlock component, use JSX
  if (opts.components.codeBlock && opts.useJSX) {
    // Escape backticks and dollar signs for template literal
    const escapedCode = code
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$/g, '\\$');
    return `<${opts.components.codeBlock} language="${lang}">{\`${escapedCode}\`}</${opts.components.codeBlock}>`;
  }

  // Standard fenced code block (works in MDX)
  return `\`\`\`${lang}\n${code}\n\`\`\``;
}

/**
 * Serializes callout block
 */
function serializeCallout(
  block: CalloutBlock,
  opts: ResolvedMDXOptions
): string {
  const content = serializeInlineContent(block.content, opts);
  const type = block.props.type;

  // Use JSX component for callouts
  if (opts.components.callout && opts.useJSX) {
    return `<${opts.components.callout} type="${type}">\n${content}\n</${opts.components.callout}>`;
  }

  // GitHub-style callout syntax
  return `> [!${type.toUpperCase()}]\n> ${content}`;
}

/**
 * Serializes table block
 */
function serializeTable(
  block: TableBlock,
  opts: ResolvedMDXOptions
): string {
  const { headers, rows, alignments } = block.props;

  // Use JSX component for tables
  if (opts.components.table && opts.useJSX) {
    return `<${opts.components.table}
  headers={${JSON.stringify(headers)}}
  rows={${JSON.stringify(rows)}}${alignments ? `\n  alignments={${JSON.stringify(alignments)}}` : ''}
/>`;
  }

  // Standard markdown table
  const headerRow = `| ${headers.join(' | ')} |`;
  const separator = `| ${headers.map((_, i) => {
    const align = alignments?.[i];
    if (align === 'left') return ':---';
    if (align === 'right') return '---:';
    if (align === 'center') return ':---:';
    return '---';
  }).join(' | ')} |`;
  const dataRows = rows.map(row => `| ${row.join(' | ')} |`).join('\n');

  return `${headerRow}\n${separator}\n${dataRows}`;
}

/**
 * Serializes image block
 */
function serializeImage(
  block: ImageBlock,
  opts: ResolvedMDXOptions
): string {
  const { url, alt, title, width, height } = block.props;

  // Use JSX component for images (e.g., Next.js Image)
  if (opts.components.image && opts.useJSX) {
    const props = [
      `src="${url}"`,
      `alt="${alt || ''}"`,
    ];
    if (title) props.push(`title="${title}"`);
    if (width) props.push(`width={${width}}`);
    if (height) props.push(`height={${height}}`);
    
    return `<${opts.components.image} ${props.join(' ')} />`;
  }

  // Standard markdown image
  if (title) {
    return `![${alt || ''}](${url} "${title}")`;
  }
  return `![${alt || ''}](${url})`;
}

/**
 * Serializes bullet list
 */
function serializeBulletList(
  block: Block,
  opts: ResolvedMDXOptions
): string {
  return block.children
    .map(child => `- ${serializeInlineContent(child.content, opts)}`)
    .join('\n');
}

/**
 * Serializes numbered list
 */
function serializeNumberedList(
  block: Block,
  opts: ResolvedMDXOptions
): string {
  return block.children
    .map((child, i) => `${i + 1}. ${serializeInlineContent(child.content, opts)}`)
    .join('\n');
}

/**
 * Serializes checklist
 */
function serializeCheckList(
  block: CheckListBlock,
  opts: ResolvedMDXOptions
): string {
  const checked = block.props.checked ? 'x' : ' ';
  return `- [${checked}] ${serializeInlineContent(block.content, opts)}`;
}

/**
 * Serializes blockquote
 */
function serializeBlockquote(
  block: Block,
  opts: ResolvedMDXOptions
): string {
  const content = serializeInlineContent(block.content, opts);

  if (opts.components.blockquote && opts.useJSX) {
    return `<${opts.components.blockquote}>${content}</${opts.components.blockquote}>`;
  }

  return content
    .split('\n')
    .map(line => `> ${line}`)
    .join('\n');
}

// ============================================================================
// Inline Content Serialization
// ============================================================================

/**
 * Serializes inline content (text spans with styles)
 */
function serializeInlineContent(
  spans: TextSpan[],
  opts: ResolvedMDXOptions
): string {
  return spans.map(span => serializeSpan(span, opts)).join('');
}

/**
 * Serializes a single text span with styles
 */
function serializeSpan(
  span: TextSpan,
  opts: ResolvedMDXOptions
): string {
  let text = span.text;
  const styles = span.styles;

  // If no styles, return plain text
  if (!hasStyles(styles)) {
    return text;
  }

  // Apply styles from innermost to outermost
  if (styles.code) {
    text = `\`${text}\``;
  }

  if (styles.highlight) {
    // MDX supports JSX, so use <mark>
    text = `<mark>${text}</mark>`;
  }

  if (styles.strikethrough) {
    text = `~~${text}~~`;
  }

  if (styles.underline) {
    text = `<u>${text}</u>`;
  }

  if (styles.bold && styles.italic) {
    text = `***${text}***`;
  } else {
    if (styles.italic) {
      text = `*${text}*`;
    }
    if (styles.bold) {
      text = `**${text}**`;
    }
  }

  // Link (outermost)
  if (styles.link) {
    const { url, title } = styles.link;
    
    if (opts.components.link && opts.useJSX) {
      const titleAttr = title ? ` title="${title}"` : '';
      text = `<${opts.components.link} href="${url}"${titleAttr}>${text}</${opts.components.link}>`;
    } else if (title) {
      text = `[${text}](${url} "${title}")`;
    } else {
      text = `[${text}](${url})`;
    }
  }

  return text;
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * Checks if style object has any active styles
 */
function hasStyles(styles: TextSpan['styles']): boolean {
  return !!(
    styles.bold ||
    styles.italic ||
    styles.underline ||
    styles.strikethrough ||
    styles.code ||
    styles.highlight ||
    styles.link
  );
}

/**
 * Extracts plain text from spans
 */
function spansToPlainText(spans: TextSpan[]): string {
  return spans.map(span => span.text).join('');
}

/**
 * Converts text to URL-friendly slug
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
