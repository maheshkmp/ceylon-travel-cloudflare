import { cn } from "@/lib/utils";
import type { Role } from "@repo/types";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "success" | "warning" | "danger" | "outline";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        variant === "default" && "bg-primary/10 text-primary ring-primary/20",
        variant === "secondary" && "bg-secondary text-secondary-foreground ring-border",
        variant === "success" && "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800",
        variant === "warning" && "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-800",
        variant === "danger" && "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950 dark:text-red-300 dark:ring-red-800",
        variant === "outline" && "bg-transparent text-foreground ring-border",
        className
      )}
    >
      {children}
    </span>
  );
}

const roleVariantMap: Record<Role, BadgeProps["variant"]> = {
  user: "secondary",
  admin: "default",

  teacher: "default",
  student: "success",
  affiliates: "outline",
};

const roleLabelMap: Record<Role, string> = {
  user: "User",
  admin: "Admin",

  teacher: "Teacher",
  student: "Student",
  affiliates: "Affiliate",
};

export function RoleBadge({ role }: { role: string }) {
  const roles = (role || "user").split(",").map(r => r.trim() as Role);
  return (
    <div className="flex flex-wrap gap-1">
      {roles.map(r => (
        <Badge key={r} variant={roleVariantMap[r] ?? "secondary"} className="px-1.5 py-0 text-[10px] tracking-tight">
          {roleLabelMap[r] ?? r}
        </Badge>
      ))}
    </div>
  );
}

export function PlanBadge({ plan }: { plan: "free" | "pro" | "enterprise" }) {
  const map = {
    free: { variant: "secondary" as const, label: "Free" },
    pro: { variant: "default" as const, label: "Pro" },
    enterprise: { variant: "warning" as const, label: "Enterprise" },
  };
  const { variant, label } = map[plan];
  return <Badge variant={variant}>{label}</Badge>;
}

export function VerifiedBadge({ verified }: { verified: boolean }) {
  return (
    <Badge variant={verified ? "success" : "warning"}>
      {verified ? "Verified" : "Unverified"}
    </Badge>
  );
}
