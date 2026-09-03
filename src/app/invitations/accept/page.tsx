"use client";

export const runtime = "edge";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@repo/validators/auth";
import { validateInvitation, acceptInvitation } from "@/actions/invitations";
import { signUp, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Loader2, Building2 } from "lucide-react";

type PageState = "loading" | "ready" | "success" | "error";

interface InvitationInfo {
  orgName: string;
  email: string;
  role: string;
  expired: boolean;
}

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={<div className="flex flex-col items-center gap-3 py-8"><div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>}>
      <AcceptInvitationContent />
    </Suspense>
  );
}

function AcceptInvitationContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const { data: session } = useSession();

  const [state, setState] = useState<PageState>("loading");
  const [invite, setInvite] = useState<InvitationInfo | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema as any) });

  // Validate invitation token on mount
  useEffect(() => {
    if (!token) {
      setState("error");
      setErrorMsg("Invalid invitation link.");
      return;
    }

    validateInvitation(token as string)
      .then((data: any) => {
        if (data.expired) {
          setState("error");
          setErrorMsg("This invitation has expired. Ask an admin to resend it.");
        } else {
          setInvite(data);
          setState("ready");
        }
      })
      .catch(() => {
        setState("error");
        setErrorMsg("Invitation not found or already used.");
      });
  }, [token]);

  // Accept as existing logged-in user
  async function acceptAsExisting() {
    try {
      await acceptInvitation(token as string);
      setState("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to accept invitation.");
      setState("error");
    }
  }

  // Register new account then accept
  async function registerAndAccept(data: RegisterInput) {
    try {
      const result = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        callbackURL: "/dashboard",
        fetchOptions: {
          // Pass invitation token so the server can link the new user to the org
          headers: { "x-invitation-token": token ?? "" },
        },
      });

      if (result.error) {
        const msg = result.error.message ?? "Registration failed";
        if (msg.toLowerCase().includes("email")) {
          setError("email", { message: "This email is already registered. Sign in instead." });
        } else {
          setError("root", { message: msg });
        }
        return;
      }

      // After sign-up, accept the invitation
      try {
        await acceptInvitation(token as string);
      } catch {
        // Best effort — user was created, they can accept later
      }

      setState("success");
    } catch (err) {
      setError("root", { message: err instanceof Error ? err.message : "Registration failed" });
    }
  }

  if (!token) {
    return (
      <div className="space-y-3 text-center">
        <XCircle className="w-10 h-10 text-destructive mx-auto" />
        <h1 className="text-xl font-semibold">Invalid link</h1>
        <p className="text-sm text-muted-foreground">This invitation link is not valid.</p>
        <Link href="/auth/login" className="text-sm font-medium underline underline-offset-4">
          Back to sign in
        </Link>
      </div>
    );
  }

  if (state === "loading") {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Validating invitation…</p>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="space-y-4 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mx-auto">
          <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-xl font-semibold">You&apos;re in!</h1>
        <p className="text-sm text-muted-foreground">
          You&apos;ve joined <strong>{invite?.orgName}</strong> as a{" "}
          <span className="capitalize">{invite?.role}</span>.
        </p>
        <Button className="w-full" onClick={() => router.push("/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="space-y-4 text-center">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <XCircle className="w-6 h-6 text-destructive" />
        </div>
        <h1 className="text-xl font-semibold">Invitation unavailable</h1>
        <p className="text-sm text-muted-foreground">{errorMsg}</p>
        <Link href="/auth/login" className="text-sm font-medium underline underline-offset-4">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Org context pill */}
      {invite && (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
          <div className="w-9 h-9 rounded-md border border-border bg-background flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">{invite.orgName}</p>
            <p className="text-xs text-muted-foreground">
              You&apos;ve been invited as{" "}
              <span className="capitalize font-medium">{invite.role}</span>
            </p>
          </div>
        </div>
      )}

      {/* Existing logged-in user */}
      {session?.user ? (
        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">Accept invitation</h1>
            <p className="text-sm text-muted-foreground">
              Click below to join <strong>{invite?.orgName}</strong> as{" "}
              <strong>{session.user.name}</strong>.
            </p>
          </div>
          <Button className="w-full" onClick={acceptAsExisting}>
            Join {invite?.orgName}
          </Button>
        </div>
      ) : (
        /* New user registration */
        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">Create your account</h1>
            <p className="text-sm text-muted-foreground">
              Set up your account to join <strong>{invite?.orgName}</strong>.
            </p>
          </div>

          <form onSubmit={handleSubmit(registerAndAccept)} className="space-y-4">
            {errors.root && (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2">
                <p className="text-sm text-destructive">{errors.root.message}</p>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" placeholder="Jane Smith" autoFocus
                error={errors.name?.message} {...register("name")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email"
                defaultValue={invite?.email ?? ""}
                placeholder="you@example.com"
                error={errors.email?.message} {...register("email")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Min. 8 characters"
                error={errors.password?.message} {...register("password")} />
            </div>
            <Button type="submit" className="w-full" loading={isSubmitting}>
              Create account &amp; join
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href={`/auth/login?redirect=/invitations/accept?token=${token}`}
              className="font-medium text-foreground underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
