/**
 * @create-markdown/preview - KaTeX Plugin
 * Math rendering using KaTeX
 */

import type { PreviewPlugin } from './types';

export interface KaTeXPluginOptions {
  throwOnError?: boolean;
  errorColor?: string;
  macros?: Record<string, string>;
  classPrefix?: string;
}

const DEFAULT_OPTIONS: Required<KaTeXPluginOptions> = {
  throwOnError: false,
  errorColor: '#cc0000',
  macros: {},
  classPrefix: 'cm-',
};

let katexModule: typeof import('katex') | null = null;

export function katexPlugin(options?: KaTeXPluginOptions): PreviewPlugin {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const prefix = opts.classPrefix;

  return {
    name: 'katex',

    async init() {
      try {
        katexModule = await import('katex');
      } catch {
        console.warn(
          '@create-markdown/preview: KaTeX not available. Install with: pnpm add katex',
        );
      }
    },

    postProcess(html: string): string {
      if (!katexModule) {
        return html;
      }

      const { renderToString, renderToStringForMarkup } = katexModule;

      const renderMath = (expr: string, displayMode: boolean): string => {
        try {
          const renderFn = renderToStringForMarkup || renderToString;
          return renderFn(expr, {
            displayMode,
            throwOnError: opts.throwOnError,
            errorColor: opts.errorColor,
            macros: opts.macros,
          });
        } catch {
          return `<span class="${prefix}katex-error">${expr}</span>`;
        }
      };

      const blockRegex = /\$\$([\s\S]+?)\$\$/g;
      html = html.replace(blockRegex, (_match, expr) => {
        return `<div class="${prefix}katex-block">${renderMath(expr.trim(), true)}</div>`;
      });

      const inlineRegex = /\$([^\$\n]+?)\$/g;
      html = html.replace(inlineRegex, (_match, expr) => {
        if (expr.includes('$$')) return _match;
        return `<span class="${prefix}katex-inline">${renderMath(expr.trim(), false)}</span>`;
      });

      return html;
    },

    getCSS(): string {
      return `
.${prefix}katex-inline,
.${prefix}katex-block {
  font-family: 'KaTeX_Main', 'Times New Roman', serif;
}

.${prefix}katex-block {
  display: block;
  text-align: center;
  margin: 1em 0;
  overflow-x: auto;
  overflow-y: hidden;
}

.${prefix}katex-error {
  color: ${opts.errorColor};
  font-family: monospace;
}
`;
    },
  };
}
