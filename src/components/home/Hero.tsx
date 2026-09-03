"use client";

import React, { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import Image from "next/image";

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const { settings } = useSiteSettings();

  useEffect(() => {
    setMounted(true);
  }, []);

  const heroTitle = settings?.layout?.heroTitle || "One Island. A Thousand Lifetimes.";
  const heroSubtitle = settings?.layout?.heroSubtitle || "From mist-cloaked tea hills to sun-drenched coasts, ancient rock fortresses to private safari dawns — we craft Sri Lankan journeys that stay with you forever.";
  const heroVideoUrl = settings?.layout?.heroVideoUrl || "";
  const heroButtonText = settings?.layout?.heroButtonText || "Explore Itineraries";
  const heroButtonLink = settings?.layout?.heroButtonLink || "#itineraries";
  const isYouTube = heroVideoUrl.includes("youtube.com") || heroVideoUrl.includes("youtu.be");
  
  const getYoutubeEmbed = (url: string) => {
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("youtube.com/watch")) {
      videoId = new URL(url).searchParams.get("v") || "";
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("embed/")[1]?.split("?")[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&disablekb=1&fs=0&autohide=1&iv_load_policy=3&enablejsapi=1` : url;
  };

  const parts = heroTitle.split(".");

  if (!mounted) {
    return <section className="h-screen bg-[#0A0A08]" />;
  }

  return (
    <section className="relative min-h-[70vh] sm:min-h-screen lg:h-screen lg:min-h-screen flex items-center justify-center overflow-hidden w-full max-w-full">
      {/* Background Fallback Image */}
      <div className="absolute inset-0 max-w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1586227740560-8cf2732c1531?q=80&w=2861&auto=format&fit=crop"
          alt="Sri Lanka Travel"
          fill
          priority
          className="object-cover object-center"
        />
      </div>
      
      {/* Background Video Layer - Controls strictly hidden */}
      <div className="absolute inset-0 w-full h-full max-w-full overflow-hidden pointer-events-none select-none">
        {heroVideoUrl && !isYouTube ? (
          <video
            src={heroVideoUrl}
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            controls={false}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover pointer-events-none select-none [&::-webkit-media-controls]:hidden [&::-webkit-media-controls-enclosure]:hidden [&::-webkit-media-controls-panel]:hidden"
          />
        ) : (
          <iframe
            src={isYouTube ? getYoutubeEmbed(heroVideoUrl) : "https://www.youtube.com/embed/0UAD7eaJgrQ?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&modestbranding=1&disablekb=1&fs=0&autohide=1&playlist=0UAD7eaJgrQ&playsinline=1&iv_load_policy=3"}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none max-w-none"
            style={{ width: "max(100vw, 177.77vh)", height: "max(100vh, 56.25vw)", border: "none" }}
            allow="autoplay; encrypted-media; picture-in-picture"
            tabIndex={-1}
          />
        )}
      </div>

      {/* Multi-stage Overlays for video visibility & text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/60 pointer-events-none z-[2]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black/30 via-transparent to-transparent pointer-events-none z-[2]" />

      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none z-[3]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center justify-center h-full pt-16 sm:pt-20 pb-12">
        {/* Hero Copy */}
        <div className="flex-1 text-white flex flex-col items-center justify-center max-w-3xl">
          
         

          {/* Main Title */}
          <h1
            className="font-black mb-4 sm:mb-6 text-white tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]"
            style={{
              fontFamily: "var(--font-lora), Georgia, serif",
              fontSize: "clamp(2.1rem, 5.5vw, 3.8rem)",
              lineHeight: 1.15,
              color: "#FFFFFF",
              textShadow: "0 4px 30px rgba(0, 0, 0, 0.95), 0 2px 10px rgba(0, 0, 0, 0.9)",
            }}
          >
            {parts[0]}
            {parts.length > 1 && parts[1] && (
              <>
                .<br />
                <em 
                  className="not-italic text-amber-300"
                  style={{ 
                    fontStyle: "italic",
                    textShadow: "0 0 30px rgba(252, 211, 77, 0.4), 0 4px 20px rgba(0,0,0,0.9)",
                  }}
                >
                  {parts[1]}
                </em>
              </>
            )}
            {parts.length > 2 && parts[2] && (
              <>
                .<br />
                {parts[2]}
              </>
            )}
          </h1>

          {/* Subtitle Box with Glassmorphism */}
          <div className="bg-slate-950/45 backdrop-blur-md px-5 py-3.5 sm:px-8 sm:py-5 rounded-2xl border border-white/15 shadow-2xl max-w-2xl mb-8 sm:mb-10">
            <p 
              className="text-slate-100 text-sm sm:text-base md:text-lg font-medium tracking-wide leading-relaxed"
              style={{
                textShadow: "0 2px 12px rgba(0, 0, 0, 0.95)",
              }}
            >
              {heroSubtitle}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 justify-center w-full max-w-md sm:max-w-none">
            <a
              href={heroButtonLink}
              className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm tracking-widest uppercase px-8 py-4 text-white font-extrabold rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-[0_8px_30px_rgba(6,78,59,0.5)] border border-emerald-400/30"
              style={{ background: "linear-gradient(135deg, var(--color-brand) 0%, #047857 100%)", letterSpacing: "0.14em" }}
            >
              <span>{heroButtonText}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a
              href="#inquiry"
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("open-inquiry"));
              }}
              className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm tracking-widest uppercase px-8 py-4 rounded-xl border border-white/50 text-white font-extrabold hover:bg-white/20 hover:border-white/80 transition-all duration-300 backdrop-blur-md shadow-xl active:scale-[0.98]"
              style={{ letterSpacing: "0.14em", background: "rgba(255, 255, 255, 0.08)" }}
            >
              <span>Start Planning</span>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-white/50 text-xs tracking-widest uppercase" style={{ letterSpacing: "0.2em" }}>Scroll</span>
        <div className="w-px h-12 relative overflow-hidden" style={{ background: "rgba(255,255,255,0.2)" }}>
          <div
            className="absolute top-0 w-full"
            style={{ background: "var(--color-brand)", height: "40%", animation: "scrollBar 1.8s ease-in-out infinite" }}
          />
        </div>
      </div>

      <style>{`
        @keyframes scrollBar {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(300%); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
