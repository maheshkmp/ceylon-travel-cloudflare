"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import { Icons } from "./icons";

interface HomePost {
  title: string;
  tag: string;
  image: string;
  read: string;
  slug: string;
}

const TAG_COLORS: Record<string, string> = {
  "Travel Guide": "#6366F1",
  "Travel Tips":  "#6366F1",
  "Wildlife":     "#10B981",
  "Experiences":  "#F59E0B",
  "Photography":  "#EC4899",
  "Culture":      "#8B5CF6",
  "Food & Drink": "#EF4444",
};

const DEFAULT_POSTS: HomePost[] = [
  {
    title: "The Art of the Slow Journey: Why We Love Sri Lanka's Hill Country",
    tag: "Travel Guide",
    image: "https://images.unsplash.com/photo-1546708973-b339540b5162?w=800&q=80",
    read: "5 min",
    slug: "slow-journey-hill-country"
  },
  {
    title: "Sigiriya at Dawn: A Photographer's Guide to the Lion Rock Fortress",
    tag: "Experiences",
    image: "https://images.unsplash.com/photo-1588598198321-9735fd52a9b8?w=800&q=80",
    read: "4 min",
    slug: "sigiriya-dawn-guide"
  },
  {
    title: "Wild Heart of Ceylon: Safari Guide to Yala & Udawalawe National Parks",
    tag: "Wildlife",
    image: "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=800&q=80",
    read: "7 min",
    slug: "wild-heart-safari-guide"
  }
];

export function Journal({ initialData = [] }: { initialData?: any[] }) {
  const posts: HomePost[] = (() => {
    const defaultFallbackImages: Record<string, string> = {
      culture: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=600&auto=format&fit=crop",
      coast: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=600&auto=format&fit=crop",
      visitor: "https://images.unsplash.com/photo-1586611292717-f828b167408c?q=80&w=600&auto=format&fit=crop",
      wildlife: "https://images.unsplash.com/photo-1566650576880-6740b03eaad1?q=80&w=600&auto=format&fit=crop",
      train: "https://images.unsplash.com/photo-1544750040-4ea9b8a27d38?q=80&w=600&auto=format&fit=crop",
    };

    if (!initialData || initialData.length === 0) {
      return DEFAULT_POSTS;
    }

    const mapped = initialData.map((post: any, idx: number) => {
      let imgSrc = post.image;
      if (!imgSrc || imgSrc.trim() === "" || imgSrc.includes("r2.dev") || imgSrc.includes("cloudflarestorage")) {
        const titleLower = (post.title || "").toLowerCase();
        if (titleLower.includes("custom") || titleLower.includes("culture")) {
          imgSrc = defaultFallbackImages.culture;
        } else if (titleLower.includes("coast") || titleLower.includes("beach")) {
          imgSrc = defaultFallbackImages.coast;
        } else if (titleLower.includes("visitor") || titleLower.includes("first")) {
          imgSrc = defaultFallbackImages.visitor;
        } else if (titleLower.includes("wildlife")) {
          imgSrc = defaultFallbackImages.wildlife;
        } else {
          const fallbackKeys = Object.keys(defaultFallbackImages);
          imgSrc = defaultFallbackImages[fallbackKeys[idx % fallbackKeys.length]!];
        }
      }

      return {
        title: post.title,
        tag: post.tag || "Travel Guide",
        image: imgSrc,
        read: post.readingTime || "5 min",
        slug: post.slug || ""
      };
    });

    if (mapped.length < 3) {
      const existingSlugs = new Set(mapped.map(p => p.slug));
      const neededDefaults = DEFAULT_POSTS.filter(p => !existingSlugs.has(p.slug));
      return [...mapped, ...neededDefaults].slice(0, 3);
    }

    return mapped;
  })();

  return (
    <section id="journal" className="section-pad" style={{ background: "white" }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-800" style={{ fontWeight: 800, color: "#1A1A2E", fontSize: "clamp(1.6rem, 3vw, 2rem)" }}>
              Sri Lanka Travel Guides / Blog
            </h2>
            <p className="text-sm mt-1" style={{ color: "#5B6075" }}>Tips, itineraries, and insider knowledge</p>
          </div>
          <Link href={"/blog" as Route} className="text-sm font-600 shrink-0 flex items-center gap-1.5" style={{ color: "#00A680", fontWeight: 600 }}>
            Read all articles
            {Icons.arrowRight}
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: HomePost) => {
            const tagColor = TAG_COLORS[post.tag] || "#00A680";
            return (
              <Link
                key={post.title}
                href={`/blog/${post.slug || ""}` as Route}
                className="group block rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ border: "1px solid #E4E8F0", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", textDecoration: "none" }}
              >
                {/* Image */}
                <div className="relative overflow-hidden w-full aspect-[16/10] sm:aspect-[4/3] md:aspect-[16/10] bg-slate-100">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-700 text-white shadow-xs"
                      style={{ background: tagColor, fontWeight: 700 }}
                    >
                      {post.tag}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3
                    className="font-700 text-base leading-snug mb-3 transition-colors group-hover:text-green-700 line-clamp-2"
                    style={{ fontWeight: 700, color: "#1A1A2E" }}
                  >
                    {post.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs" style={{ color: "#9CA3AF" }}>
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {post.read} read
                    </div>
                    <span className="text-xs font-600 flex items-center gap-1" style={{ color: "#00A680", fontWeight: 600 }}>
                      Read more
                      {Icons.arrowRight}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
