import { NextResponse } from "next/server";
import { getItineraries, createItinerary, reorderItineraries } from "@/actions/itineraries";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || "1");
    const pageSize = Number(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;

    const result = await getItineraries(page, pageSize, search, status);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch itineraries" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createItinerary(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create itinerary" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (Array.isArray(body)) {
      await reorderItineraries(body);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Invalid payload for reorder" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to reorder itineraries" }, { status: 500 });
  }
}
