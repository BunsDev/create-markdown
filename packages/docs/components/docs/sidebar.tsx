'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
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
      <div className="w-full">
        {navigation.map((section, index) => (
          <div key={index} className="pb-4">
            <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
              {section.title}
            </h4>
            {section.items && (
              <div className="grid grid-flow-row auto-rows-max text-sm">
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
          'group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline',
          isActive
            ? 'font-medium text-foreground'
            : 'text-muted-foreground'
        )}
      >
        {item.title}
      </Link>
    );
  }

  return (
    <span className="flex w-full cursor-not-allowed items-center rounded-md p-2 text-muted-foreground opacity-60">
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
        className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Toggle Menu</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="fixed left-0 top-0 z-50 h-full w-3/4 max-w-xs border-r bg-background p-6 shadow-lg">
            <Sidebar />
          </div>
        </div>
      )}
    </>
  );
}
