import * as React from 'react';
import { AlertCircle, AlertTriangle, Info, Lightbulb, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const variants = {
  info: {
    icon: Info,
    className: 'border-blue-400/30 bg-blue-500/10 dark:bg-blue-500/5 text-blue-900 dark:text-blue-100 shadow-blue-500/10',
    iconClassName: 'text-blue-500',
    glowColor: 'from-blue-500/20',
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-yellow-400/30 bg-yellow-500/10 dark:bg-yellow-500/5 text-yellow-900 dark:text-yellow-100 shadow-yellow-500/10',
    iconClassName: 'text-yellow-500',
    glowColor: 'from-yellow-500/20',
  },
  tip: {
    icon: Lightbulb,
    className: 'border-emerald-400/30 bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-900 dark:text-emerald-100 shadow-emerald-500/10',
    iconClassName: 'text-emerald-500',
    glowColor: 'from-emerald-500/20',
  },
  danger: {
    icon: AlertCircle,
    className: 'border-red-400/30 bg-red-500/10 dark:bg-red-500/5 text-red-900 dark:text-red-100 shadow-red-500/10',
    iconClassName: 'text-red-500',
    glowColor: 'from-red-500/20',
  },
  note: {
    icon: Info,
    className: 'border-zinc-400/30 bg-zinc-500/10 dark:bg-zinc-500/5 text-zinc-900 dark:text-zinc-100 shadow-zinc-500/10',
    iconClassName: 'text-zinc-500',
    glowColor: 'from-zinc-500/20',
  },
  success: {
    icon: CheckCircle,
    className: 'border-green-400/30 bg-green-500/10 dark:bg-green-500/5 text-green-900 dark:text-green-100 shadow-green-500/10',
    iconClassName: 'text-green-500',
    glowColor: 'from-green-500/20',
  },
};

interface CalloutProps {
  type?: keyof typeof variants;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Callout({
  type = 'info',
  title,
  children,
  className,
}: CalloutProps) {
  const variant = variants[type];
  const Icon = variant.icon;

  return (
    <div
      className={cn(
        'group relative my-6 overflow-hidden rounded-xl border backdrop-blur-sm shadow-lg',
        variant.className,
        className
      )}
      role="alert"
    >
      {/* Gradient accent on left edge */}
      <div className={cn(
        'absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b',
        variant.glowColor,
        'to-transparent'
      )} />
      
      {/* Subtle hover glow effect */}
      <div className={cn(
        'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none',
        'bg-gradient-to-r',
        variant.glowColor,
        'to-transparent'
      )} />
      
      {/* Content */}
      <div className="relative flex gap-3 p-4">
        <div className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
          'bg-white/50 dark:bg-white/10 backdrop-blur-sm',
          'border border-white/20 dark:border-white/10'
        )}>
          <Icon className={cn('h-4 w-4', variant.iconClassName)} />
        </div>
        <div className="flex-1 space-y-1 pt-1">
          {title && (
            <p className="font-semibold leading-none">{title}</p>
          )}
          <div className="text-sm [&_p]:leading-relaxed opacity-90">{children}</div>
        </div>
      </div>
    </div>
  );
}
