import React from "react";
import { getSiteSettings } from "@/lib/settings.server";
import { NavBarWrapper } from "@/components/home/NavBarWrapper";
import { Footer } from "@/components/home/Footer";
import { Lock, Shield } from "lucide-react";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  const siteName = settings?.general?.siteName || "Ceylon Travels";
  return {
    title: `Privacy Protection Policy | ${siteName}`,
    description: "Privacy policy regarding customer data collection, usage, and protection.",
  };
}

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  const siteName = settings?.general?.siteName || "Ceylon Travels";
  const privacyContent = settings?.legal?.privacy || `${siteName} is committed to maintaining the confidentiality and integrity of your personal information.

1. Information We Collect
We collect personal details such as your full name, email address, phone/WhatsApp number, travel preferences, and arrival dates when you submit inquiry forms or custom itinerary requests.

2. How Your Information Is Used
Your information is strictly utilized to curate customized Sri Lanka tour itineraries, process hotel & transport reservations, communicate updates, and deliver customer support.

3. Third-Party Sharing
We never sell, rent, or trade your personal data. Data is shared exclusively with verified local service providers (hotels, licensed safari parks, train reservation agents) as necessary to fulfill your trip booking.

4. Data Security
We implement industry-standard technical safeguards to protect your personal details against unauthorized access, disclosure, or alteration.`;

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 flex flex-col font-sans">
      <NavBarWrapper />
      
      {/* Header Hero */}
      <div className="bg-slate-900 text-white pt-32 pb-16 px-6 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 text-cyan-300 text-xs font-extrabold uppercase px-3 py-1 rounded-full tracking-wider mb-2">
            <Lock className="w-3.5 h-3.5" /> Privacy & Confidentiality
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-serif tracking-tight">Privacy Protection Policy</h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto font-light">
            How {siteName} protects your personal information and respects your confidentiality.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 space-y-6 text-left">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <Shield className="w-6 h-6 text-cyan-600 shrink-0" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Privacy Safeguards</h2>
              <p className="text-xs text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600 whitespace-pre-line">
            {privacyContent}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
