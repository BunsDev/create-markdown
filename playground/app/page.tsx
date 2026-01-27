'use client';

import { useCallback, useRef, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  paragraph,
  bulletList,
  numberedList,
  blockquote,
  codeBlock,
  divider,
  text,
  bold,
  italic,
  spans,
  link,
} from '@create-markdown/core';
import {
  useDocument,
  useBlockEditor,
} from '@create-markdown/react';
import { SelectionToolbar } from './components/selection-toolbar';
import { FloatingActions } from './components/floating-actions';
import { EditableBlock } from './components/editable-block';
import { SortableBlock, DragOverlayBlock } from './components/sortable-block';
import type { Block, TextSpan } from '@create-markdown/core';

// ============================================================================
// Initial Content
// ============================================================================

const INITIAL_BLOCKS: Block[] = [
  h1('create-markdown 👋🏻'),
  paragraph(spans(
    text('Click anywhere to edit this '),
    bold('WYSIWYG'),
    text(' block-based editor built with '),
    italic('zero dependencies'),
    text('.')
  )),
  h2('Notable Features ✨'),
  bulletList([
    'Block-based architecture',
    'DnD block reordering',
    'Press Enter to create new paragraphs',
    'Shortcuts: cmd+b, cmd+i, and cmd+u',
    'Toggle themes (light/dark)',
    'Export as markdown',
  ]),
  h2('Markdown Shortcuts ⚡'),
  paragraph(spans(
    text('Type markdown syntax (it renders live):')
  )),
  bulletList([
    '# Heading 1, ## Heading 2, ### Heading 3',
    '- or * for bullet lists, 1. for numbered lists',
    '> for blockquotes, ``` for code blocks',
    '--- for dividers',
    '**bold**, *italic*, `code`, ~~strikethrough~~, ==highlight==',
    '[link text](url) for links',
  ]),
  h2('Demo Instructions 👇🏻'),
  paragraph(spans(
    text('Select any text to see the formatting toolbar. Use keyboard shortcuts or markdown syntax.')
  )),
  blockquote('🗒️ Something to quote or to note.'),
  codeBlock('function hello() { console.log("TODO: add syntax highlighting"); }', 'typescript'),
  divider(),
  paragraph(spans(
    text('Enchanted by '),
    { text: 'Buns', styles: { bold: true, link: { url: 'https://bunsdev.com', title: 'BunsDev' } } },
    text(' with '),
    bold('love (+ Alani)')
  )),
];

// ============================================================================
// Main Editor Component
// ============================================================================

export default function Editor() {
  const doc = useDocument(INITIAL_BLOCKS);
  const editor = useBlockEditor(doc);
  const editorRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  // DnD sensors - pointer for mouse/touch, keyboard for accessibility
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag start - track which block is being dragged
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    editor.selectBlock(null); // Deselect blocks during drag
  }, [editor]);

  // Handle drag end - reorder blocks
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = doc.getBlockIndex(active.id as string);
      const newIndex = doc.getBlockIndex(over.id as string);
      doc.moveBlock(active.id as string, newIndex);
    }
  }, [doc]);

  // Get the active block for drag overlay
  const activeBlock = activeId ? doc.blocks.find(b => b.id === activeId) : null;

  // Handle inline formatting from selection toolbar
  const handleFormat = useCallback((format: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'link') => {
    // Use native browser commands for formatting
    switch (format) {
      case 'bold':
        document.execCommand('bold', false);
        break;
      case 'italic':
        document.execCommand('italic', false);
        break;
      case 'underline':
        document.execCommand('underline', false);
        break;
      case 'strikethrough':
        document.execCommand('strikeThrough', false);
        break;
      case 'code':
        // Wrap selection in <code> tags
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed) {
          const range = selection.getRangeAt(0);
          const selectedText = range.toString();
          const code = document.createElement('code');
          code.textContent = selectedText;
          range.deleteContents();
          range.insertNode(code);
          // Move cursor after the code element
          range.setStartAfter(code);
          range.setEndAfter(code);
          selection.removeAllRanges();
          selection.addRange(range);
        }
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          document.execCommand('createLink', false, url);
        }
        break;
    }
  }, []);

  // Export document as markdown
  const handleExport = useCallback(() => {
    const markdown = doc.toMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [doc]);

  // Clear document
  const handleClear = useCallback(() => {
    doc.setBlocks([
      h1('New Document'),
      paragraph(''),
    ]);
    editor.selectBlock(null);
  }, [doc, editor]);

  // Handle block content updates
  const handleUpdateBlock = useCallback((blockId: string, content: TextSpan[]) => {
    doc.updateBlock(blockId, { content });
  }, [doc]);

  // Handle Enter - create new paragraph
  const handleEnter = useCallback((afterBlockId: string) => {
    const index = doc.getBlockIndex(afterBlockId);
    const newBlock = paragraph('');
    doc.insertBlock(newBlock, index + 1);
    editor.selectBlock(newBlock.id);
  }, [doc, editor]);

  // Handle backspace on empty block
  const handleBackspaceEmpty = useCallback((blockId: string) => {
    if (doc.blocks.length <= 1) return; // Don't delete last block

    const index = doc.getBlockIndex(blockId);
    const prevBlock = index > 0 ? doc.blocks[index - 1] : null;

    doc.removeBlock(blockId);

    if (prevBlock) {
      editor.selectBlock(prevBlock.id);
    }
  }, [doc, editor]);

  // Handle arrow navigation
  const handleArrowUp = useCallback((currentBlockId: string) => {
    const index = doc.getBlockIndex(currentBlockId);
    if (index > 0) {
      editor.selectBlock(doc.blocks[index - 1].id);
    }
  }, [doc, editor]);

  const handleArrowDown = useCallback((currentBlockId: string) => {
    const index = doc.getBlockIndex(currentBlockId);
    if (index < doc.blocks.length - 1) {
      editor.selectBlock(doc.blocks[index + 1].id);
    }
  }, [doc, editor]);

  // Handle converting paragraph to bullet list
  const handleConvertToList = useCallback((blockId: string, remainingText: string) => {
    const index = doc.getBlockIndex(blockId);
    const newBlock = bulletList([remainingText]);
    newBlock.id = blockId;
    doc.removeBlock(blockId);
    doc.insertBlock(newBlock, index);
    editor.selectBlock(newBlock.id);
  }, [doc, editor]);

  // Handle converting paragraph to numbered list
  const handleConvertToNumberedList = useCallback((blockId: string, remainingText: string) => {
    const index = doc.getBlockIndex(blockId);
    const newBlock = numberedList([remainingText]);
    newBlock.id = blockId;
    doc.removeBlock(blockId);
    doc.insertBlock(newBlock, index);
    editor.selectBlock(newBlock.id);
  }, [doc, editor]);

  // Handle converting paragraph to heading
  const handleConvertToHeading = useCallback((blockId: string, level: 1 | 2 | 3 | 4 | 5 | 6, remainingText: string) => {
    const index = doc.getBlockIndex(blockId);
    const headingCreators = { 1: h1, 2: h2, 3: h3, 4: h4, 5: h5, 6: h6 };
    const newBlock = headingCreators[level](remainingText);
    newBlock.id = blockId;
    doc.removeBlock(blockId);
    doc.insertBlock(newBlock, index);
    editor.selectBlock(newBlock.id);
  }, [doc, editor]);

  // Handle converting paragraph to blockquote
  const handleConvertToBlockquote = useCallback((blockId: string, remainingText: string) => {
    const index = doc.getBlockIndex(blockId);
    const newBlock = blockquote(remainingText);
    newBlock.id = blockId;
    doc.removeBlock(blockId);
    doc.insertBlock(newBlock, index);
    editor.selectBlock(newBlock.id);
  }, [doc, editor]);

  // Handle converting paragraph to code block
  const handleConvertToCodeBlock = useCallback((blockId: string, remainingText: string) => {
    const index = doc.getBlockIndex(blockId);
    const newBlock = codeBlock(remainingText);
    newBlock.id = blockId;
    doc.removeBlock(blockId);
    doc.insertBlock(newBlock, index);
    editor.selectBlock(newBlock.id);
  }, [doc, editor]);

  // Handle converting paragraph to divider
  const handleConvertToDivider = useCallback((blockId: string) => {
    const index = doc.getBlockIndex(blockId);
    const newBlock = divider();
    newBlock.id = blockId;
    doc.removeBlock(blockId);
    doc.insertBlock(newBlock, index);
    // Create a new paragraph after the divider for continued editing
    const nextParagraph = paragraph('');
    doc.insertBlock(nextParagraph, index + 1);
    editor.selectBlock(nextParagraph.id);
  }, [doc, editor]);

  // Handle adding a new list item after the specified index
  // Also saves the current item's content atomically to prevent data loss
  const handleAddListItem = useCallback((blockId: string, afterItemIndex: number, currentItemContent: TextSpan[]) => {
    const block = doc.blocks.find((b) => b.id === blockId);
    if (!block || !block.children) return;

    // Create new children array with:
    // 1. Updated current item content
    // 2. New empty item inserted after
    const newChildren = [...block.children];

    // Update current item content first
    if (newChildren[afterItemIndex]) {
      newChildren[afterItemIndex] = { ...newChildren[afterItemIndex], content: currentItemContent };
    }

    // Insert new empty item
    const newItem = paragraph('');
    newChildren.splice(afterItemIndex + 1, 0, newItem);

    doc.updateBlock(blockId, { children: newChildren });
  }, [doc]);

  // Handle updating a specific list item's content
  const handleUpdateListItem = useCallback((blockId: string, itemIndex: number, content: TextSpan[]) => {
    const block = doc.blocks.find((b) => b.id === blockId);
    if (!block || !block.children) return;

    const newChildren = [...block.children];
    if (newChildren[itemIndex]) {
      newChildren[itemIndex] = { ...newChildren[itemIndex], content };
      doc.updateBlock(blockId, { children: newChildren });
    }
  }, [doc]);

  // Handle removing a list item
  const handleRemoveListItem = useCallback((blockId: string, itemIndex: number) => {
    const block = doc.blocks.find((b) => b.id === blockId);
    if (!block || !block.children || block.children.length <= 1) return;

    const newChildren = block.children.filter((_, i) => i !== itemIndex);
    doc.updateBlock(blockId, { children: newChildren });
  }, [doc]);

  // Handle indenting a list item (placeholder for nested lists)
  const handleIndentListItem = useCallback((blockId: string, itemIndex: number) => {
    // TODO: Implement nested list support
    console.log('Indent list item:', blockId, itemIndex);
  }, []);

  // Handle outdenting a list item (placeholder for nested lists)
  const handleOutdentListItem = useCallback((blockId: string, itemIndex: number) => {
    // TODO: Implement nested list support
    console.log('Outdent list item:', blockId, itemIndex);
  }, []);

  // Handle exiting a list when Enter is pressed on an empty item
  const handleExitList = useCallback((blockId: string, itemIndex: number) => {
    const block = doc.blocks.find((b) => b.id === blockId);
    if (!block || !block.children) return;

    const blockIndex = doc.getBlockIndex(blockId);

    if (block.children.length === 1) {
      // Only one item (the empty one), convert whole list to paragraph
      const newBlock = paragraph('');
      newBlock.id = blockId;
      doc.removeBlock(blockId);
      doc.insertBlock(newBlock, blockIndex);
      editor.selectBlock(newBlock.id);
    } else {
      // Multiple items - remove the empty one and create paragraph after list
      const newChildren = block.children.filter((_, i) => i !== itemIndex);
      doc.updateBlock(blockId, { children: newChildren });

      // Create a new paragraph after the list
      const newParagraph = paragraph('');
      doc.insertBlock(newParagraph, blockIndex + 1);
      editor.selectBlock(newParagraph.id);
    }
  }, [doc, editor]);

  return (
    <div className="flex flex-col min-h-screen">
      <SelectionToolbar onFormat={handleFormat} />
      <FloatingActions
        onExport={handleExport}
        onClear={handleClear}
        blockCount={doc.blocks.length}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="editor-wrapper">
          <div className="doc-container">
            <div className="doc-glow" />
            <div className="doc-border" />
            <main ref={editorRef} className="editor-canvas" role="list" aria-label="Document blocks">
              <SortableContext
                items={doc.blocks.map(b => b.id)}
                strategy={verticalListSortingStrategy}
              >
                {doc.blocks.map((block) => (
                  <SortableBlock key={block.id} id={block.id}>
                    <EditableBlock
                      block={block}
                      isSelected={editor.selectedBlockId === block.id}
                      onSelect={() => editor.selectBlock(block.id)}
                      onUpdate={(content) => handleUpdateBlock(block.id, content)}
                      onEnter={() => handleEnter(block.id)}
                      onBackspaceEmpty={() => handleBackspaceEmpty(block.id)}
                      onArrowUp={() => handleArrowUp(block.id)}
                      onArrowDown={() => handleArrowDown(block.id)}
                      onConvertToList={(text) => handleConvertToList(block.id, text)}
                      onConvertToNumberedList={(text) => handleConvertToNumberedList(block.id, text)}
                      onConvertToHeading={(level, text) => handleConvertToHeading(block.id, level, text)}
                      onConvertToBlockquote={(text) => handleConvertToBlockquote(block.id, text)}
                      onConvertToCodeBlock={(text) => handleConvertToCodeBlock(block.id, text)}
                      onConvertToDivider={() => handleConvertToDivider(block.id)}
                      onAddListItem={(afterIndex, currentContent) => handleAddListItem(block.id, afterIndex, currentContent)}
                      onUpdateListItem={(itemIndex, content) => handleUpdateListItem(block.id, itemIndex, content)}
                      onRemoveListItem={(itemIndex) => handleRemoveListItem(block.id, itemIndex)}
                      onIndentListItem={(itemIndex) => handleIndentListItem(block.id, itemIndex)}
                      onOutdentListItem={(itemIndex) => handleOutdentListItem(block.id, itemIndex)}
                      onExitList={(itemIndex) => handleExitList(block.id, itemIndex)}
                    />
                  </SortableBlock>
                ))}
              </SortableContext>
            </main>
          </div>
        </div>

        {/* Drag Overlay - shows ghost preview while dragging */}
        <DragOverlay dropAnimation={{
          duration: 200,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}>
          {activeBlock ? (
            <DragOverlayBlock>
              <EditableBlock
                block={activeBlock}
                isSelected={false}
                onSelect={() => {}}
                onUpdate={() => {}}
                onEnter={() => {}}
                onBackspaceEmpty={() => {}}
                onArrowUp={() => {}}
                onArrowDown={() => {}}
              />
            </DragOverlayBlock>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
