"use client";

import React from "react";
import { Calendar, ArrowRight, MessageCircle } from "lucide-react";
import { buildWhatsAppLink, getDestinationWhatsAppMessage } from "@/lib/whatsapp";

interface CustomizeItineraryButtonProps {
  destinationName?: string;
  region?: string;
  variant?: "card" | "cta";
  label?: string;
  showWhatsApp?: boolean;
}

export function CustomizeItineraryButton({
  destinationName = "Sri Lanka",
  region = "Islandwide",
  variant = "card",
  label,
  showWhatsApp = true,
}: CustomizeItineraryButtonProps) {
  const handleClick = () => {
    window.dispatchEvent(
      new CustomEvent("open-inquiry", {
        detail: { destination: destinationName },
      })
    );
  };

  const waLink = buildWhatsAppLink({
    phoneNumber: "+94775105848",
    message: getDestinationWhatsAppMessage(destinationName, region),
  });

  if (variant === "cta") {
    return (
      <div className="flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={handleClick}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-xs uppercase tracking-wider bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30 transition-all cursor-pointer"
        >
          {label || "Build My Bespoke Itinerary"}
          <ArrowRight className="w-4 h-4" />
        </button>
        {showWhatsApp && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-xs uppercase tracking-wider bg-[#25D366] hover:bg-[#20bd5a] shadow-xl shadow-emerald-500/20 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
            Chat on WhatsApp
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2 w-full">
      <button
        type="button"
        onClick={handleClick}
        className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
      >
        <Calendar className="w-4 h-4 text-blue-400" />
        {label || "Customize Private Itinerary"}
      </button>
      {showWhatsApp && (
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
        >
          <MessageCircle className="w-4 h-4 text-[#25D366]" />
          Chat on WhatsApp
        </a>
      )}
    </div>
  );
}
