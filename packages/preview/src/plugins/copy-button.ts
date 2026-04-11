/**
 * @create-markdown/preview - Copy Button Plugin
 * Adds copy-to-clipboard button to code blocks
 */

import type { PreviewPlugin } from './types';

export interface CopyButtonPluginOptions {
  buttonText?: string;
  copiedText?: string;
  classPrefix?: string;
  includeShikiBlocks?: boolean;
}

const DEFAULT_OPTIONS: Required<CopyButtonPluginOptions> = {
  buttonText: 'Copy',
  copiedText: 'Copied!',
  classPrefix: 'cm-',
  includeShikiBlocks: true,
};

let scriptInjected = false;

export function copyButtonPlugin(options?: CopyButtonPluginOptions): PreviewPlugin {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const prefix = opts.classPrefix;

  return {
    name: 'copy-button',

    postProcess(html: string): string {
      const blockSelector = opts.includeShikiBlocks
        ? `pre\\.${prefix}code-block|pre\\.${prefix}shiki`
        : `pre\\.${prefix}code-block`;

      const blockRegex = new RegExp(
        `<(${blockSelector})([^>]*)>([\\s\\S]*?)</pre>`,
        'gi',
      );

      const copyButtonClass = `${prefix}copy-button`;
      const copyTextClass = `${prefix}copy-button-text`;

      const injectScript = (): string => {
        if (scriptInjected) {
          return '';
        }
        scriptInjected = true;

        return `<script>
(function() {
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.${copyButtonClass}');
    if (!btn) return;
    var pre = btn.closest('pre');
    if (!pre) return;
    var code = pre.querySelector('code');
    var text = code ? code.textContent : '';
    navigator.clipboard.writeText(text).then(function() {
      var textEl = btn.querySelector('.${copyTextClass}');
      if (textEl) textEl.textContent = '${opts.copiedText}';
      btn.setAttribute('data-copied', 'true');
      setTimeout(function() {
        var textEl = btn.querySelector('.${copyTextClass}');
        if (textEl) textEl.textContent = '${opts.buttonText}';
        btn.removeAttribute('data-copied');
      }, 2000);
    }).catch(function() {
      var textEl = btn.querySelector('.${copyTextClass}');
      if (textEl) textEl.textContent = 'Failed';
    });
  });
})();
</script>`;
      };

      let buttonCount = 0;

      const processedHtml = html.replace(blockRegex, (match) => {
        buttonCount++;
        const copyId = `copy-${Date.now()}-${buttonCount}`;

        const buttonHtml = `<button class="${copyButtonClass}" data-copy-id="${copyId}" type="button" aria-label="Copy code">
  <span class="${copyTextClass}">${opts.buttonText}</span>
</button>`;

        return `<div class="${prefix}code-wrapper">${match}${buttonHtml}</div>`;
      });

      if (buttonCount > 0) {
        return processedHtml + injectScript();
      }

      return html;
    },

    getCSS(): string {
      return `
.${prefix}code-wrapper {
  position: relative;
}

.${prefix}copy-button {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  font-size: 12px;
  font-family: ui-system, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #6e7781;
  background: rgba(175, 184, 193, 0.2);
  border: 1px solid rgba(31, 35, 40, 0.15);
  border-radius: 6px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s, background 0.2s;
}

.${prefix}code-wrapper:hover .${prefix}copy-button,
.${prefix}copy-button:focus {
  opacity: 1;
}

.${prefix}copy-button:hover {
  background: rgba(175, 184, 193, 0.35);
  color: #24292f;
}

.${prefix}copy-button[data-copied="true"] {
  color: #0969da;
  background: rgba(9, 105, 218, 0.1);
  border-color: rgba(9, 105, 218, 0.3);
}
`;
    },
  };
}
