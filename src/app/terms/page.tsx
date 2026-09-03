import React from "react";
import { getSiteSettings } from "@/lib/settings.server";
import { NavBarWrapper } from "@/components/home/NavBarWrapper";
import { Footer } from "@/components/home/Footer";
import { ShieldCheck, FileText } from "lucide-react";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  const siteName = settings?.general?.siteName || "Ceylon Travels";
  return {
    title: `Terms of Service | ${siteName}`,
    description: "Terms and conditions for booking custom Sri Lanka travel packages and tours.",
  };
}

export default async function TermsPage() {
  const settings = await getSiteSettings();
  const siteName = settings?.general?.siteName || "Ceylon Travels";
  const companyName = settings?.general?.companyName || "Ceylon Travels (Pvt) Ltd";
  const termsContent = settings?.legal?.terms || `By accessing and using the services of ${companyName}, you agree to comply with and be bound by the terms and conditions outlined herein.

1. Booking & Reservations
All tour bookings require confirmation upon deposit payment. Final itineraries, transport details, and driver assignments will be issued prior to arrival.

2. Rates & Currency
All rates are quoted in ${settings?.general?.currency || "USD"} unless specified otherwise. We reserve the right to adjust prices in the event of major tax modifications or transport tariff revisions.

3. Cancellations & Modifications
Cancellations must be notified in writing. Refund eligibility depends on the timeframe prior to arrival as per our Refund & Cancellation Policy.

4. Traveler Conduct & Responsibilities
Travelers must possess valid passports and entry visas (ETA) for Sri Lanka. ${companyName} is not responsible for passport errors or border control delays.`;

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 flex flex-col font-sans">
      <NavBarWrapper />

      {/* Header Hero */}
      <div className="bg-slate-900 text-white pt-32 pb-16 px-6 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 text-emerald-300 text-xs font-extrabold uppercase px-3 py-1 rounded-full tracking-wider mb-2">
            <FileText className="w-3.5 h-3.5" /> Legal Governance
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-serif tracking-tight">Terms & Conditions</h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto font-light">
            Please read these terms carefully before booking your Sri Lankan journey with {siteName}.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 space-y-6 text-left">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Official Agreement</h2>
              <p className="text-xs text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600 whitespace-pre-line">
            {termsContent}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
