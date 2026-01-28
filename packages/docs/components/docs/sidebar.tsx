'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NavItem {
  title: string;
  href?: string;
  items?: NavItem[];
}

const navigation: NavItem[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs' },
      { title: 'Installation', href: '/docs/installation' },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { title: 'Core', href: '/docs/api/core' },
      { title: 'Preview', href: '/docs/api/preview' },
      { title: 'React', href: '/docs/api/react' },
      { title: 'MDX', href: '/docs/api/mdx' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { title: 'Integration', href: '/docs/guides/integration' },
    ],
  },
  {
    title: 'Community',
    items: [
      { title: 'Contributing', href: '/docs/contributing' },
      { title: 'Roadmap', href: '/docs/roadmap' },
      { title: 'Changelog', href: '/docs/changelog' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <ScrollArea className="h-full py-6 pr-6 lg:py-8">
      <div className="w-full space-y-6">
        {navigation.map((section, index) => (
          <div key={index} className="space-y-2">
            <h4 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              {section.title}
            </h4>
            {section.items && (
              <div className="grid grid-flow-row auto-rows-max text-sm gap-0.5">
                {section.items.map((item, itemIndex) => (
                  <SidebarItem
                    key={itemIndex}
                    item={item}
                    pathname={pathname}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function SidebarItem({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string | null;
}) {
  const isActive = pathname === item.href;

  if (item.href) {
    return (
      <Link
        href={item.href}
        className={cn(
          'group relative flex w-full items-center rounded-lg px-3 py-2 transition-all duration-200',
          isActive
            ? 'text-foreground font-medium bg-primary/10 shadow-sm'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
        )}
      >
        {/* Active indicator */}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-primary" />
        )}
        <span className={cn(isActive && 'ml-1')}>{item.title}</span>
        {/* Hover glow effect */}
        <div className={cn(
          'absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none',
          'bg-primary/5'
        )} />
      </Link>
    );
  }

  return (
    <span className="flex w-full cursor-not-allowed items-center rounded-lg px-3 py-2 text-muted-foreground/50">
      {item.title}
    </span>
  );
}

// Mobile sidebar trigger
export function MobileSidebar() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  // Close on route change
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mr-2 inline-flex items-center justify-center rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 md:hidden"
      >
        <ChevronRight className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Glassmorphic backdrop */}
          <div
            className="fixed inset-0 bg-background/60 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />
          
          {/* Glassmorphic sidebar drawer */}
          <div className="fixed left-0 top-0 z-50 h-full w-[280px] max-w-[85vw] border-r border-white/10 bg-background/80 backdrop-blur-xl shadow-2xl shadow-black/20">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="font-semibold text-sm text-primary">
                Navigation
              </span>
              <button
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* Sidebar content */}
            <div className="p-4">
              <Sidebar />
            </div>
            
            {/* Decorative gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
          </div>
        </div>
      )}
    </>
  );
}
