"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

// ─── AuthGuard ────────────────────────────────────────────────────────────
// Wraps any page that requires authentication.
// Better Auth's useSession handles the session cookie automatically.

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/auth/login");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return <>{children}</>;
}

// ─── AdminGuard ────────────────────────────────────────────────────────────
// Requires admin role.

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const role = session?.user?.role as string | undefined;
  const roles = (role || "").split(",").map((r) => r.trim());
  const isAdmin = roles.includes("admin");

  useEffect(() => {
    if (!isPending && session && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [isPending, session, isAdmin, router]);

  if (isPending) return null;
  if (!session || !isAdmin) return null;

  return <>{children}</>;
}
