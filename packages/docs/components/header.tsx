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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">create-markdown</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname?.startsWith(item.href)
                  ? 'text-foreground'
                  : 'text-foreground/60'
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          <CommandMenu />
          <a
            href="https://github.com/BunsDev/create-markdown"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Github className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </a>
          <ThemeToggle />
          
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
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

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block py-2 text-sm font-medium transition-colors hover:text-foreground/80',
                  pathname?.startsWith(item.href)
                    ? 'text-foreground'
                    : 'text-foreground/60'
                )}
              >
                {item.name}
              </Link>
            ))}
            <a
              href="https://github.com/BunsDev/create-markdown"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-2 text-sm font-medium text-foreground/60 hover:text-foreground/80"
            >
              GitHub
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
