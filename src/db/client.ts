import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// if (process.env["NODE_ENV"] === "development") {
//   process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
// }

const getDatabaseUrl = (): string => {
  let url = process.env["DATABASE_URL"];

  if (!url || url.includes("placeholder")) {
    try {
      const { getRequestContext } = require("@cloudflare/next-on-pages");
      const ctx = getRequestContext();
      if (ctx?.env?.DATABASE_URL) {
        url = ctx.env.DATABASE_URL;
      }
    } catch {
      // Ignored if not running inside Cloudflare Workers
    }
  }

  if (!url) {
    return "postgresql://placeholder:placeholder@localhost:5432/placeholder";
  }
  return url;
};

// Singleton connection pool

export function getDb() {
  const connectionString = getDatabaseUrl();
  const sql = neon(connectionString);

  return drizzle(sql, {
    schema,
  });
}

export type Database = ReturnType<typeof getDb>;

// Graceful shutdown

