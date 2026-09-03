import { betterAuth } from "better-auth";
import { admin as adminPlugin, bearer } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "@/db/client";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  secret: process.env["BETTER_AUTH_SECRET"] ?? "default_secret_for_build_phase_min_32_chars",
  database: drizzleAdapter(getDb(), {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  baseURL: process.env["NEXT_PUBLIC_APP_URL"] ?? process.env["API_URL"] ?? "http://localhost:3000",
  trustedOrigins: [process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    adminPlugin({
      adminRole: "admin",
      defaultRole: "user",
    }),
    bearer(),
  ],
  advanced: {
    cookiePrefix: "saas",
    generateId: () => crypto.randomUUID(),
  },
});

export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
