import { NextResponse } from "next/server";
import { getAuditLogs, getAuditLogStats } from "@/actions/audit-logs";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");

    if (mode === "stats") {
      const stats = await getAuditLogStats();
      return NextResponse.json(stats);
    }

    const page = Number(searchParams.get("page") || "1");
    const pageSize = Number(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || undefined;
    const resource = searchParams.get("resource") || undefined;
    const status = searchParams.get("status") || undefined;

    const result = await getAuditLogs(page, pageSize, search, resource, status);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch audit logs" }, { status: 500 });
  }
}
