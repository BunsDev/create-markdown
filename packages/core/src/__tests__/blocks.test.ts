import { describe, it, expect } from 'vitest';
import {
  paragraph,
  heading,
  h1,
  h2,
  h3,
  bulletList,
  numberedList,
  codeBlock,
  blockquote,
  divider,
  image,
  callout,
  table,
  text,
  bold,
  italic,
  code,
  link,
  spans,
} from '../core/blocks';

describe('Block Factories', () => {
  describe('paragraph', () => {
    it('should create a paragraph with string content', () => {
      const block = paragraph('Hello, world!');
      expect(block.type).toBe('paragraph');
      expect(block.content).toHaveLength(1);
      expect(block.content[0].text).toBe('Hello, world!');
    });

    it('should create a paragraph with TextSpan array', () => {
      const block = paragraph([bold('Bold'), text(' and '), italic('italic')]);
      expect(block.type).toBe('paragraph');
      expect(block.content).toHaveLength(3);
      expect(block.content[0].styles.bold).toBe(true);
      expect(block.content[2].styles.italic).toBe(true);
    });
  });

  describe('heading', () => {
    it('should create headings with correct levels', () => {
      expect(h1('Title').props.level).toBe(1);
      expect(h2('Title').props.level).toBe(2);
      expect(h3('Title').props.level).toBe(3);
    });

    it('should create heading with content', () => {
      const block = heading(2, 'My Heading');
      expect(block.type).toBe('heading');
      expect(block.props.level).toBe(2);
      expect(block.content[0].text).toBe('My Heading');
    });
  });

  describe('lists', () => {
    it('should create bullet list with string items', () => {
      const block = bulletList(['Item 1', 'Item 2', 'Item 3']);
      expect(block.type).toBe('bulletList');
      expect(block.children).toHaveLength(3);
      expect(block.children[0].content[0].text).toBe('Item 1');
    });

    it('should create numbered list with string items', () => {
      const block = numberedList(['First', 'Second']);
      expect(block.type).toBe('numberedList');
      expect(block.children).toHaveLength(2);
    });
  });

  describe('codeBlock', () => {
    it('should create code block with language', () => {
      const block = codeBlock('const x = 1;', 'typescript');
      expect(block.type).toBe('codeBlock');
      expect(block.props.language).toBe('typescript');
      expect(block.content[0].text).toBe('const x = 1;');
    });

    it('should create code block without language', () => {
      const block = codeBlock('plain text');
      expect(block.props.language).toBeUndefined();
    });
  });

  describe('blockquote', () => {
    it('should create blockquote with string content', () => {
      const block = blockquote('A wise quote');
      expect(block.type).toBe('blockquote');
      expect(block.content[0].text).toBe('A wise quote');
    });
  });

  describe('divider', () => {
    it('should create divider with no content', () => {
      const block = divider();
      expect(block.type).toBe('divider');
      expect(block.content).toHaveLength(0);
    });
  });

  describe('image', () => {
    it('should create image with URL and alt', () => {
      const block = image('https://example.com/img.png', 'Example image');
      expect(block.type).toBe('image');
      expect(block.props.url).toBe('https://example.com/img.png');
      expect(block.props.alt).toBe('Example image');
    });
  });

  describe('callout', () => {
    it('should create callout with type', () => {
      const block = callout('warning', 'Be careful!');
      expect(block.type).toBe('callout');
      expect(block.props.type).toBe('warning');
      expect(block.content[0].text).toBe('Be careful!');
    });
  });

  describe('table', () => {
    it('should create table with headers and rows', () => {
      const block = table(['Name', 'Age'], [['Alice', '30'], ['Bob', '25']]);
      expect(block.type).toBe('table');
      expect(block.props.headers).toEqual(['Name', 'Age']);
      expect(block.props.rows).toHaveLength(2);
    });
  });
});

describe('Inline Helpers', () => {
  describe('text', () => {
    it('should create plain text span', () => {
      const span = text('Hello');
      expect(span.text).toBe('Hello');
      expect(span.styles).toEqual({});
    });
  });

  describe('bold', () => {
    it('should create bold text span', () => {
      const span = bold('Strong');
      expect(span.text).toBe('Strong');
      expect(span.styles.bold).toBe(true);
    });
  });

  describe('italic', () => {
    it('should create italic text span', () => {
      const span = italic('Emphasized');
      expect(span.styles.italic).toBe(true);
    });
  });

  describe('code', () => {
    it('should create inline code span', () => {
      const span = code('const x');
      expect(span.styles.code).toBe(true);
    });
  });

  describe('link', () => {
    it('should create link with URL', () => {
      const span = link('Click here', 'https://example.com');
      expect(span.text).toBe('Click here');
      expect(span.styles.link?.url).toBe('https://example.com');
    });

    it('should create link with title', () => {
      const span = link('Click', 'https://example.com', 'Example');
      expect(span.styles.link?.title).toBe('Example');
    });
  });

  describe('spans', () => {
    it('should combine multiple spans', () => {
      const result = spans(bold('Bold'), text(' and '), italic('italic'));
      expect(result).toHaveLength(3);
    });
  });
});
