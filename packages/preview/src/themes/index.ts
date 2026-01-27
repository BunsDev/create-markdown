/**
 * @create-markdown/preview - Theme Exports
 */

// Theme CSS content (for bundling)
export const themes = {
  github: 'github',
  githubDark: 'github-dark',
  minimal: 'minimal',
} as const;

export type ThemeName = keyof typeof themes;

/**
 * Get the CSS file path for a theme
 */
export function getThemePath(theme: ThemeName): string {
  return `@create-markdown/preview/themes/${themes[theme]}.css`;
}
