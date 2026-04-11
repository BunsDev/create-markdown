/**
 * Type declarations for optional peer dependencies
 * These modules may not be installed - they are loaded lazily at runtime
 */

declare module 'katex' {
  export interface RenderOptions {
    displayMode?: boolean;
    throwOnError?: boolean;
    errorColor?: string;
    macros?: Record<string, string>;
  }

  export function renderToString(expr: string, options?: RenderOptions): string;
  export const renderToStringForMarkup: ((expr: string, options?: RenderOptions) => string) | undefined;
}
