import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  className?: string;
  children?: React.ReactNode;
}

export function StatCard({ label, value, subtitle, icon: Icon, iconColor = "text-primary", className, children }: StatCardProps) {
  return (
    <div className={cn("bg-card border rounded-xl p-5 flex flex-col justify-between", className)}>
      <div className="flex justify-between items-start mb-2">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{label}</p>
        {Icon && <Icon size={18} className={iconColor} />}
      </div>
      <div>
        <div className="text-3xl font-bold tracking-tight mb-1">{value}</div>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
