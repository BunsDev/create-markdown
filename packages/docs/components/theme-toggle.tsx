'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-lg',
        'bg-background/50 backdrop-blur-sm',
        'border border-border/50'
      )}>
        <span className="sr-only">Toggle theme</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={cn(
        'group relative inline-flex h-9 w-9 items-center justify-center rounded-lg overflow-hidden',
        'bg-background/50 backdrop-blur-sm',
        'border border-border/50',
        'hover:bg-accent/50 hover:border-accent',
        'hover:shadow-lg hover:shadow-primary/20',
        'transition-all duration-300'
      )}
    >
      {/* Glow effect on hover */}
      <div className={cn(
        'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
        'bg-primary/10'
      )} />
      
      {/* Sun icon */}
      <Sun className={cn(
        'relative h-4 w-4',
        'rotate-0 scale-100 transition-all duration-300',
        'text-foreground group-hover:text-primary',
        'dark:-rotate-90 dark:scale-0'
      )} />
      
      {/* Moon icon */}
      <Moon className={cn(
        'absolute h-4 w-4',
        'rotate-90 scale-0 transition-all duration-300',
        'text-primary group-hover:text-primary/80',
        'dark:rotate-0 dark:scale-100'
      )} />
      
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
