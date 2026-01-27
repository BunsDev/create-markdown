import { describe, it, expect } from 'vitest';
import {
  createDocument,
  emptyDocument,
  appendBlock,
  insertBlock,
  removeBlock,
  updateBlock,
  moveBlock,
  findBlock,
  getBlockIndex,
  getBlockCount,
  isEmpty,
  clearBlocks,
  setBlocks,
} from '../core/document';
import { paragraph, h1 } from '../core/blocks';

describe('Document Management', () => {
  describe('createDocument', () => {
    it('should create document with blocks', () => {
      const blocks = [h1('Title'), paragraph('Content')];
      const doc = createDocument(blocks);
      expect(doc.version).toBeDefined();
      expect(doc.blocks).toHaveLength(2);
      expect(doc.meta.createdAt).toBeDefined();
    });

    it('should create empty document', () => {
      const doc = createDocument();
      expect(doc.blocks).toHaveLength(0);
    });
  });

  describe('emptyDocument', () => {
    it('should create empty document', () => {
      const doc = emptyDocument();
      expect(doc.blocks).toHaveLength(0);
    });
  });

  describe('appendBlock', () => {
    it('should append block to end', () => {
      let doc = createDocument([paragraph('First')]);
      doc = appendBlock(doc, paragraph('Second'));
      expect(doc.blocks).toHaveLength(2);
      expect(doc.blocks[1].content[0].text).toBe('Second');
    });
  });

  describe('insertBlock', () => {
    it('should insert block at index', () => {
      let doc = createDocument([paragraph('First'), paragraph('Third')]);
      doc = insertBlock(doc, paragraph('Second'), 1);
      expect(doc.blocks).toHaveLength(3);
      expect(doc.blocks[1].content[0].text).toBe('Second');
    });

    it('should insert at end if no index', () => {
      let doc = createDocument([paragraph('First')]);
      doc = insertBlock(doc, paragraph('Last'));
      expect(doc.blocks[doc.blocks.length - 1].content[0].text).toBe('Last');
    });
  });

  describe('removeBlock', () => {
    it('should remove block by id', () => {
      const block = paragraph('To remove');
      let doc = createDocument([paragraph('Keep'), block]);
      const blockId = doc.blocks[1].id;
      doc = removeBlock(doc, blockId);
      expect(doc.blocks).toHaveLength(1);
    });

    it('should not modify document if id not found', () => {
      const doc = createDocument([paragraph('Content')]);
      const result = removeBlock(doc, 'nonexistent');
      expect(result).toBe(doc);
    });
  });

  describe('updateBlock', () => {
    it('should update block content', () => {
      let doc = createDocument([paragraph('Original')]);
      const blockId = doc.blocks[0].id;
      doc = updateBlock(doc, blockId, { content: [{ text: 'Updated', styles: {} }] });
      expect(doc.blocks[0].content[0].text).toBe('Updated');
    });

    it('should not modify document if id not found', () => {
      const doc = createDocument([paragraph('Content')]);
      const result = updateBlock(doc, 'nonexistent', { content: [] });
      expect(result).toBe(doc);
    });
  });

  describe('moveBlock', () => {
    it('should move block to new position', () => {
      let doc = createDocument([
        paragraph('First'),
        paragraph('Second'),
        paragraph('Third'),
      ]);
      const blockId = doc.blocks[2].id;
      doc = moveBlock(doc, blockId, 0);
      expect(doc.blocks[0].content[0].text).toBe('Third');
    });
  });

  describe('findBlock', () => {
    it('should find block by id', () => {
      const doc = createDocument([paragraph('Content')]);
      const blockId = doc.blocks[0].id;
      const found = findBlock(doc, blockId);
      expect(found).toBeDefined();
      expect(found?.content[0].text).toBe('Content');
    });

    it('should return undefined if not found', () => {
      const doc = createDocument([paragraph('Content')]);
      const found = findBlock(doc, 'nonexistent');
      expect(found).toBeUndefined();
    });
  });

  describe('getBlockIndex', () => {
    it('should return block index', () => {
      const doc = createDocument([paragraph('First'), paragraph('Second')]);
      const blockId = doc.blocks[1].id;
      expect(getBlockIndex(doc, blockId)).toBe(1);
    });

    it('should return -1 if not found', () => {
      const doc = createDocument([paragraph('Content')]);
      expect(getBlockIndex(doc, 'nonexistent')).toBe(-1);
    });
  });

  describe('getBlockCount', () => {
    it('should return number of blocks', () => {
      const doc = createDocument([paragraph('1'), paragraph('2'), paragraph('3')]);
      expect(getBlockCount(doc)).toBe(3);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty document', () => {
      const doc = emptyDocument();
      expect(isEmpty(doc)).toBe(true);
    });

    it('should return false for non-empty document', () => {
      const doc = createDocument([paragraph('Content')]);
      expect(isEmpty(doc)).toBe(false);
    });
  });

  describe('clearBlocks', () => {
    it('should remove all blocks', () => {
      let doc = createDocument([paragraph('1'), paragraph('2')]);
      doc = clearBlocks(doc);
      expect(doc.blocks).toHaveLength(0);
    });
  });

  describe('setBlocks', () => {
    it('should replace all blocks', () => {
      let doc = createDocument([paragraph('Old')]);
      doc = setBlocks(doc, [h1('New'), paragraph('Content')]);
      expect(doc.blocks).toHaveLength(2);
      expect(doc.blocks[0].type).toBe('heading');
    });
  });
});
