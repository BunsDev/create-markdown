'use client';

import {
  useRef,
  useEffect,
  useCallback,
  useState,
  type KeyboardEvent,
  type FocusEvent,
} from 'react';
import type { Block, TextSpan } from '../../../dist/index.js';

export interface EditableBlockProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (content: TextSpan[]) => void;
  onEnter: () => void;
  onBackspaceEmpty: () => void;
  onArrowUp: () => void;
  onArrowDown: () => void;
  onConvertToList?: (text: string) => void;
  onConvertToNumberedList?: (text: string) => void;
  onConvertToHeading?: (level: 1 | 2 | 3 | 4 | 5 | 6, text: string) => void;
  onConvertToBlockquote?: (text: string) => void;
  onConvertToCodeBlock?: (text: string) => void;
  onConvertToDivider?: () => void;
  onAddListItem?: (afterIndex: number, currentItemContent: TextSpan[]) => void;
  onUpdateListItem?: (itemIndex: number, content: TextSpan[]) => void;
  onIndentListItem?: (itemIndex: number) => void;
  onOutdentListItem?: (itemIndex: number) => void;
  onRemoveListItem?: (itemIndex: number) => void;
  onExitList?: (itemIndex: number) => void;
}

/**
 * Converts a block's content spans to HTML string
 */
function spansToHtml(spans: TextSpan[] | undefined): string {
  if (!spans || !Array.isArray(spans)) return '';
  
  return spans.map((span) => {
    let html = escapeHtml(span.text || '');
    const styles = span.styles || {};
    
    if (styles.code) {
      html = `<code>${html}</code>`;
    }
    if (styles.strikethrough) {
      html = `<del>${html}</del>`;
    }
    if (styles.italic) {
      html = `<em>${html}</em>`;
    }
    if (styles.bold) {
      html = `<strong>${html}</strong>`;
    }
    if (styles.link) {
      html = `<a href="${escapeHtml(styles.link.url)}">${html}</a>`;
    }
    
    return html;
  }).join('');
}

/**
 * Converts: HTML content back to TextSpan array
 * Properly parses HTML to preserve styles including links
 */
function htmlToSpans(html: string): TextSpan[] {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  const spans: TextSpan[] = [];
  
  function processNode(node: Node, inheritedStyles: TextSpan['styles'] = {}): void {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (text) {
        spans.push({ text, styles: { ...inheritedStyles } });
      }
      return;
    }
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();
      const newStyles = { ...inheritedStyles };
      
      // Apply styles based on tag
      switch (tagName) {
        case 'strong':
        case 'b':
          newStyles.bold = true;
          break;
        case 'em':
        case 'i':
          newStyles.italic = true;
          break;
        case 'u':
          newStyles.underline = true;
          break;
        case 'del':
        case 's':
        case 'strike':
          newStyles.strikethrough = true;
          break;
        case 'code':
          newStyles.code = true;
          break;
        case 'mark':
          newStyles.highlight = true;
          break;
        case 'a':
          const href = element.getAttribute('href');
          if (href) {
            newStyles.link = { url: href };
            const title = element.getAttribute('title');
            if (title) {
              newStyles.link.title = title;
            }
          }
          break;
      }
      
      // Process child nodes with accumulated styles
      for (const child of Array.from(node.childNodes)) {
        processNode(child, newStyles);
      }
    }
  }
  
  processNode(temp);
  
  // Merge adjacent spans with identical styles
  const mergedSpans: TextSpan[] = [];
  for (const span of spans) {
    const last = mergedSpans[mergedSpans.length - 1];
    if (last && stylesEqual(last.styles, span.styles)) {
      last.text += span.text;
    } else {
      mergedSpans.push(span);
    }
  }
  
  return mergedSpans;
}

/**
 * Compares two style objects for equality
 */
function stylesEqual(a: TextSpan['styles'], b: TextSpan['styles']): boolean {
  const aLink = a.link;
  const bLink = b.link;
  
  const linksEqual = aLink === bLink || !!(
    aLink && bLink &&
    aLink.url === bLink.url &&
    aLink.title === bLink.title
  );
  
  return (
    a.bold === b.bold &&
    a.italic === b.italic &&
    a.underline === b.underline &&
    a.strikethrough === b.strikethrough &&
    a.code === b.code &&
    a.highlight === b.highlight &&
    linksEqual
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Gets: appropriate CSS class and element for a block type
 */
function getBlockClassName(block: Block): string {
  switch (block.type) {
    case 'heading': {
      const level = (block.props as { level: number }).level || 1;
      return `block-h${level}`;
    }
    case 'paragraph':
      return 'block-paragraph';
    case 'bulletList':
      return 'block-bullet-list';
    case 'numberedList':
      return 'block-numbered-list';
    case 'codeBlock':
      return 'block-code';
    case 'blockquote':
      return 'block-blockquote';
    case 'divider':
      return 'block-divider';
    default:
      return 'block-paragraph';
  }
}

/**
 * Gets: placeholder text based on block type
 */
function getPlaceholder(block: Block): string {
  switch (block.type) {
    case 'heading': {
      const level = (block.props as { level: number }).level || 1;
      return `Heading ${level}`;
    }
    case 'paragraph':
      return 'Type something...';
    case 'codeBlock':
      return 'Code...';
    case 'blockquote':
      return 'Quote...';
    default:
      return 'Type something...';
  }
}

// Patterns that trigger block conversions
const BULLET_PATTERNS = /^[-*•+]\s(.*)$/;
const NUMBERED_LIST_PATTERN = /^(\d+)\.\s(.*)$/;
const HEADING_PATTERNS = /^(#{1,6})\s(.*)$/;
const BLOCKQUOTE_PATTERN = /^>\s(.*)$/;
const CODE_BLOCK_PATTERN = /^```(.*)$/;
const DIVIDER_PATTERN = /^(-{3,}|_{3,}|\*{3,})$/;

// Inline markdown patterns for live rendering
const INLINE_PATTERNS = [
  // Bold: **text** or __text__
  { pattern: /\*\*([^*]+)\*\*/, replacement: '<strong>$1</strong>' },
  { pattern: /__([^_]+)__/, replacement: '<strong>$1</strong>' },
  // Italic: *text* or _text_ (single)
  { pattern: /(?<!\*)\*([^*]+)\*(?!\*)/, replacement: '<em>$1</em>' },
  { pattern: /(?<!_)_([^_]+)_(?!_)/, replacement: '<em>$1</em>' },
  // Code: `text`
  { pattern: /`([^`]+)`/, replacement: '<code>$1</code>' },
  // Strikethrough: ~~text~~
  { pattern: /~~([^~]+)~~/, replacement: '<del>$1</del>' },
  // Highlight: ==text==
  { pattern: /==([^=]+)==/, replacement: '<mark>$1</mark>' },
];

/**
 * Parses inline markdown syntax and converts to HTML
 * Processes markdown patterns first, then escapes remaining HTML
 */
function parseInlineMarkdown(text: string): string {
  let result = text;
  
  // Process links first: [text](url) or [text](url "title")
  result = result.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g, (match, linkText, url, title) => {
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
    return `<a href="${escapeHtml(url)}"${titleAttr}>${escapeHtml(linkText)}</a>`;
  });
  
  // Process bold first (** and __)
  result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  
  // Process italic (* and _) - be careful not to match inside bold
  result = result.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
  result = result.replace(/(?<!_)_([^_]+)_(?!_)/g, '<em>$1</em>');
  
  // Process code
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Process strikethrough
  result = result.replace(/~~([^~]+)~~/g, '<del>$1</del>');
  
  // Process highlight
  result = result.replace(/==([^=]+)==/g, '<mark>$1</mark>');
  
  return result;
}

/**
 * Checks if text contains incomplete markdown patterns that shouldn't be rendered yet
 * Returns true if the user is in the middle of typing a markdown pattern
 */
function hasIncompletePattern(text: string): boolean {
  // Count opening and closing markers to detect incomplete patterns
  // For bold (**), check if there's an odd number of ** sequences
  const boldMatches = text.match(/\*\*/g);
  if (boldMatches && boldMatches.length % 2 !== 0) return true;
  
  // For bold (__), check if there's an odd number of __ sequences  
  const boldUnderMatches = text.match(/__/g);
  if (boldUnderMatches && boldUnderMatches.length % 2 !== 0) return true;
  
  // For inline code (`), check if there's an odd number
  const codeMatches = text.match(/`/g);
  if (codeMatches && codeMatches.length % 2 !== 0) return true;
  
  // For strikethrough (~~), check if there's an odd number of ~~ sequences
  const strikeMatches = text.match(/~~/g);
  if (strikeMatches && strikeMatches.length % 2 !== 0) return true;
  
  // For highlight (==), check if there's an odd number of == sequences
  const highlightMatches = text.match(/==/g);
  if (highlightMatches && highlightMatches.length % 2 !== 0) return true;
  
  // For single * italic: count standalone * (not part of **)
  // Replace ** with placeholder, then count remaining *
  const textWithoutBold = text.replace(/\*\*/g, '');
  const italicAstMatches = textWithoutBold.match(/\*/g);
  if (italicAstMatches && italicAstMatches.length % 2 !== 0) return true;
  
  // For single _ italic: count standalone _ (not part of __)
  const textWithoutBoldUnder = text.replace(/__/g, '');
  const italicUnderMatches = textWithoutBoldUnder.match(/_/g);
  if (italicUnderMatches && italicUnderMatches.length % 2 !== 0) return true;
  
  // For links: check if there's an incomplete [text](url) pattern
  // Incomplete: has [ without matching ] or ]( without matching )
  const openBrackets = (text.match(/\[/g) || []).length;
  const closeBrackets = (text.match(/\]/g) || []).length;
  const linkStarts = (text.match(/\]\(/g) || []).length;
  const linkEnds = (text.match(/\]\([^)]*\)/g) || []).length;
  
  // If we have more open brackets than close brackets, pattern is incomplete
  if (openBrackets > closeBrackets) return true;
  // If we have ]( but not a complete ](...)
  if (linkStarts > linkEnds) return true;
  
  return false;
}

export function EditableBlock({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onEnter,
  onBackspaceEmpty,
  onArrowUp,
  onArrowDown,
  onConvertToList,
  onConvertToNumberedList,
  onConvertToHeading,
  onConvertToBlockquote,
  onConvertToCodeBlock,
  onConvertToDivider,
  onAddListItem,
  onUpdateListItem,
  onIndentListItem,
  onOutdentListItem,
  onRemoveListItem,
  onExitList,
}: EditableBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const listItemRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [focusedItemIndex, setFocusedItemIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const initializedRef = useRef(false);
  const skipBlurRef = useRef(false); // Flag to skip blur handler after list operations
  const isListBlock = block.type === 'bulletList' || block.type === 'numberedList';
  const isDivider = block.type === 'divider';

  // Set initial content on mount
  useEffect(() => {
    if (ref.current && !initializedRef.current) {
      ref.current.innerHTML = spansToHtml(block.content);
      initializedRef.current = true;
    }
  }, [block.content]);

  // Focus: when selected - use requestAnimationFrame to ensure DOM is ready
  useEffect(() => {
    if (isSelected) {
      // Use requestAnimationFrame to ensure DOM is updated with new refs
      requestAnimationFrame(() => {
        if (isListBlock) {
          // Focus the appropriate list item
          const itemRef = listItemRefs.current[focusedItemIndex];
          if (itemRef && document.activeElement !== itemRef) {
            itemRef.focus();
            // Place cursor at end
            const range = document.createRange();
            range.selectNodeContents(itemRef);
            range.collapse(false);
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        } else if (ref.current && document.activeElement !== ref.current) {
          ref.current.focus();
        }
      });
    }
  }, [isSelected, isListBlock, focusedItemIndex, block.children?.length]);

  // Sync content from props when not editing (for external updates like formatting)
  useEffect(() => {
    if (!isEditing && ref.current && initializedRef.current) {
      const newHtml = spansToHtml(block.content);
      if (ref.current.innerHTML !== newHtml) {
        ref.current.innerHTML = newHtml;
      }
    }
  }, [block.content, isEditing]);

  const handleInput = useCallback(() => {
    if (!ref.current) return;
    
    const text = ref.current.textContent || '';
    
    // Only check for block-level conversions on paragraph blocks
    if (block.type === 'paragraph') {
      // Check for heading patterns: # ## ### etc.
      const headingMatch = text.match(HEADING_PATTERNS);
      if (headingMatch && onConvertToHeading) {
        const level = headingMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6;
        const remainingText = (headingMatch[2] || '').trim();
        onConvertToHeading(level, remainingText);
        return;
      }
      
      // Check for bullet list: - * + •
      const bulletMatch = text.match(BULLET_PATTERNS);
      if (bulletMatch && onConvertToList) {
        const remainingText = (bulletMatch[1] || '').trim();
        onConvertToList(remainingText);
        return;
      }
      
      // Check for numbered list: 1. 2. etc.
      const numberedMatch = text.match(NUMBERED_LIST_PATTERN);
      if (numberedMatch && onConvertToNumberedList) {
        const remainingText = (numberedMatch[2] || '').trim();
        onConvertToNumberedList(remainingText);
        return;
      }
      
      // Check for blockquote: >
      const blockquoteMatch = text.match(BLOCKQUOTE_PATTERN);
      if (blockquoteMatch && onConvertToBlockquote) {
        const remainingText = (blockquoteMatch[1] || '').trim();
        onConvertToBlockquote(remainingText);
        return;
      }
      
      // Check for code block: ```
      const codeBlockMatch = text.match(CODE_BLOCK_PATTERN);
      if (codeBlockMatch && onConvertToCodeBlock) {
        const remainingText = (codeBlockMatch[1] || '').trim();
        onConvertToCodeBlock(remainingText);
        return;
      }
      
      // Check for divider: --- ___ ***
      if (DIVIDER_PATTERN.test(text) && onConvertToDivider) {
        onConvertToDivider();
        return;
      }
    }
    
    // Live inline markdown rendering
    // Only process if we have complete patterns
    const html = ref.current.innerHTML;
    const plainText = ref.current.textContent || '';
    
    // Don't process if text is too short or has incomplete patterns
    if (plainText.length < 3 || hasIncompletePattern(plainText)) {
      return;
    }
    
    // Check if we have any complete inline markdown patterns
    const hasCompletePattern = 
      /\*\*[^*]+\*\*/.test(plainText) ||
      /__[^_]+__/.test(plainText) ||
      /(?<!\*)\*[^*]+\*(?!\*)/.test(plainText) ||
      /(?<!_)_[^_]+_(?!_)/.test(plainText) ||
      /`[^`]+`/.test(plainText) ||
      /~~[^~]+~~/.test(plainText) ||
      /==[^=]+==/.test(plainText) ||
      /\[[^\]]+\]\([^)]+\)/.test(plainText);
    
    if (hasCompletePattern) {
      // Save cursor position
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      const cursorOffset = range?.startOffset || 0;
      
      // Parse and update the HTML
      const newHtml = parseInlineMarkdown(plainText);
      
      if (newHtml !== html) {
        ref.current.innerHTML = newHtml;
        
        // Restore cursor position at end
        const newRange = document.createRange();
        const textNode = ref.current.lastChild || ref.current;
        try {
          if (textNode.nodeType === Node.TEXT_NODE) {
            newRange.setStart(textNode, Math.min(cursorOffset, textNode.textContent?.length || 0));
          } else {
            newRange.selectNodeContents(ref.current);
            newRange.collapse(false);
          }
          selection?.removeAllRanges();
          selection?.addRange(newRange);
        } catch (e) {
          // Fallback: just place cursor at end
          newRange.selectNodeContents(ref.current);
          newRange.collapse(false);
          selection?.removeAllRanges();
          selection?.addRange(newRange);
        }
        
        // Update the block content
        const newContent = htmlToSpans(newHtml);
        onUpdate(newContent);
      }
    }
  }, [block.type, onConvertToList, onConvertToNumberedList, onConvertToHeading, onConvertToBlockquote, onConvertToCodeBlock, onConvertToDivider, onUpdate]);

  const handleFocus = useCallback((e: FocusEvent) => {
    setIsEditing(true);
    if (!isSelected) {
      onSelect();
    }
  }, [isSelected, onSelect]);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (!ref.current) return;
    const html = ref.current.innerHTML;
    const newContent = htmlToSpans(html);
    onUpdate(newContent);
  }, [onUpdate]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    const isMod = e.metaKey || e.ctrlKey;

    // Undo/Redo - let browser handle natively (don't preventDefault)
    if (isMod && (e.key === 'z' || e.key === 'y')) {
      return;
    }

    // Formatting shortcuts - use native browser commands
    if (isMod && e.key === 'b') {
      e.preventDefault();
      document.execCommand('bold', false);
      return;
    }
    if (isMod && e.key === 'i') {
      e.preventDefault();
      document.execCommand('italic', false);
      return;
    }
    if (isMod && e.key === 'u') {
      e.preventDefault();
      document.execCommand('underline', false);
      return;
    }

    // Enter: create new block
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onEnter();
      return;
    }

    // Backspace: on empty - delete block
    if (e.key === 'Backspace') {
      const content = ref.current?.textContent || '';
      if (content === '') {
        e.preventDefault();
        onBackspaceEmpty();
        return;
      }
    }

    // Arrow: navigation
    if (e.key === 'ArrowUp') {
      const selection = window.getSelection();
      if (selection && selection.anchorOffset === 0) {
        e.preventDefault();
        onArrowUp();
      }
    }

    if (e.key === 'ArrowDown') {
      const selection = window.getSelection();
      const textLength = ref.current?.textContent?.length || 0;
      if (selection && selection.anchorOffset >= textLength) {
        e.preventDefault();
        onArrowDown();
      }
    }
  }, [onEnter, onBackspaceEmpty, onArrowUp, onArrowDown]);

  // Render: divider differently
  if (isDivider) {
    return (
      <hr
        className={`editable-block block-divider ${isSelected ? 'selected' : ''}`}
        onClick={onSelect}
      />
    );
  }

  // Handle list item specific key events
  const handleListItemKeyDown = useCallback((e: KeyboardEvent<HTMLSpanElement>, itemIndex: number) => {
    const isMod = e.metaKey || e.ctrlKey;
    const itemRef = listItemRefs.current[itemIndex];
    const content = itemRef?.textContent || '';

    // Undo/Redo - let browser handle
    if (isMod && (e.key === 'z' || e.key === 'y')) {
      return;
    }

    // Formatting shortcuts
    if (isMod && e.key === 'b') {
      e.preventDefault();
      document.execCommand('bold', false);
      return;
    }
    if (isMod && e.key === 'i') {
      e.preventDefault();
      document.execCommand('italic', false);
      return;
    }

    // Tab: indent list item
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      if (onIndentListItem) {
        onIndentListItem(itemIndex);
      }
      return;
    }

    // Shift+Tab: outdent list item
    if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault();
      if (onOutdentListItem) {
        onOutdentListItem(itemIndex);
      }
      return;
    }

    // Enter: create new list item OR exit list if empty
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      
      // If current item is empty, exit the list
      if (content === '' && onExitList) {
        // Skip blur handler to prevent overwriting other items
        skipBlurRef.current = true;
        onExitList(itemIndex);
        // Reset after a tick
        requestAnimationFrame(() => { skipBlurRef.current = false; });
        return;
      }
      
      // Get current content to save atomically with add
      const html = itemRef?.innerHTML || '';
      const currentContent = htmlToSpans(html);
      
      // Add new item (pass current content so it can be saved atomically)
      if (onAddListItem) {
        // Skip blur handler since we're saving content atomically
        skipBlurRef.current = true;
        setFocusedItemIndex(itemIndex + 1);
        onAddListItem(itemIndex, currentContent);
        // Reset after a tick to allow future blurs
        requestAnimationFrame(() => { skipBlurRef.current = false; });
      }
      return;
    }

    // Backspace on empty item: remove item or convert to paragraph
    if (e.key === 'Backspace' && content === '') {
      e.preventDefault();
      // Skip blur handler to prevent overwriting other items
      skipBlurRef.current = true;
      if (block.children.length === 1) {
        // Last item, convert to paragraph
        onBackspaceEmpty();
      } else if (onRemoveListItem) {
        // Remove this item and focus previous
        const newFocusIndex = Math.max(0, itemIndex - 1);
        setFocusedItemIndex(newFocusIndex);
        onRemoveListItem(itemIndex);
      }
      // Reset after a tick
      requestAnimationFrame(() => { skipBlurRef.current = false; });
      return;
    }

    // Arrow navigation between items
    if (e.key === 'ArrowUp') {
      const selection = window.getSelection();
      if (selection && selection.anchorOffset === 0) {
        e.preventDefault();
        if (itemIndex > 0) {
          setFocusedItemIndex(itemIndex - 1);
        } else {
          onArrowUp();
        }
      }
    }

    if (e.key === 'ArrowDown') {
      const selection = window.getSelection();
      const textLength = itemRef?.textContent?.length || 0;
      if (selection && selection.anchorOffset >= textLength) {
        e.preventDefault();
        if (itemIndex < block.children.length - 1) {
          setFocusedItemIndex(itemIndex + 1);
        } else {
          onArrowDown();
        }
      }
    }
  }, [block.children.length, onAddListItem, onUpdateListItem, onIndentListItem, onOutdentListItem, onRemoveListItem, onBackspaceEmpty, onArrowUp, onArrowDown]);

  // Handle list item blur - save content
  const handleListItemBlur = useCallback((itemIndex: number) => {
    setIsEditing(false);
    // Skip if we just did an operation that already saved content
    if (skipBlurRef.current) return;
    
    const itemRef = listItemRefs.current[itemIndex];
    if (!itemRef || !onUpdateListItem) return;
    
    // Verify the item still exists in the children array
    if (itemIndex >= block.children.length) return;
    
    const html = itemRef.innerHTML;
    const newContent = htmlToSpans(html);
    onUpdateListItem(itemIndex, newContent);
  }, [onUpdateListItem, block.children.length]);

  // Handle list item focus
  const handleListItemFocus = useCallback((itemIndex: number) => {
    setIsEditing(true);
    setFocusedItemIndex(itemIndex);
    if (!isSelected) {
      onSelect();
    }
  }, [isSelected, onSelect]);

  // Render: lists with their items
  if (isListBlock) {
    const ListTag = block.type === 'bulletList' ? 'ul' : 'ol';
    return (
      <ListTag
        className={`editable-block ${getBlockClassName(block)} ${isSelected ? 'selected' : ''}`}
        onClick={onSelect}
      >
        {block.children.map((child, i) => (
          <li key={child.id || i}>
            <span
              ref={(el) => { listItemRefs.current[i] = el; }}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onFocus={() => handleListItemFocus(i)}
              onBlur={() => handleListItemBlur(i)}
              onKeyDown={(e) => handleListItemKeyDown(e, i)}
              dangerouslySetInnerHTML={{ __html: spansToHtml(child.content) }}
            />
          </li>
        ))}
      </ListTag>
    );
  }

  // Render: regular block
  const placeholder = getPlaceholder(block);
  const isEmpty = !block.content?.length || (block.content.length === 1 && !block.content[0]?.text);

  return (
    <div
      ref={ref}
      className={`editable-block ${getBlockClassName(block)} ${isSelected ? 'selected' : ''}`}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={isEmpty ? placeholder : undefined}
      onInput={handleInput}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  );
}

export default EditableBlock;
