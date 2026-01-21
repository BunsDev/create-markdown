'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useTheme } from '../theme-context';

export interface SelectionToolbarProps {
  onFormat: (format: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'link') => void;
  containerRef?: React.RefObject<HTMLElement>;
}

interface Position {
  x: number;
  y: number;
}

export function SelectionToolbar({ onFormat, containerRef }: SelectionToolbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const updatePosition = useCallback(() => {
    const selection = window.getSelection();
    
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      setIsVisible(false);
      return;
    }

    // Check if selection is within an editable block
    const anchorNode = selection.anchorNode;
    const isInEditable = anchorNode && (
      anchorNode.parentElement?.closest('.editable-block') ||
      anchorNode.parentElement?.closest('[contenteditable]')
    );

    if (!isInEditable) {
      setIsVisible(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Calculate position - center above the selection
    const toolbarWidth = 280; // Approximate toolbar width
    const toolbarHeight = 44;
    const padding = 8;
    
    let x = rect.left + (rect.width / 2) - (toolbarWidth / 2);
    let y = rect.top - toolbarHeight - padding;

    // Keep within viewport bounds
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Horizontal bounds
    if (x < padding) x = padding;
    if (x + toolbarWidth > viewportWidth - padding) {
      x = viewportWidth - toolbarWidth - padding;
    }

    // If not enough space above, show below
    if (y < padding) {
      y = rect.bottom + padding;
    }

    // Account for scroll
    x += window.scrollX;
    y += window.scrollY;

    setPosition({ x, y });
    setIsVisible(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    // Small delay to let selection settle
    requestAnimationFrame(() => {
      updatePosition();
    });
  }, [updatePosition]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    // Update on Shift+Arrow selection
    if (e.shiftKey && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      updatePosition();
    }
  }, [updatePosition]);

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [handleMouseUp, handleKeyUp, handleSelectionChange]);

  const handleFormat = useCallback((format: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'link') => {
    onFormat(format);
    // Keep selection after formatting
    requestAnimationFrame(() => {
      updatePosition();
    });
  }, [onFormat, updatePosition]);

  if (!isVisible) return null;

  return (
    <div
      ref={toolbarRef}
      className="selection-toolbar"
      style={{
        left: position.x,
        top: position.y,
      }}
      onMouseDown={(e) => e.preventDefault()} // Prevent losing selection
    >
      <button
        className="selection-btn"
        onClick={() => handleFormat('bold')}
        title="Bold (⌘B)"
      >
        <strong>B</strong>
      </button>
      <button
        className="selection-btn"
        onClick={() => handleFormat('italic')}
        title="Italic (⌘I)"
      >
        <em>I</em>
      </button>
      <button
        className="selection-btn"
        onClick={() => handleFormat('underline')}
        title="Underline (⌘U)"
      >
        <span style={{ textDecoration: 'underline' }}>U</span>
      </button>
      <button
        className="selection-btn"
        onClick={() => handleFormat('strikethrough')}
        title="Strikethrough"
      >
        <span style={{ textDecoration: 'line-through' }}>S</span>
      </button>
      <div className="selection-divider" />
      <button
        className="selection-btn"
        onClick={() => handleFormat('code')}
        title="Inline Code"
      >
        {'</>'}
      </button>
      <button
        className="selection-btn"
        onClick={() => handleFormat('link')}
        title="Add Link"
      >
        <LinkIcon />
      </button>
    </div>
  );
}

function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

export default SelectionToolbar;
