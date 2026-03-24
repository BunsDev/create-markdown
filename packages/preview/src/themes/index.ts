/**
 * @create-markdown/preview - Theme Exports
 */

export const themeNames = {
  github: 'github',
  githubDark: 'github-dark',
  minimal: 'minimal',
  system: 'system',
} as const;

export type ThemeName = keyof typeof themeNames;

/**
 * Get the CSS file path for a theme
 */
export function getThemePath(theme: ThemeName): string {
  return `@create-markdown/preview/themes/${themeNames[theme]}.css`;
}

export { themeCSS as themes } from './css-strings';
