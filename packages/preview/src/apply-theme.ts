/**
 * @create-markdown/preview - Apply Theme
 * Decorate raw HTML (from any markdown parser) with cm-* classes
 */

export interface ApplyThemeOptions {
  /** CSS class prefix (default: 'cm-') */
  classPrefix?: string;
  /** Sanitize the final HTML output */
  sanitize?: boolean | ((html: string) => string);
  /** Override the wrapper element's class */
  wrapperClass?: string;
}

interface TagMapping {
  tag: string;
  classes: string[];
}

function buildTagMappings(prefix: string): TagMapping[] {
  const headings: TagMapping[] = [1, 2, 3, 4, 5, 6].map((level) => ({
    tag: `h${level}`,
    classes: [`${prefix}heading`, `${prefix}h${level}`],
  }));

  return [
    ...headings,
    { tag: 'p', classes: [`${prefix}paragraph`] },
    { tag: 'ul', classes: [`${prefix}bullet-list`] },
    { tag: 'ol', classes: [`${prefix}numbered-list`] },
    { tag: 'pre', classes: [`${prefix}code-block`] },
    { tag: 'blockquote', classes: [`${prefix}blockquote`] },
    { tag: 'hr', classes: [`${prefix}divider`] },
    { tag: 'table', classes: [`${prefix}table`] },
    { tag: 'figure', classes: [`${prefix}image`] },
  ];
}

/**
 * Injects `classes` into an opening HTML tag captured as a full string (e.g. `<p class="x">`).
 * Merges with any existing class attribute.
 */
function injectClasses(openTag: string, classes: string[]): string {
  const classStr = classes.join(' ');
  const classAttrRe = /\bclass\s*=\s*"([^"]*)"/i;
  const match = openTag.match(classAttrRe);

  if (match) {
    return openTag.replace(classAttrRe, `class="${classStr} ${match[1]}"`);
  }

  if (openTag.endsWith('/>')) {
    return openTag.slice(0, -2) + ` class="${classStr}" />`;
  }
  return openTag.slice(0, -1) + ` class="${classStr}">`;
}

/**
 * Wrap standalone `<img>` tags (not already inside `<figure>`) in `<figure class="cm-image">`.
 */
function wrapStandaloneImages(html: string, prefix: string): string {
  return html.replace(
    /(?<!<figure[^>]*>\s*)(<img\s[^>]*\/?>)(?!\s*<\/figure>)/gi,
    `<figure class="${prefix}image">$1</figure>`,
  );
}

/**
 * Takes raw HTML from any markdown parser and decorates standard elements
 * with cm-* classes so theme CSS applies.
 *
 * Works server-side (pure string manipulation, no DOM required).
 */
export function applyPreviewTheme(html: string, options?: ApplyThemeOptions): string {
  const prefix = options?.classPrefix ?? 'cm-';
  const wrapperClass = options?.wrapperClass ?? `${prefix}preview`;
  const mappings = buildTagMappings(prefix);

  let result = html;

  for (const { tag, classes } of mappings) {
    const fullTagRe = new RegExp(`<${tag}(\\s[^>]*)?>|<${tag}\\s*\\/?>`, 'gi');
    result = result.replace(fullTagRe, (match) => injectClasses(match, classes));
  }

  result = wrapStandaloneImages(result, prefix);

  result = `<div class="${wrapperClass}">${result}</div>`;

  if (typeof options?.sanitize === 'function') {
    result = options.sanitize(result);
  }

  return result;
}
