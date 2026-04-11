/**
 * @create-markdown/preview - Table of Contents Plugin
 * Generates a table of contents from heading blocks
 */

import type { HeadingBlock, Block } from '@create-markdown/core';
import type { PreviewPlugin } from './types';

export interface TocPluginOptions {
  classPrefix?: string;
  containerClass?: string;
  listClass?: string;
  itemClass?: string;
  linkClass?: string;
  indentWidth?: number;
  headingLevels?: number[];
}

export interface TocItem {
  level: number;
  text: string;
  anchor: string;
}

const DEFAULT_OPTIONS: Required<TocPluginOptions> = {
  classPrefix: 'cm-',
  containerClass: 'toc',
  listClass: 'toc-list',
  itemClass: 'toc-item',
  linkClass: 'toc-link',
  indentWidth: 2,
  headingLevels: [1, 2, 3, 4, 5, 6],
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function tocPlugin(options?: TocPluginOptions): PreviewPlugin {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const prefix = opts.classPrefix;

  const tocItems: TocItem[] = [];

  return {
    name: 'table-of-contents',

    transformBlock(block: Block): Block {
      if (block.type === 'heading') {
        const headingBlock = block as HeadingBlock;
        const level = headingBlock.props.level;

        if (opts.headingLevels.includes(level)) {
          const text = headingBlock.content.map((span) => span.text).join('');
          tocItems.push({
            level,
            text,
            anchor: slugify(text),
          });
        }
      }
      return block;
    },

    postProcess(html: string): string {
      if (tocItems.length === 0) {
        return html;
      }

      const buildList = (items: TocItem[], parentLevel = 1): string => {
        let result = '';
        let currentItem: TocItem | null = null;

        for (const item of items) {
          if (item.level < parentLevel) continue;

          if (!currentItem) {
            result += `<ul class="${prefix}${opts.listClass}">\n`;
          }

          currentItem = item;

          const indent = (item.level - parentLevel) * opts.indentWidth;
          const indentStyle = indent > 0 ? ` style="padding-left: ${indent}em"` : '';

          result += `<li class="${prefix}${opts.itemClass}"${indentStyle}>
  <a class="${prefix}${opts.linkClass}" href="#${item.anchor}">${escapeHtml(item.text)}</a>
</li>\n`;
        }

        if (currentItem) {
          result += '</ul>\n';
        }

        return result;
      };

      const minLevel = Math.min(...tocItems.map((i) => i.level));
      const tocHtml = `<div class="${prefix}${opts.containerClass}" data-toc="true">
${buildList(tocItems, minLevel)}</div>\n`;

      tocItems.length = 0;

      return tocHtml + html;
    },

    getCSS(): string {
      return `
.${prefix}${opts.containerClass}[data-toc="true"] {
  margin-bottom: 1.5em;
  padding: 1em;
  background: rgba(175, 184, 193, 0.1);
  border-radius: 6px;
}

.${prefix}${opts.listClass} {
  margin: 0;
  padding-left: 1.5em;
  list-style: none;
}

.${prefix}${opts.itemClass} {
  margin: 0.25em 0;
}

.${prefix}${opts.linkClass} {
  color: #0969da;
  text-decoration: none;
  font-size: 0.9em;
}

.${prefix}${opts.linkClass}:hover {
  text-decoration: underline;
}
`;
    },
  };
}

export function extractToc(blocks: Block[]): TocItem[] {
  const items: TocItem[] = [];

  for (const block of blocks) {
    if (block.type === 'heading') {
      const headingBlock = block as HeadingBlock;
      const level = headingBlock.props.level;
      const text = headingBlock.content.map((span) => span.text).join('');

      items.push({
        level,
        text,
        anchor: slugify(text),
      });
    }
  }

  return items;
}

export function renderToc(items: TocItem[], classPrefix = 'cm-'): string {
  if (items.length === 0) {
    return '';
  }

  const minLevel = Math.min(...items.map((i) => i.level));

  const buildList = (items: TocItem[], parentLevel: number): string => {
    let result = '';
    let currentItem: TocItem | null = null;

    for (const item of items) {
      if (item.level < parentLevel) continue;

      if (!currentItem) {
        result += `<ul class="${classPrefix}toc-list">\n`;
      }

      currentItem = item;

      const indent = (item.level - parentLevel) * 2;
      const indentStyle = indent > 0 ? ` style="padding-left: ${indent}em"` : '';

      result += `<li class="${classPrefix}toc-item"${indentStyle}>
  <a class="${classPrefix}toc-link" href="#${item.anchor}">${escapeHtml(item.text)}</a>
</li>\n`;
    }

    if (currentItem) {
      result += '</ul>\n';
    }

    return result;
  };

  return `<div class="${classPrefix}toc" data-toc="true">
${buildList(items, minLevel)}</div>`;
}
