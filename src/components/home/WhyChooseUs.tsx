"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Leaf,
  Users,
  Compass,
  GraduationCap,
  Heart,
  Milestone,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

const FEATURES = [
  {
    icon: Compass,
    title: "Expert Local Guides",
    desc: "Certified guides who know every hidden corner of Sri Lanka — from ancient ruins to secret beaches.",
    color: "from-blue-500 to-indigo-600",
    glow: "rgba(99,102,241,0.25)",
    iconBg: "bg-indigo-500/20 text-indigo-300",
  },
  {
    icon: Leaf,
    title: "Sustainability First",
    desc: "Eco-friendly practices, sustainable accommodations, and local partnerships minimise your footprint.",
    color: "from-emerald-500 to-teal-600",
    glow: "rgba(16,185,129,0.25)",
    iconBg: "bg-emerald-500/20 text-emerald-300",
  },
  {
    icon: Users,
    title: "Local Empowerment",
    desc: "Every booking directly supports local families, guides and small businesses across Sri Lanka.",
    color: "from-violet-500 to-purple-600",
    glow: "rgba(139,92,246,0.25)",
    iconBg: "bg-violet-500/20 text-violet-300",
  },
  {
    icon: GraduationCap,
    title: "Deep Cultural Insights",
    desc: "Our guided tours go beyond the surface — rich historical, cultural and ecological storytelling included.",
    color: "from-amber-500 to-orange-600",
    glow: "rgba(245,158,11,0.25)",
    iconBg: "bg-amber-500/20 text-amber-300",
  },
  {
    icon: Heart,
    title: "Wellness Journeys",
    desc: "Rejuvenate with specialised Ayurvedic itineraries and authentic wellness retreats in serene settings.",
    color: "from-rose-500 to-pink-600",
    glow: "rgba(244,63,94,0.25)",
    iconBg: "bg-rose-500/20 text-rose-300",
  },
  {
    icon: Milestone,
    title: "Ramayana Trail",
    desc: "Trace the mythological path with expert-crafted tours visiting sacred historical and spiritual sites.",
    color: "from-orange-500 to-red-600",
    glow: "rgba(249,115,22,0.25)",
    iconBg: "bg-orange-500/20 text-orange-300",
  },
  {
    icon: ShieldCheck,
    title: "Fully Insured & Safe",
    desc: "All tours are comprehensively insured with 24/7 on-ground support, so you travel worry-free.",
    color: "from-cyan-500 to-sky-600",
    glow: "rgba(6,182,212,0.25)",
    iconBg: "bg-cyan-500/20 text-cyan-300",
  },
  {
    icon: Sparkles,
    title: "Commitment to Excellence",
    desc: "From meticulous planning to exceptional service, we go the extra mile every single time.",
    color: "from-fuchsia-500 to-indigo-600",
    glow: "rgba(217,70,239,0.25)",
    iconBg: "bg-fuchsia-500/20 text-fuchsia-300",
  },
];

const STATS = [
  { value: "55+", label: "Years Experience" },
  { value: "12k+", label: "Happy Travellers" },
  { value: "60+", label: "Countries Served" },
  { value: "98%", label: "Satisfaction Rate" },
];

function FeatureCard({
  item,
  index,
}: {
  item: (typeof FEATURES)[number];
  index: number;
}) {
  const IconComponent = item.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="relative group rounded-2xl p-5 sm:p-6 border border-white/[0.07] bg-white/[0.04] backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.07] cursor-default"
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 20% 50%, ${item.glow} 0%, transparent 70%)`,
        }}
      />
      {/* Gradient top-line accent */}
      <div
        className={`absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />
      <div className="relative z-10 flex flex-col gap-4">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.iconBg} transition-transform duration-300 group-hover:scale-110`}
        >
          <IconComponent className="w-5 h-5" strokeWidth={1.75} />
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm sm:text-base mb-1.5 leading-snug">
            {item.title}
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            {item.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function WhyChooseUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: isMounted ? sectionRef : undefined,
    offset: ["start end", "end start"],
  });

  const sectionOpacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0, 1, 1, 0]);
  const sectionY = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [60, 0, 0, -60]);

  return (
    <section
      ref={sectionRef}
      className="md:sticky md:top-0 md:min-h-screen flex items-center py-16 sm:py-20 md:py-24 bg-slate-950 z-10 overflow-hidden shadow-2xl"
    >
      {/* Rich background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-blue-600/[0.07] blur-[100px]" />
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full bg-violet-600/[0.07] blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-indigo-700/[0.04] blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <motion.div
        style={{ opacity: sectionOpacity, y: sectionY }}
        className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10"
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full mb-4"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Why Choose Us
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-[1.1]"
            >
              Why{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">
                Ceylon Travels
              </span>
              ?
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-md lg:text-right"
          >
            Expertly crafted itineraries, deep local insights, and a commitment to
            excellence — we don't just show you Sri Lanka, we help you feel it.
          </motion.p>
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.05] rounded-2xl overflow-hidden mb-12 sm:mb-16 border border-white/[0.06]"
        >
          {STATS.map((stat) => (
            <div
              key={stat.value}
              className="flex flex-col items-center justify-center py-5 sm:py-6 px-4 bg-slate-950 hover:bg-white/[0.04] transition-colors duration-300"
            >
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {stat.value}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-slate-500 mt-1 text-center">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {FEATURES.map((item, i) => (
            <FeatureCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
