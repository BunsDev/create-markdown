'use client';

import * as React from 'react';
import GitHubSlugger from 'github-slugger';
import { List, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items?: TocItem[];
}

export function TableOfContents({ items = [] }: TableOfContentsProps) {
  const [activeId, setActiveId] = React.useState<string>('');

  React.useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0% 0% -80% 0%' }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      items.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="font-medium">On This Page</p>
      <ul className="m-0 list-none text-sm">
        {items.map((item, index) => (
          <li
            key={`${item.id}-${index}`}
            className={cn(
              'mt-0 pt-2',
              item.level === 3 && 'pl-4'
            )}
          >
            <a
              href={`#${item.id}`}
              className={cn(
                'inline-block no-underline transition-colors hover:text-foreground',
                activeId === item.id
                  ? 'font-medium text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Collapsible TOC for small screens - shown at top like the menu */
export function MobileTOC({ items = [] }: TableOfContentsProps) {
  const [open, setOpen] = React.useState(false);

  if (items.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="xl:hidden flex items-center z-50 gap-2 w-full mb-4 p-3 rounded-xl bg-background/50 dark:bg-background/30 backdrop-blur-md border border-white/10 dark:border-white/5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all"
      >
        <List className="h-4 w-4 shrink-0" />
        On this page
      </button>

      {open && (
        <div className="xl:hidden fixed inset-0 z-[100]">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-x-0 top-0 z-[101] max-h-[70vh] overflow-auto rounded-b-2xl border-b border-x border-white/10 bg-background/95 dark:bg-background backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="font-semibold text-sm">On this page</span>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4">
              <TableOfContents items={items} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Utility to extract headings from content (use @/lib/mdx extractHeadings for doc pages).
// Uses github-slugger so ids are unique and match rehype-slug output.
export function extractHeadings(content: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: TocItem[] = [];
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
