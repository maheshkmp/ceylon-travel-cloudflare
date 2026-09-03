import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
// ─── Better Auth client ────────────────────────────────────────────────────
// Mirrors the server-side auth instance plugins exactly.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authClient: ReturnType<typeof createAuthClient> = createAuthClient({
  baseURL: process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000",
  plugins: [
    // Admin plugin client: role management
    adminClient(),
  ],
});

// ─── Named exports for convenience ────────────────────────────────────────

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  forgetPassword,
  resetPassword,
  verifyEmail,
  changeEmail,
  changePassword,
  deleteUser,
  updateUser,
  linkSocial,
  listSessions,
  revokeSession,
  revokeOtherSessions,
} = authClient as any;

// ─── Types ────────────────────────────────────────────────────────────────

export type AuthSession = typeof authClient.$Infer.Session;
export type AuthUser = typeof authClient.$Infer.Session.user;
