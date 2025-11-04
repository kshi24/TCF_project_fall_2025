import React from 'react';

import { cn } from './utils';

export function Progress({ className, value = 0, ...props }) {
  return (
    <div
      data-slot="progress"
      className={cn(
        'bg-primary/20 relative h-2 w-full overflow-hidden rounded-full',
        className
      )}
      {...props}
    >
      <div
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-transform duration-300"
        style={{ transform: `translateX(-${Math.max(0, 100 - value)}%)` }}
      />
    </div>
  );
}
