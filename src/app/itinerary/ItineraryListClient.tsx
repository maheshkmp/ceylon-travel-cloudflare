"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { NavBar } from "@/components/home/NavBar";
import { Footer } from "@/components/home/Footer";
import { useQuery } from "@tanstack/react-query";
import { getItineraries } from "@/actions/itineraries";
import { useSearchParams } from "next/navigation";
import { Clock } from "lucide-react";
import { ItineraryCard, type ItineraryData } from "@/components/shared/ItineraryCard";

const FILTERS = ["All", "Culture", "Wildlife", "Romance", "Adventure", "Luxury", "Beach", "Wellness", "Ramayana"];

function ItineraryListContent({ initialItineraries }: { initialItineraries: any[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const searchParams = useSearchParams();
  const destinationQuery = searchParams.get("destination");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: dynamicData } = useQuery({
    queryKey: ["itineraries", "list"],
    queryFn: () => getItineraries(1, 50),
    initialData: { data: initialItineraries } as any,
  });

  const rawData = (dynamicData as any)?.data || [];
  const itineraries: ItineraryData[] = rawData.map((item: any) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    days: item.duration,
    tag: item.tags?.[0] || "Featured",
    price: item.price,
    highlights: item.highlights || [],
    image: item.heroImg,
    mood: item.travelStyle,
    rating: item.rating,
    reviewsCount: item.reviewsCount,
  }));

  // Perform local filtering
  const filteredItineraries = itineraries.filter((item) => {
    // If destinationQuery exists, match title, highlights or tags
    if (destinationQuery) {
      const q = destinationQuery.toLowerCase();
      const matchesDestination = 
        item.title.toLowerCase().includes(q) ||
        (item.highlights && item.highlights.some(h => h.toLowerCase().includes(q))) ||
        (item.mood && item.mood.toLowerCase().includes(q)) ||
        (item.tag && item.tag.toLowerCase().includes(q));
      if (!matchesDestination) return false;
    }

    if (activeFilter === "All") return true;
    const filterLower = activeFilter.toLowerCase();
    
    // Check mood/travelStyle
    if (item.mood && item.mood.toLowerCase().includes(filterLower)) return true;
    
    // Check tags/badge label
    if (item.tag && item.tag.toLowerCase().includes(filterLower)) return true;
    
    // Check highlights
    if (item.highlights && item.highlights.some(h => h.toLowerCase().includes(filterLower))) return true;

    // Check title
    if (item.title && item.title.toLowerCase().includes(filterLower)) return true;

    return false;
  });

  return (
    <main className="bg-slate-950 text-white min-h-screen font-sans antialiased relative overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" }}>
      {/* Decorative Glow Nodes */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <NavBar scrolled={scrolled} />

      {/* Hero Header Banner */}
      <section className="relative h-[48vh] min-h-[350px] flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950">
        <Image 
          src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1920&q=80" 
          alt="Sri Lanka Tour Packages"
          fill
          priority
          className="object-cover opacity-20 select-none pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/80 to-slate-950" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 pt-12">
     
          <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-6 tracking-tight" style={{ fontFamily: "var(--font-lora)" }}>
            Sri Lanka <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-400">Tour Packages</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-medium leading-relaxed">
            Handpicked and fully customizable itineraries — all-inclusive, guided by certified local experts, and crafted to fit your perfect travel pace.
          </p>
        </div>
      </section>

      {/* Search query descriptor banner */}
      {destinationQuery && (
        <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-8 relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-300">
            <span>Showing tours matching: <strong className="text-white capitalize">{destinationQuery}</strong></span>
            <button 
              onClick={() => {
                window.history.pushState({}, "", "/itinerary");
                window.location.href = "/itinerary";
              }}
              className="hover:text-white transition-colors underline ml-2 font-bold"
            >
              Clear Filter
            </button>
          </div>
        </div>
      )}

      {/* Main Content Section */}
      <section className="py-8 pb-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          
          {/* Header & Filter Pill Container */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wide">
                Explore Packages
              </h2>
              <p className="text-sm mt-1 text-slate-400">
                Showing {filteredItineraries.length} of {itineraries.length} packages
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className="px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 uppercase tracking-wider border"
                  style={{
                    background: activeFilter === f ? "rgba(59, 130, 246, 0.15)" : "rgba(255, 255, 255, 0.02)",
                    color: activeFilter === f ? "#60A5FA" : "#94A3B8",
                    borderColor: activeFilter === f ? "#3B82F6" : "rgba(255, 255, 255, 0.08)"
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Layout */}
          {filteredItineraries.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItineraries.map((item, i) => (
                <ItineraryCard key={item.id || i} item={item} theme="dark" />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-3xl bg-slate-900/20 backdrop-blur-md">
              <span className="text-4xl">🏝️</span>
              <h3 className="text-lg font-bold text-white mt-4">No packages found</h3>
              <p className="text-sm text-slate-400 mt-1">Try selecting another filter or travel style.</p>
              <button 
                onClick={() => setActiveFilter("All")}
                className="mt-6 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold transition-all hover:bg-blue-500 uppercase tracking-wider"
              >
                Clear Filters
              </button>
            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function ItineraryListClient({ initialItineraries }: { initialItineraries: any[] }) {
  return (
    <Suspense fallback={
      <main className="bg-slate-950 min-h-screen text-white font-sans antialiased flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </main>
    }>
      <ItineraryListContent initialItineraries={initialItineraries} />
    </Suspense>
  );
}
