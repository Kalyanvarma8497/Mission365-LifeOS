import React from 'react';
import { cn } from '@/lib/utils';

export function SectionTitle({ title, className }: { title: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-4 py-2", className)}>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground shrink-0">{title}</h3>
      <div className="h-px bg-border flex-1" />
    </div>
  );
}
