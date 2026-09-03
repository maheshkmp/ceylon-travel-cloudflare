"use client";

import { useToast } from "@/hooks/use-toast";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto flex items-start gap-3 rounded-lg border shadow-lg p-4 text-sm",
            "animate-slide-in-bottom bg-background",
            t.variant === "destructive"
              ? "border-destructive/30 bg-destructive/5"
              : "border-border"
          )}
        >
          {t.variant === "destructive" ? (
            <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className={cn("font-medium", t.variant === "destructive" && "text-destructive")}>
              {t.title}
            </p>
            {t.description && (
              <p className="mt-0.5 text-muted-foreground text-xs">{t.description}</p>
            )}
          </div>
          <button
            onClick={() => dismiss(t.id)}
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
