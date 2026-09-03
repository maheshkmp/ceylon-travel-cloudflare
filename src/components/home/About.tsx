"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Compass, Heart, Sparkles, ArrowRight } from "lucide-react";

const PHILOSOPHY = [
  { 
    title: "Explore", 
    desc: "Explore the authentic beauty of Sri Lanka—from ancient cultural treasures and landscapes to pristine beaches.", 
    icon: Compass,
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" 
  },
  { 
    title: "Experience", 
    desc: "Experience its rich culture, nature, and warm local hospitality through custom-tailored itineraries.", 
    icon: Heart,
    color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" 
  },
  { 
    title: "Remember", 
    desc: "Remember moments that will stay with you forever, created with care so you travel with total confidence.", 
    icon: Sparkles,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" 
  },
];

export function About() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const aboutRef = useRef<HTMLElement>(null);

  const { scrollYProgress: aboutScrollY } = useScroll({
    target: isMounted ? aboutRef : undefined,
    offset: ["start end", "end start"],
  });

  const mainImageY = useTransform(aboutScrollY, [0, 1], [-25, 25]);
  const overlapImageY = useTransform(aboutScrollY, [0, 1], [30, -30]);
  const glow1Y = useTransform(aboutScrollY, [0, 1], [-40, 40]);
  const glow2Y = useTransform(aboutScrollY, [0, 1], [40, -40]);

  const sectionOpacity = useTransform(aboutScrollY, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const sectionY = useTransform(aboutScrollY, [0, 0.15, 0.85, 1], [80, 0, 0, -80]);

  return (
    <section
      ref={aboutRef}
      id="about"
      className="md:sticky md:top-0 md:min-h-screen flex items-center py-14 sm:py-20 md:py-24 bg-slate-900 text-white z-20 overflow-hidden shadow-2xl w-full max-w-full"
    >
      {/* Background atmosphere */}
      <motion.div
        style={{ y: glow1Y }}
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/[0.08] rounded-full blur-[120px] -z-10 pointer-events-none"
      />
      <motion.div
        style={{ y: glow2Y }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/[0.06] rounded-full blur-[120px] -z-10 pointer-events-none"
      />
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <motion.div
        style={{ opacity: sectionOpacity, y: sectionY }}
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10"
      >
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* ── Image Collage (Left) ── */}
          <div className="lg:col-span-5 relative h-[300px] sm:h-[440px] lg:h-[520px] w-full max-w-sm sm:max-w-md mx-auto lg:max-w-none">
            {/* Decorative tilt card */}
            <div className="absolute inset-4 bg-gradient-to-br from-blue-600/20 to-indigo-600/10 rounded-3xl -rotate-2 scale-[0.97] border border-white/[0.06] pointer-events-none" />

            {/* Main image — top-left (Founder Photo) */}
            <motion.div
              style={{ y: mainImageY }}
              className="absolute top-0 left-0 w-[66%] h-[65%] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group z-10"
            >
              <Image
                src="/images/thiraj.jpeg"
                alt="Founder of Ceylon Travels"
                fill
                loading="lazy"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 55vw, (max-width: 1024px) 45vw, 30vw"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/40 via-transparent to-transparent" />
            </motion.div>

            {/* Secondary image — bottom-right */}
            <motion.div
              style={{ y: overlapImageY }}
              className="absolute bottom-0 right-0 w-[58%] h-[58%] rounded-2xl overflow-hidden shadow-2xl border-[3px] border-slate-900 group"
            >
              <Image
                src="https://images.unsplash.com/photo-1743585826344-aea35e952642?q=80&w=1470&auto=format&fit=crop"
                alt="Galle Fort Sri Lanka"
                fill
                loading="lazy"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 35vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-tl from-indigo-900/20 to-transparent" />
            </motion.div>

            {/* Floating Host Badge */}
            <div className="absolute bottom-3 left-2 z-20 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 shadow-xl flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <p className="text-[11px] font-bold text-white tracking-wide">Founder & Host</p>
                <p className="text-[9px] text-slate-400">Your Local Ceylon Guide</p>
              </div>
            </div>
          </div>

          {/* ── Content (Right) ── */}
          <div className="lg:col-span-7 space-y-5">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-xs font-extrabold uppercase tracking-[0.25em] text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20"
            >
              Welcome to Ceylon Travels
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-[1.1]"
            >
              Explore. Experience.{" "}
              <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">
                Remember.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl"
            >
              At Ceylon Travels, we believe every journey should be more than just a vacation—it should be an experience you'll cherish for a lifetime. Founded with a passion for sharing the authentic beauty of Sri Lanka, our company creates memorable journeys for travelers from around the world.
            </motion.p>

            {/* Philosophy Cards Grid */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2"
            >
              {PHILOSOPHY.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] transition-all duration-300 group"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 border ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="font-bold text-sm text-white mb-1">{item.title}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </motion.div>

            {/* Action link to full about page */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="pt-3"
            >
              <a
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors group"
              >
                Read Full Story & Company Vision
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </section>
  );
}

