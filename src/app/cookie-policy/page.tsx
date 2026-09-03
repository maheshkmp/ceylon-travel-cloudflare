import React from "react";
import { getSiteSettings } from "@/lib/settings.server";
import { NavBarWrapper } from "@/components/home/NavBarWrapper";
import { Footer } from "@/components/home/Footer";
import { Cookie, ShieldCheck } from "lucide-react";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  const siteName = settings?.general?.siteName || "Ceylon Travels";
  return {
    title: `Cookie Usage Policy | ${siteName}`,
    description: "Information about cookie usage and analytical preferences.",
  };
}

export default async function CookiePolicyPage() {
  const settings = await getSiteSettings();
  const siteName = settings?.general?.siteName || "Ceylon Travels";
  const cookieContent = settings?.legal?.cookie || `${siteName} uses cookies and similar browser tracking technologies to deliver a personalized browsing experience, understand visitor interactions, and optimize custom travel package offerings.

1. What Are Cookies?
Cookies are small text files stored on your device when you visit websites. They help remember your language preferences, currency choices, and session activity.

2. Types of Cookies We Use
- Essential Cookies: Necessary for navigation and basic website operations.
- Analytics Cookies: Help us measure visitor engagement and improve page speed.
- Preference Cookies: Remember custom preferences such as currency or wishlist items.

3. Managing Cookie Preferences
You can manage or disable cookies at any time through your browser settings or via our Cookie Consent banner on the platform.`;

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 flex flex-col font-sans">
      <NavBarWrapper />

      <div className="bg-slate-900 text-white pt-32 pb-16 px-6 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 text-amber-300 text-xs font-extrabold uppercase px-3 py-1 rounded-full tracking-wider mb-2">
            <Cookie className="w-3.5 h-3.5" /> Platform Preferences
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-serif tracking-tight">Cookie Usage Policy</h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto font-light">
            Understand how {siteName} uses cookies to improve your user experience.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 space-y-6 text-left">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Cookie Management</h2>
              <p className="text-xs text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600 whitespace-pre-line">
            {cookieContent}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
