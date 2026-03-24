import { describe, it, expect } from 'vitest';
import { applyPreviewTheme } from '../apply-theme';

describe('applyPreviewTheme', () => {
  it('should wrap output in cm-preview container', () => {
    const html = applyPreviewTheme('<p>Hello</p>');
    expect(html).toMatch(/^<div class="cm-preview">/);
    expect(html).toMatch(/<\/div>$/);
  });

  it('should add cm-paragraph class to <p> tags', () => {
    const html = applyPreviewTheme('<p>Hello world</p>');
    expect(html).toContain('<p class="cm-paragraph">Hello world</p>');
  });

  it('should add cm-heading and cm-h1 classes to <h1> tags', () => {
    const html = applyPreviewTheme('<h1>Title</h1>');
    expect(html).toContain('<h1 class="cm-heading cm-h1">Title</h1>');
  });

  it('should add classes for all heading levels', () => {
    for (let level = 1; level <= 6; level++) {
      const html = applyPreviewTheme(`<h${level}>Heading</h${level}>`);
      expect(html).toContain(`class="cm-heading cm-h${level}"`);
    }
  });

  it('should add cm-bullet-list class to <ul> tags', () => {
    const html = applyPreviewTheme('<ul><li>Item</li></ul>');
    expect(html).toContain('<ul class="cm-bullet-list">');
  });

  it('should add cm-numbered-list class to <ol> tags', () => {
    const html = applyPreviewTheme('<ol><li>Item</li></ol>');
    expect(html).toContain('<ol class="cm-numbered-list">');
  });

  it('should add cm-code-block class to <pre> tags', () => {
    const html = applyPreviewTheme('<pre><code>const x = 1;</code></pre>');
    expect(html).toContain('<pre class="cm-code-block">');
  });

  it('should add cm-blockquote class to <blockquote> tags', () => {
    const html = applyPreviewTheme('<blockquote>Quote</blockquote>');
    expect(html).toContain('<blockquote class="cm-blockquote">');
  });

  it('should add cm-divider class to <hr> tags', () => {
    const html = applyPreviewTheme('<hr />');
    expect(html).toContain('cm-divider');
  });

  it('should add cm-table class to <table> tags', () => {
    const html = applyPreviewTheme('<table><tr><td>Cell</td></tr></table>');
    expect(html).toContain('<table class="cm-table">');
  });

  it('should wrap standalone <img> in <figure class="cm-image">', () => {
    const html = applyPreviewTheme('<img src="test.png" alt="Test" />');
    expect(html).toContain('<figure class="cm-image"><img');
    expect(html).toContain('</figure>');
  });

  it('should not double-wrap <img> already inside <figure>', () => {
    const html = applyPreviewTheme('<figure><img src="test.png" /></figure>');
    expect(html).not.toContain('<figure class="cm-image"><figure');
  });

  it('should append classes when tag already has a class attribute', () => {
    const html = applyPreviewTheme('<p class="existing">Text</p>');
    expect(html).toContain('class="cm-paragraph existing"');
  });

  it('should support custom class prefix', () => {
    const html = applyPreviewTheme('<p>Hello</p>', { classPrefix: 'md-' });
    expect(html).toContain('class="md-preview"');
    expect(html).toContain('class="md-paragraph"');
  });

  it('should support custom wrapper class', () => {
    const html = applyPreviewTheme('<p>Hello</p>', { wrapperClass: 'my-preview' });
    expect(html).toContain('class="my-preview"');
  });

  it('should apply sanitize function when provided', () => {
    const sanitizer = (html: string) => html.replace(/Hello/g, 'Sanitized');
    const html = applyPreviewTheme('<p>Hello</p>', { sanitize: sanitizer });
    expect(html).toContain('Sanitized');
    expect(html).not.toContain('Hello');
  });

  it('should handle boolean sanitize without error', () => {
    const html = applyPreviewTheme('<p>Hello</p>', { sanitize: true });
    expect(html).toContain('Hello');
  });

  it('should handle complex real-world marked output', () => {
    const markedOutput = `<h1>Title</h1>
<p>Some <strong>bold</strong> text with a <a href="https://example.com">link</a>.</p>
<ul>
<li>Item 1</li>
<li>Item 2</li>
</ul>
<pre><code class="language-js">const x = 1;
</code></pre>
<blockquote>
<p>A quote</p>
</blockquote>
<hr>
<table>
<thead><tr><th>Col</th></tr></thead>
<tbody><tr><td>Val</td></tr></tbody>
</table>`;

    const html = applyPreviewTheme(markedOutput);
    expect(html).toContain('cm-heading cm-h1');
    expect(html).toContain('cm-paragraph');
    expect(html).toContain('cm-bullet-list');
    expect(html).toContain('cm-code-block');
    expect(html).toContain('cm-blockquote');
    expect(html).toContain('cm-divider');
    expect(html).toContain('cm-table');
  });
});
