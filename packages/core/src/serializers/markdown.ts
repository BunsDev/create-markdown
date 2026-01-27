/**
 * create-markdown — Markdown Serializer
 * Convert: blocks to markdown strings
 */

import type {
    Block,
    TextSpan,
    InlineStyle,
    MarkdownSerializeOptions,
    Document,
    HeadingBlock,
    CodeBlockBlock,
    ImageBlock,
    TableBlock,
    CalloutBlock,
    CheckListBlock,
} from '../types/index';
import { spansToPlainText } from '../core/utils';

// ============================================================================
// Default Options
// ============================================================================

const DEFAULT_OPTIONS: Required<MarkdownSerializeOptions> = {
    lineEnding: '\n',
    listIndent: 2,
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletChar: '-',
    emphasisChar: '*',
};

// ============================================================================
// Main Serializer
// ============================================================================

/**
 * Converts: array of blocks to a markdown string
 */
export function blocksToMarkdown(
    blocks: Block[],
    options: MarkdownSerializeOptions = {}
): string {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    const serializedBlocks = blocks.map((block, index) =>
        serializeBlock(block, 0, opts, index, blocks)
    );

    return serializedBlocks
        .filter((s) => s !== null)
        .join(opts.lineEnding + opts.lineEnding);
}

/**
 * Converts: document to a markdown string
 */
export function documentToMarkdown(
    doc: Document,
    options: MarkdownSerializeOptions = {}
): string {
    return blocksToMarkdown(doc.blocks, options);
}

// ============================================================================
// Block Serialization
// ============================================================================

/**
 * Serializes: single block to markdown
 */
export function serializeBlock(
    block: Block,
    depth: number,
    options: Required<MarkdownSerializeOptions>,
    index: number = 0,
    siblings: Block[] = []
): string {
    switch (block.type) {
        case 'paragraph':
            return serializeParagraph(block, options);

        case 'heading':
            return serializeHeading(block as HeadingBlock, options);

        case 'bulletList':
            return serializeBulletList(block, depth, options);

        case 'numberedList':
            return serializeNumberedList(block, depth, options, index, siblings);

        case 'checkList':
            return serializeCheckList(block as CheckListBlock, depth, options);

        case 'codeBlock':
            return serializeCodeBlock(block as CodeBlockBlock, options);

        case 'blockquote':
            return serializeBlockquote(block, options);

        case 'table':
            return serializeTable(block as TableBlock, options);

        case 'image':
            return serializeImage(block as ImageBlock);

        case 'divider':
            return '---';

        case 'callout':
            return serializeCallout(block as CalloutBlock, options);

        default:
            // Unknown block type - serialize as paragraph
            return serializeInlineContent(block.content, options);
    }
}

/**
 * Serializes: paragraph block
 */
function serializeParagraph(
    block: Block,
    options: Required<MarkdownSerializeOptions>
): string {
    return serializeInlineContent(block.content, options);
}

/**
 * Serializes: heading block
 */
function serializeHeading(
    block: HeadingBlock,
    options: Required<MarkdownSerializeOptions>
): string {
    const level = block.props.level;
    const content = serializeInlineContent(block.content, options);

    if (options.headingStyle === 'setext' && (level === 1 || level === 2)) {
        const underline = level === 1 ? '=' : '-';
        return `${content}${options.lineEnding}${underline.repeat(content.length)}`;
    }

    return `${'#'.repeat(level)} ${content}`;
}

/**
 * Serializes: bullet list block
 */
function serializeBulletList(
    block: Block,
    depth: number,
    options: Required<MarkdownSerializeOptions>
): string {
    const indent = ' '.repeat(depth * options.listIndent);
    const bullet = options.bulletChar;

    return block.children
        .map((child) => {
            const content = serializeListItemContent(child, depth, options);
            return `${indent}${bullet} ${content}`;
        })
        .join(options.lineEnding);
}

/**
 * Serializes: numbered list block
 */
function serializeNumberedList(
    block: Block,
    depth: number,
    options: Required<MarkdownSerializeOptions>,
    _blockIndex: number = 0,
    _siblings: Block[] = []
): string {
    const indent = ' '.repeat(depth * options.listIndent);

    return block.children
        .map((child, index) => {
            const content = serializeListItemContent(child, depth, options);
            return `${indent}${index + 1}. ${content}`;
        })
        .join(options.lineEnding);
}

/**
 * Serializes: checklist item
 */
function serializeCheckList(
    block: CheckListBlock,
    depth: number,
    options: Required<MarkdownSerializeOptions>
): string {
    const indent = ' '.repeat(depth * options.listIndent);
    const checked = block.props.checked ? 'x' : ' ';
    const content = serializeInlineContent(block.content, options);

    return `${indent}- [${checked}] ${content}`;
}

/**
 * Serializes: list item content (handles nested lists)
 */
function serializeListItemContent(
    item: Block,
    depth: number,
    options: Required<MarkdownSerializeOptions>
): string {
    // If the item has children (nested list), serialize them too
    if (item.children.length > 0) {
        const content = serializeInlineContent(item.content, options);
        const nestedContent = item.children
            .map((child, index) =>
                serializeBlock(child, depth + 1, options, index, item.children)
            )
            .join(options.lineEnding);

        return `${content}${options.lineEnding}${nestedContent}`;
    }

    return serializeInlineContent(item.content, options);
}

/**
 * Serializes: code block
 */
function serializeCodeBlock(
    block: CodeBlockBlock,
    options: Required<MarkdownSerializeOptions>
): string {
    const code = spansToPlainText(block.content);
    const language = block.props.language ?? '';

    if (options.codeBlockStyle === 'indented') {
        return code
            .split('\n')
            .map((line) => `    ${line}`)
            .join(options.lineEnding);
    }

    return `\`\`\`${language}${options.lineEnding}${code}${options.lineEnding}\`\`\``;
}

/**
 * Serializes: blockquote
 */
function serializeBlockquote(
    block: Block,
    options: Required<MarkdownSerializeOptions>
): string {
    const content = serializeInlineContent(block.content, options);

    return content
        .split('\n')
        .map((line) => `> ${line}`)
        .join(options.lineEnding);
}

/**
 * Serializes: image block
 */
function serializeImage(block: ImageBlock): string {
    const alt = block.props.alt ?? '';
    const url = block.props.url ?? '';
    const title = block.props.title;

    if (title) {
        return `![${alt}](${url} "${title}")`;
    }

    return `![${alt}](${url})`;
}

/**
 * Serializes: table block
 */
function serializeTable(
    block: TableBlock,
    options: Required<MarkdownSerializeOptions>
): string {
    const { headers, rows, alignments } = block.props;
    const lineEnding = options.lineEnding;

    // Calculate column widths
    const columnWidths = headers.map((header, i) => {
        const rowWidths = rows.map((row) => (row[i] ?? '').length);
        return Math.max(header.length, ...rowWidths, 3);
    });

    // Serialize header row
    const headerRow = headers
        .map((header, i) => header.padEnd(columnWidths[i]))
        .join(' | ');

    // Create separator row with alignment
    const separatorRow = headers
        .map((_, i) => {
            const width = columnWidths[i];
            const alignment = alignments?.[i] ?? null;

            if (alignment === 'left') return `:${'-'.repeat(width - 1)}`;
            if (alignment === 'right') return `${'-'.repeat(width - 1)}:`;
            if (alignment === 'center') return `:${'-'.repeat(width - 2)}:`;
            return '-'.repeat(width);
        })
        .join(' | ');

    // Serialize data rows
    const dataRows = rows.map((row) =>
        row
            .map((cell, i) => (cell ?? '').padEnd(columnWidths[i]))
            .join(' | ')
    );

    return [
        `| ${headerRow} |`,
        `| ${separatorRow} |`,
        ...dataRows.map((row) => `| ${row} |`),
    ].join(lineEnding);
}

/**
 * Serializes: callout block
 */
function serializeCallout(
    block: CalloutBlock,
    options: Required<MarkdownSerializeOptions>
): string {
    const type = block.props.type.toUpperCase();
    const content = serializeInlineContent(block.content, options);
    const lineEnding = options.lineEnding;

    // Use GitHub-style callout syntax
    return `> [!${type}]${lineEnding}> ${content.split('\n').join(`${lineEnding}> `)}`;
}

// ============================================================================
// Inline Content Serialization
// ============================================================================

/**
 * Serializes: array of text spans to markdown
 */
export function serializeInlineContent(
    spans: TextSpan[],
    options: Required<MarkdownSerializeOptions>
): string {
    return spans.map((span) => serializeSpan(span, options)).join('');
}

/**
 * Serializes: single text span with its styles
 */
export function serializeSpan(
    span: TextSpan,
    options: Required<MarkdownSerializeOptions>
): string {
    let text = span.text;
    const styles = span.styles;

    // If no styles, return plain text
    if (!hasStyles(styles)) {
        return text;
    }

    // Apply styles in a specific order (inside-out)
    // Code first (innermost), then other styles
    if (styles.code) {
        text = `\`${text}\``;
    }

    if (styles.highlight) {
        text = `==${text}==`;
    }

    if (styles.strikethrough) {
        text = `~~${text}~~`;
    }

    if (styles.bold && styles.italic) {
        // Combined bold and italic
        const char = options.emphasisChar;
        text = `${char}${char}${char}${text}${char}${char}${char}`;
    } else {
        if (styles.italic) {
            const char = options.emphasisChar;
            text = `${char}${text}${char}`;
        }

        if (styles.bold) {
            const char = options.emphasisChar;
            text = `${char}${char}${text}${char}${char}`;
        }
    }

    // Underline (not standard markdown, using HTML)
    if (styles.underline) {
        text = `<u>${text}</u>`;
    }

    // Link (outermost)
    if (styles.link) {
        const { url, title } = styles.link;
        if (title) {
            text = `[${text}](${url} "${title}")`;
        } else {
            text = `[${text}](${url})`;
        }
    }

    return text;
}

/**
 * Checks: [if] style object has any active styles
 */
function hasStyles(styles: InlineStyle): boolean {
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

// ============================================================================
// Convenience Exports
// ============================================================================

/**
 * Quick stringify function - converts: blocks to markdown
 */
export function stringify(
    blocks: Block[],
    options?: MarkdownSerializeOptions
): string {
    return blocksToMarkdown(blocks, options);
}
