import React from 'react';
import { cn } from '@/lib/utils';

export default function StatCard({ title, value, icon: Icon, color = "primary", trend }) {
  const colorMap = {
    primary: "bg-primary/10 text-primary",
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
    destructive: "bg-red-50 text-red-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-heading font-bold mt-2">{value}</p>
          {trend && (
            <p className="text-xs text-muted-foreground mt-2">{trend}</p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", colorMap[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}