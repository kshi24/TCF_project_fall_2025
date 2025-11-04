import React from 'react';

import { cn } from './utils';

const baseClasses =
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 transition-[color,box-shadow] overflow-hidden [&>svg]:size-3 [&>svg]:pointer-events-none focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:border-ring';

const variantClasses = {
  default:
    'border-transparent bg-primary text-primary-foreground hover:bg-primary/90',
  secondary:
    'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90',
  destructive:
    'border-transparent bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20',
  outline: 'text-foreground hover:bg-accent hover:text-accent-foreground',
};

export function Badge({ className, variant = 'default', ...props }) {
  const classes = cn(baseClasses, variantClasses[variant] || '', className);

  return <span data-slot="badge" className={classes} {...props} />;
}
