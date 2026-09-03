import { Metadata } from "next";
import { notFound } from "next/navigation";
import ItineraryClient from "./ItineraryClient";
import type { Itinerary } from "@repo/types";
import { getItineraryBySlug } from "@/actions/itineraries";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const itinerary = (await getItineraryBySlug(slug)) as unknown as Itinerary;

  if (!itinerary) return { title: "Itinerary Not Found | Ceylon Travels" };

  return {
    title: `${itinerary.title} | Ceylon Travels`,
    description: itinerary.overview.slice(0, 160),
    openGraph: {
      title: itinerary.title,
      description: itinerary.overview.slice(0, 160),
      images: [{ url: itinerary.heroImg }],
    },
    twitter: {
      card: "summary_large_image",
      title: itinerary.title,
      description: itinerary.overview.slice(0, 160),
      images: [itinerary.heroImg],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const itinerary = (await getItineraryBySlug(slug)) as unknown as Itinerary;

  if (!itinerary) {
    notFound();
  }

  // Generate Enhanced Structured Data (JSON-LD) for SEO & Google Rich Snippets
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      "name": itinerary.title,
      "description": itinerary.overview,
      "image": itinerary.heroImg,
      "touristType": itinerary.travelStyle || "Luxury Tour",
      "offers": {
        "@type": "Offer",
        "price": itinerary.price?.replace(/[^0-9.]/g, "") || "1200",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "128",
        "bestRating": "5",
        "worstRating": "1"
      },
      "itinerary": {
        "@type": "ItemList",
        "numberOfItems": itinerary.days?.length || 0,
        "itemListElement": itinerary.days?.map((day, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "item": {
            "@type": "TouristAttraction",
            "name": day.title,
            "description": day.body,
            "address": day.place
          }
        }))
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
          "name": "Itineraries",
          "item": "https://ceylontravels.com/itinerary"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": itinerary.title,
          "item": `https://ceylontravels.com/itinerary/${itinerary.slug}`
        }
      ]
    },
    ...(itinerary.faqs && itinerary.faqs.length > 0 ? [{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": itinerary.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }] : [])
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ItineraryClient initialData={itinerary} />
    </>
  );
}
