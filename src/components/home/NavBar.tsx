"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/data/home";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.177-1.358a9.936 9.936 0 0 0 4.835 1.254h.005c5.502 0 9.987-4.479 9.988-9.986 0-2.67-1.037-5.18-2.92-7.062A9.925 9.925 0 0 0 12.012 2Zm5.792 14.34c-.255.72-1.48 1.408-2.036 1.488-.512.073-1.18.13-3.486-.827-2.947-1.224-4.846-4.225-4.993-4.423-.147-.197-1.196-1.593-1.196-3.037 0-1.443.754-2.151 1.025-2.443.271-.291.59-.364.787-.364h.566c.18 0 .423-.069.662.509.246.596.84 2.046.914 2.197.074.15.123.327.025.525-.099.198-.148.32-.296.492-.148.173-.31.385-.443.518-.148.148-.303.31-.13.607.172.296.764 1.258 1.632 2.03 1.12.996 2.062 1.306 2.358 1.454.296.148.468.123.64-.074.173-.197.74-.861.937-1.157.197-.296.394-.246.663-.148.27.099 1.706.804 2.001.952.296.147.492.221.566.345.074.123.074.714-.18 1.433Z"/>
    </svg>
  );
}

export function NavBar({ scrolled }: { scrolled: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useSiteSettings();
  const { user } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scrolling when mobile menu drawer is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const siteName = settings?.general?.siteName ?? "Ceylon Travels";
  const whatsapp = settings?.contact?.whatsapp || "+94770000000";
  const waLink = `https://wa.me/${whatsapp.replace(/\+/g, "").replace(/\s/g, "")}`;

  const words = siteName.split(" ");
  const firstWord = words[0] || "Ceylon";
  const secondWord = words.slice(1).join(" ") || "Travels";

  const isActive = (href: string) => {
    const base = href.split("#")[0];
    if (!base || base === "/") return pathname === "/";
    return pathname.startsWith(base);
  };

  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5 h-14 sm:h-16" />
    );
  }

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 h-14 sm:h-16 flex items-center",
          scrolled
            ? "bg-slate-950/90 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.5)]"
            : "bg-gradient-to-b from-black/50 via-black/20 to-transparent border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 w-full flex items-center justify-between gap-2">
          {/* Left Group: Mobile Menu Button + Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
            {/* Mobile Menu Toggle Button (Left Side on Mobile) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-white bg-white/10 hover:bg-white/20 active:scale-95 transition-all border border-white/15 flex items-center justify-center shrink-0 shadow-sm cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo / Brand Title (Text Only) */}
            <Link href="/" className="flex items-center group min-w-0 shrink">
              <div className="flex flex-col leading-tight select-none transition-transform duration-300 group-hover:scale-[1.02]">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-white text-base sm:text-xl tracking-tight">{firstWord}</span>
                  <span className="font-bold text-emerald-400 text-base sm:text-xl tracking-tight">{secondWord}</span>
                </div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] -mt-0.5">Sri Lanka</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href as Route}
                className={cn(
                  "group relative px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200",
                  "hover:text-white",
                  isActive(link.href) ? "text-white" : "text-slate-300"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300",
                    isActive(link.href)
                      ? "w-3/5 bg-blue-400"
                      : "w-0 bg-blue-400/60 group-hover:w-2/5"
                  )}
                />
              </Link>
            ))}
          </div>

          {/* Right Action Items */}
          <div className="flex items-center shrink-0 gap-1.5 sm:gap-2">
            {/* Quick Mobile WhatsApp Icon Button */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-white bg-emerald-600/90 hover:bg-emerald-500 active:scale-95 transition-all shadow-sm"
              title="WhatsApp Us"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4" />
            </a>

            {/* Desktop CTA buttons */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-all duration-200 hover:scale-[1.03] shadow-md shadow-emerald-900/30"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" />
              WhatsApp
            </a>
            <a
              href="#inquiry"
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("open-inquiry"));
              }}
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 hover:scale-[1.03] shadow-md shadow-blue-900/30 ring-2 ring-blue-400/50 ring-offset-1 ring-offset-slate-950 hover:ring-blue-300/70"
            >
              Free Quote
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

        </div>
      </nav>

      {/* Mobile Menu Fullscreen Overlay Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/98 backdrop-blur-2xl flex flex-col pt-20 pb-8 px-6 md:hidden animate-in fade-in slide-in-from-top-2 duration-200 overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href as Route}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "text-base font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-between",
                  isActive(link.href)
                    ? "text-white bg-blue-500/15 border border-blue-500/20"
                    : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent"
                )}
              >
                <span>{link.label}</span>
                <span className="text-slate-500 text-xs">→</span>
              </Link>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2.5 text-sm font-bold py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg shadow-emerald-900/30"
            >
              <WhatsAppIcon className="w-4 h-4" />
              WhatsApp Us Direct
            </a>
            <a
              href="#inquiry"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                window.dispatchEvent(new CustomEvent("open-inquiry"));
              }}
              className="w-full inline-flex items-center justify-center text-sm font-bold py-3.5 rounded-xl text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 active:scale-95 shadow-lg shadow-blue-900/40 ring-2 ring-blue-400/30"
            >
              Get a Free Trip Quote
            </a>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;
