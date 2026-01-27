import { describe, it, expect } from 'vitest';
import { parse, markdownToBlocks, markdownToDocument } from '../parsers/markdown';

describe('Markdown Parser', () => {
  describe('parse', () => {
    it('should parse headings', () => {
      const blocks = parse('# Heading 1\n\n## Heading 2');
      expect(blocks).toHaveLength(2);
      expect(blocks[0].type).toBe('heading');
      expect(blocks[0].props.level).toBe(1);
      expect(blocks[1].props.level).toBe(2);
    });

    it('should parse paragraphs', () => {
      const blocks = parse('This is a paragraph.\n\nThis is another.');
      expect(blocks).toHaveLength(2);
      expect(blocks[0].type).toBe('paragraph');
      expect(blocks[1].type).toBe('paragraph');
    });

    it('should parse bullet lists', () => {
      const blocks = parse('- Item 1\n- Item 2\n- Item 3');
      expect(blocks).toHaveLength(1);
      expect(blocks[0].type).toBe('bulletList');
      expect(blocks[0].children).toHaveLength(3);
    });

    it('should parse numbered lists', () => {
      const blocks = parse('1. First\n2. Second\n3. Third');
      expect(blocks).toHaveLength(1);
      expect(blocks[0].type).toBe('numberedList');
      expect(blocks[0].children).toHaveLength(3);
    });

    it('should parse code blocks', () => {
      const blocks = parse('```javascript\nconst x = 1;\n```');
      expect(blocks).toHaveLength(1);
      expect(blocks[0].type).toBe('codeBlock');
      expect(blocks[0].props.language).toBe('javascript');
    });

    it('should parse blockquotes', () => {
      const blocks = parse('> This is a quote');
      expect(blocks).toHaveLength(1);
      expect(blocks[0].type).toBe('blockquote');
    });

    it('should parse horizontal rules', () => {
      const blocks = parse('---');
      expect(blocks).toHaveLength(1);
      expect(blocks[0].type).toBe('divider');
    });

    it('should parse images', () => {
      const blocks = parse('![Alt text](https://example.com/image.png)');
      expect(blocks).toHaveLength(1);
      expect(blocks[0].type).toBe('image');
      expect(blocks[0].props.url).toBe('https://example.com/image.png');
    });

    it('should handle empty input', () => {
      const blocks = parse('');
      expect(blocks).toHaveLength(0);
    });

    it('should handle mixed content', () => {
      const markdown = `# Title

This is a paragraph with **bold** text.

- List item 1
- List item 2

\`\`\`
code
\`\`\`
`;
      const blocks = parse(markdown);
      expect(blocks.length).toBeGreaterThan(0);
      expect(blocks[0].type).toBe('heading');
    });
  });

  describe('markdownToBlocks', () => {
    it('should produce equivalent structure to parse', () => {
      const markdown = '# Hello';
      const blocks1 = markdownToBlocks(markdown);
      const blocks2 = parse(markdown);
      // Compare structure (not IDs since they're randomly generated)
      expect(blocks1.length).toBe(blocks2.length);
      expect(blocks1[0].type).toBe(blocks2[0].type);
      expect(blocks1[0].props).toEqual(blocks2[0].props);
      expect(blocks1[0].content).toEqual(blocks2[0].content);
    });
  });

  describe('markdownToDocument', () => {
    it('should return a document with blocks', () => {
      const doc = markdownToDocument('# Hello\n\nWorld');
      expect(doc.version).toBeDefined();
      expect(doc.blocks).toHaveLength(2);
      expect(doc.meta).toBeDefined();
    });
  });
});

describe('Inline Parsing', () => {
  it('should parse bold text', () => {
    const blocks = parse('This is **bold** text');
    expect(blocks[0].content.some(s => s.styles.bold)).toBe(true);
  });

  it('should parse italic text', () => {
    const blocks = parse('This is *italic* text');
    expect(blocks[0].content.some(s => s.styles.italic)).toBe(true);
  });

  it('should parse inline code', () => {
    const blocks = parse('Use the `code` function');
    expect(blocks[0].content.some(s => s.styles.code)).toBe(true);
  });

  it('should parse links', () => {
    const blocks = parse('Visit [example](https://example.com)');
    expect(blocks[0].content.some(s => s.styles.link?.url === 'https://example.com')).toBe(true);
  });

  it('should parse strikethrough', () => {
    const blocks = parse('This is ~~deleted~~ text');
    expect(blocks[0].content.some(s => s.styles.strikethrough)).toBe(true);
  });

  it('should parse highlight', () => {
    const blocks = parse('This is ==highlighted== text');
    expect(blocks[0].content.some(s => s.styles.highlight)).toBe(true);
  });
});
