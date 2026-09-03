import { NavBar } from "@/components/home/NavBar";
import { Footer } from "@/components/home/Footer";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Facebook,
  Twitter,
  Link as LinkIcon,
  BookOpen,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { getPostBySlug } from "@/actions/posts";
import { notFound } from "next/navigation";
import { marked } from "marked";
import React from "react";
import { ReadingProgressBar } from "@/components/posts/ReadingProgressBar";

import { Metadata } from "next";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) return { title: "Article Not Found | Ceylon Travels" };

  return {
    title: `${post.title} | Ceylon Travels Journal`,
    description: post.excerpt?.slice(0, 160) || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt?.slice(0, 160) || post.title,
      images: [{ url: post.image }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt?.slice(0, 160) || post.title,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const htmlContent = post.content.trim().startsWith("<")
    ? post.content
    : (marked.parse(post.content, { async: false }) as string);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "image": post.image,
      "datePublished": post.createdAt,
      "author": {
        "@type": "Organization",
        "name": "Ceylon Travels Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Ceylon Travels",
        "url": "https://ceylontravels.com"
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
          "name": "Journal",
          "item": "https://ceylontravels.com/journal"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": post.title,
          "item": `https://ceylontravels.com/journal/${post.slug}`
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
      <main style={{ background: "#fafaf8", minHeight: "100vh", overflowX: "hidden" }}>
        <NavBar scrolled={true} />

        {/* Reading progress bar — client component to avoid SSR/hydration mismatch */}
        <ReadingProgressBar />

        {/* ── HERO ── */}
        <section style={{ position: "relative", minHeight: "90vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden" }}>
          {/* Full-bleed hero image */}
          <div style={{ position: "absolute", inset: 0 }}>
            <Image src={post.image} alt={post.title} fill priority className="object-cover" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,8,0.92) 0%, rgba(10,10,8,0.35) 50%, transparent 100%)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,10,8,0.25) 0%, transparent 40%, rgba(10,10,8,0.25) 100%)" }} />
          </div>

          {/* Back button */}
          <div style={{ position: "absolute", top: "6rem", left: 0, right: 0, zIndex: 10 }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem" }}>
              <Link
                href="/blog"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  color: "rgba(255,255,255,0.7)", fontSize: "0.688rem",
                  textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600,
                  textDecoration: "none", transition: "color 0.2s, gap 0.2s"
                }}
                className="hover:text-white blog-back-link"
              >
                <ArrowLeft size={13} /> Back to Journal
              </Link>
            </div>
          </div>

          {/* Hero text content */}
          <div style={{ position: "relative", zIndex: 10, paddingBottom: "4rem", paddingTop: "12rem" }}>
            <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 2rem" }}>
              {/* Meta */}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <span style={{
                  padding: "0.25rem 0.875rem", borderRadius: "999px",
                  fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
                  background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                  color: "white", border: "1px solid rgba(255,255,255,0.2)"
                }}>
                  {post.tag}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "rgba(255,255,255,0.55)", fontSize: "0.688rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <Calendar size={11} /> {format(new Date(post.createdAt), "MMMM d, yyyy")}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <Clock size={11} /> {post.readingTime} Read
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 style={{
                fontFamily: "var(--font-lora, Georgia, serif)",
                fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)",
                fontWeight: 700, color: "white",
                letterSpacing: "-0.025em", lineHeight: 1.08, marginBottom: "1.25rem"
              }}>
                {post.title}
              </h1>

              {/* Excerpt */}
              <p style={{
                fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
                color: "rgba(255,255,255,0.65)",
                fontStyle: "italic", lineHeight: 1.65, maxWidth: "580px"
              }}>
                {post.excerpt}
              </p>

              {/* Author strip */}
              <div style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                marginTop: "2rem", paddingTop: "2rem",
                borderTop: "1px solid rgba(255,255,255,0.15)"
              }}>
                <div style={{
                  width: "2.5rem", height: "2.5rem", borderRadius: "50%",
                  background: "linear-gradient(135deg, #064e3b, #10b981)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontWeight: 700, fontSize: "0.9rem"
                }}>T</div>
                <div>
                  <p style={{ color: "white", fontSize: "0.875rem", fontWeight: 600, margin: 0 }}>Ceylon Travels Team</p>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.625rem", textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>Expert Island Guides</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ARTICLE BODY ── */}
        <article>
          {/* Green accent bar */}
          <div style={{ height: "3px", background: "linear-gradient(90deg, #064e3b, #10b981, #34d399)" }} />

          <div style={{ maxWidth: 760, margin: "0 auto", padding: "4rem 2rem 6rem" }}>

            {/* Quick facts strip
          <div style={{
            display: "flex", flexWrap: "wrap", gap: "1.5rem",
            padding: "1.25rem 1.5rem", borderRadius: "1rem", marginBottom: "3.5rem",
            background: "#f0faf5", border: "1px solid #a7f3d0"
          }}>
            {[
              { icon: <MapPin size={13} />, text: "Sri Lanka" },
              { icon: <BookOpen size={13} />, text: post.readingTime },
              { icon: <Calendar size={13} />, text: format(new Date(post.createdAt), "MMM yyyy") },
              { icon: <Clock size={13} />, text: post.tag },
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#065f46" }}>
                <span style={{ color: "#10b981" }}>{f.icon}</span> {f.text}
              </div>
            ))}
          </div> */}

            {/* Prose content */}
            <div className="blog-prose" dangerouslySetInnerHTML={{ __html: htmlContent }} />

            {/* Author / share footer */}
            <div style={{ marginTop: "4rem", paddingTop: "2.5rem", borderTop: "2px solid #e5e7eb" }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{
                    width: "3.5rem", height: "3.5rem", borderRadius: "50%",
                    background: "linear-gradient(135deg, #064e3b, #10b981)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontWeight: 700, fontSize: "1.1rem",
                    boxShadow: "0 4px 16px rgba(6,78,59,0.25)"
                  }}>T</div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: "#111827", fontSize: "0.9rem" }}>Ceylon Travels Team</p>
                    <p style={{ margin: 0, fontSize: "0.688rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#9ca3af" }}>Expert Island Guides</p>
                    <p style={{ margin: "0.25rem 0 0", fontSize: "0.8rem", color: "#6b7280" }}>Sharing Sri Lanka&apos;s hidden gems since 1968</p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                  <p style={{ margin: 0, fontSize: "0.688rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#9ca3af", fontWeight: 600 }}>Share</p>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {[<Facebook key="fb" size={15} />, <Twitter key="tw" size={15} />, <LinkIcon key="li" size={15} />].map((icon, i) => (
                      <button key={i} className="share-btn" style={{
                        width: "2.25rem", height: "2.25rem", borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: "1px solid #e5e7eb", background: "white",
                        color: "#9ca3af", cursor: "pointer", transition: "all 0.2s"
                      }}>
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── CTA BANNER ── */}
          <div style={{
            padding: "5rem 2rem",
            background: "linear-gradient(135deg, #022c22 0%, #064e3b 55%, #065f46 100%)"
          }}>
            <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
              <p style={{ margin: "0 0 0.75rem", fontSize: "0.688rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#34d399", fontWeight: 700 }}>
                Ready to explore?
              </p>
              <h2 style={{
                fontFamily: "var(--font-lora, Georgia, serif)",
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                fontWeight: 700, color: "white", lineHeight: 1.15, margin: "0 0 1rem"
              }}>
                Make these places your next adventure
              </h2>
              <p style={{ color: "rgba(255,255,255,0.58)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "2.25rem", maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
                Our expert guides craft bespoke Sri Lanka tours tailored to your timeline, budget, and travel style.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
                <Link href="/destinations" style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.875rem 1.875rem", borderRadius: "999px",
                  fontSize: "0.875rem", fontWeight: 700, textDecoration: "none",
                  background: "#10b981", color: "white", transition: "transform 0.2s, background 0.2s"
                }} className="cta-primary-btn">
                  Explore Destinations
                </Link>
                <Link href="/itinerary" style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.875rem 1.875rem", borderRadius: "999px",
                  fontSize: "0.875rem", fontWeight: 700, textDecoration: "none",
                  border: "1.5px solid rgba(255,255,255,0.3)", color: "white",
                  transition: "background 0.2s"
                }} className="cta-outline-btn">
                  Plan My Trip
                </Link>
              </div>
            </div>
          </div>
        </article>

        <Footer />

        {/* Blog-specific styles */}
        <style>{`
        .blog-prose {
          color: #374151;
          font-size: 1.0625rem;
          line-height: 1.9;
          font-family: var(--font-lora, Georgia, serif);
        }
        .blog-prose h1, .blog-prose h2, .blog-prose h3, .blog-prose h4 {
          font-family: var(--font-jakarta, 'Plus Jakarta Sans', system-ui, sans-serif);
          font-weight: 700; color: #111827; line-height: 1.2;
          margin: 2.5em 0 0.75em;
        }
        .blog-prose h2 {
          font-size: 1.55rem;
          border-bottom: 2px solid #d1fae5; padding-bottom: 0.4em;
        }
        .blog-prose h3 { font-size: 1.2rem; }
        .blog-prose h4 { font-size: 1.05rem; }
        .blog-prose p { margin-bottom: 1.6em; color: #4b5563; }
        .blog-prose strong { color: #111827; font-weight: 700; }
        .blog-prose em { color: #4b5563; }
        .blog-prose a {
          color: #064e3b; font-weight: 600;
          text-decoration: underline; text-decoration-color: #a7f3d0;
          text-underline-offset: 3px; transition: color 0.2s;
        }
        .blog-prose a:hover { color: #10b981; }
        .blog-prose ul, .blog-prose ol { margin: 1.5em 0; padding-left: 1.5em; }
        .blog-prose li { margin-bottom: 0.6em; color: #4b5563; }
        .blog-prose ol {
          counter-reset: blog-counter;
          padding-left: 0;
          list-style: none;
        }
        .blog-prose ol > li {
          counter-increment: blog-counter;
          position: relative;
          padding-left: 3.25rem;
          margin-bottom: 1.25rem;
        }
        .blog-prose ol > li::before {
          content: counter(blog-counter);
          position: absolute; left: 0; top: 0.05em;
          width: 2rem; height: 2rem;
          background: linear-gradient(135deg, #064e3b 0%, #10b981 100%);
          color: white; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem; font-weight: 800;
          font-family: system-ui, sans-serif;
          box-shadow: 0 2px 8px rgba(6,78,59,0.3);
        }
        .blog-prose blockquote {
          border-left: 3px solid #10b981;
          padding: 1em 1.5em; margin: 2.5em 0;
          background: #f0faf5; border-radius: 0 14px 14px 0;
          font-style: italic; color: #374151; font-size: 1.08em;
        }
        .blog-prose blockquote p { margin-bottom: 0; }
        .blog-prose img {
          width: 100%; border-radius: 16px; margin: 2.5em 0;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12); display: block;
        }
        .blog-prose hr {
          border: none; height: 1px; margin: 3em 0;
          background: linear-gradient(90deg, transparent, #d1fae5, transparent);
        }
        .blog-prose code {
          background: #f3f4f6; padding: 0.15em 0.4em;
          border-radius: 4px; font-size: 0.9em; color: #065f46;
        }
        .blog-prose pre {
          background: #0f172a; padding: 1.5em; border-radius: 12px;
          overflow-x: auto; margin: 2em 0;
        }
        .blog-prose pre code { background: none; color: #e2e8f0; padding: 0; }

        .share-btn:hover {
          background: #064e3b !important;
          border-color: #064e3b !important;
          color: white !important;
          transform: scale(1.1);
        }
        .cta-primary-btn:hover { background: #059669 !important; transform: translateY(-2px); }
        .cta-outline-btn:hover { background: rgba(255,255,255,0.1) !important; }
        .blog-back-link:hover { color: white !important; gap: 0.75rem !important; }
      `}</style>
      </main>
    </>
  );
}
