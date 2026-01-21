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

export function EditableBlock({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onEnter,
  onBackspaceEmpty,
  onArrowUp,
  onArrowDown,
}: EditableBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const initializedRef = useRef(false);
  const isListBlock = block.type === 'bulletList' || block.type === 'numberedList';
  const isDivider = block.type === 'divider';

  // Set initial content on mount
  useEffect(() => {
    if (ref.current && !initializedRef.current) {
      ref.current.innerHTML = spansToHtml(block.content);
      initializedRef.current = true;
    }
  }, [block.content]);

  // Focus: when selected
  useEffect(() => {
    if (isSelected && ref.current && document.activeElement !== ref.current) {
      ref.current.focus();
    }
  }, [isSelected]);

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
    // Don't sync back to React state on every keystroke
    // This prevents cursor jumping
  }, []);

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
              ref={i === 0 ? ref : undefined}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
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
