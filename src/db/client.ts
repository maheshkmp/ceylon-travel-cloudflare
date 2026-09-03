import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// if (process.env["NODE_ENV"] === "development") {
//   process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
// }

const getDatabaseUrl = (): string => {
  const url = process.env["DATABASE_URL"];
  if (!url) {
    if (process.env.NEXT_PHASE === "phase-production-build" || process.env.NODE_ENV === "production") {
      return "postgresql://placeholder:placeholder@localhost:5432/placeholder";
    }
    throw new Error("DATABASE_URL environment variable is required");
  }
  return url;
};

// Singleton connection pool

let db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (db) return db;


  const sql = neon(getDatabaseUrl(), {
    fetchOptions: {
      cache: "no-store",
    },
  });


  db = drizzle(sql, {
    schema,
    logger: process.env["NODE_ENV"] === "development",
  });

  return db;
}

export type Database = ReturnType<typeof getDb>;

// Graceful shutdown

