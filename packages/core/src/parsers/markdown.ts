/**
 * create-markdown - Markdown Parser
 * Convert markdown strings to block structures
 */

import type {
  Block,
  Document,
  MarkdownParseOptions,
  CalloutType,
} from '../types/index';
import { generateId, plainContent } from '../core/utils';
import { createDocument } from '../core/document';
import { tokenize, type Token } from '../parsers/tokenizer';
import { parseInlineContent } from '../parsers/inline';

// ============================================================================
// Default Options
// ============================================================================

const DEFAULT_OPTIONS: Required<MarkdownParseOptions> = {
    generateId,
    strict: false,
};

// ============================================================================
// Main Parser
// ============================================================================

/**
 * Parses: markdown string into an array of blocks
 */
export function markdownToBlocks(
    markdown: string,
    options: MarkdownParseOptions = {}
): Block[] {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const tokens = tokenize(markdown);

    return parseTokens(tokens, opts);
}

/**
 * Parses: markdown string into a Document
 */
export function markdownToDocument(
    markdown: string,
    options: MarkdownParseOptions = {}
): Document {
    const blocks = markdownToBlocks(markdown, options);
    return createDocument(blocks);
}

/**
 * Quick parse: function - converts markdown to blocks
 */
export function parse(
    markdown: string,
    options?: MarkdownParseOptions
): Block[] {
    return markdownToBlocks(markdown, options);
}

// ============================================================================
// Token Processing
// ============================================================================

interface ParserState {
    options: Required<MarkdownParseOptions>;
    tokens: Token[];
    index: number;
}

/**
 * Parses: array of tokens into blocks
 */
function parseTokens(
    tokens: Token[],
    options: Required<MarkdownParseOptions>
): Block[] {
    const blocks: Block[] = [];
    const state: ParserState = {
        options,
        tokens,
        index: 0,
    };

    while (state.index < tokens.length) {
        const token = tokens[state.index];

        // Skip blank lines at the top level
        if (token.type === 'blank') {
            state.index++;
            continue;
        }

        const block = parseBlock(state);
        if (block) {
            blocks.push(block);
        }
    }

    return blocks;
}

/**
 * Parses: single block from the current position
 */
function parseBlock(state: ParserState): Block | null {
    const token = state.tokens[state.index];

    switch (token.type) {
        case 'heading':
            return parseHeading(state);

        case 'paragraph':
            return parseParagraph(state);

        case 'bullet_list_item':
            return parseBulletList(state);

        case 'numbered_list_item':
            return parseNumberedList(state);

        case 'check_list_item':
            return parseCheckListItem(state);

        case 'code_fence_start':
            return parseCodeBlock(state);

        case 'blockquote':
            return parseBlockquote(state);

        case 'callout':
            return parseCallout(state);

        case 'divider':
            return parseDivider(state);

        case 'table_row':
            return parseTable(state);

        case 'image':
            return parseImage(state);

        default:
            // Skip unknown tokens
            state.index++;
            return null;
    }
}

// ============================================================================
// Block Parsers
// ============================================================================

/**
 * Parses: heading block
 */
function parseHeading(state: ParserState): Block {
    const token = state.tokens[state.index];
    const level = (token.meta?.level ?? 1) as 1 | 2 | 3 | 4 | 5 | 6;
    const content = parseInlineContent(token.content);

    state.index++;

    return {
        id: state.options.generateId(),
        type: 'heading',
        content,
        children: [],
        props: { level },
    };
}

/**
 * Parses: paragraph block (handles multi-line paragraphs)
 */
function parseParagraph(state: ParserState): Block {
    const lines: string[] = [];

    // Collect consecutive paragraph lines
    while (
        state.index < state.tokens.length &&
        state.tokens[state.index].type === 'paragraph'
    ) {
        lines.push(state.tokens[state.index].content);
        state.index++;
    }

    const content = parseInlineContent(lines.join(' '));

    return {
        id: state.options.generateId(),
        type: 'paragraph',
        content,
        children: [],
        props: {},
    };
}

/**
 * Parses: bullet list
 */
function parseBulletList(state: ParserState): Block {
    const children: Block[] = [];
    const baseIndent = state.tokens[state.index].indent;

    while (
        state.index < state.tokens.length &&
        state.tokens[state.index].type === 'bullet_list_item' &&
        state.tokens[state.index].indent >= baseIndent
    ) {
        const token = state.tokens[state.index];

        if (token.indent > baseIndent) {
            // This is a nested list item - should be added to the last child
            // For simplicity, we'll handle flat lists for now
            state.index++;
            continue;
        }

        const content = parseInlineContent(token.content);

        children.push({
            id: state.options.generateId(),
            type: 'paragraph',
            content,
            children: [],
            props: {},
        });

        state.index++;
    }

    return {
        id: state.options.generateId(),
        type: 'bulletList',
        content: [],
        children,
        props: {},
    };
}

/**
 * Parses: numbered list
 */
function parseNumberedList(state: ParserState): Block {
    const children: Block[] = [];
    const baseIndent = state.tokens[state.index].indent;

    while (
        state.index < state.tokens.length &&
        state.tokens[state.index].type === 'numbered_list_item' &&
        state.tokens[state.index].indent >= baseIndent
    ) {
        const token = state.tokens[state.index];

        if (token.indent > baseIndent) {
            state.index++;
            continue;
        }

        const content = parseInlineContent(token.content);

        children.push({
            id: state.options.generateId(),
            type: 'paragraph',
            content,
            children: [],
            props: {},
        });

        state.index++;
    }

    return {
        id: state.options.generateId(),
        type: 'numberedList',
        content: [],
        children,
        props: {},
    };
}

/**
 * Parses: checklist item
 */
function parseCheckListItem(state: ParserState): Block {
    const token = state.tokens[state.index];
    const checked = token.meta?.checked ?? false;
    const content = parseInlineContent(token.content);

    state.index++;

    return {
        id: state.options.generateId(),
        type: 'checkList',
        content,
        children: [],
        props: { checked },
    };
}

/**
 * Parses: code block
 */
function parseCodeBlock(state: ParserState): Block {
    const startToken = state.tokens[state.index];
    const language = startToken.meta?.language ?? '';
    const codeLines: string[] = [];

    state.index++; // Skip code_fence_start

    // Collect code content
    while (
        state.index < state.tokens.length &&
        state.tokens[state.index].type === 'code_content'
    ) {
        codeLines.push(state.tokens[state.index].content);
        state.index++;
    }

    // Skip code_fence_end if present
    if (
        state.index < state.tokens.length &&
        state.tokens[state.index].type === 'code_fence_end'
    ) {
        state.index++;
    }

    return {
        id: state.options.generateId(),
        type: 'codeBlock',
        content: plainContent(codeLines.join('\n')),
        children: [],
        props: { language: language || undefined },
    };
}

/**
 * Parses: blockquote
 */
function parseBlockquote(state: ParserState): Block {
    const lines: string[] = [];

    // Collect consecutive blockquote lines
    while (
        state.index < state.tokens.length &&
        state.tokens[state.index].type === 'blockquote'
    ) {
        lines.push(state.tokens[state.index].content);
        state.index++;
    }

    const content = parseInlineContent(lines.join('\n'));

    return {
        id: state.options.generateId(),
        type: 'blockquote',
        content,
        children: [],
        props: {},
    };
}

/**
 * Parses: callout block (GitHub-style)
 */
function parseCallout(state: ParserState): Block {
    const calloutToken = state.tokens[state.index];
    const calloutType = (calloutToken.meta?.calloutType ?? 'note') as CalloutType;

    state.index++;

    // Collect the content (subsequent blockquote lines)
    const lines: string[] = [];

    while (
        state.index < state.tokens.length &&
        state.tokens[state.index].type === 'blockquote'
    ) {
        lines.push(state.tokens[state.index].content);
        state.index++;
    }

    const content = parseInlineContent(lines.join('\n'));

    return {
        id: state.options.generateId(),
        type: 'callout',
        content,
        children: [],
        props: { type: calloutType },
    };
}

/**
 * Parses: horizontal divider
 */
function parseDivider(state: ParserState): Block {
    state.index++;

    return {
        id: state.options.generateId(),
        type: 'divider',
        content: [],
        children: [],
        props: {},
    };
}

/**
 * Parses: table
 */
function parseTable(state: ParserState): Block {
    const rows: string[][] = [];
    let headers: string[] = [];
    let alignments: ('left' | 'center' | 'right' | null)[] = [];
    let isFirstRow = true;
    let hasSeparator = false;

    while (
        state.index < state.tokens.length &&
        (state.tokens[state.index].type === 'table_row' ||
            state.tokens[state.index].type === 'table_separator')
    ) {
        const token = state.tokens[state.index];

        if (token.type === 'table_separator') {
            // Parse alignments from separator
            alignments = parseTableAlignments(token.content);
            hasSeparator = true;
            state.index++;
            continue;
        }

        // Parse cells
        const cells = token.content
            .split('|')
            .map((cell) => cell.trim())
            .filter((cell) => cell !== '');

        if (isFirstRow && !hasSeparator) {
            // This might be the header row
            headers = cells;
            isFirstRow = false;
        } else if (hasSeparator) {
            rows.push(cells);
        }

        state.index++;
    }

    // If we didn't find a separator, treat first row as data
    if (!hasSeparator && headers.length > 0) {
        rows.unshift(headers);
        headers = [];
    }

    return {
        id: state.options.generateId(),
        type: 'table',
        content: [],
        children: [],
        props: {
            headers,
            rows,
            alignments: alignments.length > 0 ? alignments : undefined,
        },
    };
}

/**
 * Parses: table column alignments from separator row
 */
function parseTableAlignments(
    separator: string
): ('left' | 'center' | 'right' | null)[] {
    return separator
        .split('|')
        .map((cell) => cell.trim())
        .filter((cell) => cell !== '')
        .map((cell) => {
            const leftColon = cell.startsWith(':');
            const rightColon = cell.endsWith(':');

            if (leftColon && rightColon) return 'center';
            if (leftColon) return 'left';
            if (rightColon) return 'right';
            return null;
        });
}

/**
 * Parses: image block
 */
function parseImage(state: ParserState): Block {
    const token = state.tokens[state.index];
    const url = token.content;
    const alt = token.meta?.language ?? ''; // We stored alt in language field

    state.index++;

    return {
        id: state.options.generateId(),
        type: 'image',
        content: [],
        children: [],
        props: {
            url,
            alt: alt || undefined,
        },
    };
}

// ============================================================================
// Convenience Exports
// ============================================================================

export { parseInlineContent } from '../parsers/inline';
