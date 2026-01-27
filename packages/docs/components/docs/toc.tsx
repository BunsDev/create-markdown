'use client';

import * as React from 'react';
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
        {items.map((item) => (
          <li
            key={item.id}
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

// Utility to extract headings from content
export function extractHeadings(content: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2];
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    headings.push({ id, text, level });
  }

  return headings;
}
