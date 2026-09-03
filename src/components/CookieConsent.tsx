"use client";

import { useState, useEffect } from "react";
import { Icons } from "./home/icons";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[100] animate-fade-up">
      <div 
        className="p-6 rounded-2xl shadow-2xl border"
        style={{ background: "white", borderColor: "var(--color-border)" }}
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--color-brand-light)", color: "var(--color-brand)" }}>
            <span className="text-xl">🍪</span>
          </div>
          <div>
            <h3 className="font-700 text-base mb-1" style={{ fontWeight: 700, color: "var(--color-text-primary)" }}>Cookie Preferences</h3>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              We use cookies to improve your experience and analyze site traffic. By clicking "Accept", you agree to our use of cookies.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAccept}
            className="flex-1 py-2.5 rounded-xl text-sm font-700 text-white transition-all hover:opacity-90"
            style={{ background: "var(--color-brand)", fontWeight: 700 }}
          >
            Accept All
          </button>
          <button
            onClick={handleDecline}
            className="px-5 py-2.5 rounded-xl text-sm font-600 transition-all hover:bg-gray-50"
            style={{ color: "var(--color-text-secondary)", border: "1px solid var(--color-border)", fontWeight: 600 }}
          >
            Decline
          </button>
        </div>
        <div className="mt-3 text-center">
          <a href="/legal/cookies" className="text-xs underline" style={{ color: "var(--color-text-muted)" }}>Read our Cookie Policy</a>
        </div>
      </div>
    </div>
  );
}
