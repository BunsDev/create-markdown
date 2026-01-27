/**
 * @create-markdown/preview - HTML Serializer
 * Convert blocks to HTML strings
 */

import type {
  Block,
  TextSpan,
  HeadingBlock,
  CodeBlockBlock,
  ImageBlock,
  TableBlock,
  CalloutBlock,
  CheckListBlock,
} from '@create-markdown/core';
import { parse } from '@create-markdown/core';
import type { PreviewOptions, ResolvedPreviewOptions } from './plugins/types';

// ============================================================================
// Default Options
// ============================================================================

const DEFAULT_OPTIONS: ResolvedPreviewOptions = {
  classPrefix: 'cm-',
  theme: 'github',
  linkTarget: '_blank',
  sanitize: false,
  plugins: [],
  customRenderers: {},
};

/**
 * Resolves options with defaults
 */
function resolveOptions(options?: PreviewOptions): ResolvedPreviewOptions {
  return {
    ...DEFAULT_OPTIONS,
    ...options,
    plugins: options?.plugins ?? [],
    customRenderers: options?.customRenderers ?? {},
  };
}

// ============================================================================
// Main Serializer
// ============================================================================

/**
 * Converts blocks to HTML string
 */
export function blocksToHTML(
  blocks: Block[],
  options?: PreviewOptions
): string {
  const opts = resolveOptions(options);
  const prefix = opts.classPrefix;
  
  // Transform blocks through plugins
  let transformedBlocks = blocks;
  for (const plugin of opts.plugins) {
    if (plugin.transformBlock) {
      transformedBlocks = transformedBlocks.map(plugin.transformBlock);
    }
  }
  
  // Render each block
  const htmlParts = transformedBlocks.map((block) => {
    // Try plugin renderers first
    for (const plugin of opts.plugins) {
      if (plugin.renderBlock) {
        const result = plugin.renderBlock(block, () => renderBlock(block, opts));
        if (result !== null) {
          return result;
        }
      }
    }
    
    // Try custom renderers
    const customRenderer = opts.customRenderers[block.type as keyof typeof opts.customRenderers];
    if (customRenderer) {
      return customRenderer(block);
    }
    
    // Default rendering
    return renderBlock(block, opts);
  });
  
  const html = `<div class="${prefix}preview">${htmlParts.join('\n')}</div>`;
  
  return html;
}

/**
 * Converts markdown string to HTML
 */
export function markdownToHTML(
  markdown: string,
  options?: PreviewOptions
): string {
  const blocks = parse(markdown);
  return blocksToHTML(blocks, options);
}

/**
 * Async version with plugin initialization
 */
export async function renderAsync(
  blocks: Block[],
  options?: PreviewOptions
): Promise<string> {
  const opts = resolveOptions(options);
  
  // Initialize plugins
  for (const plugin of opts.plugins) {
    if (plugin.init) {
      await plugin.init();
    }
  }
  
  let html = blocksToHTML(blocks, options);
  
  // Post-process through plugins
  for (const plugin of opts.plugins) {
    if (plugin.postProcess) {
      html = await plugin.postProcess(html);
    }
  }
  
  return html;
}

// ============================================================================
// Block Rendering
// ============================================================================

/**
 * Renders a single block to HTML
 */
function renderBlock(block: Block, opts: ResolvedPreviewOptions): string {
  const prefix = opts.classPrefix;
  
  switch (block.type) {
    case 'paragraph':
      return `<p class="${prefix}paragraph">${renderInlineContent(block.content, opts)}</p>`;
    
    case 'heading':
      return renderHeading(block as HeadingBlock, opts);
    
    case 'bulletList':
      return renderBulletList(block, opts);
    
    case 'numberedList':
      return renderNumberedList(block, opts);
    
    case 'checkList':
      return renderCheckList(block as CheckListBlock, opts);
    
    case 'codeBlock':
      return renderCodeBlock(block as CodeBlockBlock, opts);
    
    case 'blockquote':
      return `<blockquote class="${prefix}blockquote">${renderInlineContent(block.content, opts)}</blockquote>`;
    
    case 'table':
      return renderTable(block as TableBlock, opts);
    
    case 'image':
      return renderImage(block as ImageBlock, opts);
    
    case 'divider':
      return `<hr class="${prefix}divider" />`;
    
    case 'callout':
      return renderCallout(block as CalloutBlock, opts);
    
    default:
      return `<div class="${prefix}unknown">${renderInlineContent(block.content, opts)}</div>`;
  }
}

/**
 * Renders heading block
 */
function renderHeading(block: HeadingBlock, opts: ResolvedPreviewOptions): string {
  const prefix = opts.classPrefix;
  const level = block.props.level;
  const tag = `h${level}`;
  const content = renderInlineContent(block.content, opts);
  
  return `<${tag} class="${prefix}heading ${prefix}h${level}">${content}</${tag}>`;
}

/**
 * Renders bullet list
 */
function renderBulletList(block: Block, opts: ResolvedPreviewOptions): string {
  const prefix = opts.classPrefix;
  const items = block.children
    .map((child) => `<li>${renderInlineContent(child.content, opts)}</li>`)
    .join('\n');
  
  return `<ul class="${prefix}bullet-list">\n${items}\n</ul>`;
}

/**
 * Renders numbered list
 */
function renderNumberedList(block: Block, opts: ResolvedPreviewOptions): string {
  const prefix = opts.classPrefix;
  const items = block.children
    .map((child) => `<li>${renderInlineContent(child.content, opts)}</li>`)
    .join('\n');
  
  return `<ol class="${prefix}numbered-list">\n${items}\n</ol>`;
}

/**
 * Renders checklist item
 */
function renderCheckList(block: CheckListBlock, opts: ResolvedPreviewOptions): string {
  const prefix = opts.classPrefix;
  const checked = block.props.checked;
  const checkboxAttr = checked ? 'checked disabled' : 'disabled';
  const textClass = checked ? `${prefix}checked` : '';
  
  return `
<div class="${prefix}checklist-item">
  <input type="checkbox" ${checkboxAttr} />
  <span class="${textClass}">${renderInlineContent(block.content, opts)}</span>
</div>`.trim();
}

/**
 * Renders code block
 */
function renderCodeBlock(block: CodeBlockBlock, opts: ResolvedPreviewOptions): string {
  const prefix = opts.classPrefix;
  const code = block.content.map((span) => span.text).join('');
  const language = block.props.language || '';
  const escapedCode = escapeHtml(code);
  const langClass = language ? ` language-${language}` : '';
  const dataLang = language ? ` data-language="${language}"` : '';
  
  return `<pre class="${prefix}code-block"${dataLang}><code class="${prefix}code${langClass}">${escapedCode}</code></pre>`;
}

/**
 * Renders table
 */
function renderTable(block: TableBlock, opts: ResolvedPreviewOptions): string {
  const prefix = opts.classPrefix;
  const { headers, rows, alignments } = block.props;
  
  const getStyle = (index: number): string => {
    const align = alignments?.[index];
    return align ? ` style="text-align: ${align}"` : '';
  };
  
  const headerRow = headers.length > 0
    ? `<thead><tr>${headers.map((h, i) => `<th${getStyle(i)}>${escapeHtml(h)}</th>`).join('')}</tr></thead>`
    : '';
  
  const bodyRows = rows
    .map((row) => `<tr>${row.map((cell, i) => `<td${getStyle(i)}>${escapeHtml(cell)}</td>`).join('')}</tr>`)
    .join('\n');
  
  return `<table class="${prefix}table">\n${headerRow}\n<tbody>\n${bodyRows}\n</tbody>\n</table>`;
}

/**
 * Renders image
 */
function renderImage(block: ImageBlock, opts: ResolvedPreviewOptions): string {
  const prefix = opts.classPrefix;
  const { url, alt, title, width, height } = block.props;
  
  const altAttr = alt ? ` alt="${escapeHtml(alt)}"` : ' alt=""';
  const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
  const widthAttr = width ? ` width="${width}"` : '';
  const heightAttr = height ? ` height="${height}"` : '';
  
  const img = `<img src="${escapeHtml(url)}"${altAttr}${titleAttr}${widthAttr}${heightAttr} />`;
  const caption = alt ? `<figcaption>${escapeHtml(alt)}</figcaption>` : '';
  
  return `<figure class="${prefix}image">${img}${caption}</figure>`;
}

/**
 * Renders callout
 */
function renderCallout(block: CalloutBlock, opts: ResolvedPreviewOptions): string {
  const prefix = opts.classPrefix;
  const type = block.props.type;
  const content = renderInlineContent(block.content, opts);
  
  return `
<div class="${prefix}callout ${prefix}callout-${type}" role="alert">
  <strong class="${prefix}callout-title">${type}</strong>
  <div class="${prefix}callout-content">${content}</div>
</div>`.trim();
}

// ============================================================================
// Inline Content Rendering
// ============================================================================

/**
 * Renders inline content (text spans with styles)
 */
function renderInlineContent(spans: TextSpan[], opts: ResolvedPreviewOptions): string {
  return spans.map((span) => renderSpan(span, opts)).join('');
}

/**
 * Renders a single text span with styles
 */
function renderSpan(span: TextSpan, opts: ResolvedPreviewOptions): string {
  let html = escapeHtml(span.text);
  const styles = span.styles;
  
  // Apply styles from innermost to outermost
  if (styles.code) {
    html = `<code>${html}</code>`;
  }
  
  if (styles.highlight) {
    html = `<mark>${html}</mark>`;
  }
  
  if (styles.strikethrough) {
    html = `<del>${html}</del>`;
  }
  
  if (styles.underline) {
    html = `<u>${html}</u>`;
  }
  
  if (styles.italic) {
    html = `<em>${html}</em>`;
  }
  
  if (styles.bold) {
    html = `<strong>${html}</strong>`;
  }
  
  if (styles.link) {
    const target = opts.linkTarget === '_blank' ? ' target="_blank" rel="noopener noreferrer"' : '';
    const title = styles.link.title ? ` title="${escapeHtml(styles.link.title)}"` : '';
    html = `<a href="${escapeHtml(styles.link.url)}"${title}${target}>${html}</a>`;
  }
  
  return html;
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * Escapes HTML special characters
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
