import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// if (process.env["NODE_ENV"] === "development") {
//   process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
// }

const getDatabaseUrl = (): string => {
  const url = process.env["DATABASE_URL"];
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

