'use client';

import { useCallback } from 'react';
import {
  h1,
  h2,
  h3,
  paragraph,
  bulletList,
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
      paragraph('Start writing...'),
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
          />
        ))}
      </main>
    </>
  );
}
