"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  authClient,
  signIn,
  signUp,
  signOut,
  useSession,
} from "@/lib/auth-client";
import { useToast } from "@/hooks/use-toast";
import type { LoginInput, RegisterInput } from "@repo/validators/auth";

// ─── useAuth ───────────────────────────────────────────────────────────────
// Primary auth hook — provides login, register, logout + current session.

export function useAuth() {
  const router = useRouter();
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: session, isPending } = useSession();

  // ── Login ─────────────────────────────────────────────────────────────
  async function login(input: LoginInput) {
    const result = await signIn.email({
      email: input.email,
      password: input.password,
      callbackURL: "/dashboard",
    });

    if (result.error) {
      throw new Error(result.error.message ?? "Invalid credentials");
    }

    router.push("/dashboard");
    router.refresh();
  }

  // ── Register ──────────────────────────────────────────────────────────
  async function register(input: RegisterInput) {
    const result = await signUp.email({
      email: input.email,
      password: input.password,
      name: input.name,
      callbackURL: "/dashboard",
    });

    if (result.error) {
      throw new Error(result.error.message ?? "Registration failed");
    }

    toast({ title: "Account created!", description: "Check your email to verify your account." });
    router.push("/dashboard");
    router.refresh();
  }

  // ── Logout ────────────────────────────────────────────────────────────
  async function logout() {
    await signOut({ fetchOptions: { onSuccess: () => {
      qc.clear();
      router.push("/auth/login");
      router.refresh();
    }}});
  }

  return {
    user: session?.user ?? null,
    session: session?.session ?? null,
    isAuthenticated: !!session?.user,
    isLoading: isPending,
    login,
    register,
    logout,
  };
}

// ─── useMe ────────────────────────────────────────────────────────────────
// Lightweight hook that just returns the current user.

export function useMe() {
  const { data: session, isPending } = useSession();
  return {
    user: session?.user ?? null,
    isLoading: isPending,
  };
}
