import { z } from "zod";

// ─── API Env Schema ───────────────────────────────────────────────────────

export const apiEnvSchema = z.object({
  // Server
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3001),
  API_URL: z.string().url(),
  WEB_URL: z.string().url(),

  // Database
  DATABASE_URL: z.string().url(),
  DATABASE_POOL_MAX: z.coerce.number().default(10),
  DATABASE_POOL_MIN: z.coerce.number().default(2),

  // Redis
  REDIS_URL: z.string().url().optional(),
  REDIS_PASSWORD: z.string().optional(),

  // Better Auth
  BETTER_AUTH_SECRET: z.string().min(32, "Better Auth secret must be at least 32 characters"),
  BETTER_AUTH_URL: z.string().url().optional(),

  // Email
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_SECURE: z.coerce.boolean().default(false),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().email().default("noreply@example.com"),
  EMAIL_FROM_NAME: z.string().default("CeylonTravels"),

  // S3 / R2
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().default("auto"),
  S3_ENDPOINT: z.string().url().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  CDN_URL: z.string().url().optional(),

  // Observability
  SENTRY_DSN: z.string().url().optional(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),

  // Misc
  ENCRYPTION_KEY: z.string().min(32, "Encryption key must be at least 32 characters"),
});

export type ApiEnv = z.infer<typeof apiEnvSchema>;

// ─── Web Env Schema ───────────────────────────────────────────────────────

export const webEnvSchema = z.object({
  // Next.js
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().default("CeylonTravels"),

  // Analytics / monitoring
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),

  // Feature flags
  NEXT_PUBLIC_ENABLE_BILLING: z.coerce.boolean().default(false),
  NEXT_PUBLIC_ENABLE_TEAMS: z.coerce.boolean().default(true),
});

export type WebEnv = z.infer<typeof webEnvSchema>;

// ─── Validation helpers ───────────────────────────────────────────────────

export function validateApiEnv(env: NodeJS.ProcessEnv): ApiEnv {
  const result = apiEnvSchema.safeParse(env);
  if (!result.success) {
    console.error("❌ Invalid API environment variables:");
    console.error(result.error.flatten().fieldErrors);
    process.exit(1);
  }
  return result.data;
}

export function validateWebEnv(env: NodeJS.ProcessEnv): WebEnv {
  const result = webEnvSchema.safeParse(env);
  if (!result.success) {
    console.error("❌ Invalid Web environment variables:");
    console.error(result.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }
  return result.data;
}
