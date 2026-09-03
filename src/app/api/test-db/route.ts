import { getDb } from "@/db/client";
import { sessions } from "@/db/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = 'edge';



export async function GET() {
  try {
    const db = getDb();
    const token = "Nzx7nldsjj8UWw0ZbYiaP52PMZoHaoFM";
    
    // Simulate what Better Auth does
    const res = await db.execute(
      sql`select "id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id" from "session" where "session"."token" = ${token}`
    );
    
    return NextResponse.json({ success: true, data: res });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, stack: err.stack, details: err });
  }
}
