"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Icons } from "./icons";
import { TRAVEL_CATEGORIES } from "@/data/home";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Honeymoon: Icons.honeymoon,
  Wildlife:  Icons.wildlife,
  Luxury:    Icons.luxury,
  Surfing:   Icons.surf,
  Culture:   Icons.culture,
  Adventure: Icons.adventure,
  Wellness:  Icons.wellness,
  Ramayana:  Icons.ramayana,
};

// Notion-style section eyebrow — geometric dot + label
function Eyebrow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3" style={{ color: "var(--color-brand)" }}>
      <span
        className="flex items-center justify-center w-5 h-5 rounded"
        style={{ background: "var(--color-brand-light)" }}
      >
        {icon}
      </span>
      <span className="text-xs font-700 uppercase tracking-widest" style={{ fontWeight: 700, letterSpacing: "0.1em" }}>{label}</span>
    </div>
  );
}

export function Categories({ initialData = [] }: { initialData?: any[] }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const categories = (() => {
    const raw = initialData && initialData.length > 0 ? initialData : TRAVEL_CATEGORIES;
    const existingLabels = new Set(raw.map((c: any) => c.label.toLowerCase()));
    const missingDefaults = TRAVEL_CATEGORIES.filter(
      (cat) => !existingLabels.has(cat.label.toLowerCase())
    ).map((cat) => ({
      id: cat.id,
      label: cat.label,
      image: cat.image,
      description: cat.desc,
    }));
    return [...raw, ...missingDefaults].map((cat: any) => {
      if (cat.label.toLowerCase() === "culture" && (!cat.image || cat.image.includes("1624963145721"))) {
        return { ...cat, image: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=600&auto=format&fit=crop" };
      }
      return cat;
    });
  })();

  return (
    <section id="services" className="relative z-20 mt-1 sm:mt-2 pb-1 sm:pb-2 bg-white pt-10 sm:pt-6">
      <div id="experiences" />
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4 px-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-[800] text-slate-900" style={{ fontSize: "clamp(1.6rem, 3vw, 2rem)" }}>
              What Kind of Journey Are You Planning?
            </h2>
          </div>
          <a href="#itineraries" className="text-sm font-[600] shrink-0 flex items-center gap-1.5 transition-colors text-emerald-600 hover:text-emerald-700">
            View all packages
            {Icons.arrowRight}
          </a>
        </div>

        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
            hidden: {}
          }}
        >
          {categories.map((cat, i) => (
            <motion.button
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
              key={cat.id}
              onClick={() => {
                setActiveIdx(i);
                window.dispatchEvent(
                  new CustomEvent("open-inquiry", { detail: { style: cat.label } })
                );
              }}
              className="group relative rounded-xl overflow-hidden text-left focus:outline-none h-[150px] sm:h-[180px] cursor-pointer"
              style={{
                border: activeIdx === i ? "2px solid var(--color-brand)" : "2px solid transparent",
                boxShadow: activeIdx === i ? "0 12px 32px rgba(0,166,128,0.25)" : "0 2px 8px rgba(0,0,0,0.08)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
              }}
              whileHover={{
                y: -6,
                boxShadow: "0 16px 40px rgba(0,0,0,0.22)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              <Image
                src={cat.image} alt={cat.label} fill loading="lazy"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />

              {/* Hover ring glow */}
              <div className="absolute inset-0 rounded-xl ring-0 group-hover:ring-2 ring-white/40 transition-all duration-300 pointer-events-none z-10" />

              {/* Dark overlay — lifts on hover to reveal image */}
              <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/0 transition-colors duration-400" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)" }} />

              {/* Active check */}
              {activeIdx === i && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center z-10" style={{ background: "var(--color-brand)", color: "white" }}>
                  {Icons.check}
                </div>
              )}

              {/* Slide-in "Explore →" hint on hover */}
              <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                Explore
                <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>

              <div className="absolute inset-0 p-3 flex flex-col justify-end z-10">
                {/* SVG icon */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 transition-colors duration-300 group-hover:bg-white/25"
                  style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
                >
                  {CATEGORY_ICONS[cat.label] || Icons.compass}
                </div>
                <span className="text-white font-700 text-sm leading-tight" style={{ fontWeight: 700 }}>{cat.label}</span>
                <span className="text-white/65 text-xs leading-snug mt-0.5">{cat.description || cat.desc}</span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
