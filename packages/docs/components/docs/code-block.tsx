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
    <div className={cn('group relative my-4 rounded-lg border bg-zinc-950 dark:bg-zinc-900 overflow-hidden', className)}>
      {/* Header with filename */}
      {(filename || language) && (
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2 text-sm">
          <span className="text-zinc-400">{filename || language}</span>
          {language && !filename && (
            <span className="text-xs uppercase text-zinc-500">{language}</span>
          )}
        </div>
      )}
      
      {/* Code content */}
      <div className="relative">
        <pre
          className={cn(
            'overflow-x-auto p-4 text-sm text-zinc-100',
            showLineNumbers && 'pl-12'
          )}
        >
          <code className={language ? `language-${language}` : undefined}>
            {children}
          </code>
        </pre>
        
        {/* Copy button */}
        <button
          onClick={copy}
          className="absolute right-2 top-2 rounded-md p-2 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-zinc-800"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 text-zinc-400" />
          )}
        </button>
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
      className="absolute right-2 top-2 rounded-md p-2 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-zinc-800"
      aria-label="Copy code"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4 text-zinc-400" />
      )}
    </button>
  );
}
