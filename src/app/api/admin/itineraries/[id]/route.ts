import { NextResponse } from "next/server";
import { getItineraryById, updateItinerary, deleteItinerary, updateItineraryStatus } from "@/actions/itineraries";

export const runtime = "edge";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const itinerary = await getItineraryById(id);
    if (!itinerary) {
      return NextResponse.json({ error: "Itinerary not found" }, { status: 404 });
    }
    return NextResponse.json(itinerary);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch itinerary" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = await updateItinerary(id, body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update itinerary" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (body.status) {
      const result = await updateItineraryStatus(id, body.status);
      return NextResponse.json(result);
    }
    return NextResponse.json({ error: "Invalid status update" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update status" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteItinerary(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete itinerary" }, { status: 500 });
  }
}
