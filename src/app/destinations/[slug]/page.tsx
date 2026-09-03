import React from "react";
import { notFound } from "next/navigation";
import { getDestinationBySlug, getRelatedItinerariesForDestination } from "@/actions/destinations";
import { NavBar } from "@/components/home/NavBar";
import { Footer } from "@/components/home/Footer";
import { ItineraryCard, type ItineraryData } from "@/components/shared/ItineraryCard";
import { MapPin, ArrowRight, Compass, Sparkles, Calendar, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CustomizeItineraryButton } from "@/components/destinations/CustomizeItineraryButton";

export const runtime = "edge";
export const dynamic = "force-dynamic";

interface DestinationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DestinationPageProps) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    return { title: "Destination Not Found | Ceylon Travels" };
  }

  return {
    title: `${destination.name} Travel Guide & Tours | Ceylon Travels`,
    description: `${destination.tagline}. Discover tours, itineraries, and travel highlights for ${destination.name}, ${destination.region}, Sri Lanka.`,
    openGraph: {
      title: `${destination.name} | Ceylon Travels`,
      description: destination.tagline,
      images: [{ url: destination.image }],
    },
  };
}

function stripHtml(html?: string | null) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ").trim();
}

export default async function DestinationDetailPage({ params }: DestinationPageProps) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  const rawItineraries = await getRelatedItinerariesForDestination(destination.name, destination.slug);

  const itineraryCards: ItineraryData[] = rawItineraries.map((itin: any) => ({
    id: itin.id,
    title: itin.title,
    slug: itin.slug,
    days: itin.duration,
    tag: itin.travelStyle || "Luxury Tour",
    price: itin.price,
    highlights:
      itin.highlights && itin.highlights.length > 0
        ? itin.highlights
        : itin.days?.map((d: any) => d.place.split(" → ")[0]).slice(0, 3) || [destination.name],
    image: itin.heroImg,
    mood: itin.travelStyle || "Culture & Wildlife",
    rating: 4.9,
    reviewsCount: 112,
  }));

  const cleanDescription = stripHtml(destination.description);

  // Generate Structured Data (JSON-LD)
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "TouristDestination",
      "name": destination.name,
      "description": destination.tagline || cleanDescription,
      "image": destination.image,
      "containedInPlace": {
        "@type": "AdministrativeArea",
        "name": `${destination.region}, Sri Lanka`
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://ceylontravels.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Destinations",
          "item": "https://ceylontravels.com/destinations"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": destination.name,
          "item": `https://ceylontravels.com/destinations/${destination.slug}`
        }
      ]
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main
        className="bg-slate-950 text-white min-h-screen font-sans antialiased relative overflow-hidden"
        style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" }}
      >
        <NavBar scrolled={true} />

        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-96 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[520px] flex items-end overflow-hidden pt-28">
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            priority
            className="absolute inset-0 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pb-16">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-6">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/destinations" className="hover:text-white transition-colors">
                Destinations
              </Link>
              <span>/</span>
              <span className="text-blue-400 font-bold">{destination.name}</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/15 backdrop-blur-md border border-white/20 text-blue-300 shadow-sm mb-4">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>{destination.region}</span>
            </div>

            <h1
              className="text-white text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-4 tracking-tight leading-none uppercase"
              style={{ fontFamily: "var(--font-lora)" }}
            >
              {destination.name}
            </h1>

            <p className="text-blue-300 text-base sm:text-xl font-medium italic max-w-3xl mb-8">
              "{destination.tagline}"
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#related-tours"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white text-xs uppercase tracking-wider transition-all bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/25"
              >
                Explore {destination.name} Tours
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href={`/itinerary?destination=${destination.slug}`}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-slate-200 text-xs uppercase tracking-wider transition-all bg-white/10 border border-white/20 hover:bg-white/20"
              >
                All Packages
              </Link>
            </div>
          </div>
        </section>

        {/* Overview & Quick Info */}
        <section className="py-20 relative z-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-start">
              {/* Left: About Details */}
              <div className="bg-slate-900/60 p-8 sm:p-10 rounded-3xl border border-white/[0.08] backdrop-blur-xl shadow-2xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                  <Compass className="w-3.5 h-3.5" /> Destination Overview
                </div>

                <h2
                  className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight"
                  style={{ fontFamily: "var(--font-lora)" }}
                >
                  Experience {destination.name}
                </h2>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                  {cleanDescription ||
                    `Discover the rich history, natural beauty, and vibrant culture of ${destination.name}. Situated in the ${destination.region} of Sri Lanka, this landmark destination offers an unforgettable blend of scenic landscapes, cultural monuments, and authentic local experiences.`}
                </p>

                <div className="pt-6 border-t border-white/10 grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-blue-400 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white uppercase tracking-wider">Unmatched Heritage</h5>
                      <p className="text-xs text-slate-400 mt-0.5">Rich Sri Lankan history and iconic landmarks.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white uppercase tracking-wider">Expert Chauffeurs</h5>
                      <p className="text-xs text-slate-400 mt-0.5">Guided by private Sri Lanka travel specialists.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Quick Stats Card */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/40 p-8 rounded-3xl border border-white/[0.1] shadow-2xl space-y-6">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider border-b border-white/10 pb-4">
                  Key Highlights
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-xs font-semibold text-slate-400">Region</span>
                    <span className="text-xs font-bold text-white uppercase">{destination.region}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-xs font-semibold text-slate-400">Best For</span>
                    <span className="text-xs font-bold text-blue-400 truncate max-w-[200px]">
                      {destination.tagline}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-xs font-semibold text-slate-400">Tours Available</span>
                    <span className="text-xs font-bold text-emerald-400">{rawItineraries.length} Tour Packages</span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs font-semibold text-slate-400">Travel Assistance</span>
                    <span className="text-xs font-bold text-amber-400">24/7 Concierge</span>
                  </div>
                </div>

                <CustomizeItineraryButton destinationName={destination.name} region={destination.region} variant="card" />
              </div>
            </div>
          </div>
        </section>

        {/* Related Tour Itineraries Section */}
        <section id="related-tours" className="py-20 bg-slate-900/40 border-t border-white/[0.06] relative z-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
                  Featured Experiences
                </span>
                <h2
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase"
                  style={{ fontFamily: "var(--font-lora)" }}
                >
                  Tours Featuring <span className="text-blue-400">{destination.name}</span>
                </h2>
                <p className="text-slate-400 text-sm mt-3 max-w-xl">
                  Explore handpicked, customizable Sri Lanka itineraries that take you to {destination.name} and surrounding landmarks.
                </p>
              </div>

              <Link
                href={`/itinerary?destination=${destination.slug}`}
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-white transition-colors uppercase tracking-wider shrink-0"
              >
                Browse All Itineraries
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {itineraryCards.map((card) => (
                <ItineraryCard key={card.id || card.slug} item={card} />
              ))}
            </div>

            {itineraryCards.length === 0 && (
              <div className="py-16 text-center bg-slate-900/60 rounded-3xl border border-white/10">
                <p className="text-slate-400 text-sm font-semibold mb-4">
                  No active itineraries directly tagged with {destination.name} yet.
                </p>
                <Link
                  href="/itinerary"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-500 transition-colors"
                >
                  Explore All Sri Lanka Tours
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-blue-950 via-slate-950 to-slate-950 border-t border-white/[0.08] relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center relative z-10 space-y-6">
            <span className="text-blue-400 text-xs font-bold uppercase tracking-[0.3em]">
              Bespoke Sri Lanka Travel
            </span>
            <h2
              className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight"
              style={{ fontFamily: "var(--font-lora)" }}
            >
              Want a Custom Trip to {destination.name}?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-medium leading-relaxed">
              Our local travel experts can design a personalized itinerary tailored to your travel style, pace, and preferred landmarks.
            </p>

            <div className="pt-4 flex justify-center">
              <CustomizeItineraryButton destinationName={destination.name} region={destination.region} variant="cta" />
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
