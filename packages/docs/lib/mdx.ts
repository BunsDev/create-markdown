import fs from 'fs';
import path from 'path';
import GitHubSlugger from 'github-slugger';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export interface DocFrontmatter {
  title: string;
  description?: string;
  date?: string;
}

export interface Doc {
  slug: string[];
  frontmatter: DocFrontmatter;
  content: string;
}

/**
 * Get all doc slugs for static generation
 */
export function getAllDocSlugs(): string[][] {
  const slugs: string[][] = [];

  function walkDir(dir: string, basePath: string[] = []) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath, [...basePath, file]);
      } else if (file.endsWith('.mdx') || file.endsWith('.md')) {
        const slug = file.replace(/\.(mdx|md)$/, '');
        if (slug === 'index') {
          slugs.push(basePath);
        } else {
          slugs.push([...basePath, slug]);
        }
      }
    }
  }

  walkDir(contentDirectory);
  return slugs;
}

/**
 * Get a single doc by slug
 */
export function getDocBySlug(slug: string[]): Doc | null {
  // Try different file paths
  const possiblePaths = [
    path.join(contentDirectory, ...slug) + '.mdx',
    path.join(contentDirectory, ...slug) + '.md',
    path.join(contentDirectory, ...slug, 'index.mdx'),
    path.join(contentDirectory, ...slug, 'index.md'),
  ];

  // For root docs page
  if (slug.length === 0) {
    possiblePaths.unshift(
      path.join(contentDirectory, 'index.mdx'),
      path.join(contentDirectory, 'index.md')
    );
  }

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        frontmatter: {
          title: data.title || 'Untitled',
          description: data.description,
          date: data.date,
        },
        content,
      };
    }
  }

  return null;
}

/**
 * Get all docs for search indexing
 */
export function getAllDocs(): Doc[] {
  const slugs = getAllDocSlugs();
  const docs: Doc[] = [];

  for (const slug of slugs) {
    const doc = getDocBySlug(slug);
    if (doc) {
      docs.push(doc);
    }
  }

  return docs;
}

/**
 * Extract headings from MDX content.
 * Uses github-slugger so ids match rehype-slug (used when compiling MDX).
 */
export function extractHeadings(content: string): Array<{ id: string; text: string; level: number }> {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Array<{ id: string; text: string; level: number }> = [];
  const slugger = new GitHubSlugger();
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const rawText = match[2];
    const text = rawText.replace(/\*\*/g, '').replace(/`/g, '').trim();
    const id = slugger.slug(text);

    headings.push({ id, text, level });
  }

  return headings;
}
