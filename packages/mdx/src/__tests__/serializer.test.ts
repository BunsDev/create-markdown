/**
 * @create-markdown/mdx - Serializer Tests
 */

import { describe, it, expect } from 'vitest';
import { parse } from '@create-markdown/core';
import { blocksToMDX, blocksToMDXWithMeta } from '../serializer';
import { markdownToMDX, markdownToMDXWithMeta } from '../converter';

describe('blocksToMDX', () => {
  it('should convert simple paragraph', () => {
    const blocks = parse('Hello world');
    const mdx = blocksToMDX(blocks, { extractTitle: false });
    expect(mdx).toContain('Hello world');
  });

  it('should convert heading with frontmatter', () => {
    const blocks = parse('# Welcome\n\nThis is content.');
    const mdx = blocksToMDX(blocks);
    expect(mdx).toContain('---');
    expect(mdx).toContain('title: "Welcome"');
    expect(mdx).toContain('# Welcome');
    expect(mdx).toContain('This is content.');
  });

  it('should convert code blocks', () => {
    const markdown = '```typescript\nconst x = 1;\n```';
    const blocks = parse(markdown);
    const mdx = blocksToMDX(blocks, { extractTitle: false });
    expect(mdx).toContain('```typescript');
    expect(mdx).toContain('const x = 1;');
    expect(mdx).toContain('```');
  });

  it('should use custom code block component', () => {
    const markdown = '```typescript\nconst x = 1;\n```';
    const blocks = parse(markdown);
    const mdx = blocksToMDX(blocks, {
      extractTitle: false,
      components: { codeBlock: 'CodeBlock' },
      useJSX: true,
    });
    expect(mdx).toContain('<CodeBlock language="typescript">');
    expect(mdx).toContain('</CodeBlock>');
  });

  it('should convert bullet lists', () => {
    const blocks = parse('- Item 1\n- Item 2\n- Item 3');
    const mdx = blocksToMDX(blocks, { extractTitle: false });
    expect(mdx).toContain('- Item 1');
    expect(mdx).toContain('- Item 2');
    expect(mdx).toContain('- Item 3');
  });

  it('should convert numbered lists', () => {
    const blocks = parse('1. First\n2. Second\n3. Third');
    const mdx = blocksToMDX(blocks, { extractTitle: false });
    expect(mdx).toContain('1. First');
    expect(mdx).toContain('2. Second');
    expect(mdx).toContain('3. Third');
  });

  it('should convert bold and italic', () => {
    const blocks = parse('This is **bold** and *italic*');
    const mdx = blocksToMDX(blocks, { extractTitle: false });
    expect(mdx).toContain('**bold**');
    expect(mdx).toContain('*italic*');
  });

  it('should convert links', () => {
    const blocks = parse('[Click here](https://example.com)');
    const mdx = blocksToMDX(blocks, { extractTitle: false });
    expect(mdx).toContain('[Click here](https://example.com)');
  });

  it('should use custom Link component', () => {
    const blocks = parse('[Click here](https://example.com)');
    const mdx = blocksToMDX(blocks, {
      extractTitle: false,
      components: { link: 'Link' },
      useJSX: true,
    });
    expect(mdx).toContain('<Link href="https://example.com">Click here</Link>');
  });

  it('should convert blockquotes', () => {
    const blocks = parse('> This is a quote');
    const mdx = blocksToMDX(blocks, { extractTitle: false });
    expect(mdx).toContain('> This is a quote');
  });

  it('should convert dividers', () => {
    const blocks = parse('---');
    const mdx = blocksToMDX(blocks, { extractTitle: false });
    expect(mdx).toContain('---');
  });

  it('should add imports when specified', () => {
    const blocks = parse('# Hello');
    const mdx = blocksToMDX(blocks, {
      imports: [
        "import { Button } from '@/components/button'",
        "import Link from 'next/link'",
      ],
    });
    expect(mdx).toContain("import { Button } from '@/components/button'");
    expect(mdx).toContain("import Link from 'next/link'");
  });

  it('should include custom frontmatter', () => {
    const blocks = parse('# Hello');
    const mdx = blocksToMDX(blocks, {
      frontmatter: {
        description: 'A test page',
        author: 'Test Author',
        draft: true,
      },
    });
    expect(mdx).toContain('description: "A test page"');
    expect(mdx).toContain('author: "Test Author"');
    expect(mdx).toContain('draft: true');
  });
});

describe('blocksToMDXWithMeta', () => {
  it('should extract title from first H1', () => {
    const blocks = parse('# My Title\n\nContent here');
    const result = blocksToMDXWithMeta(blocks);
    expect(result.title).toBe('My Title');
  });

  it('should extract headings for TOC', () => {
    const markdown = '# Title\n\n## Section 1\n\n### Subsection\n\n## Section 2';
    const blocks = parse(markdown);
    const result = blocksToMDXWithMeta(blocks);
    expect(result.headings).toHaveLength(4);
    expect(result.headings[0]).toEqual({ level: 1, text: 'Title', id: 'title' });
    expect(result.headings[1]).toEqual({ level: 2, text: 'Section 1', id: 'section-1' });
    expect(result.headings[2]).toEqual({ level: 3, text: 'Subsection', id: 'subsection' });
    expect(result.headings[3]).toEqual({ level: 2, text: 'Section 2', id: 'section-2' });
  });
});

describe('markdownToMDX', () => {
  it('should convert markdown string to MDX', () => {
    const markdown = '# Hello\n\nWorld';
    const mdx = markdownToMDX(markdown);
    expect(mdx).toContain('title: "Hello"');
    expect(mdx).toContain('# Hello');
    expect(mdx).toContain('World');
  });

  it('should work with docsPreset-like options', () => {
    const markdown = '# Docs\n\n```ts\nconst x = 1;\n```';
    const mdx = markdownToMDX(markdown, {
      components: {
        codeBlock: 'CodeBlock',
      },
      imports: [
        "import { CodeBlock } from '@/components/code-block'",
      ],
    });
    expect(mdx).toContain("import { CodeBlock }");
    expect(mdx).toContain('<CodeBlock language="ts">');
  });
});

describe('markdownToMDXWithMeta', () => {
  it('should return conversion result with metadata', () => {
    const markdown = '# My Page\n\n## Section\n\nContent';
    const result = markdownToMDXWithMeta(markdown);
    expect(result.title).toBe('My Page');
    expect(result.headings).toHaveLength(2);
    expect(result.content).toContain('title: "My Page"');
  });
});
