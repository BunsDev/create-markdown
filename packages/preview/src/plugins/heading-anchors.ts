/**
 * @create-markdown/preview - Heading Anchors Plugin
 * Adds anchor links to heading elements
 */

import type { HeadingBlock, Block } from '@create-markdown/core';
import type { PreviewPlugin } from './types';

export interface HeadingAnchorsPluginOptions {
  classPrefix?: string;
  anchorPrefix?: string;
}

const DEFAULT_OPTIONS: Required<HeadingAnchorsPluginOptions> = {
  classPrefix: 'cm-',
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

export function headingAnchorsPlugin(options?: HeadingAnchorsPluginOptions): PreviewPlugin {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const prefix = opts.classPrefix;

  return {
    name: 'heading-anchors',

    renderBlock(block: Block, defaultRender: () => string): string | null {
      if (block.type !== 'heading') {
        return null;
      }

      const headingBlock = block as HeadingBlock;
      const content = headingBlock.content
        .map((span) => span.text)
        .join('');
      const anchorId = slugify(content, opts.anchorPrefix);

      const defaultHtml = defaultRender();

      const anchorHtml = `<a class="${prefix}heading-anchor" href="#${anchorId}" aria-hidden="true" tabindex="-1">
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M7.775 3.275a.75.75 0 0 0 1.06 1.06l1.25-1.25a2 2 0 1 1 2.83 2.83l-2.5 2.5a2 2 0 0 1-2.83 0 .75.75 0 0 0-1.06 1.06 3.5 3.5 0 0 0 4.95 0l2.5-2.5a3.5 3.5 0 0 0-4.95-4.95l-1.25 1.25zm-1.72-1.72a.75.75 0 0 0-1.06-1.06l-1.25 1.25a2 2 0 1 1-2.83-2.83l2.5-2.5a2 2 0 0 1 2.83 0 .75.75 0 1 0 1.06-1.06 3.5 3.5 0 0 0-4.95 0l-2.5 2.5a3.5 3.5 0 1 0 4.95 4.95l1.25-1.25z"/>
  </svg>
</a>`;

      const idAttr = ` id="${anchorId}"`;

      const match = defaultHtml.match(/^<(h[1-6])/i);
      if (!match) return null;

      const tag = match[1];
      const closeTag = `</${tag}>`;
      const parts = defaultHtml.split(closeTag);

      if (parts.length !== 2) return null;

      return `${parts[0]}${idAttr}${anchorHtml}${closeTag}${parts[1]}`;
    },

    getCSS(): string {
      return `
.${prefix}heading {
  position: relative;
}

.${prefix}heading-anchor {
  position: absolute;
  left: -24px;
  color: #6e7781;
  text-decoration: none;
  opacity: 0;
  transition: opacity 0.15s;
  display: flex;
  align-items: center;
  height: 100%;
}

.${prefix}heading:hover .${prefix}heading-anchor,
.${prefix}heading-anchor:focus {
  opacity: 1;
}

.${prefix}heading-anchor:hover {
  color: #0969da;
}
`;
    },
  };
}
