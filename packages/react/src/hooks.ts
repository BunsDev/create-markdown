/**
 * @create-markdown/react - Hooks
 * State management hooks for document manipulation
 */

import { useState, useCallback, useMemo } from 'react';
import type { Block, Document, DocumentOptions, TextSpan } from '@create-markdown/core';
import {
  createDocument,
  insertBlock,
  appendBlock,
  removeBlock,
  updateBlock,
  moveBlock,
  findBlock,
  getBlockIndex,
  clearBlocks,
  setBlocks,
  updateMeta,
  markdownToBlocks,
  blocksToMarkdown,
} from '@create-markdown/core';

// ============================================================================
// useDocument Hook
// ============================================================================

export interface UseDocumentReturn {
  /** Current document state */
  document: Document;
  /** Blocks in the document */
  blocks: Block[];
  
  // Block operations
  /** Insert: block at a specific index */
  insertBlock: (block: Block, index?: number) => void;
  /** Append: block to the end */
  appendBlock: (block: Block) => void;
  /** Remove: block by ID */
  removeBlock: (blockId: string) => void;
  /** Update: block by ID */
  updateBlock: (blockId: string, updates: Partial<Omit<Block, 'id' | 'type'>>) => void;
  /** Move: block to a new index */
  moveBlock: (blockId: string, newIndex: number) => void;
  /** Find: block by ID */
  findBlock: (blockId: string) => Block | undefined;
  /** Get: index of a block */
  getBlockIndex: (blockId: string) => number;
  
  // Bulk operations
  /** Clear: all blocks */
  clearBlocks: () => void;
  /** Replace: entire document with new blocks */
  setBlocks: (blocks: Block[]) => void;
  /** Set: entire document */
  setDocument: (doc: Document) => void;
  
  // Markdown operations
  /** Get: document as markdown */
  toMarkdown: () => string;
  /** Load: markdown into the document */
  fromMarkdown: (markdown: string) => void;
  
  // Metadata operations
  /** Update: document metadata */
  updateMeta: (meta: Partial<Document['meta']>) => void;
}

/**
 * Hook for managing: document with blocks
 * 
 * @example
 * ```tsx
 * function Editor() {
 *   const { blocks, appendBlock, toMarkdown } = useDocument();
 *   
 *   const addParagraph = () => {
 *     appendBlock(paragraph('New paragraph'));
 *   };
 *   
 *   return (
 *     <div>
 *       <BlockRenderer blocks={blocks} />
 *       <button onClick={addParagraph}>Add Paragraph</button>
 *       <button onClick={() => console.log(toMarkdown())}>Export</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useDocument(
  initialBlocks: Block[] = [],
  options?: DocumentOptions
): UseDocumentReturn {
  const [document, setDocument] = useState<Document>(() =>
    createDocument(initialBlocks, options)
  );
  
  const insert = useCallback((block: Block, index?: number) => {
    setDocument((doc) => insertBlock(doc, block, index));
  }, []);
  
  const append = useCallback((block: Block) => {
    setDocument((doc) => appendBlock(doc, block));
  }, []);
  
  const remove = useCallback((blockId: string) => {
    setDocument((doc) => removeBlock(doc, blockId));
  }, []);
  
  const update = useCallback(
    (blockId: string, updates: Partial<Omit<Block, 'id' | 'type'>>) => {
      setDocument((doc) => updateBlock(doc, blockId, updates));
    },
    []
  );
  
  const move = useCallback((blockId: string, newIndex: number) => {
    setDocument((doc) => moveBlock(doc, blockId, newIndex));
  }, []);
  
  const find = useCallback(
    (blockId: string) => findBlock(document, blockId),
    [document]
  );
  
  const getIndex = useCallback(
    (blockId: string) => getBlockIndex(document, blockId),
    [document]
  );
  
  const clear = useCallback(() => {
    setDocument((doc) => clearBlocks(doc));
  }, []);
  
  const set = useCallback((blocks: Block[]) => {
    setDocument((doc) => setBlocks(doc, blocks));
  }, []);
  
  const toMd = useCallback(() => blocksToMarkdown(document.blocks), [document]);
  
  const fromMd = useCallback((markdown: string) => {
    const blocks = markdownToBlocks(markdown);
    setDocument((doc) => setBlocks(doc, blocks));
  }, []);
  
  const meta = useCallback((newMeta: Partial<Document['meta']>) => {
    setDocument((doc) => updateMeta(doc, newMeta));
  }, []);
  
  return {
    document,
    blocks: document.blocks,
    insertBlock: insert,
    appendBlock: append,
    removeBlock: remove,
    updateBlock: update,
    moveBlock: move,
    findBlock: find,
    getBlockIndex: getIndex,
    clearBlocks: clear,
    setBlocks: set,
    setDocument,
    toMarkdown: toMd,
    fromMarkdown: fromMd,
    updateMeta: meta,
  };
}

// ============================================================================
// useMarkdown Hook
// ============================================================================

export interface UseMarkdownReturn {
  /** Current markdown string */
  markdown: string;
  /** Parsed blocks */
  blocks: Block[];
  /** Update: markdown content */
  setMarkdown: (markdown: string) => void;
  /** Update: blocks (will update markdown too) */
  setBlocks: (blocks: Block[]) => void;
}

/**
 * Hook for bidirectional: markdown/blocks state
 * 
 * @example
 * ```tsx
 * function MarkdownEditor() {
 *   const { markdown, blocks, setMarkdown } = useMarkdown('# Hello');
 *   
 *   return (
 *     <div>
 *       <textarea
 *         value={markdown}
 *         onChange={(e) => setMarkdown(e.target.value)}
 *       />
 *       <BlockRenderer blocks={blocks} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useMarkdown(initialMarkdown: string = ''): UseMarkdownReturn {
  const [markdown, setMarkdownState] = useState(initialMarkdown);
  
  const blocks = useMemo(() => markdownToBlocks(markdown), [markdown]);
  
  const setMarkdown = useCallback((newMarkdown: string) => {
    setMarkdownState(newMarkdown);
  }, []);
  
  const setBlocksFromBlocks = useCallback((newBlocks: Block[]) => {
    const newMarkdown = blocksToMarkdown(newBlocks);
    setMarkdownState(newMarkdown);
  }, []);
  
  return {
    markdown,
    blocks,
    setMarkdown,
    setBlocks: setBlocksFromBlocks,
  };
}

// ============================================================================
// useBlockEditor Hook
// ============================================================================

export interface UseBlockEditorReturn {
  /** Current selected block ID */
  selectedBlockId: string | null;
  /** Current selected block */
  selectedBlock: Block | undefined;
  /** Select: block by ID */
  selectBlock: (blockId: string | null) => void;
  /** Select: next block */
  selectNext: () => void;
  /** Select: previous block */
  selectPrevious: () => void;
  /** Delete: selected block */
  deleteSelected: () => void;
  /** Update: selected block's content */
  updateSelectedContent: (content: TextSpan[]) => void;
  /** Duplicate: selected block */
  duplicateSelected: () => void;
  /** Move: selected block up */
  moveSelectedUp: () => void;
  /** Move: selected block down */
  moveSelectedDown: () => void;
}

/**
 * Hook for: block selection and editing operations
 * 
 * @example
 * ```tsx
 * function Editor() {
 *   const doc = useDocument();
 *   const editor = useBlockEditor(doc);
 *   
 *   return (
 *     <div>
 *       {doc.blocks.map((block) => (
 *         <div
 *           key={block.id}
 *           onClick={() => editor.selectBlock(block.id)}
 *           style={{
 *             border: editor.selectedBlockId === block.id ? '2px solid blue' : 'none'
 *           }}
 *         >
 *           <BlockElement block={block} />
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useBlockEditor(
  documentHook: UseDocumentReturn
): UseBlockEditorReturn {
  const { document, blocks, removeBlock, updateBlock, moveBlock, insertBlock } =
    documentHook;
  
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  
  const selectedBlock = useMemo(
    () => (selectedBlockId ? findBlock(document, selectedBlockId) : undefined),
    [document, selectedBlockId]
  );
  
  const selectBlock = useCallback((blockId: string | null) => {
    setSelectedBlockId(blockId);
  }, []);
  
  const selectNext = useCallback(() => {
    if (!selectedBlockId) {
      if (blocks.length > 0) {
        setSelectedBlockId(blocks[0].id);
      }
      return;
    }
    
    const currentIndex = getBlockIndex(document, selectedBlockId);
    if (currentIndex < blocks.length - 1) {
      setSelectedBlockId(blocks[currentIndex + 1].id);
    }
  }, [document, blocks, selectedBlockId]);
  
  const selectPrevious = useCallback(() => {
    if (!selectedBlockId) {
      if (blocks.length > 0) {
        setSelectedBlockId(blocks[blocks.length - 1].id);
      }
      return;
    }
    
    const currentIndex = getBlockIndex(document, selectedBlockId);
    if (currentIndex > 0) {
      setSelectedBlockId(blocks[currentIndex - 1].id);
    }
  }, [document, blocks, selectedBlockId]);
  
  const deleteSelected = useCallback(() => {
    if (!selectedBlockId) return;
    
    const currentIndex = getBlockIndex(document, selectedBlockId);
    removeBlock(selectedBlockId);
    
    // Select next block or previous if at end
    if (blocks.length > 1) {
      if (currentIndex < blocks.length - 1) {
        setSelectedBlockId(blocks[currentIndex + 1].id);
      } else if (currentIndex > 0) {
        setSelectedBlockId(blocks[currentIndex - 1].id);
      }
    } else {
      setSelectedBlockId(null);
    }
  }, [document, blocks, selectedBlockId, removeBlock]);
  
  const updateSelectedContent = useCallback(
    (content: TextSpan[]) => {
      if (!selectedBlockId) return;
      updateBlock(selectedBlockId, { content });
    },
    [selectedBlockId, updateBlock]
  );
  
  const duplicateSelected = useCallback(() => {
    if (!selectedBlockId || !selectedBlock) return;
    
    const currentIndex = getBlockIndex(document, selectedBlockId);
    const clonedBlock: Block = {
      ...selectedBlock,
      id: Math.random().toString(36).substring(2, 9),
    };
    
    insertBlock(clonedBlock, currentIndex + 1);
    setSelectedBlockId(clonedBlock.id);
  }, [document, selectedBlockId, selectedBlock, insertBlock]);
  
  const moveSelectedUp = useCallback(() => {
    if (!selectedBlockId) return;
    
    const currentIndex = getBlockIndex(document, selectedBlockId);
    if (currentIndex > 0) {
      moveBlock(selectedBlockId, currentIndex - 1);
    }
  }, [document, selectedBlockId, moveBlock]);
  
  const moveSelectedDown = useCallback(() => {
    if (!selectedBlockId) return;
    
    const currentIndex = getBlockIndex(document, selectedBlockId);
    if (currentIndex < blocks.length - 1) {
      moveBlock(selectedBlockId, currentIndex + 1);
    }
  }, [document, blocks, selectedBlockId, moveBlock]);
  
  return {
    selectedBlockId,
    selectedBlock,
    selectBlock,
    selectNext,
    selectPrevious,
    deleteSelected,
    updateSelectedContent,
    duplicateSelected,
    moveSelectedUp,
    moveSelectedDown,
  };
}
