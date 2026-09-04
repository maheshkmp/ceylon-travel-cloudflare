"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Icons } from "./icons";
import { useSiteSettings } from "@/hooks/use-site-settings";

export function Gallery({ 
  initialData = [],
  instagramUrl: propInstagramUrl,
  instagramHandle: propInstagramHandle
}: { 
  initialData?: any[],
  instagramUrl?: string,
  instagramHandle?: string
}) {
  const [mounted, setMounted] = useState(false);
  const { settings } = useSiteSettings();

  const instagramUrl = "https://www.instagram.com/ceylon_travels/";
  const instagramHandle = "@ceylon_travels";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use a fixed value during SSR to avoid hydration mismatch
  const getLikes = (i: number) => {
    if (!mounted) return 150 + i; // Deterministic value for SSR
    return Math.floor(Math.random() * 500) + 200;
  };

  const getComments = (i: number) => {
    if (!mounted) return 10 + i; // Deterministic value for SSR
    return Math.floor(Math.random() * 50) + 10;
  };

  return (
    <section id="gallery" className="section-pad" style={{ background: "white" }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
          
            <h2 className="text-3xl font-800" style={{ fontWeight: 800, color: "#1A1A2E", fontSize: "clamp(1.6rem, 3vw, 2rem)" }}>
              Moments from Paradise
            </h2>
            <p className="text-sm mt-1" style={{ color: "#5B6075" }}>
              Visual stories from our latest Sri Lanka journeys
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-inquiry"))}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-700 transition-all hover:bg-gray-50 cursor-pointer"
              style={{ border: "1px solid #E4E8F0", color: "#1A1A2E", fontWeight: 700 }}
            >
              <span style={{ color: "#E1306C" }}>{Icons.globe}</span>
              {instagramHandle}
            </button>
            <p className="text-[10px] font-600 uppercase tracking-widest text-gray-400" style={{ fontWeight: 600 }}>Follow for daily inspiration</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 lg:gap-4">
          {(() => {
            const fallbackGallery = [
              "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1581888227599-779811939961?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1520106212299-d99c443e4568?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1586611292717-f828b167408c?q=80&w=600&auto=format&fit=crop",
            ];

            const galleryItems = initialData && initialData.length > 0 ? initialData : fallbackGallery;

            return galleryItems.map((img: any, i: number) => {
              let imgSrc = typeof img === "string" ? img : (img.url || img.src);
              if (!imgSrc || typeof imgSrc !== "string" || imgSrc.startsWith("/") || imgSrc.includes("r2.dev") || imgSrc.includes("cloudflarestorage") || imgSrc.includes("ceylon") || !imgSrc.startsWith("http")) {
                imgSrc = fallbackGallery[i % fallbackGallery.length];
              }

              // Always assign a distinct reliable Unsplash image per index
              imgSrc = fallbackGallery[i % fallbackGallery.length]!;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("open-inquiry"))}
                  className="relative overflow-hidden group rounded-xl w-full text-left cursor-pointer"
                  style={{
                    height: "0",
                    paddingBottom: "100%", // Square aspect ratio like Instagram
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <Image
                    src={imgSrc}
                    alt={img.alt || `${instagramHandle} Sri Lanka post ${i + 1}`}
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 25vw, 20vw"
                  />
                  {/* Instagram Hover Overlay */}
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }}
                  >
                    <div className="flex items-center gap-4 text-white">
                      <div className="flex items-center gap-1">
                        <span className="text-lg">❤</span>
                        <span className="font-700 text-sm" style={{ fontWeight: 700 }}>{getLikes(i)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-lg">💬</span>
                        <span className="font-700 text-sm" style={{ fontWeight: 700 }}>{getComments(i)}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            });
          })()}
        </div>

        <div className="text-center mt-12">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-inquiry"))}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-[700] text-white transition-all hover:scale-105 shadow-md hover:shadow-lg cursor-pointer"
            style={{ background: "#1A1A2E" }}
          >
            <span>{Icons.globe}</span>
            View More on Instagram
          </button>
        </div>
      </div>
    </section>
  );
}
