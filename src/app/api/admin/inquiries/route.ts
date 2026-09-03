import { NextResponse } from "next/server";
import { getInquiries, updateInquiryStatus } from "@/actions/inquiries";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || "1");
    const pageSize = Number(searchParams.get("pageSize") || "20");

    const result = await getInquiries(page, pageSize);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch inquiries" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (body.id && body.status) {
      const result = await updateInquiryStatus(body.id, body.status);
      return NextResponse.json(result);
    }
    return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update inquiry status" }, { status: 500 });
  }
}
