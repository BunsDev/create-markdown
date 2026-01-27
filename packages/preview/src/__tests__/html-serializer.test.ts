import { describe, it, expect } from 'vitest';
import { blocksToHTML, markdownToHTML } from '../html-serializer';
import { h1, h2, paragraph, bulletList, codeBlock, blockquote, divider, bold, italic, spans, text } from '@create-markdown/core';

describe('HTML Serializer', () => {
  describe('blocksToHTML', () => {
    it('should wrap output in preview container', () => {
      const html = blocksToHTML([paragraph('Hello')]);
      expect(html).toContain('class="cm-preview"');
    });

    it('should serialize headings', () => {
      const html = blocksToHTML([h1('Title'), h2('Subtitle')]);
      expect(html).toContain('<h1');
      expect(html).toContain('Title');
      expect(html).toContain('<h2');
      expect(html).toContain('Subtitle');
    });

    it('should serialize paragraphs', () => {
      const html = blocksToHTML([paragraph('Hello, world!')]);
      expect(html).toContain('<p');
      expect(html).toContain('Hello, world!');
    });

    it('should serialize bullet lists', () => {
      const html = blocksToHTML([bulletList(['Item 1', 'Item 2'])]);
      expect(html).toContain('<ul');
      expect(html).toContain('<li>Item 1</li>');
      expect(html).toContain('<li>Item 2</li>');
    });

    it('should serialize code blocks', () => {
      const html = blocksToHTML([codeBlock('const x = 1;', 'javascript')]);
      expect(html).toContain('<pre');
      expect(html).toContain('<code');
      expect(html).toContain('const x = 1;');
      expect(html).toContain('data-language="javascript"');
    });

    it('should serialize blockquotes', () => {
      const html = blocksToHTML([blockquote('A quote')]);
      expect(html).toContain('<blockquote');
      expect(html).toContain('A quote');
    });

    it('should serialize dividers', () => {
      const html = blocksToHTML([divider()]);
      expect(html).toContain('<hr');
    });

    it('should escape HTML in content', () => {
      const html = blocksToHTML([paragraph('<script>alert("xss")</script>')]);
      expect(html).not.toContain('<script>');
      expect(html).toContain('&lt;script&gt;');
    });

    it('should use custom class prefix', () => {
      const html = blocksToHTML([paragraph('Test')], { classPrefix: 'md-' });
      expect(html).toContain('class="md-preview"');
      expect(html).toContain('class="md-paragraph"');
    });
  });

  describe('Inline styles', () => {
    it('should serialize bold text', () => {
      const html = blocksToHTML([paragraph(spans(text('Hello '), bold('world')))]);
      expect(html).toContain('<strong>world</strong>');
    });

    it('should serialize italic text', () => {
      const html = blocksToHTML([paragraph(spans(text('Hello '), italic('world')))]);
      expect(html).toContain('<em>world</em>');
    });

    it('should serialize nested styles', () => {
      const html = blocksToHTML([paragraph(spans(bold('Bold '), italic('italic')))]);
      expect(html).toContain('<strong>Bold </strong>');
      expect(html).toContain('<em>italic</em>');
    });
  });

  describe('markdownToHTML', () => {
    it('should parse and serialize markdown', () => {
      const html = markdownToHTML('# Hello\n\nWorld');
      expect(html).toContain('<h1');
      expect(html).toContain('Hello');
      expect(html).toContain('<p');
      expect(html).toContain('World');
    });
  });

  describe('Options', () => {
    it('should set link target', () => {
      const html = blocksToHTML([paragraph(spans({
        text: 'Link',
        styles: { link: { url: 'https://example.com' } }
      }))], { linkTarget: '_blank' });
      expect(html).toContain('target="_blank"');
      expect(html).toContain('rel="noopener noreferrer"');
    });

    it('should respect _self link target', () => {
      const html = blocksToHTML([paragraph(spans({
        text: 'Link',
        styles: { link: { url: 'https://example.com' } }
      }))], { linkTarget: '_self' });
      expect(html).not.toContain('target="_blank"');
    });
  });
});
