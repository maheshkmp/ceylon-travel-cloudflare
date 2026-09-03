import React from "react";
import { NavBar } from "@/components/home/NavBar";
import { Footer } from "@/components/home/Footer";
import { getPosts } from "@/actions/posts";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";

export const runtime = 'edge';

export const dynamic = 'force-dynamic';


export default async function BlogPage() {
  const result = await getPosts(1, 50, true);
  const rawPosts = result.data || [];

  const articles = rawPosts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    subtitle: p.excerpt || "",
    category: p.tag || "General",
    readTime: p.readingTime || "5 min read",
    date: p.createdAt ? format(new Date(p.createdAt), "MMM d, yyyy") : "",
    author: "Ceylon Travels Team",
    imageUrl: p.image || "https://images.unsplash.com/photo-1546708973-b339540b5162?w=800&q=80"
  }));

  return (
    <div className="bg-slate-950 text-white min-h-screen flex flex-col">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-500/8 via-transparent to-transparent pointer-events-none" />

      <NavBar scrolled={true} />

      <div className="max-w-4xl mx-auto px-6 pt-32 flex-1 w-full pb-16 relative z-10">
        <div className="text-center space-y-5 mb-20">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white leading-tight">
            Tales from the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-400">
              Teardrop Island
            </span>
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
            Travel stories, destination highlights, and expert guides to inspire your next Sri Lankan adventure.
          </p>
        </div>

        <div className="space-y-6">
          {articles.length > 0 ? articles.map((art, i) => (
            <Link
              key={art.id}
              href={`/blog/${art.slug}`}
              className="group flex flex-col md:flex-row gap-6 p-5 -mx-5 rounded-2xl transition-all duration-300 cursor-pointer hover:bg-white/[0.03]"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex-1 space-y-3 min-w-0">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-400">
                  <span className="font-semibold text-blue-400">{art.category}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span>{art.author}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span>{art.date}</span>
                </div>

                <h2 className="text-xl md:text-2xl font-serif font-bold text-white group-hover:text-blue-400 transition-colors leading-snug">
                  {art.title}
                </h2>

                <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                  {art.subtitle}
                </p>

                <span className="inline-block text-xs text-slate-500 font-medium">
                  {art.readTime}
                </span>
              </div>

              <div className="relative w-full md:w-48 aspect-[16/10] rounded-xl overflow-hidden shrink-0 border border-white/5 bg-slate-900 shadow-lg transition-shadow duration-300 group-hover:shadow-blue-500/10">
                <Image
                  src={art.imageUrl}
                  alt={art.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 200px"
                  className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-90"
                />
              </div>
            </Link>
          )) : (
            <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-3xl bg-slate-900/20 backdrop-blur-md">
              <span className="text-4xl">📝</span>
              <h3 className="text-lg font-bold text-white mt-4">No stories found</h3>
              <p className="text-sm text-slate-400 mt-1">Check back later for new travel stories.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
