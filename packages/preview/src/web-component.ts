/**
 * @create-markdown/preview - Web Component
 * <markdown-preview> custom element for rendering markdown anywhere
 */

import type { Block } from '@create-markdown/core';
import { blocksToHTML, renderAsync } from './html-serializer';
import type { PreviewPlugin, PreviewOptions } from './plugins/types';

async function lazyParse(markdown: string): Promise<Block[]> {
  try {
    const core = await import('@create-markdown/core');
    return core.parse(markdown);
  } catch {
    throw new Error(
      '@create-markdown/core is required to parse markdown in <markdown-preview>. ' +
      'Install it, or provide pre-parsed blocks via the blocks attribute / setBlocks().',
    );
  }
}

export type ShadowModeOption = 'open' | 'closed' | 'none';

/**
 * Options for registering the web component
 */
export interface RegisterOptions {
  /** Custom tag name (default: 'markdown-preview') */
  tagName?: string;
  /** Default theme */
  defaultTheme?: 'github' | 'github-dark' | 'minimal' | 'system' | string;
  /** Default plugins to apply */
  plugins?: PreviewPlugin[];
  /** Shadow DOM mode. Use 'none' to render in light DOM and inherit page CSS. */
  shadowMode?: ShadowModeOption;
}

/**
 * Attributes supported by the web component
 */
export interface MarkdownPreviewAttributes {
  /** Theme name */
  theme?: string;
  /** Link target */
  'link-target'?: '_blank' | '_self';
  /** Whether to use async rendering with plugins */
  async?: string;
}

/**
 * The MarkdownPreview custom element
 */
class MarkdownPreviewElement extends HTMLElement {
  /** @internal */ static _shadowMode: ShadowModeOption = 'open';

  private _shadow: ShadowRoot | null = null;
  private plugins: PreviewPlugin[] = [];
  private defaultTheme = 'github';
  private styleElement!: HTMLStyleElement;
  private contentElement!: HTMLDivElement;

  static get observedAttributes(): string[] {
    return ['theme', 'link-target', 'async'];
  }

  private get renderRoot(): ShadowRoot | HTMLElement {
    return this._shadow ?? this;
  }

  constructor() {
    super();

    const mode = (this.constructor as typeof MarkdownPreviewElement)._shadowMode;

    if (mode !== 'none') {
      this._shadow = this.attachShadow({ mode: mode as 'open' | 'closed' });
    }

    this.styleElement = document.createElement('style');
    this.renderRoot.appendChild(this.styleElement);

    this.contentElement = document.createElement('div');
    this.contentElement.className = 'markdown-preview-content';
    this.renderRoot.appendChild(this.contentElement);

    this.updateStyles();
  }

  connectedCallback(): void {
    this.render();
  }

  attributeChangedCallback(_name: string, _oldValue: string | null, _newValue: string | null): void {
    this.render();
  }

  setPlugins(plugins: PreviewPlugin[]): void {
    this.plugins = plugins;
    this.render();
  }

  setDefaultTheme(theme: string): void {
    this.defaultTheme = theme;
    this.render();
  }

  getMarkdown(): string {
    const blocksAttr = this.getAttribute('blocks');
    if (blocksAttr) {
      try {
        const blocks = JSON.parse(blocksAttr) as Block[];
        return blocks.map(b => b.content.map(s => s.text).join('')).join('\n\n');
      } catch {
        return '';
      }
    }

    return this.textContent || '';
  }

  setMarkdown(markdown: string): void {
    this.textContent = markdown;
    this.render();
  }

  setBlocks(blocks: Block[]): void {
    this.setAttribute('blocks', JSON.stringify(blocks));
    this.render();
  }

  private getOptions(): PreviewOptions {
    const theme = this.getAttribute('theme') || this.defaultTheme;
    const linkTarget = (this.getAttribute('link-target') || '_blank') as '_blank' | '_self';

    return {
      theme,
      linkTarget,
      plugins: this.plugins,
    };
  }

  private async getBlocks(): Promise<Block[]> {
    const blocksAttr = this.getAttribute('blocks');
    if (blocksAttr) {
      try {
        return JSON.parse(blocksAttr) as Block[];
      } catch {
        console.warn('Invalid blocks JSON in markdown-preview element');
        return [];
      }
    }

    const markdown = this.textContent || '';
    return lazyParse(markdown);
  }

  private async render(): Promise<void> {
    const blocks = await this.getBlocks();
    const options = this.getOptions();
    const isAsync = this.hasAttribute('async') || this.plugins.length > 0;

    try {
      let html: string;

      if (isAsync) {
        html = await renderAsync(blocks, options);
      } else {
        html = blocksToHTML(blocks, options);
      }

      this.contentElement.innerHTML = html;
    } catch (error) {
      console.error('Error rendering markdown preview:', error);
      this.contentElement.innerHTML = `<div class="error">Error rendering content</div>`;
    }
  }

  private updateStyles(): void {
    const pluginCSS = this.plugins
      .filter(p => p.getCSS)
      .map(p => p.getCSS!())
      .join('\n\n');

    const hostRule = this._shadow
      ? ':host { display: block; }'
      : 'markdown-preview { display: block; }';

    this.styleElement.textContent = `
${hostRule}

.markdown-preview-content {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
}

.error {
  color: #cf222e;
  padding: 1rem;
  background: #ffebe9;
  border-radius: 6px;
}

${pluginCSS}
    `.trim();
  }
}

let globalPlugins: PreviewPlugin[] = [];
let globalDefaultTheme = 'github';

/**
 * Register the <markdown-preview> custom element
 */
export function registerPreviewElement(options?: RegisterOptions): void {
  const tagName = options?.tagName || 'markdown-preview';
  const plugins = options?.plugins || [];
  const defaultTheme = options?.defaultTheme || 'github';
  const shadowMode = options?.shadowMode ?? 'open';

  globalPlugins = plugins;
  globalDefaultTheme = defaultTheme;

  if (!customElements.get(tagName)) {
    class ConfiguredMarkdownPreview extends MarkdownPreviewElement {
      static override _shadowMode = shadowMode;

      constructor() {
        super();
        this.setPlugins(globalPlugins);
        this.setDefaultTheme(globalDefaultTheme);
      }
    }

    customElements.define(tagName, ConfiguredMarkdownPreview);
  }
}

/**
 * Auto-register if in browser environment
 */
export function autoRegister(): void {
  if (typeof window !== 'undefined' && typeof customElements !== 'undefined') {
    registerPreviewElement();
  }
}

export { MarkdownPreviewElement };
