import React from "react";
import { getSiteSettings } from "@/lib/settings.server";
import { NavBarWrapper } from "@/components/home/NavBarWrapper";
import { Footer } from "@/components/home/Footer";
import { HelpCircle, MessageSquare, PhoneCall } from "lucide-react";
import { FAQAccordion } from "@/components/faq/FAQAccordion";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  const siteName = settings?.general?.siteName || "Ceylon Travels";
  return {
    title: `Frequently Asked Questions (FAQ) | ${siteName}`,
    description: "Get answers to popular questions about Sri Lanka visa requirements, custom tour packages, transport, and travel tips.",
  };
}

export default async function FAQPage() {
  const settings = await getSiteSettings();
  const siteName = settings?.general?.siteName || "Ceylon Travels";

  let faqList: { id: string; question: string; answer: string }[] = [];

  try {
    const rawItems = settings?.faq?.items;
    if (rawItems) {
      const parsed = JSON.parse(rawItems);
      if (Array.isArray(parsed) && parsed.length > 0) {
        faqList = parsed;
      }
    }
  } catch (e) {
    // fallback parsing
  }

  // Fallback defaults if empty
  if (faqList.length === 0) {
    faqList = [
      { id: "1", question: "Do I need a visa to visit Sri Lanka?", answer: "Yes, most foreign travelers require an Electronic Travel Authorization (ETA) or tourist visa prior to entry in Sri Lanka. It can be applied online easily." },
      { id: "2", question: "What is the best time of year to visit Sri Lanka?", answer: "Sri Lanka is a year-round destination! Dec-April is ideal for the West & South coasts, while May-Sept is perfect for the East coast & Cultural Triangle." },
      { id: "3", question: "Are your tour packages customizable?", answer: "Absolutely! All of our itineraries are 100% tailor-made to fit your dates, travel style, and budget preferences." },
      { id: "4", question: "Is private transportation included?", answer: "Yes, all our luxury and custom tour packages come with a private air-conditioned vehicle and an experienced English-speaking chauffeur guide." },
      { id: "5", question: "What currency is accepted in Sri Lanka?", answer: "The local currency is the Sri Lankan Rupee (LKR). Major credit cards and US Dollars are widely accepted in hotels and major travel hubs." },
      { id: "6", question: "How do I book a tour with Ceylon Travels?", answer: "You can click 'Start Planning' or send us an inquiry via our contact form or WhatsApp. Our travel specialists will craft a customized itinerary for you within 24 hours." }
    ];
  }

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 flex flex-col font-sans">
      <NavBarWrapper />

      {/* Header Hero */}
      <div className="bg-slate-900 text-white pt-32 pb-16 px-6 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-300 text-xs font-extrabold uppercase px-3.5 py-1 rounded-full tracking-wider mb-2">
            <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
          </div>
          <h1 className="text-3xl md:text-5xl font-white font-serif tracking-tight">Everything You Need to Know</h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto font-light">
            Have questions about traveling to Sri Lanka? Find clear answers regarding visas, travel seasons, itineraries, and bookings.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full space-y-8">

        {/* Interactive Accordion List */}
        <FAQAccordion items={faqList} />

        {/* Contact Support Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md text-left">
          <div className="space-y-1">
            <h3 className="text-lg font-bold font-serif flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" /> Still have questions?
            </h3>
            <p className="text-xs text-slate-300">
              Our expert travel consultants are available 24/7 on WhatsApp & Email to assist you.
            </p>
          </div>
          <a
            href={`https://wa.me/${(settings?.contact?.whatsapp || "+94775105848").replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all shrink-0 uppercase tracking-wider"
          >
            <PhoneCall className="w-4 h-4" /> Ask on WhatsApp
          </a>
        </div>

      </main>

      <Footer />
    </div>
  );
}
