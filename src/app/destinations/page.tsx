import React from "react";
import { getDb } from "@/db/client";
import { destinations as destinationsTable } from "@/db/schema";
import { desc, asc } from "drizzle-orm";
import { NavBar } from "@/components/home/NavBar";
import { Footer } from "@/components/home/Footer";
import { MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";

export const runtime = 'edge';

export const dynamic = 'force-dynamic';

async function getDestinations() {
  try {
    if (process.env.NEXT_PHASE === "phase-production-build") return [];
    const db = getDb();
    return await db.select().from(destinationsTable).orderBy(asc(destinationsTable.order), desc(destinationsTable.createdAt));
  } catch (error) {
    console.error("Failed to fetch destinations:", error);
    return [];
  }
}

export const metadata = {
  title: "Sri Lanka's Top Travel Destinations | Ceylon Travels",
  description: "Discover the most beautiful travel destinations in Sri Lanka. From historical cities like Sigiriya & Galle to misty Ella tea plantations and wild Yala safaris.",
};

function stripHtml(html?: string | null) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ").trim();
}

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <main className="bg-slate-950 text-white min-h-screen font-sans antialiased" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" }}>
      <NavBar scrolled={true} />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-6 tracking-tight text-slate-100" style={{ fontFamily: "var(--font-lora)" }}>
            Sri Lanka's Greatest <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-400">Destinations</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-medium leading-relaxed">
            From the sacred ruins of ancient kingdoms and mist-wrapped tea plantations to golden palm-fringed coastlines, explore the beautiful wonders of the teardrop island.
          </p>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16 pb-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest) => (
              <div
                key={dest.id}
                className="group relative rounded-3xl overflow-hidden border border-white/[0.06] bg-slate-900/40 hover:bg-slate-900/60 hover:border-white/[0.12] transition-all duration-500 flex flex-col h-[490px] shadow-2xl"
              >
                {/* Clickable Card Link */}
                <Link href={`/destinations/${dest.slug}` as Route} className="absolute inset-0 z-10" aria-label={`View ${dest.name} details`} />

                {/* Image Wrapper */}
                <div className="relative h-[260px] w-full overflow-hidden shrink-0">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

                  {/* Floating Region Tag */}
                  <div className="absolute top-4 left-4 z-20">
                    <div className="px-3 py-1 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">{dest.region}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white tracking-tight uppercase group-hover:text-blue-400 transition-colors">
                        {dest.name}
                      </h2>
                      <div className="h-px bg-gradient-to-r from-white/20 to-transparent flex-1" />
                    </div>
                    <p className="text-blue-400 text-xs font-semibold italic">
                      {dest.tagline}
                    </p>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                      {stripHtml(dest.description) || "Explore Sigiriya's historic citadel, climb the rock fortress, and capture breathtaking views of the surrounding gardens and forests."}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto z-20">
                    <Link
                      href={`/destinations/${dest.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-blue-400 transition-colors uppercase tracking-wider group/link"
                    >
                      Explore Destination
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </Link>
                    <Link
                      href={`/itinerary?destination=${dest.slug}`}
                      className="text-[10px] font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider"
                    >
                      View Tours
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
