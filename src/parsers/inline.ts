/**
 * create-markdown - Inline Style Parser
 * Parse inline markdown styles (bold, italic, code, links, etc.)
 */

import type { TextSpan, InlineStyle } from '../types';

// ============================================================================
// Types
// ============================================================================

interface InlineToken {
  type: 'text' | 'bold' | 'italic' | 'code' | 'strikethrough' | 'highlight' | 'link' | 'image';
  content: string;
  url?: string;
  title?: string;
  children?: InlineToken[];
}

// ============================================================================
// Inline Parser
// ============================================================================

/**
 * Parses inline markdown content into an array of TextSpans
 */
export function parseInlineContent(text: string): TextSpan[] {
  if (!text) {
    return [];
  }
  
  const tokens = tokenizeInline(text);
  return tokensToSpans(tokens);
}

/**
 * Tokenizes: inline markdown content
 */
function tokenizeInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let remaining = text;
  let pos = 0;
  
  while (pos < remaining.length) {
    // Try to match inline patterns
    const matched = tryMatchInline(remaining, pos);
    
    if (matched) {
      // Add any text before the match
      if (matched.startIndex > pos) {
        tokens.push({
          type: 'text',
          content: remaining.slice(pos, matched.startIndex),
        });
      }
      
      tokens.push(matched.token);
      pos = matched.endIndex;
    } else {
      // No match found, consume one character
      pos++;
    }
  }
  
  // Simpler approach: re-parse with explicit position tracking
  return parseInlineTokens(text);
}

/**
 * Parses: inline tokens with proper position tracking
 */
function parseInlineTokens(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let i = 0;
  let textBuffer = '';
  
  const flushText = () => {
    if (textBuffer) {
      tokens.push({ type: 'text', content: textBuffer });
      textBuffer = '';
    }
  };
  
  while (i < text.length) {
    // Escape sequences
    if (text[i] === '\\' && i + 1 < text.length) {
      textBuffer += text[i + 1];
      i += 2;
      continue;
    }
    
    // Inline code (highest priority - no nesting inside)
    if (text[i] === '`') {
      const match = matchCode(text, i);
      if (match) {
        flushText();
        tokens.push(match.token);
        i = match.end;
        continue;
      }
    }
    
    // Links and images
    if (text[i] === '[' || (text[i] === '!' && text[i + 1] === '[')) {
      const isImage = text[i] === '!';
      const match = matchLink(text, isImage ? i + 1 : i, isImage);
      if (match) {
        flushText();
        tokens.push(match.token);
        i = match.end;
        continue;
      }
    }
    
    // Bold and italic (**bold**, *italic*, ***both***)
    if (text[i] === '*' || text[i] === '_') {
      const match = matchEmphasis(text, i);
      if (match) {
        flushText();
        tokens.push(match.token);
        i = match.end;
        continue;
      }
    }
    
    // Strikethrough (~~text~~)
    if (text[i] === '~' && text[i + 1] === '~') {
      const match = matchStrikethrough(text, i);
      if (match) {
        flushText();
        tokens.push(match.token);
        i = match.end;
        continue;
      }
    }
    
    // Highlight (==text==)
    if (text[i] === '=' && text[i + 1] === '=') {
      const match = matchHighlight(text, i);
      if (match) {
        flushText();
        tokens.push(match.token);
        i = match.end;
        continue;
      }
    }
    
    // Regular character
    textBuffer += text[i];
    i++;
  }
  
  flushText();
  return tokens;
}

// ============================================================================
// Pattern Matchers
// ============================================================================

interface MatchResult {
  token: InlineToken;
  end: number;
}

/**
 * Matches: inline code spans
 */
function matchCode(text: string, start: number): MatchResult | null {
  // Count opening backticks
  let backticks = 0;
  let i = start;
  
  while (i < text.length && text[i] === '`') {
    backticks++;
    i++;
  }
  
  if (backticks === 0) return null;
  
  // Find closing backticks of same length
  const closePattern = '`'.repeat(backticks);
  const closeIndex = text.indexOf(closePattern, i);
  
  if (closeIndex === -1) return null;
  
  // Make sure it's exactly the same number of backticks
  if (text[closeIndex + backticks] === '`') {
    // More backticks, not a match
    return null;
  }
  
  const content = text.slice(i, closeIndex);
  
  return {
    token: { type: 'code', content: content.trim() },
    end: closeIndex + backticks,
  };
}

/**
 * Matches: links and images
 */
function matchLink(text: string, start: number, isImage: boolean = false): MatchResult | null {
  if (text[start] !== '[') return null;
  
  // Find closing bracket
  let bracketDepth = 1;
  let i = start + 1;
  
  while (i < text.length && bracketDepth > 0) {
    if (text[i] === '[') bracketDepth++;
    else if (text[i] === ']') bracketDepth--;
    else if (text[i] === '\\') i++; // Skip escaped char
    i++;
  }
  
  if (bracketDepth !== 0) return null;
  
  const linkText = text.slice(start + 1, i - 1);
  
  // Expect (url) or (url "title")
  if (text[i] !== '(') return null;
  
  const urlStart = i + 1;
  let urlEnd = urlStart;
  let parenDepth = 1;
  
  while (urlEnd < text.length && parenDepth > 0) {
    if (text[urlEnd] === '(') parenDepth++;
    else if (text[urlEnd] === ')') parenDepth--;
    else if (text[urlEnd] === '\\') urlEnd++; // Skip escaped char
    urlEnd++;
  }
  
  if (parenDepth !== 0) return null;
  
  const urlPart = text.slice(urlStart, urlEnd - 1).trim();
  
  // Parse URL and optional title
  let url = urlPart;
  let title: string | undefined;
  
  // Check for title in quotes
  const titleMatch = urlPart.match(/^(.+?)\s+["'](.+?)["']$/);
  if (titleMatch) {
    url = titleMatch[1];
    title = titleMatch[2];
  }
  
  const token: InlineToken = isImage
    ? { type: 'image', content: linkText, url, title }
    : { type: 'link', content: linkText, url, title };
  
  return {
    token,
    end: isImage ? urlEnd + 1 : urlEnd,
  };
}

/**
 * Matches: emphasis (bold/italic)
 */
function matchEmphasis(text: string, start: number): MatchResult | null {
  const char = text[start];
  if (char !== '*' && char !== '_') return null;
  
  // Count opening markers
  let count = 0;
  let i = start;
  
  while (i < text.length && text[i] === char && count < 3) {
    count++;
    i++;
  }
  
  if (count === 0) return null;
  
  // Find closing markers of same count
  const closePattern = char.repeat(count);
  let searchStart = i;
  
  while (searchStart < text.length) {
    const closeIndex = text.indexOf(closePattern, searchStart);
    
    if (closeIndex === -1) return null;
    
    // Make sure it's exactly the same number of markers
    if (text[closeIndex + count] === char) {
      // More markers, not a match - keep searching
      searchStart = closeIndex + 1;
      continue;
    }
    
    // Check that there's no whitespace right before closing
    if (text[closeIndex - 1] === ' ') {
      searchStart = closeIndex + 1;
      continue;
    }
    
    const content = text.slice(i, closeIndex);
    
    // Don't match empty content
    if (!content.trim()) {
      searchStart = closeIndex + 1;
      continue;
    }
    
    // Recursively parse content for nested styles
    const children = parseInlineTokens(content);
    
    if (count === 3) {
      // Bold and italic
      return {
        token: {
          type: 'bold',
          content,
          children: [{ type: 'italic', content, children }],
        },
        end: closeIndex + count,
      };
    } else if (count === 2) {
      return {
        token: { type: 'bold', content, children },
        end: closeIndex + count,
      };
    } else {
      return {
        token: { type: 'italic', content, children },
        end: closeIndex + count,
      };
    }
  }
  
  return null;
}

/**
 * Matches: strikethrough
 */
function matchStrikethrough(text: string, start: number): MatchResult | null {
  if (text[start] !== '~' || text[start + 1] !== '~') return null;
  
  const closeIndex = text.indexOf('~~', start + 2);
  if (closeIndex === -1) return null;
  
  const content = text.slice(start + 2, closeIndex);
  if (!content.trim()) return null;
  
  const children = parseInlineTokens(content);
  
  return {
    token: { type: 'strikethrough', content, children },
    end: closeIndex + 2,
  };
}

/**
 * Matches: highlight
 */
function matchHighlight(text: string, start: number): MatchResult | null {
  if (text[start] !== '=' || text[start + 1] !== '=') return null;
  
  const closeIndex = text.indexOf('==', start + 2);
  if (closeIndex === -1) return null;
  
  const content = text.slice(start + 2, closeIndex);
  if (!content.trim()) return null;
  
  const children = parseInlineTokens(content);
  
  return {
    token: { type: 'highlight', content, children },
    end: closeIndex + 2,
  };
}

// ============================================================================
// Token to Span Conversion
// ============================================================================

/**
 * Converts: inline tokens to TextSpans
 */
function tokensToSpans(tokens: InlineToken[]): TextSpan[] {
  const spans: TextSpan[] = [];
  
  for (const token of tokens) {
    const newSpans = tokenToSpans(token, {});
    spans.push(...newSpans);
  }
  
  return mergeAdjacentSpans(spans);
}

/**
 * Converts: single token to spans, applying inherited styles
 */
function tokenToSpans(token: InlineToken, inheritedStyles: InlineStyle): TextSpan[] {
  switch (token.type) {
    case 'text':
      return [{ text: token.content, styles: { ...inheritedStyles } }];
    
    case 'bold':
      return processStyledToken(token, { ...inheritedStyles, bold: true });
    
    case 'italic':
      return processStyledToken(token, { ...inheritedStyles, italic: true });
    
    case 'code':
      // Code doesn't have children - it's literal
      return [{ text: token.content, styles: { ...inheritedStyles, code: true } }];
    
    case 'strikethrough':
      return processStyledToken(token, { ...inheritedStyles, strikethrough: true });
    
    case 'highlight':
      return processStyledToken(token, { ...inheritedStyles, highlight: true });
    
    case 'link':
      return processStyledToken(token, {
        ...inheritedStyles,
        link: { url: token.url || '', title: token.title },
      });
    
    case 'image':
      // Images are handled at the block level
      // Return as a placeholder text
      return [{ text: `[image: ${token.content}]`, styles: inheritedStyles }];
    
    default:
      return [{ text: token.content, styles: inheritedStyles }];
  }
}

/**
 * Processes: styled token with children
 */
function processStyledToken(token: InlineToken, styles: InlineStyle): TextSpan[] {
  if (token.children && token.children.length > 0) {
    const spans: TextSpan[] = [];
    for (const child of token.children) {
      spans.push(...tokenToSpans(child, styles));
    }
    return spans;
  }
  
  return [{ text: token.content, styles }];
}

/**
 * Merges: adjacent spans with identical styles
 */
function mergeAdjacentSpans(spans: TextSpan[]): TextSpan[] {
  if (spans.length === 0) return [];
  
  const merged: TextSpan[] = [spans[0]];
  
  for (let i = 1; i < spans.length; i++) {
    const current = spans[i];
    const previous = merged[merged.length - 1];
    
    if (stylesEqual(current.styles, previous.styles)) {
      previous.text += current.text;
    } else {
      merged.push(current);
    }
  }
  
  return merged;
}

/**
 * Checks: [if] two style objects are equal
 */
function stylesEqual(a: InlineStyle, b: InlineStyle): boolean {
  return (
    a.bold === b.bold &&
    a.italic === b.italic &&
    a.underline === b.underline &&
    a.strikethrough === b.strikethrough &&
    a.code === b.code &&
    a.highlight === b.highlight &&
    linksEqual(a.link, b.link)
  );
}

/**
 * Checks: [if] two link objects are equal
 */
function linksEqual(
  a: InlineStyle['link'],
  b: InlineStyle['link']
): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return a.url === b.url && a.title === b.title;
}

// ============================================================================
// Utility Exports
// ============================================================================

/**
 * Attempts to match: any inline pattern at the given position
 */
function tryMatchInline(
  text: string,
  pos: number
): { token: InlineToken; startIndex: number; endIndex: number } | null {
  // Try each pattern
  const matchers = [
    () => matchCode(text, pos),
    () => matchEmphasis(text, pos),
    () => matchStrikethrough(text, pos),
    () => matchHighlight(text, pos),
  ];
  
  for (const match of matchers) {
    const result = match();
    if (result) {
      return {
        token: result.token,
        startIndex: pos,
        endIndex: result.end,
      };
    }
  }
  
  return null;
}

/**
 * Extracts: plain text from inline content (strips all formatting)
 */
export function extractPlainText(text: string): string {
  const spans = parseInlineContent(text);
  return spans.map((s) => s.text).join('');
}
