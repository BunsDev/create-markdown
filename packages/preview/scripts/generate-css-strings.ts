/**
 * Reads all theme CSS files and generates src/themes/css-strings.ts
 * with their contents exported as string constants.
 *
 * Run: pnpm tsx scripts/generate-css-strings.ts
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
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
 * Do not edit — regenerate with: pnpm tsx scripts/generate-css-strings.ts
 */

${entries.join('\n\n')}

export const themeCSS = {
  ${keys.map((k) => k).join(',\n  ')},
} as const;
`;

writeFileSync(outFile, source, 'utf-8');
console.log(`Generated ${outFile} with themes: ${keys.join(', ')}`);
