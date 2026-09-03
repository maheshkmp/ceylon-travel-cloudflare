"use client";

export const runtime = "edge";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@repo/validators/auth";
import { authClient, forgetPassword } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(data: ForgotPasswordInput) {
    await forgetPassword({
      email: data.email,
      redirectTo: `${process.env["NEXT_PUBLIC_APP_URL"]}/auth/reset-password`,
    });
    setSent(true); // Always show success to prevent email enumeration
  }

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            If that email exists, we sent a reset link. Check your spam folder too.
          </p>
        </div>
        <Link href="/auth/login" className="text-sm font-medium hover:underline underline-offset-4">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Reset your password</h1>
        <p className="text-sm text-muted-foreground">Enter your email and we&apos;ll send a reset link</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com"
            autoFocus error={errors.email?.message} {...register("email")} />
        </div>
        <Button type="submit" className="w-full" loading={isSubmitting}>Send reset link</Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/auth/login" className="font-medium text-foreground hover:underline underline-offset-4">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
