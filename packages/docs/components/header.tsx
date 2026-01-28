'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Github, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from './theme-toggle';
import { CommandMenu } from './command-menu';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Docs', href: '/docs' },
  { name: 'API', href: '/docs/api/core' },
  { name: 'Guides', href: '/docs/guides/integration' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 dark:border-white/5 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50">
      {/* Subtle gradient overlay - Purple only */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      
      <div className="container relative flex h-16 items-center">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2 group">
          <div className="relative">
            <span className="font-bold text-lg bg-gradient-to-r from-foreground to-foreground bg-clip-text group-hover:from-primary group-hover:to-primary transition-all duration-300">
              create-markdown
            </span>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
          {navigation.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative px-4 py-2 rounded-lg transition-all duration-200',
                  isActive
                    ? 'text-foreground bg-muted/50'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                )}
              >
                {item.name}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          <CommandMenu />
          <a
            href="https://github.com/BunsDev/create-markdown"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm hover:bg-accent/50 hover:border-accent hover:shadow-glow-sm transition-all duration-200"
          >
            <Github className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </a>
          <ThemeToggle />
          
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm hover:bg-accent/50 transition-all duration-200"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation - Glassmorphic */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-background/80 backdrop-blur-xl">
          <nav className="container py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'block py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-200',
                    isActive
                      ? 'text-foreground bg-primary/10 border-l-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
            <a
              href="https://github.com/BunsDev/create-markdown"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-2.5 px-4 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-all duration-200"
            >
              GitHub
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
