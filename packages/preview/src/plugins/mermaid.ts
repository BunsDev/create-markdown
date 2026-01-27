/**
 * @create-markdown/preview - Mermaid Plugin
 * Diagram rendering for mermaid code blocks
 */

import type { Block, CodeBlockBlock } from '@create-markdown/core';
import type { PreviewPlugin } from './types';

/**
 * Options for the Mermaid plugin
 */
export interface MermaidPluginOptions {
  /** Mermaid theme */
  theme?: 'default' | 'dark' | 'forest' | 'neutral' | 'base';
  /** Custom Mermaid configuration */
  config?: Record<string, unknown>;
  /** CSS class prefix */
  classPrefix?: string;
  /** Whether to use a unique ID for each diagram */
  useUniqueIds?: boolean;
}

const DEFAULT_OPTIONS: MermaidPluginOptions = {
  theme: 'default',
  config: {},
  classPrefix: 'cm-',
  useUniqueIds: true,
};

/**
 * Mermaid module (lazy loaded)
 */
let mermaidModule: unknown = null;
let mermaidInitialized = false;
let diagramCounter = 0;

/**
 * Creates a Mermaid diagram plugin
 */
export function mermaidPlugin(options?: MermaidPluginOptions): PreviewPlugin {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  return {
    name: 'mermaid',
    
    async init() {
      if (mermaidInitialized) return;
      
      try {
        // Dynamically import mermaid
        const mermaid = await import('mermaid');
        mermaidModule = mermaid.default || mermaid;
        
        // Initialize mermaid with configuration
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
      } catch (error) {
        console.warn('@create-markdown/preview: Mermaid not available. Install with: npm install mermaid');
      }
    },
    
    renderBlock(block: Block, defaultRender: () => string): string | null {
      if (block.type !== 'codeBlock') {
        return null;
      }
      
      const codeBlock = block as CodeBlockBlock;
      const language = codeBlock.props.language?.toLowerCase();
      
      // Only handle mermaid code blocks
      if (language !== 'mermaid') {
        return null;
      }
      
      const code = codeBlock.content.map((span) => span.text).join('');
      const prefix = opts.classPrefix;
      
      // Generate unique ID for the diagram
      const diagramId = opts.useUniqueIds
        ? `mermaid-${Date.now()}-${++diagramCounter}`
        : `mermaid-${++diagramCounter}`;
      
      // Return a placeholder that will be rendered by Mermaid on the client
      // The actual SVG rendering happens in postProcess or client-side
      return `
<div class="${prefix}mermaid-container">
  <pre class="${prefix}mermaid" id="${diagramId}">${escapeHtml(code)}</pre>
</div>`.trim();
    },
    
    async postProcess(html: string): Promise<string> {
      if (!mermaidModule) {
        return html;
      }
      
      // For server-side rendering, we need to render the diagrams
      // This is a simplified version - in practice you'd use mermaid.render()
      try {
        const mermaid = mermaidModule as {
          render: (id: string, code: string) => Promise<{ svg: string }>;
        };
        
        // Find all mermaid blocks and render them
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
            // Keep the code block as fallback
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

/* Dark theme adjustments */
@media (prefers-color-scheme: dark) {
  .${prefix}mermaid-diagram {
    background-color: #161b22;
  }
}
`.trim();
    },
  };
}

/**
 * Creates a Mermaid plugin (alias for mermaidPlugin)
 */
export const createMermaidPlugin = mermaidPlugin;

/**
 * Pre-configured Mermaid plugins
 */
export const mermaid = {
  /** Default theme */
  default: () => mermaidPlugin({ theme: 'default' }),
  
  /** Dark theme */
  dark: () => mermaidPlugin({ theme: 'dark' }),
  
  /** Forest theme */
  forest: () => mermaidPlugin({ theme: 'forest' }),
  
  /** Neutral theme */
  neutral: () => mermaidPlugin({ theme: 'neutral' }),
};

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

/**
 * Unescapes HTML special characters
 */
function unescapeHtml(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}
