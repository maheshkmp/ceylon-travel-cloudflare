"use client";

import { useRef } from "react";
import Image from "next/image";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { motion, useScroll, useTransform } from "framer-motion";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.177-1.358a9.936 9.936 0 0 0 4.835 1.254h.005c5.502 0 9.987-4.479 9.988-9.986 0-2.67-1.037-5.18-2.92-7.062A9.925 9.925 0 0 0 12.012 2Zm5.792 14.34c-.255.72-1.48 1.408-2.036 1.488-.512.073-1.18.13-3.486-.827-2.947-1.224-4.846-4.225-4.993-4.423-.147-.197-1.196-1.593-1.196-3.037 0-1.443.754-2.151 1.025-2.443.271-.291.59-.364.787-.364h.566c.18 0 .423-.069.662.509.246.596.84 2.046.914 2.197.074.15.123.327.025.525-.099.198-.148.32-.296.492-.148.173-.31.385-.443.518-.148.148-.303.31-.13.607.172.296.764 1.258 1.632 2.03 1.12.996 2.062 1.306 2.358 1.454.296.148.468.123.64-.074.173-.197.74-.861.937-1.157.197-.296.394-.246.663-.148.27.099 1.706.804 2.001.952.296.147.492.221.566.345.074.123.074.714-.18 1.433Z"/>
    </svg>
  );
}

export function CTABanner() {
  const { settings } = useSiteSettings();
  const whatsapp = settings?.contact?.whatsapp || "+94775105848";
  const waLink = `https://wa.me/${whatsapp.replace(/\+/g, "").replace(/\s/g, "")}`;

  const ctaRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ctaRef,
    offset: ["start end", "end start"],
  });

  const ctaBgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section
      ref={ctaRef}
      id="contact"
      className="relative flex items-center py-20 md:py-28 overflow-hidden bg-slate-950"
    >
      <div id="inquiry" className="absolute -top-24" />
      {/* Parallax background image */}
      <motion.div
        style={{ y: ctaBgY }}
        className="absolute inset-0 h-[120%] -top-[10%] w-full"
      >
        <Image
          src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1920&q=85"
          alt="Kandy Sri Lanka"
          fill
          loading="lazy"
          className="object-cover opacity-30"
          sizes="100vw"
        />
      </motion.div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/50 via-indigo-950/25 to-transparent" />

      {/* Atmospheric glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 rounded-full mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Plan Your Journey
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-white font-black leading-[1.12] mb-5 uppercase tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
        >
          Your Dream Sri Lanka{" "}
          <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400">
            Trip Starts Here
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl sm:max-w-2xl mx-auto mb-10"
        >
          Tell us what you love — wildlife, beaches, temples, tea hills — and our local experts
          will build a personalised itinerary just for you, completely free.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4"
        >
          <a
            href="#inquiry"
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent("open-inquiry"));
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 hover:scale-[1.03] shadow-xl shadow-blue-900/40 hover:shadow-blue-700/40"
          >
            Get a Free Quote
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all duration-300 hover:scale-[1.03] shadow-xl shadow-emerald-900/40 hover:shadow-emerald-700/40"
          >
            <WhatsAppIcon className="w-5 h-5 shrink-0" />
            WhatsApp Us
          </a>
        </motion.div>
      </div>
    </section>
  );
}
