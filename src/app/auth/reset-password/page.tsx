"use client";

export const runtime = "edge";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z
  .object({
    password: z.string().min(8).max(128).regex(/[A-Z]/).regex(/[0-9]/),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-8"><div className="w-6 h-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const {
    register, handleSubmit, setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    if (!token) return;
    const result = await authClient.resetPassword({ newPassword: data.password, token });
    if (result.error) {
      setError("root", { message: result.error.message ?? "Reset failed. The link may have expired." });
    } else {
      router.push("/auth/login?reset=success");
    }
  }

  if (!token) {
    return (
      <div className="space-y-2 text-center">
        <h1 className="text-xl font-semibold">Invalid link</h1>
        <p className="text-sm text-muted-foreground">This reset link is invalid or has expired.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Set new password</h1>
        <p className="text-sm text-muted-foreground">Choose a strong password for your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2">
            <p className="text-sm text-destructive">{errors.root.message}</p>
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="password">New password</Label>
          <Input id="password" type="password" placeholder="Min. 8 characters"
            autoFocus error={errors.password?.message} {...register("password")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input id="confirmPassword" type="password" placeholder="••••••••"
            error={errors.confirmPassword?.message} {...register("confirmPassword")} />
        </div>
        <Button type="submit" className="w-full" loading={isSubmitting}>Reset password</Button>
      </form>
    </div>
  );
}
