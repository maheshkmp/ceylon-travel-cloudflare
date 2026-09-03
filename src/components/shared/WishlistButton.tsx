"use client";

import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";
import type { ItineraryData } from "@/components/shared/ItineraryCard";

export function WishlistButton({ item }: { item: ItineraryData }) {
  const [mounted, setMounted] = useState(false);
  const identifier = item.id || item.slug;
  const isSaved = useWishlist((state) => state.isWishlisted(identifier));
  const addItinerary = useWishlist((state) => state.addItinerary);
  const removeItinerary = useWishlist((state) => state.removeItinerary);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      removeItinerary(identifier);
    } else {
      addItinerary(item);
    }
  };

  // If not mounted yet, render an unfilled state to match SSR
  if (!mounted) {
    return (
      <button
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all backdrop-blur-md bg-white/10 text-white border border-white/20"
        onClick={(e) => e.preventDefault()}
      >
        <Heart className="w-3.5 h-3.5 fill-transparent" />
        <span>Save</span>
      </button>
    );
  }

  return (
    <button
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 z-20 relative border ${
        isSaved 
          ? "bg-white text-rose-500 border-white shadow-md hover:bg-rose-50" 
          : "backdrop-blur-md bg-white/10 text-white border-white/20 hover:bg-white/20"
      }`}
      onClick={toggleWishlist}
      aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart 
        className={`w-3.5 h-3.5 transition-colors duration-300 ${isSaved ? "fill-rose-500 text-rose-500" : "fill-transparent"}`} 
      />
      <span>{isSaved ? "Saved" : "Save"}</span>
    </button>
  );
}
