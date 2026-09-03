// Client-safe env access — only NEXT_PUBLIC_ vars
// This file is imported by client components

export const env = {
  NEXT_PUBLIC_API_URL: process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001",
  NEXT_PUBLIC_APP_URL: process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000",
  NEXT_PUBLIC_APP_NAME: process.env["NEXT_PUBLIC_APP_NAME"] ?? "CeylonTravels",
  NEXT_PUBLIC_SENTRY_DSN: process.env["NEXT_PUBLIC_SENTRY_DSN"],
  NEXT_PUBLIC_POSTHOG_KEY: process.env["NEXT_PUBLIC_POSTHOG_KEY"],
  NEXT_PUBLIC_POSTHOG_HOST: process.env["NEXT_PUBLIC_POSTHOG_HOST"] ?? "https://app.posthog.com",
  NEXT_PUBLIC_ENABLE_BILLING: process.env["NEXT_PUBLIC_ENABLE_BILLING"] === "true",
  NEXT_PUBLIC_ENABLE_TEAMS: process.env["NEXT_PUBLIC_ENABLE_TEAMS"] !== "false",
} as const;

export type AppEnv = typeof env;
