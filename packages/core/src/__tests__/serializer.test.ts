import { describe, it, expect } from 'vitest';
import { stringify, blocksToMarkdown, documentToMarkdown } from '../serializers/markdown';
import { 
  h1, 
  h2, 
  paragraph, 
  bulletList, 
  numberedList, 
  codeBlock, 
  blockquote,
  divider,
  image,
  callout,
  bold,
  italic,
  code,
  link,
  spans,
  text,
} from '../core/blocks';
import { createDocument } from '../core/document';

describe('Markdown Serializer', () => {
  describe('stringify', () => {
    it('should serialize headings', () => {
      const blocks = [h1('Title'), h2('Subtitle')];
      const md = stringify(blocks);
      expect(md).toContain('# Title');
      expect(md).toContain('## Subtitle');
    });

    it('should serialize paragraphs', () => {
      const blocks = [paragraph('Hello, world!')];
      const md = stringify(blocks);
      expect(md).toBe('Hello, world!');
    });

    it('should serialize bullet lists', () => {
      const blocks = [bulletList(['Item 1', 'Item 2'])];
      const md = stringify(blocks);
      expect(md).toContain('- Item 1');
      expect(md).toContain('- Item 2');
    });

    it('should serialize numbered lists', () => {
      const blocks = [numberedList(['First', 'Second'])];
      const md = stringify(blocks);
      expect(md).toContain('1. First');
      expect(md).toContain('2. Second');
    });

    it('should serialize code blocks', () => {
      const blocks = [codeBlock('const x = 1;', 'javascript')];
      const md = stringify(blocks);
      expect(md).toContain('```javascript');
      expect(md).toContain('const x = 1;');
      expect(md).toContain('```');
    });

    it('should serialize blockquotes', () => {
      const blocks = [blockquote('A quote')];
      const md = stringify(blocks);
      expect(md).toContain('> A quote');
    });

    it('should serialize dividers', () => {
      const blocks = [divider()];
      const md = stringify(blocks);
      expect(md).toBe('---');
    });

    it('should serialize images', () => {
      const blocks = [image('https://example.com/img.png', 'Alt text')];
      const md = stringify(blocks);
      expect(md).toContain('![Alt text](https://example.com/img.png)');
    });

    it('should serialize callouts', () => {
      const blocks = [callout('warning', 'Be careful!')];
      const md = stringify(blocks);
      expect(md).toContain('[!WARNING]');
      expect(md).toContain('Be careful!');
    });

    it('should handle empty blocks array', () => {
      const md = stringify([]);
      expect(md).toBe('');
    });
  });

  describe('Inline styles serialization', () => {
    it('should serialize bold text', () => {
      const blocks = [paragraph(spans(text('Hello '), bold('world')))];
      const md = stringify(blocks);
      expect(md).toContain('**world**');
    });

    it('should serialize italic text', () => {
      const blocks = [paragraph(spans(text('Hello '), italic('world')))];
      const md = stringify(blocks);
      expect(md).toContain('*world*');
    });

    it('should serialize inline code', () => {
      const blocks = [paragraph(spans(text('Use '), code('function')))];
      const md = stringify(blocks);
      expect(md).toContain('`function`');
    });

    it('should serialize links', () => {
      const blocks = [paragraph(spans(link('click here', 'https://example.com')))];
      const md = stringify(blocks);
      expect(md).toContain('[click here](https://example.com)');
    });
  });

  describe('blocksToMarkdown', () => {
    it('should be equivalent to stringify', () => {
      const blocks = [h1('Title'), paragraph('Content')];
      expect(blocksToMarkdown(blocks)).toBe(stringify(blocks));
    });
  });

  describe('documentToMarkdown', () => {
    it('should serialize a document', () => {
      const doc = createDocument([h1('Title'), paragraph('Content')]);
      const md = documentToMarkdown(doc);
      expect(md).toContain('# Title');
      expect(md).toContain('Content');
    });
  });
});

describe('Round-trip', () => {
  it('should round-trip simple markdown', () => {
    const original = [
      h1('Hello World'),
      paragraph('This is a test.'),
    ];
    const md = stringify(original);
    expect(md).toContain('# Hello World');
    expect(md).toContain('This is a test.');
  });
});
