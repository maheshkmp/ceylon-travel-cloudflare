"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertTriangle className="w-6 h-6 text-destructive" />
      </div>
      <div className="text-center space-y-1">
        <h2 className="text-base font-semibold">Failed to load</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          {error.message || "An error occurred loading this page."}
        </p>
      </div>
      <Button size="sm" variant="outline" onClick={reset}>
        <RefreshCw className="w-3.5 h-3.5 mr-2" />
        Try again
      </Button>
    </div>
  );
}
