"use client";

export const runtime = "edge";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

type State = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const params = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setState("error");
      setErrorMsg("No verification token provided.");
      return;
    }

    // Better Auth verify-email endpoint
    authClient
      .verifyEmail({ query: { token } })
      .then((result) => {
        if (result.error) {
          setState("error");
          setErrorMsg(result.error.message ?? "Verification failed. The link may have expired.");
        } else {
          setState("success");
        }
      })
      .catch(() => {
        setState("error");
        setErrorMsg("Verification failed. The link may have expired.");
      });
  }, [token]);

  return (
    <div className="space-y-6 text-center">
      {state === "loading" && (
        <>
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">Verifying your email…</h1>
            <p className="text-sm text-muted-foreground">This will only take a moment.</p>
          </div>
        </>
      )}

      {state === "success" && (
        <>
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">Email verified!</h1>
            <p className="text-sm text-muted-foreground">
              Your email address has been confirmed. You can now sign in.
            </p>
          </div>
          <Link href="/auth/login" className={`w-full ${buttonVariants()}`}>Continue to sign in</Link>
        </>
      )}

      {state === "error" && (
        <>
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-destructive" />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">Verification failed</h1>
            <p className="text-sm text-muted-foreground">{errorMsg}</p>
          </div>
          <Link href="/auth/login" className={`w-full ${buttonVariants({ variant: "outline" })}`}>Back to sign in</Link>
        </>
      )}
    </div>
  );
}
