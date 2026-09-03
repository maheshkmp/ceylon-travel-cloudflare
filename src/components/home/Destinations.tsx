"use client";

import React, { useRef } from "react";
import Image from "next/image";

import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface HomeDestination {
  name: string;
  region: string;
  image: string;
  tagline: string;
}

export function Destinations({ initialData }: { initialData: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const destinations: HomeDestination[] = initialData;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section id="destinations" className="py-12 sm:py-20 relative overflow-hidden w-full max-w-full" style={{ background: "var(--color-surface)" }}>
      {/* Decorative background glows */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full blur-3xl -z-10 pointer-events-none" style={{ background: "var(--color-brand-light)", opacity: 0.3 }} />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full blur-3xl -z-10 pointer-events-none" style={{ background: "var(--color-accent-light)", opacity: 0.2 }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        {/* Header with scroll triggers */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <Link href="/destinations" className="inline-block text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full mb-4 transition-colors" style={{ color: "var(--color-brand)", background: "var(--color-brand-light)" }}>
              Explore Sri Lanka
            </Link>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-slate-900 leading-[1.1]" style={{ fontFamily: "var(--font-serif)" }}>
              Iconic 
              <span style={{ color: "var(--color-brand)", fontStyle: "italic" }}> Destinations</span>
            </h2>
            <p className="text-slate-500 text-sm mt-4 max-w-xl">
              From mist-wrapped peaks to gold-sand beaches, explore the iconic landmarks and secret sanctuaries of Sri Lanka.
            </p>
          </div>

          {/* Navigation Controls in Header */}
          <div className="flex gap-2 shrink-0">
            <button 
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm"
              style={{ color: "var(--color-brand)" }}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm"
              style={{ color: "var(--color-brand)" }}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slider Section */}
        <div className="relative group">
          {/* Cards Container */}
          <div 
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-8 pt-2 scroll-smooth [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {destinations.map((dest: any, i) => {
              const fallbackImages: Record<string, string> = {
                sigiriya: "https://images.unsplash.com/photo-1586611292717-f828b167408c?q=80&w=600&auto=format&fit=crop",
                kandy: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=600&auto=format&fit=crop",
                ella: "https://images.unsplash.com/photo-1544750040-4ea9b8a27d38?q=80&w=600&auto=format&fit=crop",
                galle: "https://images.unsplash.com/photo-1588614959060-4d144f28b207?q=80&w=600&auto=format&fit=crop",
                nuwara: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?q=80&w=600&auto=format&fit=crop",
                yala: "https://images.unsplash.com/photo-1566650576880-6740b03eaad1?q=80&w=600&auto=format&fit=crop",
                mirissa: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=600&auto=format&fit=crop",
                colombo: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=600&auto=format&fit=crop",
                anuradhapura: "https://images.unsplash.com/photo-1624963145721-277432579507?q=80&w=600&auto=format&fit=crop",
                polonnaruwa: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600&auto=format&fit=crop",
                trincomalee: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
              };

              const nameLower = (dest.name || "").toLowerCase().trim();
              const matchedKey = Object.keys(fallbackImages).find((k) => nameLower.includes(k));
              const imgSrc = matchedKey
                ? fallbackImages[matchedKey]
                : (dest.image && !dest.image.includes("r2.dev") ? dest.image : "https://images.unsplash.com/photo-1586611292717-f828b167408c?q=80&w=600&auto=format&fit=crop");

              return (
                <Link href={`/destinations/${dest.slug || dest.name.toLowerCase().replace(/\s+/g, '-')}`} key={dest.name}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -6 }}
                    className="flex-none w-[270px] sm:w-[290px] h-[340px] relative rounded-2xl overflow-hidden snap-start border border-slate-100 shadow-[0_10px_24px_-10px_rgba(0,0,0,0.1)] group/card cursor-pointer"
                  >
                  <Image
                    src={imgSrc} 
                    alt={dest.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                    sizes="(max-width: 640px) 270px, 290px"
                  />
                  
                  {/* Modern Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-slate-950/20 group-hover/card:bg-transparent transition-colors duration-500" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,8,0.9) 0%, rgba(10,10,8,0.2) 60%, transparent 100%)" }} />
                  
                  {/* Region Tag */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="px-2.5 py-1 rounded-sm bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span className="text-[9px] font-bold text-white uppercase tracking-[0.15em]">{dest.region}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-5 left-5 right-5 z-10 transition-transform duration-500 group-hover/card:-translate-y-2">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-white text-xl font-medium tracking-tight truncate" style={{ fontFamily: "var(--font-serif)" }}>
                        {dest.name}
                      </h3>
                    </div>
                    <p className="text-white/70 text-[11px] leading-relaxed opacity-0 max-h-0 overflow-hidden transition-all duration-500 group-hover/card:opacity-100 group-hover/card:max-h-[60px]">
                      {dest.tagline}
                    </p>
                  </div>
                </motion.div>
              </Link>
            );
          })}
          </div>
          {destinations.length === 0 && (
            <div className="py-12 text-center w-full text-slate-500">
              No destinations available yet.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
