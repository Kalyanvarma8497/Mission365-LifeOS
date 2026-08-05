import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  label?: string;
  value: number;
  max?: number;
  valueLabel?: string;
  colorClass?: string;
}

export function ProgressBar({ label, value, max = 100, valueLabel, colorClass = "bg-primary" }: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className="w-full space-y-2">
      {(label || valueLabel) && (
        <div className="flex justify-between items-end text-sm">
          {label && <span className="font-medium">{label}</span>}
          {valueLabel && <span className="text-muted-foreground text-xs">{valueLabel}</span>}
        </div>
      )}
      <Progress value={percentage} className="h-2 bg-secondary" indicatorClassName={colorClass} />
    </div>
  );
}
