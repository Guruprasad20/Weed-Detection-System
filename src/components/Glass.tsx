import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const Glass = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={cn(
    "rounded-xl border border-border/60 bg-card/60 backdrop-blur-md shadow-card-custom",
    className,
  )}>
    {children}
  </div>
);

export const PageHeader = ({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
    <div>
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
    {right}
  </div>
);
