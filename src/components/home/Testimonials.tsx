"use client";

import React, { useRef } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export function Testimonials({ initialData = [] }: { initialData?: any[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!initialData || initialData.length === 0) {
    return null;
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-[#F8FAFC] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="inline-block text-xs font-extrabold tracking-[0.2em] uppercase text-emerald-600 mb-3">
              TRAVELER REVIEWS
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight" style={{ fontFamily: "var(--font-jakarta)" }}>
              Don't just take{" "}
              <span className="font-serif italic text-emerald-600 font-normal" style={{ fontFamily: "var(--font-lora)" }}>
                our word for it
              </span>
            </h2>
            <p className="mt-4 text-slate-600 text-base md:text-lg leading-relaxed">
              Real stories from travelers who have experienced the magic of Sri Lanka with our expert local guides.
            </p>
          </div>

          {/* Carousel Control Buttons (Top Right) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => scroll("left")}
              aria-label="Previous review"
              className="w-11 h-11 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:border-emerald-600 hover:text-emerald-600 hover:shadow-md transition-all duration-200"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Next review"
              className="w-11 h-11 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:border-emerald-600 hover:text-emerald-600 hover:shadow-md transition-all duration-200"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Testimonials Carousel Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-4 -mx-2 px-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {initialData.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="snap-start min-w-[300px] sm:min-w-[350px] md:min-w-[380px] lg:min-w-[400px] flex-1 bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgb(0,0,0,0.07)] transition-all duration-300 relative flex flex-col justify-between"
            >
              <div>
                {/* Header inside Card: Stars + Quote Icon */}
                <div className="flex items-center justify-between mb-6">
                  {/* Star Rating */}
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Quote Icon */}
                  <Quote size={40} className="text-slate-100 rotate-180" />
                </div>

                {/* Review Text */}
                <p className="text-slate-700 leading-relaxed text-[15px] italic mb-8">
                  "{testimonial.text}"
                </p>
              </div>

              {/* User Info (Avatar + Name + Origin / Country) */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg shrink-0">
                  {testimonial.name?.charAt(0) || "T"}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base leading-tight">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs font-medium text-slate-500 mt-1">
                    {testimonial.origin || testimonial.trip || "Traveler"}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
