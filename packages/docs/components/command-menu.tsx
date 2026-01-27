'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { Search, FileText, Book, Code, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const pages = [
  { title: 'Getting Started', href: '/docs', icon: Book },
  { title: 'Core API', href: '/docs/api/core', icon: Code },
  { title: 'Preview API', href: '/docs/api/preview', icon: Code },
  { title: 'React API', href: '/docs/api/react', icon: Code },
  { title: 'MDX API', href: '/docs/api/mdx', icon: Code },
  { title: 'Integration Guide', href: '/docs/guides/integration', icon: FileText },
  { title: 'Contributing', href: '/docs/contributing', icon: FileText },
  { title: 'Roadmap', href: '/docs/roadmap', icon: FileText },
  { title: 'Changelog', href: '/docs/changelog', icon: FileText },
];

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline-flex">Search docs...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm" 
            onClick={() => setOpen(false)}
          />
          
          {/* Dialog */}
          <div className="fixed left-[50%] top-[20%] z-50 w-full max-w-lg translate-x-[-50%] p-4">
            <Command className="rounded-lg border bg-popover text-popover-foreground shadow-lg overflow-hidden">
              <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Command.Input
                  placeholder="Search documentation..."
                  className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Command.List className="max-h-[300px] overflow-y-auto p-2">
                <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                  No results found.
                </Command.Empty>
                <Command.Group heading="Pages" className="text-xs text-muted-foreground px-2 py-1.5">
                  {pages.map((page) => (
                    <Command.Item
                      key={page.href}
                      value={page.title}
                      onSelect={() => runCommand(() => router.push(page.href))}
                      className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    >
                      <page.icon className="mr-2 h-4 w-4" />
                      <span>{page.title}</span>
                      <ArrowRight className="ml-auto h-4 w-4 opacity-50" />
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}
