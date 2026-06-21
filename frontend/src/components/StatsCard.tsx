import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  className?: string;
}

export function StatsCard({ title, value, description, icon: Icon, className }: StatsCardProps) {
  return (
    <div className={cn('glass p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden group', className)}>
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>
      
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground/70">{title}</p>
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div className="mt-2">
        <h3 className="text-3xl font-bold text-foreground">{value}</h3>
        {description && (
          <p className="text-xs text-foreground/50 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
