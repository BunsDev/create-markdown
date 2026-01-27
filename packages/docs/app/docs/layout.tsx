import { Sidebar, MobileSidebar } from '@/components/docs/sidebar';

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      {/* Sidebar */}
      <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_200px]">
        <div className="mx-auto w-full min-w-0">
          {/* Mobile sidebar trigger */}
          <div className="flex items-center md:hidden mb-4">
            <MobileSidebar />
            <span className="font-medium">Menu</span>
          </div>
          
          {/* Content */}
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
