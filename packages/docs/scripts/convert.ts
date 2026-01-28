#!/usr/bin/env bun
/**
 * Convert existing markdown docs to MDX
 * Uses @create-markdown/mdx for conversion
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { markdownToMDXWithMeta } from '@create-markdown/mdx';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '../../..');
const OUTPUT_DIR = join(__dirname, '../content');

interface FileMapping {
  source: string;
  destination: string;
  frontmatter?: Record<string, string>;
}

// Files to convert
const filesToConvert: FileMapping[] = [
  {
    source: 'README.md',
    destination: 'index.mdx',
    frontmatter: {
      title: 'Introduction',
      description: 'Block-based markdown parsing and serialization with zero dependencies',
    },
  },
  {
    source: 'packages/core/README.md',
    destination: 'api/core.mdx',
    frontmatter: {
      title: 'Core API',
      description: 'Block-based markdown parsing and serialization',
    },
  },
  {
    source: 'packages/preview/README.md',
    destination: 'api/preview.mdx',
    frontmatter: {
      title: 'Preview API',
      description: 'Framework-agnostic HTML rendering with syntax highlighting',
    },
  },
  {
    source: 'packages/react/README.md',
    destination: 'api/react.mdx',
    frontmatter: {
      title: 'React API',
      description: 'React components and hooks for create-markdown',
    },
  },
  {
    source: 'packages/mdx/README.md',
    destination: 'api/mdx.mdx',
    frontmatter: {
      title: 'MDX API',
      description: 'Convert markdown blocks to MDX with component mappings',
    },
  },
  {
    source: 'INTEGRATION.md',
    destination: 'guides/integration.mdx',
    frontmatter: {
      title: 'Integration Guide',
      description: 'Framework-specific setup guides for create-markdown',
    },
  },
  {
    source: 'CONTRIBUTING.md',
    destination: 'contributing.mdx',
    frontmatter: {
      title: 'Contributing',
      description: 'Guidelines for contributing to create-markdown',
    },
  },
  {
    source: 'ROADMAP.md',
    destination: 'roadmap.mdx',
    frontmatter: {
      title: 'Roadmap',
      description: 'Planned features and development stages',
    },
  },
  {
    source: 'CHANGELOG.md',
    destination: 'changelog.mdx',
    frontmatter: {
      title: 'Changelog',
      description: 'Version history and release notes',
    },
  },
];

async function main() {
  console.log('Converting markdown docs to MDX...\n');

  for (const file of filesToConvert) {
    const sourcePath = join(ROOT_DIR, file.source);
    const destPath = join(OUTPUT_DIR, file.destination);

    // Check if source exists
    if (!existsSync(sourcePath)) {
      console.log(`⚠️  Skipping ${file.source} (not found)`);
      continue;
    }

    // Read source file
    const markdown = readFileSync(sourcePath, 'utf-8');

    // Convert to MDX
    const result = markdownToMDXWithMeta(markdown, {
      frontmatter: file.frontmatter,
      extractTitle: false, // We're providing custom frontmatter
      useJSX: false, // Keep standard markdown syntax
    });

    // Ensure directory exists
    const destDir = dirname(destPath);
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }

    // Write output
    writeFileSync(destPath, result.content);
    console.log(`✓ ${file.source} → ${file.destination}`);
  }

  console.log('\nDone!');
}

main().catch(console.error);
