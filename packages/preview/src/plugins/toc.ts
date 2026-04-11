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
  anchorPrefix?: string;
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
  anchorPrefix: '',
};

function slugify(text: string, prefix: string): string {
  return (
    prefix +
    text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  );
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
            anchor: slugify(text, opts.anchorPrefix),
          });
        }
      }
      return block;
    },

    postProcess(html: string): string {
      if (tocItems.length === 0) {
        return html;
      }

      const buildNestedList = (items: TocItem[], startLevel: number): string => {
        if (items.length === 0) {
          return '';
        }

        const result: string[] = [];
        let i = 0;

        while (i < items.length) {
          const item = items[i];

          if (item.level < startLevel) {
            break;
          }

          if (item.level === startLevel) {
            const safeText = escapeHtml(item.text);
            result.push(
              `<li class="${prefix}${opts.itemClass}">` +
              `<a class="${prefix}${opts.linkClass}" href="#${item.anchor}">${safeText}</a>`
            );
            i++;

            const childList = buildNestedList(items.slice(i), startLevel + 1);
            if (childList) {
              result.push(`<ul class="${prefix}${opts.listClass}">${childList}</ul>`);
            }

            result.push('</li>');
          } else {
            const childList = buildNestedList(items.slice(i), item.level);
            if (childList) {
              result.push(`<ul class="${prefix}${opts.listClass}">${childList}</ul>`);
            }

            while (i < items.length && items[i].level >= startLevel) {
              if (items[i].level === startLevel) {
                break;
              }
              i++;
            }
          }
        }

        return result.join('\n');
      };

      const minLevel = Math.min(...tocItems.map((i) => i.level));
      const tocHtml = `<nav class="${prefix}${opts.containerClass}" aria-label="Table of contents">
<ul class="${prefix}${opts.listClass}">
${buildNestedList(tocItems, minLevel)}
</ul>
</nav>\n`;

      tocItems.length = 0;

      return tocHtml + html;
    },

    getCSS(): string {
      return `
.${prefix}${opts.containerClass}[aria-label="Table of contents"] {
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

export function extractToc(blocks: Block[], anchorPrefix = ''): TocItem[] {
  const items: TocItem[] = [];

  for (const block of blocks) {
    if (block.type === 'heading') {
      const headingBlock = block as HeadingBlock;
      const level = headingBlock.props.level;
      const text = headingBlock.content.map((span) => span.text).join('');

      items.push({
        level,
        text,
        anchor: slugify(text, anchorPrefix),
      });
    }
  }

  return items;
}

export function renderToc(items: TocItem[], classPrefix = 'cm-'): string {
  if (items.length === 0) {
    return '';
  }

  const buildNestedList = (items: TocItem[], startLevel: number): string => {
    if (items.length === 0) {
      return '';
    }

    const result: string[] = [];
    let i = 0;

    while (i < items.length) {
      const item = items[i];

      if (item.level < startLevel) {
        break;
      }

      if (item.level === startLevel) {
        const safeText = escapeHtml(item.text);
        result.push(
          `<li class="${classPrefix}toc-item">` +
          `<a class="${classPrefix}toc-link" href="#${item.anchor}">${safeText}</a>`
        );
        i++;

        const childList = buildNestedList(items.slice(i), startLevel + 1);
        if (childList) {
          result.push(`<ul class="${classPrefix}toc-list">${childList}</ul>`);
        }

        result.push('</li>');
      } else {
        const childList = buildNestedList(items.slice(i), item.level);
        if (childList) {
          result.push(`<ul class="${classPrefix}toc-list">${childList}</ul>`);
        }

        while (i < items.length && items[i].level >= startLevel) {
          if (items[i].level === startLevel) {
            break;
          }
          i++;
        }
      }
    }

    return result.join('\n');
  };

  const minLevel = Math.min(...items.map((i) => i.level));

  return `<nav class="${classPrefix}toc" aria-label="Table of contents">
<ul class="${classPrefix}toc-list">
${buildNestedList(items, minLevel)}
</ul>
</nav>`;
}
