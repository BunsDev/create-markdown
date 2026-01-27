import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Callout } from './callout';
import { CodeBlock } from './code-block';

// Custom components for MDX
export const mdxComponents: MDXComponents = {
  // Headings with anchor links
  h1: ({ children, ...props }) => (
    <h1
      className="font-heading mt-2 scroll-m-20 text-4xl font-bold"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, id, ...props }) => (
    <h2
      id={id}
      className="font-heading mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0"
      {...props}
    >
      <a href={`#${id}`} className="hover:underline">
        {children}
      </a>
    </h2>
  ),
  h3: ({ children, id, ...props }) => (
    <h3
      id={id}
      className="font-heading mt-8 scroll-m-20 text-xl font-semibold tracking-tight"
      {...props}
    >
      <a href={`#${id}`} className="hover:underline">
        {children}
      </a>
    </h3>
  ),
  h4: ({ children, id, ...props }) => (
    <h4
      id={id}
      className="font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight"
      {...props}
    >
      {children}
    </h4>
  ),

  // Paragraphs
  p: ({ children }) => (
    <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>
  ),

  // Lists
  ul: ({ children }) => (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>
  ),
  li: ({ children }) => <li>{children}</li>,

  // Links
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith('http');
    
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline underline-offset-4"
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        href={href || '#'}
        className="font-medium text-primary underline underline-offset-4"
        {...props}
      >
        {children}
      </Link>
    );
  },

  // Code
  pre: ({ children, ...props }) => {
    return (
      <div className="group relative my-4 rounded-lg border bg-zinc-950 dark:bg-zinc-900 overflow-hidden">
        <pre className="overflow-x-auto p-4 text-sm" {...props}>
          {children}
        </pre>
      </div>
    );
  },
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    
    if (isInline) {
      return (
        <code
          className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <code className={cn('text-zinc-100', className)} {...props}>
        {children}
      </code>
    );
  },

  // Blockquote
  blockquote: ({ children }) => (
    <blockquote className="mt-6 border-l-2 pl-6 italic text-muted-foreground">
      {children}
    </blockquote>
  ),

  // Tables
  table: ({ children }) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead>{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => (
    <tr className="m-0 border-t p-0 even:bg-muted">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
      {children}
    </td>
  ),

  // Horizontal rule
  hr: () => <hr className="my-4 md:my-8" />,

  // Images
  img: ({ src, alt, ...props }) => (
    <Image
      src={src || ''}
      alt={alt || ''}
      width={800}
      height={400}
      className="rounded-md border"
      {...props}
    />
  ),

  // Custom components
  Callout,
  CodeBlock,
  Image,
  Link,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    ...components,
  };
}
