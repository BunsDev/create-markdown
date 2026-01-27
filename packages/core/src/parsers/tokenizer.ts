/**
 * create-markdown - Markdown Tokenizer
 * Line-by-line tokenization of markdown content
 */

// ============================================================================
// Token Types
// ============================================================================

export type TokenType =
    | 'heading'
    | 'paragraph'
    | 'bullet_list_item'
    | 'numbered_list_item'
    | 'check_list_item'
    | 'code_fence_start'
    | 'code_fence_end'
    | 'code_content'
    | 'blockquote'
    | 'divider'
    | 'table_row'
    | 'table_separator'
    | 'image'
    | 'callout'
    | 'blank';

export interface Token {
    type: TokenType;
    raw: string;
    content: string;
    indent: number;
    line: number;
    meta?: TokenMeta;
}

export interface TokenMeta {
    // Heading
    level?: number;
    // List items
    listMarker?: string;
    listIndex?: number;
    checked?: boolean;
    // Code fence
    language?: string;
    // Callout
    calloutType?: string;
}

// ============================================================================
// Tokenizer State
// ============================================================================

interface TokenizerState {
    inCodeBlock: boolean;
    codeBlockFence: string;
    lineNumber: number;
}

// ============================================================================
// Pattern Matchers
// ============================================================================

const PATTERNS = {
    // Headings (ATX style)
    heading: /^(#{1,6})\s+(.*)$/,

    // Setext headings
    setextH1: /^=+\s*$/,
    setextH2: /^-+\s*$/,

    // Lists
    bulletList: /^(\s*)([-*+])\s+(.*)$/,
    numberedList: /^(\s*)(\d+)\.\s+(.*)$/,
    checkList: /^(\s*)[-*+]\s+\[([ xX])\]\s+(.*)$/,

    // Code blocks
    codeFence: /^(\s*)(`{3,}|~{3,})(\w*)?\s*$/,

    // Blockquote
    blockquote: /^>\s?(.*)$/,

    // Callout (GitHub style)
    callout: /^>\s*\[!(\w+)\]\s*$/,

    // Dividers
    divider: /^(\s*)(-{3,}|\*{3,}|_{3,})\s*$/,

    // Tables
    tableRow: /^\|(.+)\|$/,
    tableSeparator: /^\|[\s\-:|]+\|$/,

    // Images (standalone)
    image: /^!\[([^\]]*)\]\(([^)]+)\)$/,

    // Blank line
    blank: /^\s*$/,
};

// ============================================================================
// Tokenizer
// ============================================================================

/**
 * Tokenizes: markdown string into an array of tokens
 */
export function tokenize(markdown: string): Token[] {
    const lines = markdown.split(/\r?\n/);
    const tokens: Token[] = [];
    const state: TokenizerState = {
        inCodeBlock: false,
        codeBlockFence: '',
        lineNumber: 0,
    };

    for (let i = 0; i < lines.length; i++) {
        state.lineNumber = i + 1;
        const line = lines[i];
        const token = tokenizeLine(line, state, lines, i);

        if (token) {
            tokens.push(token);
        }
    }

    return tokens;
}

/**
 * Tokenizes: single line
 */
function tokenizeLine(
    line: string,
    state: TokenizerState,
    allLines: string[],
    lineIndex: number
): Token | null {
    const lineNumber = state.lineNumber;

    // Handle code block content
    if (state.inCodeBlock) {
        const fenceMatch = line.match(PATTERNS.codeFence);

        // Check if this closes the code block
        if (fenceMatch && line.trim().startsWith(state.codeBlockFence.charAt(0))) {
            state.inCodeBlock = false;
            state.codeBlockFence = '';
            return {
                type: 'code_fence_end',
                raw: line,
                content: '',
                indent: 0,
                line: lineNumber,
            };
        }

        // It's code content
        return {
            type: 'code_content',
            raw: line,
            content: line,
            indent: 0,
            line: lineNumber,
        };
    }

    // Code fence start
    const codeFenceMatch = line.match(PATTERNS.codeFence);
    if (codeFenceMatch) {
        state.inCodeBlock = true;
        state.codeBlockFence = codeFenceMatch[2];
        const language = codeFenceMatch[3] || '';

        return {
            type: 'code_fence_start',
            raw: line,
            content: '',
            indent: (codeFenceMatch[1] || '').length,
            line: lineNumber,
            meta: { language },
        };
    }

    // Blank line
    if (PATTERNS.blank.test(line)) {
        return {
            type: 'blank',
            raw: line,
            content: '',
            indent: 0,
            line: lineNumber,
        };
    }

    // Divider (before checking for setext headings)
    const dividerMatch = line.match(PATTERNS.divider);
    if (dividerMatch) {
        // Make sure it's not a setext heading
        const prevLine = lineIndex > 0 ? allLines[lineIndex - 1] : '';
        if (prevLine.trim() && !PATTERNS.blank.test(prevLine)) {
            // This might be a setext heading underline
            if (PATTERNS.setextH2.test(line)) {
                // We need to handle setext headings in the parser, not tokenizer
                // For now, treat the previous line as a heading
            }
        } else {
            return {
                type: 'divider',
                raw: line,
                content: '',
                indent: (dividerMatch[1] || '').length,
                line: lineNumber,
            };
        }
    }

    // ATX Heading
    const headingMatch = line.match(PATTERNS.heading);
    if (headingMatch) {
        return {
            type: 'heading',
            raw: line,
            content: headingMatch[2].trim(),
            indent: 0,
            line: lineNumber,
            meta: { level: headingMatch[1].length },
        };
    }

    // Callout (must come before blockquote)
    const calloutMatch = line.match(PATTERNS.callout);
    if (calloutMatch) {
        return {
            type: 'callout',
            raw: line,
            content: '',
            indent: 0,
            line: lineNumber,
            meta: { calloutType: calloutMatch[1].toLowerCase() },
        };
    }

    // Blockquote
    const blockquoteMatch = line.match(PATTERNS.blockquote);
    if (blockquoteMatch) {
        return {
            type: 'blockquote',
            raw: line,
            content: blockquoteMatch[1],
            indent: 0,
            line: lineNumber,
        };
    }

    // Check list item (must come before bullet list)
    const checkListMatch = line.match(PATTERNS.checkList);
    if (checkListMatch) {
        const checked = checkListMatch[2].toLowerCase() === 'x';
        return {
            type: 'check_list_item',
            raw: line,
            content: checkListMatch[3],
            indent: checkListMatch[1].length,
            line: lineNumber,
            meta: { checked },
        };
    }

    // Bullet list item
    const bulletMatch = line.match(PATTERNS.bulletList);
    if (bulletMatch) {
        return {
            type: 'bullet_list_item',
            raw: line,
            content: bulletMatch[3],
            indent: bulletMatch[1].length,
            line: lineNumber,
            meta: { listMarker: bulletMatch[2] },
        };
    }

    // Numbered list item
    const numberedMatch = line.match(PATTERNS.numberedList);
    if (numberedMatch) {
        return {
            type: 'numbered_list_item',
            raw: line,
            content: numberedMatch[3],
            indent: numberedMatch[1].length,
            line: lineNumber,
            meta: { listIndex: parseInt(numberedMatch[2], 10) },
        };
    }

    // Table separator (must come before table row)
    if (PATTERNS.tableSeparator.test(line)) {
        return {
            type: 'table_separator',
            raw: line,
            content: line,
            indent: 0,
            line: lineNumber,
        };
    }

    // Table row
    const tableRowMatch = line.match(PATTERNS.tableRow);
    if (tableRowMatch) {
        return {
            type: 'table_row',
            raw: line,
            content: tableRowMatch[1],
            indent: 0,
            line: lineNumber,
        };
    }

    // Standalone image
    const imageMatch = line.match(PATTERNS.image);
    if (imageMatch) {
        return {
            type: 'image',
            raw: line,
            content: imageMatch[2], // URL
            indent: 0,
            line: lineNumber,
            meta: { language: imageMatch[1] }, // Using language field for alt text
        };
    }

    // Check for setext heading underlines
    if (PATTERNS.setextH1.test(line) || PATTERNS.setextH2.test(line)) {
        const prevLine = lineIndex > 0 ? allLines[lineIndex - 1] : '';
        if (prevLine.trim() && !PATTERNS.blank.test(prevLine)) {
            // This is a setext heading underline
            // The parser will handle combining with previous line
            return {
                type: 'heading',
                raw: line,
                content: prevLine.trim(),
                indent: 0,
                line: lineNumber,
                meta: { level: PATTERNS.setextH1.test(line) ? 1 : 2 },
            };
        }

        // Otherwise it's a divider
        return {
            type: 'divider',
            raw: line,
            content: '',
            indent: 0,
            line: lineNumber,
        };
    }

    // Default: paragraph
    return {
        type: 'paragraph',
        raw: line,
        content: line.trim(),
        indent: line.length - line.trimStart().length,
        line: lineNumber,
    };
}

// ============================================================================
// Token Utilities
// ============================================================================

/**
 * Groups: consecutive tokens of the same type
 */
export function groupTokens(tokens: Token[]): Token[][] {
    const groups: Token[][] = [];
    let currentGroup: Token[] = [];
    let lastType: TokenType | null = null;

    for (const token of tokens) {
        if (token.type === 'blank') {
            // Blank lines end groups
            if (currentGroup.length > 0) {
                groups.push(currentGroup);
                currentGroup = [];
            }
            lastType = null;
            continue;
        }

        if (lastType === token.type) {
            currentGroup.push(token);
        } else {
            if (currentGroup.length > 0) {
                groups.push(currentGroup);
            }
            currentGroup = [token];
            lastType = token.type;
        }
    }

    if (currentGroup.length > 0) {
        groups.push(currentGroup);
    }

    return groups;
}

/**
 * Checks: [if] token is a list item
 */
export function isListToken(token: Token): boolean {
    return (
        token.type === 'bullet_list_item' ||
        token.type === 'numbered_list_item' ||
        token.type === 'check_list_item'
    );
}

/**
 * Checks: [if] token is inside a code block
 */
export function isCodeToken(token: Token): boolean {
    return (
        token.type === 'code_fence_start' ||
        token.type === 'code_fence_end' ||
        token.type === 'code_content'
    );
}
