import { NextResponse } from "next/server";
import { getDestinationById, updateDestination, deleteDestination } from "@/actions/destinations";

export const runtime = "edge";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const destination = await getDestinationById(id);
    if (!destination) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 });
    }
    return NextResponse.json(destination);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch destination" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = await updateDestination(id, body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update destination" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteDestination(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete destination" }, { status: 500 });
  }
}
