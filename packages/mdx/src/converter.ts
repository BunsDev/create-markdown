/**
 * @create-markdown/mdx - Conversion Utilities
 * File-based MD to MDX conversion
 */

import { parse } from '@create-markdown/core';
import { blocksToMDX, blocksToMDXWithMeta } from './serializer';
import type { MDXSerializeOptions, ConvertOptions, MDXConversionResult } from './types';

// ============================================================================
// String Conversion
// ============================================================================

/**
 * Converts markdown string to MDX string
 */
export function markdownToMDX(
  markdown: string,
  options?: MDXSerializeOptions
): string {
  const blocks = parse(markdown);
  return blocksToMDX(blocks, options);
}

/**
 * Converts markdown string to MDX with extracted metadata
 */
export function markdownToMDXWithMeta(
  markdown: string,
  options?: MDXSerializeOptions
): MDXConversionResult {
  const blocks = parse(markdown);
  return blocksToMDXWithMeta(blocks, options);
}

// ============================================================================
// File Conversion (Bun/Node compatible)
// ============================================================================

/**
 * Reads a file and returns its contents
 * Works in both Bun and Node environments
 */
async function readFile(path: string): Promise<string> {
  if (typeof Bun !== 'undefined') {
    return Bun.file(path).text();
  }
  // Node.js fallback
  const fs = await import('node:fs/promises');
  return fs.readFile(path, 'utf-8');
}

/**
 * Writes content to a file
 * Works in both Bun and Node environments
 */
async function writeFile(path: string, content: string): Promise<void> {
  if (typeof Bun !== 'undefined') {
    await Bun.write(path, content);
    return;
  }
  // Node.js fallback
  const fs = await import('node:fs/promises');
  await fs.writeFile(path, content, 'utf-8');
}

/**
 * Checks if a file exists
 */
async function fileExists(path: string): Promise<boolean> {
  try {
    if (typeof Bun !== 'undefined') {
      return Bun.file(path).exists();
    }
    const fs = await import('node:fs/promises');
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Creates directory if it doesn't exist
 */
async function ensureDir(path: string): Promise<void> {
  const fs = await import('node:fs/promises');
  const { dirname } = await import('node:path');
  await fs.mkdir(dirname(path), { recursive: true });
}

/**
 * Converts a markdown file to MDX
 */
export async function convertFile(
  inputPath: string,
  outputPath: string,
  options?: ConvertOptions
): Promise<MDXConversionResult> {
  const markdown = await readFile(inputPath);
  const result = markdownToMDXWithMeta(markdown, options);
  
  // Check if output exists and overwrite is disabled
  if (!options?.overwrite && await fileExists(outputPath)) {
    throw new Error(`Output file already exists: ${outputPath}. Use overwrite: true to replace.`);
  }
  
  // Ensure output directory exists
  await ensureDir(outputPath);
  
  // Write the MDX content
  await writeFile(outputPath, result.content);
  
  return result;
}

/**
 * Batch converts a directory of markdown files to MDX
 */
export async function convertDirectory(
  inputDir: string,
  outputDir: string,
  options?: ConvertOptions
): Promise<Array<{ input: string; output: string; result: MDXConversionResult }>> {
  const { join, relative, dirname, basename } = await import('node:path');
  const fs = await import('node:fs/promises');
  
  const results: Array<{ input: string; output: string; result: MDXConversionResult }> = [];
  
  // Find all markdown files recursively
  async function* walkDir(dir: string): AsyncGenerator<string> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        yield* walkDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        yield fullPath;
      }
    }
  }
  
  // Process each file
  for await (const inputPath of walkDir(inputDir)) {
    const relativePath = relative(inputDir, inputPath);
    const ext = options?.extension ?? '.mdx';
    const outputPath = join(
      outputDir,
      dirname(relativePath),
      basename(relativePath, '.md') + ext
    );
    
    try {
      const result = await convertFile(inputPath, outputPath, options);
      results.push({ input: inputPath, output: outputPath, result });
    } catch (error) {
      if (options?.overwrite !== false) {
        throw error;
      }
      // Skip existing files when overwrite is disabled
      console.warn(`Skipping existing file: ${outputPath}`);
    }
  }
  
  return results;
}

// ============================================================================
// Conversion Presets
// ============================================================================

/**
 * Preset options for docs site conversion
 */
export const docsPreset: MDXSerializeOptions = {
  useJSX: true,
  extractTitle: true,
  components: {
    codeBlock: 'CodeBlock',
    callout: 'Callout',
    image: 'Image',
    link: 'Link',
  },
  imports: [
    "import { CodeBlock } from '@/components/docs/code-block'",
    "import { Callout } from '@/components/docs/callout'",
    "import Image from 'next/image'",
    "import Link from 'next/link'",
  ],
};

/**
 * Preset for minimal MDX (no custom components)
 */
export const minimalPreset: MDXSerializeOptions = {
  useJSX: false,
  extractTitle: true,
  components: {},
  imports: [],
};
