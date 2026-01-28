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
        className={cn(
          'inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm',
          'bg-background/50 backdrop-blur-sm',
          'border border-border/50',
          'text-muted-foreground',
          'hover:bg-accent/50 hover:border-accent/50 hover:text-foreground',
          'transition-all duration-200'
        )}
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline-flex">Search docs...</span>
        <kbd className={cn(
          'pointer-events-none hidden h-5 select-none items-center gap-1 rounded-md px-1.5 font-mono text-[10px] font-medium sm:flex',
          'bg-muted/80 backdrop-blur-sm border border-border/50'
        )}>
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100]">
          {/* Solid backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={() => setOpen(false)}
          />
          
          {/* Dialog */}
          <div className="fixed left-[50%] top-[20%] z-[101] w-full max-w-lg translate-x-[-50%] p-4">
            <Command className={cn(
              'relative rounded-2xl overflow-hidden',
              'bg-zinc-900 border border-zinc-700',
              'shadow-2xl shadow-black/50'
            )}>
              {/* Search input */}
              <div className="flex items-center border-b border-zinc-700 px-4 bg-zinc-800">
                <Search className="mr-3 h-4 w-4 shrink-0 text-zinc-400" />
                <Command.Input
                  placeholder="Search documentation..."
                  className="flex h-12 w-full bg-transparent py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              
              <Command.List className="max-h-[320px] overflow-y-auto p-2 bg-zinc-900">
                <Command.Empty className="py-8 text-center text-sm text-zinc-500">
                  No results found.
                </Command.Empty>
                
                <Command.Group heading="Pages" className="px-2 py-2">
                  <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                    Pages
                  </div>
                  {pages.map((page) => (
                    <Command.Item
                      key={page.href}
                      value={page.title}
                      onSelect={() => runCommand(() => router.push(page.href))}
                      className={cn(
                        'relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none',
                        'transition-all duration-150',
                        'text-zinc-300',
                        'aria-selected:bg-violet-600/20 aria-selected:text-white',
                        'hover:bg-zinc-800',
                        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                      )}
                    >
                      <div className={cn(
                        'mr-3 flex h-8 w-8 items-center justify-center rounded-lg',
                        'bg-zinc-800 border border-zinc-700'
                      )}>
                        <page.icon className="h-4 w-4 text-zinc-400" />
                      </div>
                      <span className="flex-1 font-medium">{page.title}</span>
                      <ArrowRight className="h-4 w-4 text-zinc-600" />
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
              
              {/* Footer hint */}
              <div className="flex items-center justify-between border-t border-zinc-700 bg-zinc-800 px-4 py-2 text-xs text-zinc-500">
                <span>Navigate with ↑↓</span>
                <span>Select with ↵</span>
              </div>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}
