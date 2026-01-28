'use client';

import * as React from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  children,
  language,
  filename,
  showLineNumbers = false,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      'group relative my-4 rounded-2xl overflow-hidden shadow-xl shadow-black/10 dark:shadow-black/30',
      className
    )}>
      {/* Gradient hover overlay - Purple only */}
      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Glass container */}
      <div className="relative border border-zinc-200/50 dark:border-white/10 bg-white dark:bg-gradient-to-br dark:from-slate-900/95 dark:to-slate-950/95 backdrop-blur-xl rounded-2xl overflow-hidden">
        {/* Header with filename - glassmorphic */}
        {(filename || language) && (
          <div className="flex items-center justify-between border-b border-zinc-200/50 dark:border-white/10 bg-zinc-50/80 dark:bg-white/5 backdrop-blur-sm px-4 py-2.5 text-sm">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600 group-hover:bg-red-400 transition-colors duration-300" />
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600 group-hover:bg-yellow-400 transition-colors duration-300" />
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600 group-hover:bg-green-400 transition-colors duration-300" />
              </div>
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">{filename || language}</span>
            </div>
            {language && !filename && (
              <span className="text-xs uppercase text-zinc-400 dark:text-zinc-500 font-mono">{language}</span>
            )}
          </div>
        )}
        
        {/* Code content */}
        <div className="relative">
          <pre
            className={cn(
              'overflow-x-auto p-4 text-sm text-zinc-800 dark:text-zinc-100',
              showLineNumbers && 'pl-12'
            )}
          >
            <code className={language ? `language-${language}` : undefined}>
              {children}
            </code>
          </pre>
          
          {/* Copy button - glassmorphic */}
          <button
            onClick={copy}
            className={cn(
              'absolute right-3 top-3 rounded-lg p-2 transition-all duration-200',
              'opacity-0 group-hover:opacity-100',
              'bg-white/80 dark:bg-white/10 backdrop-blur-sm',
              'border border-zinc-200/50 dark:border-white/10',
              'hover:bg-white dark:hover:bg-white/20',
              'hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20',
              copied && 'bg-green-500/20 dark:bg-green-500/20 border-green-500/30'
            )}
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
              <Copy className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            )}
          </button>
        </div>
        
        {/* Subtle inner ring */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-white/10 dark:ring-white/5" />
      </div>
    </div>
  );
}

// Inline copy button for code blocks in MDX - glassmorphic
export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className={cn(
        'absolute right-3 top-3 rounded-lg p-2 transition-all duration-200',
        'opacity-0 group-hover:opacity-100',
        'bg-white/80 dark:bg-white/10 backdrop-blur-sm',
        'border border-zinc-200/50 dark:border-white/10',
        'hover:bg-white dark:hover:bg-white/20',
        'hover:shadow-lg',
        copied && 'bg-green-500/20 border-green-500/30'
      )}
      aria-label="Copy code"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
      ) : (
        <Copy className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
      )}
    </button>
  );
}
