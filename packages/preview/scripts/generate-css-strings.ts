/**
 * Reads all theme CSS files and generates src/themes/css-strings.ts
 * with their contents exported as string constants.
 *
 * Run: bun scripts/generate-css-strings.ts
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';

const themesDir = join(__dirname, '..', 'src', 'themes');
const outFile = join(themesDir, 'css-strings.ts');

const cssFiles = readdirSync(themesDir)
  .filter((f) => f.endsWith('.css'))
  .sort();

function toCamelCase(filename: string): string {
  const name = basename(filename, '.css');
  return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

const entries: string[] = [];
const keys: string[] = [];

for (const file of cssFiles) {
  const content = readFileSync(join(themesDir, file), 'utf-8');
  const key = toCamelCase(file);
  keys.push(key);
  entries.push(`export const ${key} = ${JSON.stringify(content)};`);
}

const source = `/**
 * Auto-generated theme CSS string constants.
 * Do not edit — regenerate with: bun scripts/generate-css-strings.ts
 */

${entries.join('\n\n')}

export const themeCSS = {
  ${keys.map((k) => k).join(',\n  ')},
} as const;
`;

writeFileSync(outFile, source, 'utf-8');
console.log(`Generated ${outFile} with themes: ${keys.join(', ')}`);
