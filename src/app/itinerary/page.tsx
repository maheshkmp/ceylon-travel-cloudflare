import { Metadata } from "next";
import ItineraryListClient from "./ItineraryListClient";
import { getDb } from "@/db/client";
import { itinerariesTable } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";

export const runtime = 'edge';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Sri Lanka Tour Packages & Itineraries | Ceylon Travels",
  description: "Explore our collection of handpicked, fully customizable Sri Lanka tour packages. Plan your adventure, cultural, or romance getaway today with Ceylon Travels.",
  openGraph: {
    title: "Sri Lanka Tour Packages & Itineraries | Ceylon Travels",
    description: "Explore our collection of handpicked, fully customizable Sri Lanka tour packages.",
    images: [{ url: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&q=80" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sri Lanka Tour Packages & Itineraries | Ceylon Travels",
    description: "Explore our collection of handpicked, fully customizable Sri Lanka tour packages.",
    images: ["https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&q=80"],
  },
};

async function getItineraries() {
  try {
    if (process.env.NEXT_PHASE === "phase-production-build") return [];
    const db = getDb();
    return await db
      .select()
      .from(itinerariesTable)
      .where(eq(itinerariesTable.status, "published"))
      .orderBy(asc(itinerariesTable.order), desc(itinerariesTable.createdAt));
  } catch (error) {
    console.error("Failed to fetch itineraries:", error);
    return [];
  }
}

export default async function Page() {
  const data = await getItineraries();
  // Safe serialization for server -> client boundary
  const plainItineraries = JSON.parse(JSON.stringify(data));
  return <ItineraryListClient initialItineraries={plainItineraries} />;
}
