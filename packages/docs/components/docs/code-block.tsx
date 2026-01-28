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
      'group relative my-4 rounded-xl overflow-hidden',
      className
    )}>
      {/* Container with solid background */}
      <div className="border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 rounded-xl overflow-hidden">
        {/* Header with filename */}
        {(filename || language) && (
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-4 py-2.5 text-sm">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <span className="text-zinc-600 dark:text-zinc-300 font-medium">{filename || language}</span>
            </div>
            {language && !filename && (
              <span className="text-xs uppercase text-zinc-500 dark:text-zinc-400 font-mono">{language}</span>
            )}
          </div>
        )}
        
        {/* Code content */}
        <div className="relative">
          <pre
            className={cn(
              'overflow-x-auto p-5 text-[14px] leading-7 text-zinc-800 dark:text-zinc-100',
              showLineNumbers && 'pl-12'
            )}
          >
            <code className={cn('font-mono', language ? `language-${language}` : undefined)}>
              {children}
            </code>
          </pre>
          
          {/* Copy button */}
          <button
            onClick={copy}
            className={cn(
              'absolute right-3 top-3 rounded-lg p-2 transition-all duration-200',
              'opacity-0 group-hover:opacity-100',
              'bg-zinc-200 dark:bg-zinc-700',
              'hover:bg-zinc-300 dark:hover:bg-zinc-600',
              copied && 'bg-green-100 dark:bg-green-900'
            )}
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
              <Copy className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Inline copy button for code blocks in MDX
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
        'bg-zinc-200 dark:bg-zinc-700',
        'hover:bg-zinc-300 dark:hover:bg-zinc-600',
        copied && 'bg-green-100 dark:bg-green-900'
      )}
      aria-label="Copy code"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
      ) : (
        <Copy className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
      )}
    </button>
  );
}
