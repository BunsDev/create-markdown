import * as React from 'react';
import { AlertCircle, AlertTriangle, Info, Lightbulb, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const variants = {
  info: {
    icon: Info,
    className: 'border-blue-500/50 bg-blue-500/10 text-blue-900 dark:text-blue-100',
    iconClassName: 'text-blue-500',
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-900 dark:text-yellow-100',
    iconClassName: 'text-yellow-500',
  },
  tip: {
    icon: Lightbulb,
    className: 'border-green-500/50 bg-green-500/10 text-green-900 dark:text-green-100',
    iconClassName: 'text-green-500',
  },
  danger: {
    icon: AlertCircle,
    className: 'border-red-500/50 bg-red-500/10 text-red-900 dark:text-red-100',
    iconClassName: 'text-red-500',
  },
  note: {
    icon: Info,
    className: 'border-zinc-500/50 bg-zinc-500/10 text-zinc-900 dark:text-zinc-100',
    iconClassName: 'text-zinc-500',
  },
  success: {
    icon: CheckCircle,
    className: 'border-green-500/50 bg-green-500/10 text-green-900 dark:text-green-100',
    iconClassName: 'text-green-500',
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
        'my-6 flex gap-3 rounded-lg border p-4',
        variant.className,
        className
      )}
      role="alert"
    >
      <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', variant.iconClassName)} />
      <div className="flex-1 space-y-1">
        {title && (
          <p className="font-medium leading-none">{title}</p>
        )}
        <div className="text-sm [&_p]:leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
