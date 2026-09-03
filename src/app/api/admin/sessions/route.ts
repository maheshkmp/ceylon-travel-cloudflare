import { NextResponse } from "next/server";
import { getAdminSessions } from "@/actions/admin";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || "1");
    const pageSize = Number(searchParams.get("pageSize") || "25");

    const result = await getAdminSessions(page, pageSize);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch sessions" }, { status: 500 });
  }
}
