"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { NavBar } from "@/components/home/NavBar";
import { Footer } from "@/components/home/Footer";
import { 
  Clock, MapPin, Users, DollarSign, ArrowRight, 
  Home, ChevronDown, CheckCircle2, AlertCircle, Edit, Settings, Globe, HelpCircle, Sparkles, Compass
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getItineraryBySlug } from "@/actions/itineraries";
import type { Itinerary } from "@repo/types";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import Image from "next/image";
import { buildWhatsAppLink, getItineraryWhatsAppMessage } from "@/lib/whatsapp";

export default function ItineraryClient({ initialData }: { initialData: Itinerary }) {
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 0: true });
  const [expandedFaqs, setExpandedFaqs] = useState<Record<number, boolean>>({});
  const [scrolled, setScrolled] = useState(false);
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: response } = useQuery({
    queryKey: ["itinerary", slug],
    queryFn: () => getItineraryBySlug(slug),
    initialData: initialData as any,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const itinerary = response as unknown as Itinerary;

  if (!itinerary) return null;

  const validNeedToKnow = itinerary.needToKnow?.filter((item) => item?.title?.trim() || item?.detail?.trim()) || [];
  const validInclusions = itinerary.inclusions?.filter((inc) => typeof inc === "string" && inc.trim()) || [];
  const validExclusions = itinerary.exclusions?.filter((exc) => typeof exc === "string" && exc.trim()) || [];
  const validFaqs = itinerary.faqs?.filter((faq) => faq?.question?.trim() || faq?.answer?.trim()) || [];

  const hasPracticalDetails =
    validNeedToKnow.length > 0 ||
    validInclusions.length > 0 ||
    validExclusions.length > 0 ||
    validFaqs.length > 0;

  return (
    <main className="bg-slate-50 text-slate-900 min-h-screen font-sans antialiased relative overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" }}>
      {/* Soft Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-[500px] h-[500px] bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />

      <NavBar scrolled={scrolled} />

      {/* Admin Quick Actions Bar */}
      {isAdmin && (
        <div className="fixed top-16 left-0 right-0 z-[60] bg-slate-900 border-b border-slate-800 text-white py-2 px-6 flex items-center justify-between shadow-2xl animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-blue-600 text-[10px] font-bold uppercase tracking-widest text-white">
              <Settings className="w-3 h-3" />
              Admin View
            </div>
            <span className="text-xs font-medium text-slate-300">Manage this itinerary's visibility and content</span>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href={`/admin/itineraries/${itinerary.id}`}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold transition-all text-white"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit Content
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Globe className="w-3 h-3" />
              Live
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[75vh] min-h-[500px] flex items-end overflow-hidden pt-28">
        <Image 
          src={itinerary.heroImg} 
          alt={itinerary.title}
          fill
          priority
          className="absolute inset-0 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-900/30" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pb-16">
          <div className="flex flex-wrap gap-2 mb-6">
            {itinerary.tags?.map(t => (
              <span key={t} className="px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/15 backdrop-blur-md border border-white/20 text-white shadow-sm">
                {t}
              </span>
            ))}
          </div>
          <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-8 max-w-4xl tracking-tight leading-none" style={{ fontFamily: "var(--font-lora)" }}>
            {itinerary.title}
          </h1>
          <div className="flex flex-wrap gap-4 sm:gap-8 text-slate-200 border-t border-white/20 pt-8 max-w-3xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-blue-300">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-slate-300 font-semibold">Duration</span>
                <span className="text-sm font-bold text-white">{itinerary.duration}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-blue-300">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-slate-300 font-semibold">Style</span>
                <span className="text-sm font-bold text-white">{itinerary.travelStyle}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300">
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-slate-300 font-semibold">Starts from</span>
                <span className="text-sm font-bold text-white">{itinerary.price}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Itinerary & Map Section */}
      <section className="py-20 bg-slate-50 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          
          <div className="grid lg:grid-cols-[1fr_420px] gap-16 items-start">
            
            {/* Left: Timeline Itinerary */}
            <div className="space-y-12">
              <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 text-[10px] font-bold uppercase tracking-widest">
                  <Compass className="w-3.5 h-3.5" /> Overview
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: "var(--font-lora)" }}>
                  The Journey Timeline
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed max-w-2xl font-normal">
                  {itinerary.overview}
                </p>

                {itinerary.highlights && itinerary.highlights.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 mt-4 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Key Highlights</span>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {itinerary.highlights.map((hl, index) => (
                        <div key={index} className="flex items-start gap-2 text-xs font-semibold text-slate-700">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative pl-12 space-y-10">
                {/* Vertical Line */}
                <div className="absolute left-[20px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-500 via-slate-300 to-emerald-500 z-0" />

                {/* Start Point */}
                <div className="relative z-10">
                  <div className="absolute -left-12 top-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold uppercase tracking-tight shadow-md ring-4 ring-slate-50">
                    Start
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-900 leading-none mb-1">Arrival & Welcome</h4>
                    <p className="text-[13px] text-slate-500 font-medium">{itinerary.days[0]?.place.split(' → ')[0] || "Airport"}</p>
                  </div>
                </div>

                {/* Days / Stops */}
                {itinerary.days?.map((day, i) => {
                  const isOpen = !!expandedDays[i];
                  return (
                    <div key={day.day || i} className="relative z-10">
                      <div className="absolute -left-12 top-0 w-10 h-10 rounded-full bg-white border-2 border-blue-600 text-blue-600 font-extrabold flex items-center justify-center text-sm shadow-sm ring-4 ring-slate-50">
                        {i + 1}
                      </div>
                      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                        <div 
                          className="p-6 flex items-center justify-between cursor-pointer select-none"
                          onClick={() => setExpandedDays(prev => ({ ...prev, [i]: !prev[i] }))}
                        >
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 block mb-1">Day {i + 1}</span>
                            <h4 className="text-base font-bold text-slate-900 leading-snug hover:text-blue-600 transition-colors">
                              {day.title}
                            </h4>
                            <p className="text-xs text-slate-500 font-medium mt-1">{day.place}</p>
                          </div>

                          <button 
                            type="button"
                            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 flex items-center justify-center transition-colors shrink-0 ml-4"
                          >
                            <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isOpen && "rotate-180")} />
                          </button>
                        </div>

                        <div 
                          className={cn(
                            "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
                            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          )}
                        >
                        <div className="overflow-hidden">
                          <div className="px-6 pb-6 pt-0 border-t border-slate-100 space-y-5">
                            {day.img && (
                              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] shadow-sm mt-4">
                                <Image src={day.img} alt={day.title} fill className="object-cover hover:scale-105 transition-transform duration-750" />
                                <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[9px] font-bold text-slate-900 uppercase tracking-widest shadow-sm">
                                  {day.place.split(' → ')[0]}
                                </div>
                              </div>
                            )}
                            
                            <p className="text-sm leading-relaxed text-slate-700 font-normal">
                              {day.body}
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                              {day.accommodation && (
                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Accommodation</span>
                                  <div className="flex items-center gap-2">
                                    <Home className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span className="text-xs font-semibold text-slate-800 truncate">{day.accommodation}</span>
                                  </div>
                                </div>
                              )}

                              {day.travelTime && (
                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Travel Time</span>
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                                    <span className="text-xs font-semibold text-slate-800 truncate">{day.travelTime}</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {day.activities && day.activities.length > 0 && (
                              <div className="pt-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Activities</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {day.activities.map((act: string) => (
                                    <span key={act} className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700">
                                      {act}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

                {/* End Point */}
                <div className="relative z-10">
                  <div className="absolute -left-12 top-0 w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold uppercase tracking-tight shadow-md ring-4 ring-slate-50">
                    End
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-900 leading-none mb-1">Journey Conclusion</h4>
                    <p className="text-xs text-slate-500 font-medium">Return Logistics & Departure</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Sticky Map Image */}
            <div className="lg:sticky lg:top-28 w-full ml-auto">
              <div className="relative rounded-[2rem] overflow-hidden bg-white/95 border border-slate-200 shadow-xl group h-[340px] sm:h-[440px] lg:h-[520px] p-2 sm:p-4">
                {itinerary.mapImg ? (
                  <Image 
                    src={itinerary.mapImg} 
                    alt="Route Map" 
                    fill
                    className="object-contain p-2 sm:p-3 transition-transform duration-700 group-hover:scale-[1.01]"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100/70 border border-slate-200 rounded-[2rem]">
                    <MapPin className="w-10 h-10 text-slate-400 mb-4" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">No Route Map Uploaded</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Practical Details */}
      {hasPracticalDetails && (
        <section className="py-20 bg-white border-t border-b border-slate-200/80 relative z-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">

            {/* Section Header */}
            <div className="max-w-2xl mb-16">
              <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] mb-3 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                Good to Know
              </span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 uppercase tracking-wide mb-4" style={{ fontFamily: "var(--font-lora)" }}>
                Before you fly.
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed font-normal">
                We've covered all the essentials so you can focus on experiencing Sri Lanka at its finest.
              </p>
            </div>

            {/* Info Cards Grid */}
            {validNeedToKnow.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {validNeedToKnow.map((item, i) => (
                  <div
                    key={i}
                    className="bg-slate-50/80 hover:bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-300 group"
                  >
                    <div
                      className="w-8 h-1 rounded-full mb-4"
                      style={{ background: i % 2 === 0 ? "#2563EB" : "#4F46E5" }}
                    />
                    {item.title && (
                      <h5 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 group-hover:text-slate-900 transition-colors">
                        {item.title}
                      </h5>
                    )}
                    {item.detail && (
                      <p className="text-sm text-slate-800 leading-relaxed font-medium">
                        {item.detail}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Includes & Excludes Row */}
            {(validInclusions.length > 0 || validExclusions.length > 0) && (
              <div className="grid md:grid-cols-2 gap-8 mb-16">
                {validInclusions.length > 0 && (
                  <div className="bg-emerald-50/40 rounded-3xl p-8 border border-emerald-200/80 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs bg-emerald-600 font-bold">✓</span>
                      What's Included
                    </h4>
                    <ul className="space-y-3">
                      {validInclusions.map((inc: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-800 font-medium">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {validExclusions.length > 0 && (
                  <div className="bg-rose-50/40 rounded-3xl p-8 border border-rose-200/80 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs bg-rose-600 font-bold">✕</span>
                      Not Included
                    </h4>
                    <ul className="space-y-3">
                      {validExclusions.map((exc: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-500" />
                          <span>{exc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Frequently Asked Questions (FAQ) Section */}
            {validFaqs.length > 0 && (
              <div className="pt-16 border-t border-slate-200">
                <div className="max-w-3xl">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] mb-3 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Questions & Answers
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900 uppercase tracking-wide mb-8" style={{ fontFamily: "var(--font-lora)" }}>
                    Frequently Asked Questions
                  </h3>

                  <div className="space-y-4">
                    {validFaqs.map((faq, index) => {
                      const isOpen = !!expandedFaqs[index];
                      return (
                        <div
                          key={index}
                          className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all duration-300 hover:border-blue-300 shadow-sm"
                        >
                          <button
                            type="button"
                            onClick={() => setExpandedFaqs(prev => ({ ...prev, [index]: !prev[index] }))}
                            className="w-full flex items-center justify-between p-6 text-left focus:outline-none gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                                <HelpCircle className="w-4 h-4 text-blue-600" />
                              </div>
                              <h4 className="text-base font-bold text-slate-900 leading-snug">
                                {faq.question}
                              </h4>
                            </div>
                            <ChevronDown
                              className={cn(
                                "w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300",
                                isOpen && "rotate-180 text-blue-600"
                              )}
                            />
                          </button>
                          <div
                            className={cn(
                              "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
                              isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                            )}
                          >
                            <div className="overflow-hidden">
                              <div className="px-6 pb-6 pt-0 text-sm text-slate-700 leading-relaxed border-t border-slate-100 bg-slate-50/50 font-normal">
                                <p className="pt-4">{faq.answer}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="relative py-24 overflow-hidden bg-slate-900 text-white">
        <Image
          src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1920&q=85"
          alt="Sri Lanka"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-950" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.3em] mb-4">Ready to Experience This?</p>
          <h2 className="text-white font-bold leading-tight mb-4 tracking-tight" style={{ fontFamily: "var(--font-lora)", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
            {itinerary.title}
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed max-w-xl mx-auto mb-3 font-medium">
            Starting from <span className="text-blue-400 font-extrabold text-lg">{itinerary.price}</span> per person · {itinerary.duration}
          </p>
          <p className="text-slate-400 text-xs mb-10">
            Tailor-made to your schedule, group size, and budget.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#inquiry"
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("open-inquiry", { detail: { style: itinerary.travelStyle } }));
              }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-sm transition-all bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-blue-500/25 cursor-pointer"
            >
              Plan Your Journey 
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={buildWhatsAppLink({
                phoneNumber: "+94775105848",
                message: getItineraryWhatsAppMessage(itinerary.title, itinerary.duration, itinerary.price),
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-sm transition-all bg-[#25D366] hover:bg-[#20bd5a] hover:shadow-lg hover:shadow-emerald-500/25"
            >
              Chat on WhatsApp
            </a>
            <a
              href="/itinerary"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-slate-200 text-sm transition-all bg-white/10 border border-white/20 hover:bg-white/20"
            >
              Explore All Itineraries
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
