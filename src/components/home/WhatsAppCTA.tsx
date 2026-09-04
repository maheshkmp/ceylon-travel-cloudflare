import { Icons } from "./icons";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { buildWhatsAppLink, getGeneralWhatsAppMessage } from "@/lib/whatsapp";

export function WhatsAppCTA() {
  const { settings } = useSiteSettings();
  const whatsapp = settings?.contact?.whatsapp || "+94775105848";
  const waLink = buildWhatsAppLink({ phoneNumber: whatsapp, message: getGeneralWhatsAppMessage() });
  return (
    <section className="section-pad-sm" style={{ background: "#F5F7FA" }}>
      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        <div
          className="rounded-2xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8"
          style={{ background: "linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-dark) 100%)" }}
        >
          {/* Left */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
             
              <div>
                <p className="text-white font-800 text-xl" style={{ fontWeight: 800 }}>Prefer to Chat?</p>
                 </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed max-w-sm">
              Our Sri Lanka travel experts are on WhatsApp 7 days a week — ready to answer your questions and build your personalised itinerary.
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-inquiry"))}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-700 text-base transition-all hover:opacity-90 hover:scale-105 cursor-pointer"
              style={{ background: "#25D366", color: "white", fontWeight: 700, boxShadow: "0 8px 24px rgba(37,211,102,0.4)" }}
            >
              <span className="shrink-0">{Icons.message}</span>
              Chat on WhatsApp
            </button>
            <p className="text-white/60 text-xs">{whatsapp} · Available daily</p>
          </div>
        </div>
      </div>
    </section>
  );
}
