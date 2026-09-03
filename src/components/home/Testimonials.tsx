"use client";

import React from "react";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

export function Testimonials({ initialData = [] }: { initialData?: any[] }) {
  if (!initialData || initialData.length === 0) {
    return null;
  }

  // Display up to 6 testimonials in the grid
  const displayTestimonials = initialData.slice(0, 6);

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-slate-50 overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-100/50 -skew-x-12 translate-x-1/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <h2 className="text-sm font-bold tracking-widest uppercase text-emerald-600 mb-3">
            Traveler Reviews
          </h2>
          <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "var(--font-lora)" }}>
            Don't just take our word for it
          </h3>
          <p className="mt-6 text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Real stories from travelers who have experienced the magic of Sri Lanka with our expert local guides.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayTestimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300 flex flex-col"
            >
              {/* Decorative Quote Icon */}
              <div className="absolute top-6 right-8 text-slate-100 group-hover:text-emerald-50 transition-colors duration-300">
                <Quote size={64} className="rotate-180" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6 relative z-10">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={18} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-slate-700 leading-loose text-[15px] mb-8 relative z-10 flex-grow italic">
                "{testimonial.text}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-4 relative z-10 pt-6 border-t border-slate-100">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg shrink-0">
                  {testimonial.name?.charAt(0) || "T"}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-[15px]">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {testimonial.trip || "Sri Lanka Tour"}
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
