/**
 * @create-markdown/preview - Shiki Plugin
 * Syntax highlighting for code blocks using Shiki
 */

import type { Block, CodeBlockBlock } from '@create-markdown/core';
import type { PreviewPlugin } from './types';

/**
 * Options for the Shiki plugin
 */
export interface ShikiPluginOptions {
  /** Shiki theme for light mode */
  theme?: string;
  /** Shiki theme for dark mode (optional) */
  darkTheme?: string;
  /** Additional languages to load */
  langs?: string[];
  /** Enable line numbers */
  lineNumbers?: boolean;
  /** CSS class prefix */
  classPrefix?: string;
}

const DEFAULT_OPTIONS: ShikiPluginOptions = {
  theme: 'github-light',
  darkTheme: 'github-dark',
  langs: [],
  lineNumbers: false,
  classPrefix: 'cm-',
};

/**
 * Shiki highlighter instance (lazy loaded)
 */
let highlighterPromise: Promise<unknown> | null = null;
let highlighter: unknown = null;

/**
 * Creates a Shiki syntax highlighting plugin
 */
export function shikiPlugin(options?: ShikiPluginOptions): PreviewPlugin {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  return {
    name: 'shiki',
    
    async init() {
      if (highlighter) return;
      
      try {
        // Dynamically import shiki
        // @ts-expect-error - shiki is an optional peer dependency
        const shikiModule = await import('shiki');
        const createHighlighter = shikiModule.createHighlighter || shikiModule.getHighlighter;
        
        if (!createHighlighter) {
          console.warn('@create-markdown/preview: Shiki module loaded but createHighlighter not found');
          return;
        }
        
        highlighterPromise = createHighlighter({
          themes: [opts.theme!, opts.darkTheme!].filter(Boolean),
          langs: [
            'javascript',
            'typescript',
            'jsx',
            'tsx',
            'json',
            'html',
            'css',
            'markdown',
            'python',
            'rust',
            'go',
            'bash',
            'shell',
            ...opts.langs!,
          ],
        });
        
        highlighter = await highlighterPromise;
      } catch (error) {
        console.warn('@create-markdown/preview: Shiki not available. Install with: npm install shiki');
      }
    },
    
    renderBlock(block: Block, _defaultRender: () => string): string | null {
      if (block.type !== 'codeBlock') {
        return null;
      }
      
      const codeBlock = block as CodeBlockBlock;
      const code = codeBlock.content.map((span) => span.text).join('');
      const language = codeBlock.props.language || 'text';
      
      if (!highlighter) {
        // Fallback to default rendering if Shiki not available
        return null;
      }
      
      try {
        // Use Shiki to highlight the code
        const shikiHighlighter = highlighter as {
          codeToHtml: (code: string, options: { lang: string; theme: string }) => string;
        };
        
        const html = shikiHighlighter.codeToHtml(code, {
          lang: language,
          theme: opts.theme!,
        });
        
        // Wrap in our container class
        const prefix = opts.classPrefix;
        return `<div class="${prefix}code-block ${prefix}shiki" data-language="${language}">${html}</div>`;
      } catch (error) {
        // Language not supported, fallback to default
        return null;
      }
    },
    
    getCSS(): string {
      const prefix = opts.classPrefix;
      return `
.${prefix}shiki pre {
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 0;
}

.${prefix}shiki code {
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
  font-size: 0.875em;
  background: transparent;
  padding: 0;
}

.${prefix}shiki .line {
  display: inline-block;
  width: 100%;
}

${opts.lineNumbers ? `
.${prefix}shiki pre {
  counter-reset: line;
}

.${prefix}shiki .line::before {
  counter-increment: line;
  content: counter(line);
  display: inline-block;
  width: 2em;
  margin-right: 1em;
  text-align: right;
  color: #6e7781;
  user-select: none;
}
` : ''}
`.trim();
    },
  };
}

/**
 * Creates a Shiki plugin (alias for shikiPlugin)
 */
export const createShikiPlugin = shikiPlugin;

/**
 * Pre-configured Shiki plugins
 */
export const shiki = {
  /** GitHub light theme */
  light: () => shikiPlugin({ theme: 'github-light' }),
  
  /** GitHub dark theme */
  dark: () => shikiPlugin({ theme: 'github-dark' }),
  
  /** One dark theme */
  oneDark: () => shikiPlugin({ theme: 'one-dark-pro' }),
  
  /** Dracula theme */
  dracula: () => shikiPlugin({ theme: 'dracula' }),
};
