import { Sidebar, MobileSidebar } from '@/components/docs/sidebar';

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
      {/* Sidebar - Glassmorphic */}
      <aside className="fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] w-full shrink-0 md:sticky md:block">
        <div className="h-full pr-2">
          <div className="h-full rounded-2xl bg-background/40 dark:bg-background/20 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-xl shadow-black/5 dark:shadow-black/10 overflow-hidden">
            <Sidebar />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_200px]">
        <div className="mx-auto w-full min-w-0">
          {/* Mobile sidebar trigger - Glassmorphic */}
          <div className="flex items-center md:hidden mb-6 p-3 rounded-xl bg-background/50 dark:bg-background/30 backdrop-blur-md border border-white/10 dark:border-white/5">
            <MobileSidebar />
            <span className="font-medium bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Menu</span>
          </div>
          
          {/* Content - Glassmorphic container */}
          <div className="relative rounded-2xl bg-background/50 dark:bg-background/30 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-xl shadow-black/5 dark:shadow-black/10 p-6 lg:p-8">
            {/* Subtle gradient overlay - Purple only */}
            <div className="absolute inset-0 rounded-2xl bg-primary/5 pointer-events-none" />
            
            {/* Prose content */}
            <div className="relative prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:no-underline">
              {children}
            </div>
            
            {/* Inner ring */}
            <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-white/10 dark:ring-white/5" />
          </div>
        </div>
      </main>
    </div>
  );
}
