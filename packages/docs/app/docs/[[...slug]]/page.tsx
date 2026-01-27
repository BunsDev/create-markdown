import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getDocBySlug, getAllDocSlugs, extractHeadings } from '@/lib/mdx';
import { mdxComponents } from '@/components/docs/mdx-components';
import { TableOfContents } from '@/components/docs/toc';

interface DocPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllDocSlugs();
  
  return [
    { slug: [] }, // /docs
    ...slugs.map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({ params }: DocPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  const doc = getDocBySlug(slug);

  if (!doc) {
    return {
      title: 'Not Found',
    };
  }

  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  const doc = getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  const headings = extractHeadings(doc.content);

  return (
    <>
      <article className="relative">
        {/* Page header */}
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
            {doc.frontmatter.title}
          </h1>
          {doc.frontmatter.description && (
            <p className="text-lg text-muted-foreground">
              {doc.frontmatter.description}
            </p>
          )}
        </div>

        {/* MDX Content */}
        <div className="pb-12 pt-8">
          <MDXRemote source={doc.content} components={mdxComponents} />
        </div>
      </article>

      {/* Table of Contents - Desktop only */}
      <div className="hidden text-sm xl:block">
        <div className="sticky top-16 -mt-10 pt-4">
          <TableOfContents items={headings} />
        </div>
      </div>
    </>
  );
}
