"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, Phone, Mail, ArrowUp, MapPin } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { motion, useScroll, useTransform } from "framer-motion";

// ── Real Social Media Brand Logo SVG Components ──────────────────────────────

function FacebookLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </svg>
  );
}

function InstagramLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function YoutubeLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function WhatsappLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function TripAdvisorLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.006 4.295c-2.67 0-5.338.784-7.645 2.353H0l1.963 2.135a5.997 5.997 0 0 0 4.04 10.43 5.976 5.976 0 0 0 4.075-1.6L12 19.705l1.922-2.09a5.972 5.972 0 0 0 4.072 1.598 6 6 0 0 0 6-5.998 5.982 5.982 0 0 0-1.957-4.432L24 6.648h-4.35a13.573 13.573 0 0 0-7.644-2.353zM12 6.255c1.531 0 3.063.303 4.504.903C13.943 8.138 12 10.43 12 13.1c0-2.671-1.942-4.962-4.504-5.942A11.72 11.72 0 0 1 12 6.256zM6.002 9.157a4.059 4.059 0 1 1 0 8.118 4.059 4.059 0 0 1 0-8.118zm11.992.002a4.057 4.057 0 1 1 .003 8.115 4.057 4.057 0 0 1-.003-8.115zm-11.992 1.93a2.128 2.128 0 0 0 0 4.256 2.128 2.128 0 0 0 0-4.256zm11.992 0a2.128 2.128 0 0 0 0 4.256 2.128 2.128 0 0 0 0-4.256z" />
    </svg>
  );
}

function LinkedinLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TiktokLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

function TwitterXLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
    </svg>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [mounted, setMounted] = useState(false);
  const { settings } = useSiteSettings();
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: mounted ? footerRef : undefined,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  const siteName = settings?.general?.siteName ?? "Ceylon Travels";

  const socialConfig = [
    {
      key: "facebook",
      name: "Facebook",
      icon: FacebookLogo,
      href: settings?.social?.facebook,
      textColor: "text-[#1877F2]",
      bgColor: "bg-[#1877F2]/15 border-[#1877F2]/30 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]"
    },
    {
      key: "instagram",
      name: "Instagram",
      icon: InstagramLogo,
      href: settings?.social?.instagram,
      textColor: "text-[#E4405F]",
      bgColor: "bg-[#E4405F]/15 border-[#E4405F]/30 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white hover:border-transparent"
    },
    {
      key: "youtube",
      name: "YouTube",
      icon: YoutubeLogo,
      href: settings?.social?.youtube,
      textColor: "text-[#FF0000]",
      bgColor: "bg-[#FF0000]/15 border-[#FF0000]/30 hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]"
    },
    {
      key: "whatsapp",
      name: "WhatsApp",
      icon: WhatsappLogo,
      href: settings?.social?.whatsapp || (settings?.contact?.whatsapp ? (settings.contact.whatsapp.startsWith("http") ? settings.contact.whatsapp : `https://wa.me/${settings.contact.whatsapp.replace(/[^0-9]/g, "")}`) : undefined),
      textColor: "text-[#25D366]",
      bgColor: "bg-[#25D366]/15 border-[#25D366]/30 hover:bg-[#25D366] hover:text-white hover:border-[#25D366]"
    },
    {
      key: "tripadvisor",
      name: "TripAdvisor",
      icon: TripAdvisorLogo,
      href: settings?.social?.tripadvisor,
      textColor: "text-[#00AF87]",
      bgColor: "bg-[#00AF87]/15 border-[#00AF87]/30 hover:bg-[#00AF87] hover:text-white hover:border-[#00AF87]"
    },
    {
      key: "linkedin",
      name: "LinkedIn",
      icon: LinkedinLogo,
      href: settings?.social?.linkedin,
      textColor: "text-[#0077B5]",
      bgColor: "bg-[#0077B5]/15 border-[#0077B5]/30 hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5]"
    },
    {
      key: "tiktok",
      name: "TikTok",
      icon: TiktokLogo,
      href: settings?.social?.tiktok,
      textColor: "text-white",
      bgColor: "bg-white/10 border-white/20 hover:bg-black hover:text-white hover:border-white/50"
    },
    {
      key: "twitter",
      name: "Twitter / X",
      icon: TwitterXLogo,
      href: settings?.social?.twitter,
      textColor: "text-white",
      bgColor: "bg-white/10 border-white/20 hover:bg-black hover:text-white hover:border-white/50"
    },
  ];

  const activeSocialLinks = socialConfig.filter((item) => Boolean(item.href && item.href.trim() !== ""));

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerTextSetting = settings?.layout?.footerText || "© 2026 Ceylon Travels (Pvt) Ltd. All rights reserved.";

  const renderFooterNoticeText = (text: string) => {
    if (text.includes("example")) {
      const parts = text.split("example");
      return (
        <>
          {parts[0]}
          <a
            href="https://example.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 font-bold underline hover:text-white transition-colors"
          >
            example
          </a>
          {parts[1]}
        </>
      );
    }
    return text;
  };

  if (!mounted) {
    return <footer className="bg-slate-950 h-[400px]" />;
  }

  return (
    <footer ref={footerRef} className="relative bg-slate-950 overflow-hidden text-white">
      {/* Background Cinematic Image with Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          src="https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Ella Train Route Sri Lanka"
          className="w-full h-[130%] -top-[15%] object-cover opacity-60"
          style={{ y: bgY }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/85 to-slate-950" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-10 pb-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-8 sm:mb-10 lg:mb-12">

          {/* Column 1: Brand & Contact Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-black tracking-tight text-white mb-2">
                {siteName.toUpperCase()}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-[260px]">
                Crafting authentic, unforgettable Sri Lankan adventures with local expertise.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex gap-3 items-start">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Office</h4>
                  <p className="text-[13px] text-slate-300 leading-relaxed font-medium mt-0.5">
                    Ceylon Travels, Colombo 03, Sri Lanka.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Phone</h4>
                  <a href="tel:+94770000000" className="text-[13px] text-slate-300 font-bold hover:text-blue-400 transition-colors">
                    +94 77 000 0000
                  </a>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Email</h4>
                  <a href="mailto:info@ceylontravels.com" className="text-[13px] text-slate-300 font-semibold hover:text-blue-400 transition-colors">
                    info@ceylontravels.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links (Dual Column) */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-slate-400">Explore</h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3.5">
              {[
                { label: "Home", href: "/" },
                { label: "Tour Packages", href: "/#itineraries" },
                { label: "Destinations", href: "/destinations" },
                { label: "Travel Journal", href: "/blog" },
                { label: "About Us", href: "/#about" },
                { label: "Our Services", href: "/#services" },
                { label: "Contact Us", href: "/#contact" },
                { label: "Gallery", href: "/#gallery" },
                { label: "FAQs", href: "/faq" },
                { label: "Reviews", href: "/#testimonials" },
                { label: "Inquiry", href: "/#inquiry" },
                { label: "Terms", href: "/terms" },
              ].map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href === "/#inquiry") {
                      e.preventDefault();
                      window.dispatchEvent(new CustomEvent("open-inquiry"));
                    }
                  }}
                  className="text-[13px] text-slate-400 hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-0.5 inline-block w-fit cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Newsletter & Partner Badges */}
          <div className="md:col-span-2 lg:col-span-2 space-y-10">
            <div className="max-w-md">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 text-slate-400">Newsletter</h4>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full h-12 bg-white/[0.04] border border-white/10 rounded-xl px-6 pr-14 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all placeholder:text-slate-500"
                />
                <button className="absolute right-1.5 top-1.5 h-9 w-9 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center transition-all hover:scale-[1.02] shadow-lg">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Accredited Member</h4>
              <div className="flex flex-wrap gap-2.5">
                {["SLTDA Approved", "TAASL", "PATA Member", "IATA Accredited"].map(p => (
                  <div key={p} className="px-3.5 py-1.5 bg-white/[0.03] hover:bg-white/[0.07] rounded-lg text-[9px] font-extrabold text-slate-400 tracking-wider uppercase border border-white/[0.06] transition-all cursor-default">
                    {p}
                  </div>
                ))}
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex flex-wrap gap-2 pt-2">
              {socialConfig.map((social) => {
                const Icon = social.icon;
                return (
                  <button
                    key={social.key}
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent("open-inquiry"))}
                    title={social.name}
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${social.textColor} ${social.bgColor}`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] text-slate-500">
            {renderFooterNoticeText(footerTextSetting)}
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-[11px] text-slate-500">
            <a href="/terms" className="hover:text-slate-300 transition-colors">Terms & Conditions</a>
            <a href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="/cookie-policy" className="hover:text-slate-300 transition-colors">Cookie Policy</a>
            <a href="/refund-policy" className="hover:text-slate-300 transition-colors">Refund Policy</a>
            <a href="/faq" className="hover:text-slate-300 transition-colors">FAQs</a>
          </div>

          <p className="text-[11px] text-slate-600">
            Premium Travel Partner
          </p>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-24 right-4 sm:bottom-8 sm:right-8 z-[100] flex flex-col gap-4">
        <button
          onClick={scrollToTop}
          className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-900/60 hover:bg-slate-900 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 hover:scale-105 transition-all shadow-2xl"
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </footer>
  );
}
