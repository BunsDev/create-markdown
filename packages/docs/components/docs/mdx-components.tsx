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

  // Code - glassmorphic styling
  pre: ({ children, ...props }) => {
    return (
      <div className="group relative my-6 rounded-2xl overflow-hidden shadow-xl shadow-black/10 dark:shadow-black/30">
        {/* Gradient hover overlay - Purple only */}
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Glass container */}
        <div className="relative border border-zinc-200/50 dark:border-white/10 bg-white dark:bg-gradient-to-br dark:from-slate-900/95 dark:to-slate-950/95 backdrop-blur-xl rounded-2xl overflow-hidden">
          {/* Window chrome */}
          <div className="flex items-center gap-2 border-b border-zinc-200/50 dark:border-white/10 bg-zinc-50/80 dark:bg-white/5 backdrop-blur-sm px-4 py-2.5">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600 group-hover:bg-red-400 transition-colors duration-300" />
              <div className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600 group-hover:bg-yellow-400 transition-colors duration-300" />
              <div className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600 group-hover:bg-green-400 transition-colors duration-300" />
            </div>
          </div>
          
          <pre className="overflow-x-auto p-4 text-sm" {...props}>
            {children}
          </pre>
        </div>
        
        {/* Subtle inner ring */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-white/10 dark:ring-white/5" />
      </div>
    );
  },
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    
    if (isInline) {
      return (
        <code
          className="relative rounded-lg bg-muted/80 dark:bg-muted/50 backdrop-blur-sm px-1.5 py-0.5 font-mono text-sm border border-border/50"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <code className={cn('text-zinc-800 dark:text-zinc-100', className)} {...props}>
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
