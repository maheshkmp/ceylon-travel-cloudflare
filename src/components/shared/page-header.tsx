import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6", className)}>
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">{children}</div>}
    </div>
  );
}


interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  isLoading?: boolean;
}

export function StatCard({ label, value, change, trend, isLoading }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
      {isLoading ? (
        <div className="mt-2 h-8 w-24 rounded bg-muted animate-skeleton" />
      ) : (
        <p className="mt-1.5 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      )}
      {change && (
        <p className={cn(
          "mt-1 text-xs font-medium",
          trend === "up" && "text-emerald-600 dark:text-emerald-400",
          trend === "down" && "text-red-600 dark:text-red-400",
          trend === "neutral" && "text-muted-foreground"
        )}>
          {change}
        </p>
      )}
    </div>
  );
}
