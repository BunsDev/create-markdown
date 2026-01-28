import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { getDocBySlug, getAllDocSlugs, extractHeadings } from '@/lib/mdx';
import { mdxComponents } from '@/components/docs/mdx-components';
import { TableOfContents, MobileTOC } from '@/components/docs/toc';

interface DocPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllDocSlugs();
  
  // getAllDocSlugs already includes [] for index.mdx
  return slugs.map((slug) => ({ slug }));
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
    <div className="xl:grid xl:grid-cols-[1fr_200px] xl:gap-8">
      {/* Left column: mobile TOC + article */}
      <div className="min-w-0">
        <MobileTOC items={headings} />
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
            <MDXRemote
              source={doc.content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug],
                },
              }}
            />
          </div>
        </article>
      </div>

      {/* Right column: Table of Contents (desktop only) */}
      <aside className="hidden xl:block text-sm">
        <div className="sticky top-24 pt-4">
          <TableOfContents items={headings} />
        </div>
      </aside>
    </div>
  );
}
