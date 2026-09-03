"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/hooks/use-wishlist";
import { ItineraryCard } from "@/components/shared/ItineraryCard";
import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";

export function WishlistClient() {
  const [mounted, setMounted] = useState(false);
  const items = useWishlist((state) => state.items);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-2 text-slate-400">
          <Heart className="w-5 h-5" /> Loading your wishlist...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 lg:py-12">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 transition-all flex-shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900 leading-[1.1]" style={{ fontFamily: "var(--font-serif)" }}>
            Your <span style={{ color: "var(--color-brand)", fontStyle: "italic" }}>Wishlist</span>
          </h1>
        </div>
        <p className="text-slate-500 max-w-2xl sm:ml-14">
          Review the itineraries you've saved for later. When you're ready, you can start customizing your dream journey.
        </p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <ItineraryCard key={item.id || item.slug || i} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-slate-50 rounded-2xl border border-slate-100">
          <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-slate-700 mb-2">Your wishlist is empty</h3>
          <p className="text-slate-500 mb-6">
            Explore our curated journeys and tap the heart icon to save your favorites here.
          </p>
          <Link 
            href="/itinerary"
            className="inline-flex px-6 py-3 rounded-full text-sm font-semibold transition-all text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-light)] shadow-md"
          >
            Explore Journeys
          </Link>
        </div>
      )}
    </div>
  );
}
