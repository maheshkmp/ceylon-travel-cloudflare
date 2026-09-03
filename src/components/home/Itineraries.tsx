"use client";

import Link from "next/link";
import type { Route } from "next";
import { useState } from "react";

import { Icons } from "./icons";
import { ItineraryCard, type ItineraryData } from "@/components/shared/ItineraryCard";

const FILTERS = ["All", "Culture", "Wildlife", "Romance", "Adventure", "Luxury", "Beach", "Wellness", "Ramayana"];

export function Itineraries({ initialData }: { initialData: any[] }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const itineraries: ItineraryData[] = initialData.map((item: any) => ({
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

  const filteredItineraries = itineraries.filter((item) => {
    if (activeFilter === "All") return true;
    const searchStr = activeFilter.toLowerCase();
    return (
      item.mood?.toLowerCase().includes(searchStr) ||
      item.tag?.toLowerCase().includes(searchStr) ||
      item.title?.toLowerCase().includes(searchStr) ||
      item.highlights?.some((h) => h.toLowerCase().includes(searchStr))
    );
  });



  return (
    <section id="itineraries" className="py-12 sm:py-20 relative overflow-hidden" style={{ background: "var(--color-surface)" }}>
      {/* Subtle background texture/glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-emerald-600 mb-2 block">Handcrafted Experiences</span>
            <h2
              className="font-light leading-tight mb-2 sm:mb-3"
              style={{ fontFamily: "var(--font-serif)", color: "var(--color-text-primary)", fontSize: "clamp(2.25rem, 5vw, 3.25rem)" }}
            >
              Curated <span style={{ color: "var(--color-brand)", fontStyle: "italic" }}>Journeys</span>
            </h2>
            <p className="text-xs sm:text-base max-w-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              Handpicked itineraries designed by our local experts — all-inclusive, private, and fully customizable.
            </p>
          </div>
          <Link
            href={"/itinerary" as Route}
            className="text-[11px] uppercase tracking-[0.15em] font-bold shrink-0 flex items-center gap-2 self-start sm:self-auto transition-colors hover:opacity-80 pb-1"
            style={{ color: "var(--color-brand)", borderBottom: "1px solid var(--color-brand)" }}
          >
            View all packages {Icons.arrowRight}
          </Link>
        </div>

        {/* Filter Pills — horizontally scrollable on mobile */}
        <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-none">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="flex-shrink-0 px-4 sm:px-5 py-2.5 rounded-full text-[11px] uppercase tracking-wider font-bold transition-all duration-300 active:scale-95"
              style={{
                background: activeFilter === f ? "var(--color-brand)" : "white",
                color: activeFilter === f ? "white" : "var(--color-text-secondary)",
                border: activeFilter === f ? "1px solid var(--color-brand)" : "1px solid rgba(0,0,0,0.1)",
                boxShadow: activeFilter === f ? "0 4px 14px rgba(6, 78, 59, 0.25)" : "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid — 1 col on mobile, 2 on sm, 3 on lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredItineraries.map((item: ItineraryData, i: number) => (
            <ItineraryCard key={item.id || i} item={item} theme="light" />
          ))}
        </div>

        {filteredItineraries.length === 0 && (
          <p className="text-center py-12 text-sm" style={{ color: "#9CA3AF" }}>
            No packages found for this filter.
          </p>
        )}

        <div className="text-center mt-8 sm:mt-10">
          <Link
            href={"/itinerary" as Route}
            className="inline-block px-8 py-3.5 rounded-full text-[11px] uppercase tracking-[0.15em] font-bold transition-all hover:scale-105 shadow-sm"
            style={{ border: "1.5px solid var(--color-brand)", color: "var(--color-brand)", background: "transparent" }}
          >
            View All Packages
          </Link>
        </div>
      </div>
    </section>
  );
}
