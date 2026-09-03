import React from "react";
import { getSiteSettings } from "@/lib/settings.server";
import { NavBarWrapper } from "@/components/home/NavBarWrapper";
import { Footer } from "@/components/home/Footer";
import { Banknote, ShieldCheck } from "lucide-react";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  const siteName = settings?.general?.siteName || "Ceylon Travels";
  return {
    title: `Refund & Cancellation Policy | ${siteName}`,
    description: "Refund and cancellation guidelines for Sri Lanka tour packages.",
  };
}

export default async function RefundPolicyPage() {
  const settings = await getSiteSettings();
  const siteName = settings?.general?.siteName || "Ceylon Travels";
  const refundContent = settings?.legal?.refund || `${siteName} strives to maintain fair and transparent refund rules for all tour bookings.

1. Cancellation Timeframes & Refunds
- Cancellations made 30+ days prior to arrival date: 90% refund of total booking deposit (10% processing fee).
- Cancellations made 14-29 days prior to arrival date: 50% refund of total booking deposit.
- Cancellations made within 14 days of arrival date: Non-refundable due to pre-paid hotel and chauffeur reservations.

2. Trip Rescheduling & Flexibility
If travel plans change, dates may be rescheduled free of charge up to 15 days before arrival, subject to hotel availability and seasonal tariff adjustments.

3. Process & Reimbursements
Approved refunds will be credited to the original payment method within 7-14 business days.`;

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 flex flex-col font-sans">
      <NavBarWrapper />

      <div className="bg-slate-900 text-white pt-32 pb-16 px-6 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 text-rose-300 text-xs font-extrabold uppercase px-3 py-1 rounded-full tracking-wider mb-2">
            <Banknote className="w-3.5 h-3.5" /> Financial Protection
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-serif tracking-tight">Refund & Cancellation Policy</h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto font-light">
            Understand how cancellations, date changes, and refunds are handled at {siteName}.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 space-y-6 text-left">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <ShieldCheck className="w-6 h-6 text-rose-600 shrink-0" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Refund Terms</h2>
              <p className="text-xs text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600 whitespace-pre-line">
            {refundContent}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
