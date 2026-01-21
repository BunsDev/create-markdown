'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ReactNode } from 'react';

interface SortableBlockProps {
  id: string;
  children: ReactNode;
}

/**
 * Grip icon for drag handle - minimal 6-dot pattern
 */
function GripIcon() {
  return (
    <svg
      width="12"
      height="16"
      viewBox="0 0 12 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="3" cy="3" r="1.5" />
      <circle cx="9" cy="3" r="1.5" />
      <circle cx="3" cy="8" r="1.5" />
      <circle cx="9" cy="8" r="1.5" />
      <circle cx="3" cy="13" r="1.5" />
      <circle cx="9" cy="13" r="1.5" />
    </svg>
  );
}

/**
 * Sortable wrapper for blocks with drag handle
 * Adds drag-and-drop functionality with sleek visual feedback
 */
export function SortableBlock({ id, children }: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Extract aria-describedby from attributes but use role="group" for container
  const { role: _, ...safeAttributes } = attributes;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sortable-block ${isDragging ? 'is-dragging' : ''} ${isOver ? 'is-over' : ''}`}
      role="listitem"
      {...safeAttributes}
    >
      {/* Drag Handle */}
      <button
        ref={setActivatorNodeRef}
        className="drag-handle"
        aria-label="Drag to reorder"
        type="button"
        {...listeners}
      >
        <GripIcon />
      </button>

      {/* Block Content */}
      <div className="sortable-block-content">
        {children}
      </div>
    </div>
  );
}

/**
 * Drag overlay component - shown while dragging
 * Displays a ghost preview of the block being dragged
 */
interface DragOverlayBlockProps {
  children: ReactNode;
}

export function DragOverlayBlock({ children }: DragOverlayBlockProps) {
  return (
    <div className="drag-overlay-block">
      <div className="drag-handle drag-handle-active">
        <GripIcon />
      </div>
      <div className="sortable-block-content">
        {children}
      </div>
    </div>
  );
}
