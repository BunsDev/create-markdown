import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Callout } from './callout';
import { CodeBlock } from './code-block';

// Custom components for MDX with glassmorphic design
export const mdxComponents: MDXComponents = {
  // Headings with anchor links and gradient accents
  h1: ({ children, ...props }) => (
    <h1
      className="font-heading mt-2 scroll-m-20 text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, id, ...props }) => (
    <h2
      id={id}
      className="group font-heading mt-12 scroll-m-20 border-b border-border/50 pb-2 text-2xl font-semibold tracking-tight first:mt-0"
      {...props}
    >
      <a href={`#${id}`} className="relative hover:text-foreground/80 transition-colors">
        {children}
        <span className="absolute -left-5 opacity-0 group-hover:opacity-50 transition-opacity">#</span>
      </a>
    </h2>
  ),
  h3: ({ children, id, ...props }) => (
    <h3
      id={id}
      className="group font-heading mt-8 scroll-m-20 text-xl font-semibold tracking-tight"
      {...props}
    >
      <a href={`#${id}`} className="relative hover:text-foreground/80 transition-colors">
        {children}
        <span className="absolute -left-4 opacity-0 group-hover:opacity-50 transition-opacity text-lg">#</span>
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
    <p className="leading-7 [&:not(:first-child)]:mt-6 text-foreground/90">{children}</p>
  ),

  // Lists with subtle styling
  ul: ({ children }) => (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2 marker:text-muted-foreground/50">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-6 ml-6 list-decimal [&>li]:mt-2 marker:text-muted-foreground/50">{children}</ol>
  ),
  li: ({ children }) => <li className="text-foreground/90">{children}</li>,

  // Links with gradient hover effect
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith('http');
    
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:text-primary/80 transition-all underline underline-offset-4 decoration-primary/30 hover:decoration-primary/50"
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        href={href || '#'}
        className="font-medium text-primary hover:text-primary/80 transition-all underline underline-offset-4 decoration-primary/30 hover:decoration-primary/50"
        {...props}
      >
        {children}
      </Link>
    );
  },

  // Code blocks - clean, readable styling
  pre: ({ children, ...props }) => {
    return (
      <div className="group relative my-6 rounded-xl overflow-hidden">
        {/* Container with solid, readable background */}
        <div className="relative border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 rounded-xl overflow-hidden">
          {/* Window chrome */}
          <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-4 py-2.5">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
          </div>
          
          <pre className="overflow-x-auto p-5 text-[15px] leading-relaxed" {...props}>
            {children}
          </pre>
        </div>
      </div>
    );
  },
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    
    if (isInline) {
      return (
        <code
          className="relative rounded-md bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 font-mono text-sm text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <code className={cn('text-zinc-800 dark:text-zinc-100 font-mono', className)} {...props}>
        {children}
      </code>
    );
  },

  // Blockquote - glassmorphic
  blockquote: ({ children }) => (
    <blockquote className="relative mt-6 rounded-xl border border-border/50 bg-muted/30 dark:bg-muted/10 backdrop-blur-sm pl-6 pr-4 py-4 italic text-muted-foreground overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
      {children}
    </blockquote>
  ),

  // Tables - glassmorphic
  table: ({ children }) => (
    <div className="my-6 w-full overflow-hidden rounded-xl border border-border/50 backdrop-blur-sm shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full">{children}</table>
      </div>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-muted/50 dark:bg-muted/20 backdrop-blur-sm">{children}</thead>
  ),
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => (
    <tr className="m-0 border-t border-border/50 p-0 even:bg-muted/30 dark:even:bg-muted/10 transition-colors hover:bg-muted/50 dark:hover:bg-muted/20">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="border-b border-border/50 px-4 py-3 text-left font-semibold [&[align=center]]:text-center [&[align=right]]:text-right">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
      {children}
    </td>
  ),

  // Horizontal rule - gradient
  hr: () => (
    <hr className="my-8 md:my-12 border-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
  ),

  // Images - glassmorphic frame
  img: ({ src, alt, ...props }) => (
    <div className="my-6 rounded-xl overflow-hidden border border-border/50 shadow-lg bg-muted/10 backdrop-blur-sm">
      <Image
        src={src || ''}
        alt={alt || ''}
        width={800}
        height={400}
        className="w-full"
        {...props}
      />
    </div>
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
