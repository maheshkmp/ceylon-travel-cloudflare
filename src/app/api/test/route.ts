import { getDestinations } from "@/actions/destinations";
import { getItineraries } from "@/actions/itineraries";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  try {
    const dest = await getDestinations(1, 10);
    const it = await getItineraries(1, 6, undefined, "published");
    return NextResponse.json({ success: true, destCount: dest.data.length, itCount: it.data.length });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message, stack: e.stack });
  }
}
