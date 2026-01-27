import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDocument, useBlockEditor, useMarkdown } from '../hooks';
import { paragraph, h1 } from '@create-markdown/core';

describe('useDocument', () => {
  it('should initialize with provided blocks', () => {
    const { result } = renderHook(() => 
      useDocument([paragraph('Hello')])
    );
    
    expect(result.current.blocks).toHaveLength(1);
    expect(result.current.blocks[0].type).toBe('paragraph');
  });

  it('should initialize with empty array', () => {
    const { result } = renderHook(() => useDocument());
    expect(result.current.blocks).toHaveLength(0);
  });

  it('should append block', () => {
    const { result } = renderHook(() => 
      useDocument([paragraph('First')])
    );

    act(() => {
      result.current.appendBlock(paragraph('Second'));
    });

    expect(result.current.blocks).toHaveLength(2);
    expect(result.current.blocks[1].content[0].text).toBe('Second');
  });

  it('should insert block at index', () => {
    const { result } = renderHook(() => 
      useDocument([paragraph('First'), paragraph('Third')])
    );

    act(() => {
      result.current.insertBlock(paragraph('Second'), 1);
    });

    expect(result.current.blocks).toHaveLength(3);
    expect(result.current.blocks[1].content[0].text).toBe('Second');
  });

  it('should remove block by id', () => {
    const { result } = renderHook(() => 
      useDocument([paragraph('Keep'), paragraph('Remove')])
    );
    const blockId = result.current.blocks[1].id;

    act(() => {
      result.current.removeBlock(blockId);
    });

    expect(result.current.blocks).toHaveLength(1);
    expect(result.current.blocks[0].content[0].text).toBe('Keep');
  });

  it('should update block', () => {
    const { result } = renderHook(() => 
      useDocument([paragraph('Original')])
    );
    const blockId = result.current.blocks[0].id;

    act(() => {
      result.current.updateBlock(blockId, {
        content: [{ text: 'Updated', styles: {} }],
      });
    });

    expect(result.current.blocks[0].content[0].text).toBe('Updated');
  });

  it('should move block', () => {
    const { result } = renderHook(() => 
      useDocument([paragraph('First'), paragraph('Second'), paragraph('Third')])
    );
    const blockId = result.current.blocks[2].id;

    act(() => {
      result.current.moveBlock(blockId, 0);
    });

    expect(result.current.blocks[0].content[0].text).toBe('Third');
  });

  it('should set all blocks', () => {
    const { result } = renderHook(() => 
      useDocument([paragraph('Old')])
    );

    act(() => {
      result.current.setBlocks([h1('New'), paragraph('Content')]);
    });

    expect(result.current.blocks).toHaveLength(2);
    expect(result.current.blocks[0].type).toBe('heading');
  });

  it('should clear all blocks', () => {
    const { result } = renderHook(() => 
      useDocument([paragraph('1'), paragraph('2')])
    );

    act(() => {
      result.current.clearBlocks();
    });

    expect(result.current.blocks).toHaveLength(0);
  });

  it('should get markdown with toMarkdown', () => {
    const { result } = renderHook(() => 
      useDocument([h1('Title')])
    );

    expect(result.current.toMarkdown()).toContain('# Title');
  });

  it('should set from markdown with fromMarkdown', () => {
    const { result } = renderHook(() => useDocument());

    act(() => {
      result.current.fromMarkdown('# Hello\n\nWorld');
    });

    expect(result.current.blocks.length).toBeGreaterThan(0);
    expect(result.current.blocks[0].type).toBe('heading');
  });
});

describe('useBlockEditor', () => {
  it('should initialize with no selection', () => {
    const { result } = renderHook(() => {
      const doc = useDocument([paragraph('Hello')]);
      const editor = useBlockEditor(doc);
      return { doc, editor };
    });

    expect(result.current.editor.selectedBlockId).toBe(null);
    expect(result.current.editor.selectedBlock).toBeUndefined();
  });

  it('should select a block', () => {
    const { result } = renderHook(() => {
      const doc = useDocument([paragraph('Hello')]);
      const editor = useBlockEditor(doc);
      return { doc, editor };
    });

    const blockId = result.current.doc.blocks[0].id;

    act(() => {
      result.current.editor.selectBlock(blockId);
    });

    expect(result.current.editor.selectedBlockId).toBe(blockId);
    expect(result.current.editor.selectedBlock).toBeDefined();
  });

  it('should delete selected block', () => {
    const { result } = renderHook(() => {
      const doc = useDocument([paragraph('To delete'), paragraph('Keep')]);
      const editor = useBlockEditor(doc);
      return { doc, editor };
    });

    const blockId = result.current.doc.blocks[0].id;

    act(() => {
      result.current.editor.selectBlock(blockId);
    });

    act(() => {
      result.current.editor.deleteSelected();
    });

    expect(result.current.doc.blocks).toHaveLength(1);
    expect(result.current.doc.blocks[0].content[0].text).toBe('Keep');
  });
});

describe('useMarkdown', () => {
  it('should initialize with markdown', () => {
    const { result } = renderHook(() => useMarkdown('# Hello'));

    expect(result.current.markdown).toBe('# Hello');
    expect(result.current.blocks).toHaveLength(1);
    expect(result.current.blocks[0].type).toBe('heading');
  });

  it('should update markdown', () => {
    const { result } = renderHook(() => useMarkdown('# Hello'));

    act(() => {
      result.current.setMarkdown('## New Heading');
    });

    expect(result.current.markdown).toBe('## New Heading');
    expect(result.current.blocks[0].props.level).toBe(2);
  });

  it('should update blocks and reflect in markdown', () => {
    const { result } = renderHook(() => useMarkdown(''));

    act(() => {
      result.current.setBlocks([h1('Title'), paragraph('Content')]);
    });

    expect(result.current.markdown).toContain('# Title');
    expect(result.current.markdown).toContain('Content');
  });
});
