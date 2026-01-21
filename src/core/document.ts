/**
 * create-markdown - Document Management
 * Create and manipulate document structures
 */

import type {
  Block,
  BlockType,
  Document,
  DocumentMeta,
  DocumentOptions,
  TextSpan,
} from '../types';
import { deepClone, deepCloneBlocks } from './utils';

// ============================================================================
// Document Version
// ============================================================================

/**
 * Current document schema version
 */
export const DOCUMENT_VERSION = 1;

// ============================================================================
// Document Creation
// ============================================================================

/**
 * Creates: new document with optional initial blocks and metadata
 */
export function createDocument(
    blocks: Block[] = [],
    options: DocumentOptions = {}
): Document {
    const { meta = {} } = options;

    return {
        version: DOCUMENT_VERSION,
        blocks: deepCloneBlocks(blocks, false),
        meta: {
            createdAt: new Date(),
            updatedAt: new Date(),
            ...meta,
        },
    };
}

/**
 * Creates: empty document
 */
export function emptyDocument(options: DocumentOptions = {}): Document {
    return createDocument([], options);
}

/**
 * Clones: document with new IDs for all blocks
 */
export function cloneDocument(doc: Document): Document {
    return {
        version: doc.version,
        blocks: deepCloneBlocks(doc.blocks, true),
        meta: {
            ...doc.meta,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    };
}

// ============================================================================
// Block CRUD Operations
// ============================================================================

/**
 * Inserts: block at the specified index
 * If index is not provided, appends to the end
 */
export function insertBlock(
    doc: Document,
    block: Block,
    index?: number
): Document {
    const newBlocks = [...doc.blocks];
    const insertIndex = index ?? newBlocks.length;

    newBlocks.splice(insertIndex, 0, deepClone(block, false));

    return {
        ...doc,
        blocks: newBlocks,
        meta: {
            ...doc.meta,
            updatedAt: new Date(),
        },
    };
}

/**
 * Appends: block to the end of the document
 */
export function appendBlock(doc: Document, block: Block): Document {
    return insertBlock(doc, block);
}

/**
 * Prepends: block to the beginning of the document
 */
export function prependBlock(doc: Document, block: Block): Document {
    return insertBlock(doc, block, 0);
}

/**
 * Inserts: multiple blocks at the specified index
 */
export function insertBlocks(
    doc: Document,
    blocks: Block[],
    index?: number
): Document {
    const newBlocks = [...doc.blocks];
    const insertIndex = index ?? newBlocks.length;

    newBlocks.splice(insertIndex, 0, ...deepCloneBlocks(blocks, false));

    return {
        ...doc,
        blocks: newBlocks,
        meta: {
            ...doc.meta,
            updatedAt: new Date(),
        },
    };
}

/**
 * Removes: block by its ID
 */
export function removeBlock(doc: Document, blockId: string): Document {
    const newBlocks = doc.blocks.filter((block) => block.id !== blockId);

    // If no blocks were removed, return the original document
    if (newBlocks.length === doc.blocks.length) {
        return doc;
    }

    return {
        ...doc,
        blocks: newBlocks,
        meta: {
            ...doc.meta,
            updatedAt: new Date(),
        },
    };
}

/**
 * Removes: multiple blocks by their IDs
 */
export function removeBlocks(doc: Document, blockIds: string[]): Document {
    const idSet = new Set(blockIds);
    const newBlocks = doc.blocks.filter((block) => !idSet.has(block.id));

    if (newBlocks.length === doc.blocks.length) {
        return doc;
    }

    return {
        ...doc,
        blocks: newBlocks,
        meta: {
            ...doc.meta,
            updatedAt: new Date(),
        },
    };
}

/**
 * Updates: block by its ID with partial updates
 */
export function updateBlock<T extends BlockType>(
    doc: Document,
    blockId: string,
    updates: Partial<Omit<Block<T>, 'id' | 'type'>>
): Document {
    const blockIndex = doc.blocks.findIndex((block) => block.id === blockId);

    if (blockIndex === -1) {
        return doc;
    }

    const newBlocks = [...doc.blocks];
    const existingBlock = newBlocks[blockIndex];

    newBlocks[blockIndex] = {
        ...existingBlock,
        ...updates,
        id: existingBlock.id,
        type: existingBlock.type,
        content: updates.content ?? existingBlock.content,
        children: updates.children ?? existingBlock.children,
        props: updates.props
            ? { ...existingBlock.props, ...updates.props }
            : existingBlock.props,
    };

    return {
        ...doc,
        blocks: newBlocks,
        meta: {
            ...doc.meta,
            updatedAt: new Date(),
        },
    };
}

/**
 * Replaces: block entirely by its ID
 */
export function replaceBlock(
    doc: Document,
    blockId: string,
    newBlock: Block
): Document {
    const blockIndex = doc.blocks.findIndex((block) => block.id === blockId);

    if (blockIndex === -1) {
        return doc;
    }

    const newBlocks = [...doc.blocks];
    newBlocks[blockIndex] = deepClone(newBlock, false);

    return {
        ...doc,
        blocks: newBlocks,
        meta: {
            ...doc.meta,
            updatedAt: new Date(),
        },
    };
}

/**
 * Moves: block to a new position
 */
export function moveBlock(
    doc: Document,
    blockId: string,
    newIndex: number
): Document {
    const currentIndex = doc.blocks.findIndex((block) => block.id === blockId);

    if (currentIndex === -1) {
        return doc;
    }

    // Clamp new index to valid range
    const targetIndex = Math.max(0, Math.min(newIndex, doc.blocks.length - 1));

    if (currentIndex === targetIndex) {
        return doc;
    }

    const newBlocks = [...doc.blocks];
    const [movedBlock] = newBlocks.splice(currentIndex, 1);
    newBlocks.splice(targetIndex, 0, movedBlock);

    return {
        ...doc,
        blocks: newBlocks,
        meta: {
            ...doc.meta,
            updatedAt: new Date(),
        },
    };
}

/**
 * Swaps: two blocks by their IDs
 */
export function swapBlocks(
    doc: Document,
    blockId1: string,
    blockId2: string
): Document {
    const index1 = doc.blocks.findIndex((block) => block.id === blockId1);
    const index2 = doc.blocks.findIndex((block) => block.id === blockId2);

    if (index1 === -1 || index2 === -1 || index1 === index2) {
        return doc;
    }

    const newBlocks = [...doc.blocks];
    [newBlocks[index1], newBlocks[index2]] = [newBlocks[index2], newBlocks[index1]];

    return {
        ...doc,
        blocks: newBlocks,
        meta: {
            ...doc.meta,
            updatedAt: new Date(),
        },
    };
}

// ============================================================================
// Block Query Operations
// ============================================================================

/**
 * Finds: block by its ID
 */
export function findBlock(doc: Document, blockId: string): Block | undefined {
    return doc.blocks.find((block) => block.id === blockId);
}

/**
 * Finds: index of a block by its ID
 */
export function getBlockIndex(doc: Document, blockId: string): number {
    return doc.blocks.findIndex((block) => block.id === blockId);
}

/**
 * Gets: block at the specified index
 */
export function getBlockAt(doc: Document, index: number): Block | undefined {
    return doc.blocks[index];
}

/**
 * Gets: first block in the document
 */
export function getFirstBlock(doc: Document): Block | undefined {
    return doc.blocks[0];
}

/**
 * Gets: last block in the document
 */
export function getLastBlock(doc: Document): Block | undefined {
    return doc.blocks[doc.blocks.length - 1];
}

/**
 * Finds: all blocks of a specific type
 */
export function findBlocksByType<T extends BlockType>(
    doc: Document,
    type: T
): Block<T>[] {
    return doc.blocks.filter((block) => block.type === type) as Block<T>[];
}

/**
 * Checks: if the document contains a block with the given ID
 */
export function hasBlock(doc: Document, blockId: string): boolean {
    return doc.blocks.some((block) => block.id === blockId);
}

/**
 * Gets: total number of blocks in the document
 */
export function getBlockCount(doc: Document): number {
    return doc.blocks.length;
}

/**
 * Checks: if the document is empty
 */
export function isEmpty(doc: Document): boolean {
    return doc.blocks.length === 0;
}

// ============================================================================
// Content Operations
// ============================================================================

/**
 * Updates: content of a specific block
 */
export function setBlockContent(
    doc: Document,
    blockId: string,
    content: TextSpan[]
): Document {
    return updateBlock(doc, blockId, { content });
}

/**
 * Appends: content to a specific block
 */
export function appendBlockContent(
    doc: Document,
    blockId: string,
    content: TextSpan[]
): Document {
    const block = findBlock(doc, blockId);
    if (!block) return doc;

    return updateBlock(doc, blockId, {
        content: [...block.content, ...content],
    });
}

// ============================================================================
// Metadata Operations
// ============================================================================

/**
 * Updates: document metadata
 */
export function updateMeta(
    doc: Document,
    meta: Partial<DocumentMeta>
): Document {
    return {
        ...doc,
        meta: {
            ...doc.meta,
            ...meta,
            updatedAt: new Date(),
        },
    };
}

/**
 * Sets: specific metadata field
 */
export function setMetaField(
    doc: Document,
    key: string,
    value: unknown
): Document {
    return updateMeta(doc, { [key]: value });
}

/**
 * Gets: specific metadata field
 */
export function getMetaField<T = unknown>(
    doc: Document,
    key: string
): T | undefined {
    return doc.meta[key] as T | undefined;
}

// ============================================================================
// Bulk Operations
// ============================================================================

/**
 * Clears: all blocks from the document
 */
export function clearBlocks(doc: Document): Document {
    return {
        ...doc,
        blocks: [],
        meta: {
            ...doc.meta,
            updatedAt: new Date(),
        },
    };
}

/**
 * Replaces: all blocks in the document
 */
export function setBlocks(doc: Document, blocks: Block[]): Document {
    return {
        ...doc,
        blocks: deepCloneBlocks(blocks, false),
        meta: {
            ...doc.meta,
            updatedAt: new Date(),
        },
    };
}

/**
 * Filters: blocks based on a predicate
 */
export function filterBlocks(
    doc: Document,
    predicate: (block: Block, index: number) => boolean
): Document {
    const newBlocks = doc.blocks.filter(predicate);

    if (newBlocks.length === doc.blocks.length) {
        return doc;
    }

    return {
        ...doc,
        blocks: newBlocks,
        meta: {
            ...doc.meta,
            updatedAt: new Date(),
        },
    };
}

/**
 * Maps: over all blocks and transforms them
 */
export function mapBlocks(
    doc: Document,
    transform: (block: Block, index: number) => Block
): Document {
    return {
        ...doc,
        blocks: doc.blocks.map(transform),
        meta: {
            ...doc.meta,
            updatedAt: new Date(),
        },
    };
}
