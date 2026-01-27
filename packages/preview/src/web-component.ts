/**
 * @create-markdown/preview - Web Component
 * <markdown-preview> custom element for rendering markdown anywhere
 */

import { parse, type Block } from '@create-markdown/core';
import { blocksToHTML, renderAsync } from './html-serializer';
import type { PreviewPlugin, PreviewOptions } from './plugins/types';

/**
 * Options for registering the web component
 */
export interface RegisterOptions {
  /** Custom tag name (default: 'markdown-preview') */
  tagName?: string;
  /** Default theme */
  defaultTheme?: 'github' | 'github-dark' | 'minimal';
  /** Default plugins to apply */
  plugins?: PreviewPlugin[];
  /** Shadow DOM mode */
  shadowMode?: 'open' | 'closed';
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
  private shadow: ShadowRoot;
  private plugins: PreviewPlugin[];
  private defaultTheme: string;
  private styleElement: HTMLStyleElement;
  private contentElement: HTMLDivElement;
  
  static get observedAttributes(): string[] {
    return ['theme', 'link-target', 'async'];
  }
  
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.plugins = [];
    this.defaultTheme = 'github';
    
    // Create style element
    this.styleElement = document.createElement('style');
    this.shadow.appendChild(this.styleElement);
    
    // Create content container
    this.contentElement = document.createElement('div');
    this.contentElement.className = 'markdown-preview-content';
    this.shadow.appendChild(this.contentElement);
    
    // Set initial styles
    this.updateStyles();
  }
  
  connectedCallback(): void {
    this.render();
  }
  
  attributeChangedCallback(_name: string, _oldValue: string | null, _newValue: string | null): void {
    this.render();
  }
  
  /**
   * Set plugins for this element
   */
  setPlugins(plugins: PreviewPlugin[]): void {
    this.plugins = plugins;
    this.render();
  }
  
  /**
   * Set the default theme
   */
  setDefaultTheme(theme: string): void {
    this.defaultTheme = theme;
    this.render();
  }
  
  /**
   * Get the current markdown content
   */
  getMarkdown(): string {
    // Check for blocks attribute first
    const blocksAttr = this.getAttribute('blocks');
    if (blocksAttr) {
      // Blocks are provided as JSON, convert back to markdown
      try {
        const blocks = JSON.parse(blocksAttr) as Block[];
        return blocks.map(b => b.content.map(s => s.text).join('')).join('\n\n');
      } catch {
        return '';
      }
    }
    
    // Otherwise use text content
    return this.textContent || '';
  }
  
  /**
   * Set markdown content
   */
  setMarkdown(markdown: string): void {
    this.textContent = markdown;
    this.render();
  }
  
  /**
   * Set blocks directly
   */
  setBlocks(blocks: Block[]): void {
    this.setAttribute('blocks', JSON.stringify(blocks));
    this.render();
  }
  
  /**
   * Get the current options
   */
  private getOptions(): PreviewOptions {
    const theme = this.getAttribute('theme') || this.defaultTheme;
    const linkTarget = (this.getAttribute('link-target') || '_blank') as '_blank' | '_self';
    
    return {
      theme,
      linkTarget,
      plugins: this.plugins,
    };
  }
  
  /**
   * Get blocks from content
   */
  private getBlocks(): Block[] {
    // Check for blocks attribute
    const blocksAttr = this.getAttribute('blocks');
    if (blocksAttr) {
      try {
        return JSON.parse(blocksAttr) as Block[];
      } catch {
        console.warn('Invalid blocks JSON in markdown-preview element');
        return [];
      }
    }
    
    // Parse markdown from text content
    const markdown = this.textContent || '';
    return parse(markdown);
  }
  
  /**
   * Render the content
   */
  private async render(): Promise<void> {
    const blocks = this.getBlocks();
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
  
  /**
   * Update the component styles
   */
  private updateStyles(): void {
    // Include plugin CSS
    const pluginCSS = this.plugins
      .filter(p => p.getCSS)
      .map(p => p.getCSS!())
      .join('\n\n');
    
    this.styleElement.textContent = `
:host {
  display: block;
}

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

/**
 * Global plugins and options for the web component
 */
let globalPlugins: PreviewPlugin[] = [];
let globalDefaultTheme = 'github';

/**
 * Register the <markdown-preview> custom element
 */
export function registerPreviewElement(options?: RegisterOptions): void {
  const tagName = options?.tagName || 'markdown-preview';
  const plugins = options?.plugins || [];
  const defaultTheme = options?.defaultTheme || 'github';
  
  // Store global options
  globalPlugins = plugins;
  globalDefaultTheme = defaultTheme;
  
  // Define the custom element
  if (!customElements.get(tagName)) {
    // Create a custom class with the options baked in
    class ConfiguredMarkdownPreview extends MarkdownPreviewElement {
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

// Export the element class for manual use
export { MarkdownPreviewElement };
