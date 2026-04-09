import type { Block, CodeBlockBlock } from '@create-markdown/core';
import type { PreviewPlugin } from '@create-markdown/preview';

export interface MermaidPluginOptions {
  theme?: 'default' | 'dark' | 'forest' | 'neutral' | 'base';
  config?: Record<string, unknown>;
  classPrefix?: string;
  useUniqueIds?: boolean;
}

const DEFAULT_OPTIONS: MermaidPluginOptions = {
  theme: 'default',
  config: {},
  classPrefix: 'cm-',
  useUniqueIds: true,
};

let mermaidModule: unknown = null;
let mermaidInitialized = false;
let diagramCounter = 0;

export function mermaidPlugin(options?: MermaidPluginOptions): PreviewPlugin {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return {
    name: 'mermaid',

    async init() {
      if (mermaidInitialized) return;

      try {
        const mermaid = await import('mermaid');
        mermaidModule = mermaid.default || mermaid;

        const mermaidApi = mermaidModule as {
          initialize: (config: Record<string, unknown>) => void;
        };

        mermaidApi.initialize({
          startOnLoad: false,
          theme: opts.theme,
          securityLevel: 'loose',
          ...opts.config,
        });

        mermaidInitialized = true;
      } catch (_error) {
        console.warn('@create-markdown/preview-mermaid: Mermaid not available. Install with: pnpm add mermaid');
      }
    },

    renderBlock(block: Block, _defaultRender: () => string): string | null {
      if (block.type !== 'codeBlock') {
        return null;
      }

      const codeBlock = block as CodeBlockBlock;
      const language = codeBlock.props.language?.toLowerCase();

      if (language !== 'mermaid') {
        return null;
      }

      const code = codeBlock.content.map((span) => span.text).join('');
      const prefix = opts.classPrefix;
      const diagramId = opts.useUniqueIds
        ? `mermaid-${Date.now()}-${++diagramCounter}`
        : `mermaid-${++diagramCounter}`;

      return `
<div class="${prefix}mermaid-container">
  <pre class="${prefix}mermaid" id="${diagramId}">${escapeHtml(code)}</pre>
</div>`.trim();
    },

    async postProcess(html: string): Promise<string> {
      if (!mermaidModule) {
        return html;
      }

      try {
        const mermaid = mermaidModule as {
          render: (id: string, code: string) => Promise<{ svg: string }>;
        };

        const prefix = opts.classPrefix;
        const mermaidBlockRegex = new RegExp(
          `<pre class="${prefix}mermaid" id="([^"]+)">([\\s\\S]*?)</pre>`,
          'g'
        );

        const matches = [...html.matchAll(mermaidBlockRegex)];

        for (const match of matches) {
          const [fullMatch, id, escapedCode] = match;
          const code = unescapeHtml(escapedCode);

          try {
            const { svg } = await mermaid.render(id, code);
            html = html.replace(
              fullMatch,
              `<div class="${prefix}mermaid-diagram">${svg}</div>`
            );
          } catch (renderError) {
            console.warn(`Failed to render Mermaid diagram: ${renderError}`);
          }
        }
      } catch (error) {
        console.warn('Mermaid post-processing failed:', error);
      }

      return html;
    },

    getCSS(): string {
      const prefix = opts.classPrefix;
      return `
.${prefix}mermaid-container {
  margin-bottom: 16px;
  overflow-x: auto;
}

.${prefix}mermaid {
  background-color: transparent;
  text-align: center;
}

.${prefix}mermaid-diagram {
  display: flex;
  justify-content: center;
  padding: 16px;
  background-color: #f6f8fa;
  border-radius: 6px;
}

.${prefix}mermaid-diagram svg {
  max-width: 100%;
  height: auto;
}

@media (prefers-color-scheme: dark) {
  .${prefix}mermaid-diagram {
    background-color: #161b22;
  }
}
`.trim();
    },
  };
}

export const createMermaidPlugin = mermaidPlugin;

export const mermaid = {
  default: () => mermaidPlugin({ theme: 'default' }),
  dark: () => mermaidPlugin({ theme: 'dark' }),
  forest: () => mermaidPlugin({ theme: 'forest' }),
  neutral: () => mermaidPlugin({ theme: 'neutral' }),
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function unescapeHtml(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&');
}
