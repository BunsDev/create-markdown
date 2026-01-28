import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'group relative rounded-2xl overflow-hidden',
      'bg-card/80 dark:bg-card/50 backdrop-blur-xl',
      'border border-border/50 dark:border-white/10',
      'shadow-lg shadow-black/5 dark:shadow-black/20',
      'hover:shadow-xl hover:shadow-purple-500/5 dark:hover:shadow-purple-500/10',
      'transition-all duration-300',
      className
    )}
    {...props}
  >
    {/* Gradient hover overlay - Purple only */}
    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    
    {/* Inner ring */}
    <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-white/10 dark:ring-white/5" />
    
    {/* Content wrapper */}
    <div className="relative">
      {props.children}
    </div>
  </div>
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

// Glassmorphic variant for special use cases
const GlassCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'group relative rounded-2xl overflow-hidden',
      'bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl',
      'border border-white/20 dark:border-white/10',
      'shadow-xl shadow-black/10 dark:shadow-black/30',
      'hover:shadow-2xl hover:shadow-purple-500/10',
      'hover:border-white/30 dark:hover:border-white/20',
      'transition-all duration-300',
      className
    )}
    {...props}
  >
    {/* Animated gradient border on hover - Purple only */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div className="absolute inset-0 bg-primary/20 blur-xl" />
    </div>
    
    {/* Content wrapper */}
    <div className="relative">
      {props.children}
    </div>
  </div>
));
GlassCard.displayName = 'GlassCard';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, GlassCard };
