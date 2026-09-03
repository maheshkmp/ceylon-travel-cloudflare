import { Suspense } from "react";
import nextDynamic from "next/dynamic";
import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";
export const runtime = "edge";

import { NavBarWrapper } from "@/components/home/NavBarWrapper";
import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";

import { getItineraries } from "@/actions/itineraries";
import { getDestinations } from "@/actions/destinations";
import { getPosts } from "@/actions/posts";
import { getTravelCategories, getTestimonials, getGalleryImages } from "@/actions/home";
import { getPublicSettings } from "@/actions/settings";
import { TRAVEL_CATEGORIES } from "@/data/home";

// ─── Dynamic Imports for below-the-fold components ────────────────────────
const Itineraries = nextDynamic(() => import("@/components/home/Itineraries").then(mod => mod.Itineraries), { ssr: true });
const Destinations = nextDynamic(() => import("@/components/home/Destinations").then(mod => mod.Destinations), { ssr: true });
const Features = nextDynamic(() => import("@/components/home/Features").then(mod => mod.Features), { ssr: true });

const About = nextDynamic(() => import("@/components/home/About").then(mod => mod.About), { ssr: true });
const CTABanner = nextDynamic(() => import("@/components/home/CTABanner").then(mod => mod.CTABanner), { ssr: true });
const Testimonials = nextDynamic(() => import("@/components/home/Testimonials").then(mod => mod.Testimonials), { ssr: true });
const Journal = nextDynamic(() => import("@/components/home/Journal").then(mod => mod.Journal), { ssr: true });
const Gallery = nextDynamic(() => import("@/components/home/Gallery").then(mod => mod.Gallery), { ssr: true });
const Footer = nextDynamic(() => import("@/components/home/Footer").then(mod => mod.Footer), { ssr: true });

// ─── Direct Fetches (Skipping unstable_cache for debugging) ─────────────────────────────
const getCachedItineraries = async () => getItineraries(1, 6, undefined, "published");
const getCachedDestinations = async () => getDestinations(1, 10);
const getCachedPosts = async () => getPosts(1, 3, true);
const getCachedCategories = async () => getTravelCategories();
const getCachedTestimonials = async () => getTestimonials();
const getCachedGallery = async () => getGalleryImages();

// ─── Wrapper Server Components for Suspense ─────────────────────────────
async function ItinerariesSection() {
  try {
    const data = await getCachedItineraries();
    return <Itineraries initialData={data?.data || []} />;
  } catch (e: any) {
    return <div className="text-red-500 text-center py-20">Error in ItinerariesSection: {e?.message || String(e)}</div>;
  }
}

async function DestinationsSection() {
  try {
    const data = await getCachedDestinations();
    return <Destinations initialData={data?.data || []} />;
  } catch (e: any) {
    return <div className="text-red-500 text-center py-20">Error in DestinationsSection: {e?.message || String(e)}</div>;
  }
}
async function JournalSection() {
  try {
    const data = await getCachedPosts();
    return <Journal initialData={data?.data || []} />;
  } catch (e: any) {
    return <Journal initialData={[]} />;
  }
}

async function CategoriesSection() {
  try {
    const data = await getCachedCategories();
    const dbCategories = data || [];
    const dbLabels = new Set(dbCategories.map((c: any) => c.label.toLowerCase()));
    const missingDefaults = TRAVEL_CATEGORIES.filter(
      (cat) => !dbLabels.has(cat.label.toLowerCase())
    ).map((cat) => ({
      id: String(cat.id),
      label: cat.label,
      image: cat.image,
      description: cat.desc,
    }));
    const finalData = [...dbCategories, ...missingDefaults];
    return <Categories initialData={finalData} />;
  } catch (e: any) {
    return <Categories initialData={TRAVEL_CATEGORIES} />;
  }
}

async function TestimonialsSection() {
  try {
    const data = await getCachedTestimonials();
    return <Testimonials initialData={data || []} />;
  } catch (e: any) {
    return <Testimonials initialData={[]} />;
  }
}

async function GallerySection() {
  try {
    const data = await getCachedGallery();
    const settingsData = (await getPublicSettings().catch(() => ({}))) as any;
    
    const instagramSetting = settingsData?.social?.instagram;
    const instagramUrl = instagramSetting && typeof instagramSetting === "string" && instagramSetting !== "" 
      ? instagramSetting 
      : "https://www.instagram.com/ceylon_travels/";
      
    const cleanUrl = instagramUrl.replace(/\/$/, "");
    const instagramHandle = `@${cleanUrl.split("/").pop() || "ceylon_travels"}`;
    
    return <Gallery initialData={data || []} instagramUrl={instagramUrl} instagramHandle={instagramHandle} />;
  } catch (e: any) {
    return <Gallery initialData={[]} instagramUrl="https://www.instagram.com/ceylon_travels/" instagramHandle="@ceylon_travels" />;
  }
}
// ─── SEO Metadata ────────────────────────────────────────────────────────
export const metadata = {
  title: "Ceylon Travels | Authentic Sri Lankan Journeys",
  description: "Experience Sri Lanka like never before. Handpicked itineraries, expert guides, and unforgettable wildlife, culture, and luxury tours.",
  openGraph: {
    title: "Ceylon Travels | Authentic Sri Lankan Journeys",
    description: "Experience Sri Lanka like never before. Handpicked itineraries, expert guides, and unforgettable wildlife, culture, and luxury tours.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  }
};

// ─── Main Page ───────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif", background: "white" }} className="overflow-x-hidden">
      <NavBarWrapper />
      <Hero />
      <Suspense fallback={<div>Loading categories...</div>}>
        <CategoriesSection />
      </Suspense>
      
      <Suspense fallback={
        <div className="h-96 flex items-center justify-center text-slate-500 font-medium animate-pulse">
          Loading itineraries...
        </div>
      }>
        <ItinerariesSection />
      </Suspense>
      
      <Suspense fallback={
        <div className="h-96 flex items-center justify-center text-slate-500 font-medium animate-pulse">
          Loading destinations...
        </div>
      }>
        <DestinationsSection />
      </Suspense>
      
      <About />

      <Suspense fallback={<div>Loading testimonials...</div>}>
        <TestimonialsSection />
      </Suspense>
      
      <Suspense fallback={
        <div className="h-96 flex items-center justify-center text-slate-500 font-medium animate-pulse">
          Loading journal...
        </div>
      }>
        <JournalSection />
      </Suspense>
      
      <Suspense fallback={<div>Loading gallery...</div>}>
        <GallerySection />
        
      </Suspense>
      <CTABanner />
      <Footer />
    </div>
  );
}
