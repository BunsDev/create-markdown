'use client';

import { useCallback } from 'react';
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
} from '../../dist/index.js';
import {
  useDocument,
  useBlockEditor,
} from '../../dist/react/index.js';
import { Toolbar, type BlockTypeOption } from './components/toolbar';
import { EditableBlock } from './components/editable-block';
import type { Block, TextSpan } from '../../dist/index.js';

// ============================================================================
// Initial Content
// ============================================================================

const INITIAL_BLOCKS: Block[] = [
  h1('Welcome to create-markdown'),
  paragraph(spans(
    text('Click anywhere to start editing. This is a '),
    bold('WYSIWYG'),
    text(' block-based editor built with '),
    italic('zero dependencies'),
    text('.')
  )),
  h2('Features'),
  bulletList([
    'Click any block to edit it directly',
    'Press Enter to create new paragraphs',
    'Use Cmd+B for bold, Cmd+I for italic',
    'Toggle between dark and light themes',
    'Export your document as markdown',
  ]),
  h2('Markdown Shortcuts'),
  paragraph(spans(
    text('Type markdown syntax and watch it render live:')
  )),
  bulletList([
    '# Heading 1, ## Heading 2, ### Heading 3',
    '- or * for bullet lists, 1. for numbered lists',
    '> for blockquotes, ``` for code blocks',
    '--- for dividers',
    '**bold**, *italic*, `code`, ~~strikethrough~~, ==highlight==',
  ]),
  h2('Try it out!'),
  paragraph(spans(
    text('Edit this text, add new blocks, or try the formatting toolbar above.')
  )),
  blockquote('This is a blockquote. Click to edit!'),
  codeBlock('function hello() { console.log("Hello, create-markdown!"); }', 'javascript'),
  divider(),
  paragraph(spans(
    text('Enchanted by '),
    { text: 'BunsDev', styles: { bold: true, link: { url: 'https://buns.dev', title: 'Buns' } } },
    text(' with '),
    bold('love'),
    text(' for the markdown community.')
  )),
];

// ============================================================================
// Main Editor Component
// ============================================================================

export default function Editor() {
  const doc = useDocument(INITIAL_BLOCKS);
  const editor = useBlockEditor(doc);

  // Handle inline formatting
  const handleFormat = useCallback((format: 'bold' | 'italic' | 'code' | 'link') => {
    // For a full implementation, we'd apply formatting to the selection
    // This is a simplified version that works with the document API
    console.log('Format:', format);
  }, []);

  // Handle block type conversion
  const handleBlockType = useCallback((type: BlockTypeOption) => {
    if (!editor.selectedBlockId) {
      // No selection, add a new block
      switch (type) {
        case 'h1':
          doc.appendBlock(h1(''));
          break;
        case 'h2':
          doc.appendBlock(h2(''));
          break;
        case 'h3':
          doc.appendBlock(h3(''));
          break;
        case 'quote':
          doc.appendBlock(blockquote(''));
          break;
        case 'bullet':
          doc.appendBlock(bulletList(['']));
          break;
        case 'code':
          doc.appendBlock(codeBlock(''));
          break;
        default:
          doc.appendBlock(paragraph(''));
      }
      return;
    }

    // Convert selected block
    const block = editor.selectedBlock;
    if (!block) return;

    const content = block.content;
    let newBlock: Block;

    switch (type) {
      case 'h1':
        newBlock = { ...h1(''), id: block.id, content };
        break;
      case 'h2':
        newBlock = { ...h2(''), id: block.id, content };
        break;
      case 'h3':
        newBlock = { ...h3(''), id: block.id, content };
        break;
      case 'quote':
        newBlock = { ...blockquote(''), id: block.id, content };
        break;
      case 'bullet':
        newBlock = bulletList([content.map(s => s.text).join('')]);
        newBlock.id = block.id;
        break;
      case 'code':
        newBlock = codeBlock(content.map(s => s.text).join(''));
        newBlock.id = block.id;
        break;
      default:
        newBlock = { ...paragraph(''), id: block.id, content };
    }

    const index = doc.getBlockIndex(block.id);
    doc.removeBlock(block.id);
    doc.insertBlock(newBlock, index);
    editor.selectBlock(newBlock.id);
  }, [editor.selectedBlockId, editor.selectedBlock, doc]);

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
  const handleAddListItem = useCallback((blockId: string, afterItemIndex: number) => {
    const block = doc.blocks.find((b) => b.id === blockId);
    if (!block || !block.children) return;

    // Create new children array with empty paragraph item inserted
    const newChildren = [...block.children];
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

  return (
    <>
      <Toolbar
        onFormat={handleFormat}
        onBlockType={handleBlockType}
        onExport={handleExport}
        onClear={handleClear}
        blockCount={doc.blocks.length}
      />

      <main className="editor-canvas" style={{ marginTop: '56px' }}>
        {doc.blocks.map((block) => (
          <EditableBlock
            key={block.id}
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
            onAddListItem={(afterIndex) => handleAddListItem(block.id, afterIndex)}
            onUpdateListItem={(itemIndex, content) => handleUpdateListItem(block.id, itemIndex, content)}
            onRemoveListItem={(itemIndex) => handleRemoveListItem(block.id, itemIndex)}
            onIndentListItem={(itemIndex) => handleIndentListItem(block.id, itemIndex)}
            onOutdentListItem={(itemIndex) => handleOutdentListItem(block.id, itemIndex)}
          />
        ))}
      </main>
    </>
  );
}
