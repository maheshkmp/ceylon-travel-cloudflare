"use client";

export const runtime = "edge";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { NavBar } from "@/components/home/NavBar";
import { Footer } from "@/components/home/Footer";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { Sparkles, Star, MapPin, ShieldCheck, Award } from "lucide-react";

const PHILOSOPHY_ITEMS = [
  {
    title: "Explore",
    tagline: "The Beauty of Sri Lanka",
    desc: "Explore the beauty of Sri Lanka—from ancient cultural treasures and mist-cloaked tea mountains to sun-drenched golden beaches and wild safari dawns.",
    image: "https://images.unsplash.com/photo-1612862862126-865765df2ded?q=80&w=800&auto=format&fit=crop",
    color: "from-blue-500/20 to-cyan-500/10",
    borderColor: "border-blue-500/30",
  },
  {
    title: "Experience",
    tagline: "Culture, Nature & Hospitality",
    desc: "Experience its culture, nature, and authentic warm local hospitality through tailor-made journeys crafted around your dreams.",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800&auto=format&fit=crop",
    color: "from-indigo-500/20 to-purple-500/10",
    borderColor: "border-indigo-500/30",
  },
  {
    title: "Remember",
    tagline: "Moments That Last Forever",
    desc: "Remember moments that will stay with you forever, created with confidence, luxury, and seamless care down to every detail.",
    image: "https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=800&auto=format&fit=crop",
    color: "from-emerald-500/20 to-teal-500/10",
    borderColor: "border-emerald-500/30",
  },
];

export default function AboutPage() {
  const [scrolled, setScrolled] = useState(false);
  const { settings } = useSiteSettings();
  const whatsapp = settings?.contact?.whatsapp || "+94775105848";
  const waLink = `https://wa.me/${whatsapp.replace(/\+/g, "").replace(/\s/g, "")}`;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="bg-slate-950 text-white min-h-screen font-sans antialiased" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" }}>
      <NavBar scrolled={scrolled} />

      {/* Hero Section */}
      <section className="relative h-[65vh] min-h-[440px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1920&q=80"
          alt="Ceylon Travels"
          fill
          priority
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/80 to-slate-950" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 pt-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold uppercase tracking-[0.3em] mb-4 text-blue-400">
            Welcome to Ceylon Travels
          </span>
          <h1 className="text-white text-4xl sm:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-tight">
            Explore. Experience. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
              Remember.
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-lg max-w-3xl mx-auto font-medium leading-relaxed">
            At Ceylon Travels, we believe every journey should be more than just a vacation—it should be an experience you'll cherish for a lifetime.
          </p>
        </div>
      </section>

      {/* Main Story Content Section */}
      <section className="py-16 sm:py-24 bg-slate-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Elegant Image Collage (Left) */}
            <div className="lg:col-span-5 relative h-[380px] sm:h-[480px] w-full flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/15 to-indigo-600/10 rounded-3xl -rotate-2 scale-[0.98] border border-white/10 pointer-events-none" />
              
              <div className="absolute top-0 left-0 w-[72%] h-[72%] rounded-2xl overflow-hidden shadow-2xl border border-white/15 group z-10">
                <Image
                  src="/images/thiraj.jpeg"
                  alt="Founder of Ceylon Travels"
                  fill 
                  priority
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 70vw, 35vw"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/40 via-transparent to-transparent" />
              </div>

              <div className="absolute bottom-2 right-0 w-[58%] h-[58%] rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-950 group">
                <Image
                  src="https://images.unsplash.com/photo-1743585826344-aea35e952642?q=80&w=1470&auto=format&fit=crop"
                  alt="Galle Fort Coastal Beauty"
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>

              <div className="absolute bottom-10 left-4 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 shadow-xl flex items-center gap-3 z-20">
                <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">Ceylon Travels — Founder</p>
                  <p className="text-[11px] text-slate-400">Your Trusted Ceylon Host</p>
                </div>
              </div>
            </div>

            {/* Content Story (Right) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="inline-block text-xs font-extrabold uppercase tracking-[0.25em] text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full mb-3 border border-blue-500/20">
                  About Us
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                  Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Ceylon Travels</span>
                </h2>
              </div>
              
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Ceylon Travels was born from a passion for sharing the authentic beauty of Sri Lanka with travelers from around the world. From ancient cultural treasures and breathtaking landscapes to pristine beaches, incredible wildlife, and warm local hospitality, we create journeys that showcase the very best our island has to offer.
              </p>

              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Whether you're seeking adventure, relaxation, culture, luxury, or a little of everything, we take care of every detail so you can travel with confidence and enjoy Sri Lanka to the fullest.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
                <div className="flex items-center gap-2 px-3.5 py-2 bg-white/[0.04] border border-white/10 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-blue-400" /> Tailor-Made Itineraries
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 bg-white/[0.04] border border-white/10 rounded-xl">
                  <MapPin className="w-4 h-4 text-cyan-400" /> Island-Wide Expertise
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 bg-white/[0.04] border border-white/10 rounded-xl">
                  <Star className="w-4 h-4 text-amber-400" /> Unforgettable Memories
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Our Philosophy Section */}
      <section className="py-20 bg-slate-900/60 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-xs font-extrabold uppercase tracking-[0.25em] text-indigo-400 mb-3">
              Our Core Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              At Ceylon Travels, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                our philosophy is simple
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {PHILOSOPHY_ITEMS.map((item) => {
              return (
                <div
                  key={item.title}
                  className={`p-6 sm:p-7 rounded-3xl bg-gradient-to-b ${item.color} border ${item.borderColor} relative group hover:-translate-y-1.5 transition-all duration-300 shadow-xl overflow-hidden flex flex-col`}
                >
                  <div className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden mb-6 border border-white/10 shadow-xl">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-[0.2em] text-cyan-300 border border-white/15">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400 block mb-1">
                    {item.tagline}
                  </span>
                  <h3 className="text-2xl font-extrabold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing Welcome & CTA Banner */}
      <section className="relative py-24 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1920&q=85"
            alt="CTA Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-white/10 backdrop-blur-xl shadow-2xl mb-10">
            <Sparkles className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-relaxed tracking-tight max-w-3xl mx-auto">
              "We look forward to welcoming you and making your Sri Lankan journey truly unforgettable."
            </h2>
            <p className="text-blue-400 text-xs font-extrabold uppercase tracking-[0.3em] mt-6">
              — Ceylon Travels
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href="/#inquiry"
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("open-inquiry"));
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-[1.02] shadow-xl bg-blue-600 hover:bg-blue-500"
            >
              Plan Your Trip Now
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <button 
              type="button" 
              onClick={() => window.dispatchEvent(new CustomEvent("open-inquiry"))}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-sm cursor-pointer"
            >
              Contact Us on WhatsApp
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

