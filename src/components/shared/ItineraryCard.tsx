import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { Clock, MapPin, Star, Heart } from "lucide-react";
import { WishlistButton } from "./WishlistButton";

export interface ItineraryData {
  id?: string;
  title: string;
  slug: string;
  days: string;
  tag: string;
  price: string;
  highlights: string[];
  image: string;
  mood: string;
  rating?: number;
  reviewsCount?: number;
}

interface ItineraryCardProps {
  item: ItineraryData;
  theme?: "light" | "dark"; // Kept for compatibility but we use one unified luxury style
}

const BADGE_MAP: Record<string, { label: string; color: string }> = {
  "Culture & Wildlife": { label: "Popular",     color: "var(--color-accent)" },
  "Romance & Luxury":  { label: "Best Seller",  color: "var(--color-brand)" },
  "Nature & Adventure":{ label: "Adventure",    color: "#059669" },
};

export function ItineraryCard({ item }: ItineraryCardProps) {
  const badge = BADGE_MAP[item.mood] || { label: item.tag, color: "var(--color-brand)" };
  const rating = item.rating ?? 4.9;
  const reviewsCount = item.reviewsCount ?? 124;

  return (
    <div
      className="group relative rounded-2xl overflow-hidden bg-slate-900 transition-all duration-700 flex flex-col h-[340px] sm:h-[380px] shadow-lg hover:shadow-2xl hover:-translate-y-2"
    >
      {/* Clickable Overlay Link */}
      <Link
        href={`/itinerary/${item.slug || "#"}` as Route}
        className="absolute inset-0 z-20"
        aria-label={`View details for ${item.title}`}
      />

      {/* Edge-to-Edge Image */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      
      {/* High-end Gradient Overlays */}
      <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors duration-700" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,8,0.95) 0%, rgba(10,10,8,0.4) 50%, transparent 100%)" }} />
      
      {/* Floating Badges (Top) */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-30">
        <span 
          className="px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-[0.15em] backdrop-blur-md pointer-events-none"
          style={{ background: badge.color }}
        >
          {badge.label}
        </span>
        <WishlistButton item={item} />
      </div>
      
      {/* Content (Bottom) */}
      <div className="relative z-10 p-6 flex flex-col justify-end flex-1 h-full pointer-events-none">
        <div className="space-y-3 transform transition-transform duration-500 group-hover:-translate-y-2">
          {/* Metadata */}
          <div className="flex items-center justify-between text-white/80 text-xs font-medium tracking-wide">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-white/60" />
              <span>{item.days}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{rating}</span>
              <span className="text-white/50">({reviewsCount})</span>
            </div>
          </div>
          
          {/* Title - Lora Serif */}
          <h3 
            className="text-2xl text-white group-hover:text-emerald-100 transition-colors line-clamp-2"
            style={{ fontFamily: "var(--font-serif)", fontWeight: 400, letterSpacing: "-0.01em" }}
          >
            {item.title}
          </h3>

          {/* Highlights */}
          <div className="flex flex-wrap gap-2 pt-2">
            {item.highlights.slice(0, 3).map((h) => (
              <span
                key={h}
                className="flex items-center gap-1 px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-wider text-white/70 font-semibold border border-white/20 backdrop-blur-sm"
              >
                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate max-w-[120px]">{h}</span>
              </span>
            ))}
          </div>

          {/* Price & CTA (Fades in slightly on hover) */}
          <div className="pt-4 mt-2 border-t border-white/10 flex items-end justify-between opacity-90 group-hover:opacity-100 transition-opacity duration-500">
            <div>
              <p className="text-[9px] text-white/50 uppercase tracking-[0.2em] mb-1">Starting from</p>
              <p className="text-xl text-white" style={{ fontFamily: "var(--font-serif)" }}>{item.price}</p>
            </div>
            <span className="text-[10px] font-bold text-white uppercase tracking-[0.15em] border-b border-emerald-400 pb-0.5 group-hover:text-emerald-400 transition-colors">
              Discover
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
