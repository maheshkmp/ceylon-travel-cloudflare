import { Icons } from "./icons";

const TRUST_ITEMS = [
  { icon: Icons.trophy,  label: "55+ Years",     sub: "Trusted Experience",   color: "#FF6B35" },
  { icon: Icons.users,   label: "12,000+",        sub: "Happy Travellers",     color: "#00A680" },
  { icon: Icons.star,    label: "4.9 / 5",        sub: "Average Rating",       color: "#F59E0B" },
  { icon: Icons.leaf,    label: "Eco Certified",  sub: "Responsible Tourism",  color: "#10B981" },
  { icon: Icons.shield,  label: "100% Safe",      sub: "Secure Booking",       color: "#6366F1" },
];

export function TrustBar() {
  return (
    <section style={{ background: "white", borderBottom: "1px solid #E4E8F0" }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <div className="flex flex-wrap justify-center lg:justify-between items-center gap-6 lg:gap-4">
          {TRUST_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${item.color}18`, color: item.color }}
              >
                {item.icon}
              </div>
              <div>
                <p className="font-700 text-sm leading-none mb-0.5" style={{ fontWeight: 700, color: "#1A1A2E" }}>{item.label}</p>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
