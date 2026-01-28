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
        <div className="fixed inset-0 z-50">
          {/* Glassmorphic backdrop */}
          <div 
            className="fixed inset-0 bg-background/60 backdrop-blur-md" 
            onClick={() => setOpen(false)}
          />
          
          {/* Glassmorphic dialog */}
          <div className="fixed left-[50%] top-[20%] z-50 w-full max-w-lg translate-x-[-50%] p-4">
            {/* Gradient glow behind - Purple only */}
            <div className="absolute inset-0 -m-4 bg-primary/20 blur-3xl opacity-50" />
            
            <Command className={cn(
              'relative rounded-2xl overflow-hidden',
              'bg-popover/90 dark:bg-popover/80 backdrop-blur-2xl',
              'border border-white/20 dark:border-white/10',
              'shadow-2xl shadow-black/20',
              'text-popover-foreground'
            )}>
              {/* Search input */}
              <div className="flex items-center border-b border-border/50 px-4 bg-muted/30">
                <Search className="mr-3 h-4 w-4 shrink-0 text-muted-foreground" />
                <Command.Input
                  placeholder="Search documentation..."
                  className="flex h-12 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              
              <Command.List className="max-h-[320px] overflow-y-auto p-2">
                <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
                  No results found.
                </Command.Empty>
                
                <Command.Group heading="Pages" className="px-2 py-2">
                  <div className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider mb-2">
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
                        'aria-selected:bg-primary/10',
                        'aria-selected:border-l-2 aria-selected:border-primary',
                        'hover:bg-muted/50',
                        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                      )}
                    >
                      <div className={cn(
                        'mr-3 flex h-8 w-8 items-center justify-center rounded-lg',
                        'bg-muted/50 dark:bg-white/5',
                        'border border-border/50 dark:border-white/10'
                      )}>
                        <page.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="flex-1 font-medium">{page.title}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-aria-selected:text-foreground transition-transform group-aria-selected:translate-x-0.5" />
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
              
              {/* Footer hint */}
              <div className="flex items-center justify-between border-t border-border/50 bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
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
