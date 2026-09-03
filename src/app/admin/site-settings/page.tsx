"use client";

export const runtime = 'edge';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { siteSettingsSchema, type SiteSettings } from "@repo/validators";
import { getAllSettings, updateSettings } from "@/actions/settings";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Globe, Eye, Laptop, Shield, Plus, Trash2, HelpCircle, FileText, Facebook, Instagram, Youtube, Linkedin, Twitter, Video, Compass, MessageCircle, Share2 } from "lucide-react";
import { ImageUpload } from "@/components/shared/image-upload";
import { VideoUpload } from "@/components/shared/video-upload";
import { useEffect, useState } from "react";

export default function SiteSettingsPage() {
  const qc = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const res = await fetch("/api/admin/site-settings");
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to load settings");
      }
      return res.json();
    },
  });

  const { register, handleSubmit, reset, watch, setValue, getValues, formState: { errors, isDirty } } = useForm<any>({
    resolver: zodResolver(siteSettingsSchema) as any,
    defaultValues: {
      general: {
        siteName: "Ceylon Travels",
        siteTagline: "Discover the Beauty of Sri Lanka",
        siteDescription: "Your trusted travel partner for unforgettable Sri Lanka experiences.",
        companyName: "Ceylon Travels (Pvt) Ltd",
        currency: "USD",
      },
      branding: {
        primaryColor: "#00A680",
        secondaryColor: "#FF6B35",
        logo: "",
        footerLogo: "",
        favicon: "",
        ogImage: "",
      },
      seo: {
        metaTitle: "Ceylon Travels | Sri Lanka Tour Packages",
        metaDescription: "Discover the beauty of Sri Lanka with Ceylon Travels. Expert-guided, all-inclusive tour packages tailored to you.",
        keywords: "Sri Lanka tours, travel packages, Sri Lanka holidays, Ceylon Travels",
        twitterCard: "summary_large_image",
      },
      contact: {
        businessEmail: "",
        whatsapp: "",
        phoneNumber: "",
        supportEmail: "",
        officeAddress: "",
      },
      social: {
        facebook: "",
        instagram: "",
        youtube: "",
        linkedin: "",
        tiktok: "",
        twitter: "",
        tripadvisor: "",
        whatsapp: "",
      },
      layout: {
        announcementBanner: "",
        footerText: "© 2026 Ceylon Travels (Pvt) Ltd. All rights reserved.",
        heroTitle: "One Island. A Thousand Lifetimes.",
        heroSubtitle: "From mist-cloaked tea hills to sun-drenched coasts, ancient rock fortresses to private safari dawns — we craft Sri Lankan journeys that stay with you forever.",
        heroVideoUrl: "",
        heroButtonText: "Explore Itineraries",
        heroButtonLink: "#itineraries",
      },
      legal: {
        privacy: "Ceylon Travels is committed to protecting your privacy. We strictly collect personal information required to facilitate custom Sri Lanka tour bookings...",
        terms: "By booking a tour with Ceylon Travels (Pvt) Ltd, you agree to our terms of service, payment schedules, and cancellation policies...",
        cookie: "We use cookies to enhance your site browsing experience, serve personalized itinerary recommendations, and analyze platform traffic...",
        refund: "Cancellations made 30 days prior to arrival receive a 90% refund. Cancellations between 14-30 days receive a 50% refund...",
      },
      faq: {
        items: JSON.stringify([
          { id: "1", question: "Do I need a visa to visit Sri Lanka?", answer: "Yes, most foreign travelers require an Electronic Travel Authorization (ETA) or tourist visa prior to entry in Sri Lanka." },
          { id: "2", question: "What is the best time of year to visit Sri Lanka?", answer: "Sri Lanka is a year-round destination! Dec-April is ideal for the West & South coasts, while May-Sept is perfect for the East coast & Cultural Triangle." },
          { id: "3", question: "Are your tour packages customizable?", answer: "Absolutely! All of our itineraries are 100% tailor-made to fit your dates, travel style, and budget preferences." },
          { id: "4", question: "Is private transportation included?", answer: "Yes, all our luxury and custom tour packages come with a private air-conditioned vehicle and an experienced English-speaking chauffeur guide." }
        ]),
      },
      advanced: {
        enableAnalytics: false,
        sessionRecording: false,
      },
    },
  });

  // Watch key values in real-time to drive the live previewer
  const watchedSiteName = (watch("general.siteName") as any) || "Ceylon Travels";
  const watchedPrimaryColor = (watch("branding.primaryColor") as any) || "#00A680";
  const watchedSecondaryColor = (watch("branding.secondaryColor") as any) || "#FF6B35";
  const watchedBannerText = (watch("layout.announcementBanner") as any) || "";
  const watchedMetaTitle = (watch("seo.metaTitle") as any) || "Ceylon Travels | Sri Lanka Tour Packages";
  const watchedMetaDescription = (watch("seo.metaDescription") as any) || "Discover the beauty of Sri Lanka with Ceylon Travels.";
  const watchedHeroTitle = (watch("layout.heroTitle") as any) || "One Island. A Thousand Lifetimes.";
  const watchedHeroSubtitle = (watch("layout.heroSubtitle") as any) || "From mist-cloaked tea hills to sun-drenched coasts...";
  const watchedHeroVideoUrl = (watch("layout.heroVideoUrl") as any) || "";
  const watchedHeroButtonText = (watch("layout.heroButtonText") as any) || "Explore Itineraries";
  const watchedHeroButtonLink = (watch("layout.heroButtonLink") as any) || "#itineraries";

  const rawFaqItems = watch("faq.items");
  const [faqItems, setFaqItems] = useState<{ id: string; question: string; answer: string }[]>([]);

  useEffect(() => {
    try {
      if (rawFaqItems) {
        const parsed = JSON.parse(rawFaqItems);
        if (Array.isArray(parsed)) {
          setFaqItems(parsed);
        }
      }
    } catch {
      // fallback if invalid json
    }
  }, [rawFaqItems]);

  const updateFaqState = (newList: any[]) => {
    setFaqItems(newList);
    setValue("faq.items", JSON.stringify(newList), { shouldDirty: true });
  };

  const handleAddFaq = () => {
    const newItem = { id: String(Date.now()), question: "", answer: "" };
    updateFaqState([...faqItems, newItem]);
  };

  const handleUpdateFaq = (index: number, field: "question" | "answer", val: string) => {
    const updated = [...faqItems];
    if (updated[index]) {
      updated[index][field] = val;
      updateFaqState(updated);
    }
  };

  const handleRemoveFaq = (index: number) => {
    const updated = faqItems.filter((_: any, i: number) => i !== index);
    updateFaqState(updated);
  };

  useEffect(() => {
    if (settings && (settings as any).length > 0) {
      const formattedData: any = {};
      const booleanFields = [
        "layout.heroShowIcons",
        "advanced.enableAnalytics",
        "advanced.trackUserActivity",
        "advanced.sessionRecording",
        "advanced.heatmaps",
        "advanced.conversionEvents"
      ];

      (settings as any).forEach((item: any) => {
        // Convert flat string key (e.g. "general.siteName") back into a nested object for RHF
        const [group, key] = item.key.split(".");
        if (!formattedData[group]) formattedData[group] = {};

        let val = item.value;
        if (booleanFields.includes(item.key)) {
          val = val === "true";
        }

        formattedData[group][key] = val;
      });
      reset((prev: any) => ({ ...prev, ...formattedData }));
    }
  }, [settings, reset]);

  const mutation = useMutation({
    mutationFn: async (data: SiteSettings) => {
      // Flatten the nested object from RHF into the array format expected by updateSettings
      const formattedData: { key: string; value: string; group: string }[] = [];

      Object.entries(data).forEach(([groupKey, groupObj]) => {
        if (typeof groupObj === 'object' && groupObj !== null) {
          Object.entries(groupObj).forEach(([settingKey, settingValue]) => {
            formattedData.push({
              key: `${groupKey}.${settingKey}`,
              value: String(settingValue ?? ""),
              group: groupKey,
            });
          });
        }
      });

      const res = await fetch("/api/admin/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save settings");
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "settings"] });
      qc.invalidateQueries({ queryKey: ["site-settings"] });
      reset(getValues());
      toast({
        title: "Settings Saved Successfully",
        description: "Your configurations have been securely updated and published.",
      });
    },
    onError: (err: any) => toast({ title: "Error saving settings", description: err.message, variant: "destructive" }),
  });

  const onSubmit = (data: SiteSettings) => {
    mutation.mutate(data);
  };

  const onFormError = (errors: any) => {
    let firstErrorMsg = "Please check all tabs for invalid or missing fields.";

    const findFirstMessage = (obj: any): string | undefined => {
      if (!obj) return;
      for (const key in obj) {
        if (obj[key] && obj[key].message && typeof obj[key].message === 'string') {
          return obj[key].message;
        }
        if (typeof obj[key] === 'object') {
          const res = findFirstMessage(obj[key]);
          if (res) return res;
        }
      }
    };

    const foundMsg = findFirstMessage(errors);
    if (foundMsg) {
      firstErrorMsg = foundMsg;
    }

    toast({
      title: "Validation Error",
      description: firstErrorMsg,
      variant: "destructive"
    });
    console.error("Form validation errors:", JSON.parse(JSON.stringify(errors)));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-slate-800 dark:text-white" />
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-[1500px] mx-auto pb-24 px-4 sm:px-6 pt-6 animate-fade-in text-left">

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-100 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            System & Brand Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-[15px] max-w-2xl">
            Configure system standing, modify brand color templates, optimize search engine listings, and review real-time styling mockups.
          </p>
        </div>

        <Button
          onClick={handleSubmit(onSubmit, onFormError)}
          disabled={mutation.isPending || !isDirty}
          className="rounded-full h-11 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md flex items-center gap-1.5 transition-all"
        >
          {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Configuration
        </Button>
      </div>

      {/* Main Grid: Form Left, Real-Time Preview Sandbox Right */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Left Columns: Form Settings */}
        <div className="xl:col-span-2 space-y-6">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="bg-slate-50 border border-slate-100 p-1 rounded-2xl flex flex-wrap gap-1 h-auto justify-start">
              <TabsTrigger value="general" className="rounded-xl px-4 py-2 text-xs font-bold transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white">General</TabsTrigger>
              <TabsTrigger value="landing" className="rounded-xl px-4 py-2 text-xs font-bold transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white">Landing Hero</TabsTrigger>
              <TabsTrigger value="branding" className="rounded-xl px-4 py-2 text-xs font-bold transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white">Branding</TabsTrigger>
              <TabsTrigger value="seo" className="rounded-xl px-4 py-2 text-xs font-bold transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white">SEO</TabsTrigger>
              <TabsTrigger value="contact" className="rounded-xl px-4 py-2 text-xs font-bold transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white">Contact</TabsTrigger>
              <TabsTrigger value="social" className="rounded-xl px-4 py-2 text-xs font-bold transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white">Social Media</TabsTrigger>
              <TabsTrigger value="legal" className="rounded-xl px-4 py-2 text-xs font-bold transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white">Legal</TabsTrigger>
              <TabsTrigger value="faq" className="rounded-xl px-4 py-2 text-xs font-bold transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white">FAQ Section</TabsTrigger>
              <TabsTrigger value="integrations" className="rounded-xl px-4 py-2 text-xs font-bold transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white">Integrations</TabsTrigger>
              <TabsTrigger value="email" className="rounded-xl px-4 py-2 text-xs font-bold transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white">SMTP</TabsTrigger>
              <TabsTrigger value="advanced" className="rounded-xl px-4 py-2 text-xs font-bold transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white">Advanced</TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-4 outline-none">
              <Card className="border-black/5 rounded-[28px] overflow-hidden shadow-sm p-6 text-left space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-serif">General Configurations</h3>
                  <p className="text-xs text-slate-400 mt-1">Configure foundational platform variables and currencies.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Site Name</Label>
                    <Input {...register("general.siteName")} className="rounded-xl border-slate-100 bg-slate-50 text-xs h-11" placeholder="Ceylon Travels" />
                    {(errors as any).general?.siteName?.message && <p className="text-xs text-destructive">{String((errors as any).general.siteName.message)}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Site Tagline</Label>
                    <Input {...register("general.siteTagline")} className="rounded-xl border-slate-100 bg-slate-50 text-xs h-11" placeholder="Discover the Beauty of Sri Lanka" />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Site Description</Label>
                    <Textarea {...register("general.siteDescription")} className="rounded-xl border-slate-100 bg-slate-50 text-xs" rows={4} placeholder="Discover the Beauty of Sri Lanka with Ceylon Travels" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Company Registry Name</Label>
                    <Input {...register("general.companyName")} className="rounded-xl border-slate-100 bg-slate-50 text-xs h-11" placeholder="Ceylon Travels (Pvt) Ltd" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Standard Currency</Label>
                    <Input {...register("general.currency")} className="rounded-xl border-slate-100 bg-slate-50 text-xs h-11" placeholder="USD" />
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Landing Hero settings */}
            <TabsContent value="landing" className="space-y-4 outline-none">
              <Card className="border-black/5 rounded-[28px] overflow-hidden shadow-sm p-6 text-left space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-serif">Landing Page Hero</h3>
                  <p className="text-xs text-slate-400 mt-1">Set the background video and text displayed on the landing page hero section.</p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-4 border border-slate-100 p-5 rounded-2xl bg-white shadow-sm">
                    <div>
                      <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Background Video URL (External Link)</Label>
                      <Input
                        {...register("layout.heroVideoUrl" as any)}
                        placeholder="https://example.com/hero-video.mp4"
                        className="rounded-xl border-slate-200 bg-slate-50 text-xs h-11"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="h-px bg-slate-100 flex-1"></div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">OR UPLOAD FILE</span>
                      <div className="h-px bg-slate-100 flex-1"></div>
                    </div>

                    <div>
                      <VideoUpload
                        value={watch("layout.heroVideoUrl")}
                        onChange={(url) => setValue("layout.heroVideoUrl", url, { shouldDirty: true })}
                        onRemove={() => setValue("layout.heroVideoUrl", "", { shouldDirty: true })}
                        label="Upload Background Video"
                      />
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed block text-center pt-2">
                      Provide a direct link or upload an <span className="font-semibold">.mp4</span> / <span className="font-semibold">.webm</span> file (Max 50MB).
                    </p>
                  </div>

                  {/* Hero Title */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hero Title</Label>
                    <Input
                      {...register("layout.heroTitle")}
                      placeholder="One Island. A Thousand Lifetimes."
                      className="rounded-xl border-slate-100 bg-slate-50 text-xs h-11"
                    />
                  </div>

                  {/* Hero Subtitle */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hero Subtitle / Description</Label>
                    <Textarea
                      {...register("layout.heroSubtitle")}
                      placeholder="Your trusted travel partner for unforgettable Sri Lanka experiences."
                      className="rounded-xl border-slate-100 bg-slate-50 text-xs"
                      rows={3}
                    />
                  </div>

                  {/* Hero Buttons */}
                  <div className="grid md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Primary Button Label</Label>
                      <Input
                        {...register("layout.heroButtonText")}
                        placeholder="Explore Itineraries"
                        className="rounded-xl border-slate-100 bg-slate-50 text-xs h-11"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Primary Button Target Link</Label>
                      <Input
                        {...register("layout.heroButtonLink")}
                        placeholder="#itineraries"
                        className="rounded-xl border-slate-100 bg-slate-50 text-xs h-11 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Branding Settings */}

            <TabsContent value="branding" className="space-y-4 outline-none">
              <Card className="border-black/5 rounded-[28px] overflow-hidden shadow-sm p-6 text-left space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-serif">Branding & Layout Assets</h3>
                  <p className="text-xs text-slate-400 mt-1">Logo endpoints, visual configurations and primary/secondary accents.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Logo Image</Label>
                    <ImageUpload
                      value={watch("branding.logo")}
                      onChange={(url) => setValue("branding.logo", url, { shouldDirty: true })}
                      onRemove={() => setValue("branding.logo", "", { shouldDirty: true })}
                      label="Upload Logo"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Footer Logo</Label>
                    <ImageUpload
                      value={watch("branding.footerLogo")}
                      onChange={(url) => setValue("branding.footerLogo", url, { shouldDirty: true })}
                      onRemove={() => setValue("branding.footerLogo", "", { shouldDirty: true })}
                      label="Upload Footer Logo"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Favicon</Label>
                    <ImageUpload
                      value={watch("branding.favicon")}
                      onChange={(url) => setValue("branding.favicon", url, { shouldDirty: true })}
                      onRemove={() => setValue("branding.favicon", "", { shouldDirty: true })}
                      label="Upload Favicon"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Default OpenGraph Image</Label>
                    <ImageUpload
                      value={watch("branding.ogImage")}
                      onChange={(url) => setValue("branding.ogImage", url, { shouldDirty: true })}
                      onRemove={() => setValue("branding.ogImage", "", { shouldDirty: true })}
                      label="Upload OG Image"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Primary Brand Accent</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={/^#[0-9A-Fa-f]{6}$/.test(watch("branding.primaryColor") || "") ? watch("branding.primaryColor") : "#000000"}
                        onChange={(e) => setValue("branding.primaryColor", e.target.value, { shouldDirty: true })}
                        className="w-12 p-1 h-11 border-slate-100 bg-slate-50 cursor-pointer rounded-xl"
                      />
                      <Input {...register("branding.primaryColor")} placeholder="#00A680" className="flex-1 rounded-xl border-slate-100 bg-slate-50 text-xs h-11 font-mono uppercase" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Secondary Brand Accent</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={/^#[0-9A-Fa-f]{6}$/.test(watch("branding.secondaryColor") || "") ? watch("branding.secondaryColor") : "#000000"}
                        onChange={(e) => setValue("branding.secondaryColor", e.target.value, { shouldDirty: true })}
                        className="w-12 p-1 h-11 border-slate-100 bg-slate-50 cursor-pointer rounded-xl"
                      />
                      <Input {...register("branding.secondaryColor")} placeholder="#FF6B35" className="flex-1 rounded-xl border-slate-100 bg-slate-50 text-xs h-11 font-mono uppercase" />
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* SEO Settings */}
            <TabsContent value="seo" className="space-y-4 outline-none">
              <Card className="border-black/5 rounded-[28px] overflow-hidden shadow-sm p-6 text-left space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-serif">Search Engine Optimization</h3>
                  <p className="text-xs text-slate-400 mt-1">Configure search index keywords, snippet headers, and metadata indexes.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Default SEO Meta Title</Label>
                    <Input {...register("seo.metaTitle")} className="rounded-xl border-slate-100 bg-slate-50 text-xs h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Default SEO Meta Description</Label>
                    <Textarea {...register("seo.metaDescription")} className="rounded-xl border-slate-100 bg-slate-50 text-xs" rows={3} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Search Index Keywords (comma separated)</Label>
                    <Input {...register("seo.keywords")} className="rounded-xl border-slate-100 bg-slate-50 text-xs h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Twitter Card Format</Label>
                    <Input {...register("seo.twitterCard")} placeholder="summary_large_image" className="rounded-xl border-slate-100 bg-slate-50 text-xs h-11" />
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Contact Settings */}
            <TabsContent value="contact" className="space-y-6 outline-none">
              <Card className="border-black/5 rounded-[28px] overflow-hidden shadow-sm p-6 text-left space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-serif">Customer Support & Channels</h3>
                  <p className="text-xs text-slate-400 mt-1">Configure user interfaces contact references and WhatsApp channels.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Business Support Email</Label>
                    <Input {...register("contact.businessEmail")} className="rounded-xl border-slate-100 bg-slate-50 text-xs h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">WhatsApp Support Channel</Label>
                    <Input {...register("contact.whatsapp")} placeholder="+9477..." className="rounded-xl border-slate-100 bg-slate-50 text-xs h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Public Phone Reference</Label>
                    <Input {...register("contact.phoneNumber")} className="rounded-xl border-slate-100 bg-slate-50 text-xs h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Technical Escalation Email</Label>
                    <Input {...register("contact.supportEmail")} className="rounded-xl border-slate-100 bg-slate-50 text-xs h-11" />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">HQ Office Location Address</Label>
                    <Textarea {...register("contact.officeAddress")} className="rounded-xl border-slate-100 bg-slate-50 text-xs" rows={2} />
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Social Media Settings */}
            <TabsContent value="social" className="space-y-4 outline-none">
              <Card className="border-black/5 rounded-[28px] overflow-hidden shadow-sm p-6 text-left space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-serif flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-indigo-600" /> Social Media Channels & Links
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Configure profile links for social media pages displayed on the public website footer.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Facebook className="w-3.5 h-3.5 text-[#1877F2]" /> Facebook Page URL
                    </Label>
                    <Input
                      {...register("social.facebook")}
                      placeholder="https://facebook.com/yourpage"
                      className={`rounded-xl bg-slate-50 text-xs h-11 ${(errors as any).social?.facebook ? "border-destructive focus-visible:ring-destructive" : "border-slate-100"}`}
                    />
                    {(errors as any).social?.facebook?.message && (
                      <p className="text-xs font-medium text-destructive mt-1">
                        {String((errors as any).social.facebook.message)}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Instagram className="w-3.5 h-3.5 text-[#E4405F]" /> Instagram Profile URL
                    </Label>
                    <Input
                      {...register("social.instagram")}
                      placeholder="https://instagram.com/yourprofile"
                      className={`rounded-xl bg-slate-50 text-xs h-11 ${(errors as any).social?.instagram ? "border-destructive focus-visible:ring-destructive" : "border-slate-100"}`}
                    />
                    {(errors as any).social?.instagram?.message && (
                      <p className="text-xs font-medium text-destructive mt-1">
                        {String((errors as any).social.instagram.message)}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Youtube className="w-3.5 h-3.5 text-[#CD201F]" /> YouTube Channel URL
                    </Label>
                    <Input
                      {...register("social.youtube")}
                      placeholder="https://youtube.com/@yourchannel"
                      className={`rounded-xl bg-slate-50 text-xs h-11 ${(errors as any).social?.youtube ? "border-destructive focus-visible:ring-destructive" : "border-slate-100"}`}
                    />
                    {(errors as any).social?.youtube?.message && (
                      <p className="text-xs font-medium text-destructive mt-1">
                        {String((errors as any).social.youtube.message)}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Linkedin className="w-3.5 h-3.5 text-[#0077B5]" /> LinkedIn Profile / Page
                    </Label>
                    <Input
                      {...register("social.linkedin")}
                      placeholder="https://linkedin.com/company/yourcompany"
                      className={`rounded-xl bg-slate-50 text-xs h-11 ${(errors as any).social?.linkedin ? "border-destructive focus-visible:ring-destructive" : "border-slate-100"}`}
                    />
                    {(errors as any).social?.linkedin?.message && (
                      <p className="text-xs font-medium text-destructive mt-1">
                        {String((errors as any).social.linkedin.message)}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-slate-800 dark:text-white" /> TikTok Profile URL
                    </Label>
                    <Input
                      {...register("social.tiktok")}
                      placeholder="https://tiktok.com/@yourhandle"
                      className={`rounded-xl bg-slate-50 text-xs h-11 ${(errors as any).social?.tiktok ? "border-destructive focus-visible:ring-destructive" : "border-slate-100"}`}
                    />
                    {(errors as any).social?.tiktok?.message && (
                      <p className="text-xs font-medium text-destructive mt-1">
                        {String((errors as any).social.tiktok.message)}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Twitter className="w-3.5 h-3.5 text-[#1DA1F2]" /> Twitter / X Profile URL
                    </Label>
                    <Input
                      {...register("social.twitter")}
                      placeholder="https://x.com/yourhandle"
                      className={`rounded-xl bg-slate-50 text-xs h-11 ${(errors as any).social?.twitter ? "border-destructive focus-visible:ring-destructive" : "border-slate-100"}`}
                    />
                    {(errors as any).social?.twitter?.message && (
                      <p className="text-xs font-medium text-destructive mt-1">
                        {String((errors as any).social.twitter.message)}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-[#00AF87]" /> TripAdvisor Page URL
                    </Label>
                    <Input
                      {...register("social.tripadvisor")}
                      placeholder="https://tripadvisor.com/..."
                      className={`rounded-xl bg-slate-50 text-xs h-11 ${(errors as any).social?.tripadvisor ? "border-destructive focus-visible:ring-destructive" : "border-slate-100"}`}
                    />
                    {(errors as any).social?.tripadvisor?.message && (
                      <p className="text-xs font-medium text-destructive mt-1">
                        {String((errors as any).social.tripadvisor.message)}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" /> WhatsApp Link
                    </Label>
                    <Input
                      {...register("social.whatsapp")}
                      placeholder="https://wa.me/94775105848"
                      className={`rounded-xl bg-slate-50 text-xs h-11 ${(errors as any).social?.whatsapp ? "border-destructive focus-visible:ring-destructive" : "border-slate-100"}`}
                    />
                    {(errors as any).social?.whatsapp?.message && (
                      <p className="text-xs font-medium text-destructive mt-1">
                        {String((errors as any).social.whatsapp.message)}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Legal Settings */}
            <TabsContent value="legal" className="space-y-4 outline-none">
              <Card className="border-black/5 rounded-[28px] overflow-hidden shadow-sm p-6 text-left space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-serif">Legal & Governance Policies</h3>
                  <p className="text-xs text-slate-400 mt-1">Define platform usage terms, privacy protection, refund rules, and cookie consent policy text.</p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Privacy Protection Policy</Label>
                    <Textarea {...register("legal.privacy")} className="rounded-xl border-slate-100 bg-slate-50 text-xs min-h-[140px]" placeholder="State how customer data is processed and protected..." />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Terms of Service</Label>
                    <Textarea {...register("legal.terms")} className="rounded-xl border-slate-100 bg-slate-50 text-xs min-h-[140px]" placeholder="Define binding terms of booking, traveler responsibilities..." />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cookie Usage Policy</Label>
                    <Textarea {...register("legal.cookie")} className="rounded-xl border-slate-100 bg-slate-50 text-xs min-h-[100px]" placeholder="Explain cookies used for session tracking and platform analytics..." />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Refund & Cancellation Policy</Label>
                    <Textarea {...register("legal.refund")} className="rounded-xl border-slate-100 bg-slate-50 text-xs min-h-[100px]" placeholder="Detail refund rules based on notice timeframe..." />
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* FAQ / FnQ Settings */}
            <TabsContent value="faq" className="space-y-4 outline-none">
              <Card className="border-black/5 rounded-[28px] overflow-hidden shadow-sm p-6 text-left space-y-6">
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <h3 className="text-lg font-bold font-serif flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-blue-600" /> FAQ Section Management
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Configure frequently asked questions displayed on the /faq page and footer.
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddFaq}
                    size="sm"
                    className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Add Question
                  </Button>
                </div>

                <div className="space-y-4">
                  {faqItems.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs border border-dashed rounded-2xl bg-slate-50/50">
                      No FAQ questions configured yet. Click "Add Question" to create one.
                    </div>
                  ) : (
                    faqItems.map((item: any, idx: number) => (
                      <div key={item.id || idx} className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm space-y-3 relative group">
                        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                            Question #{idx + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFaq(idx)}
                            className="h-7 px-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                          </Button>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-slate-600">Question Title</Label>
                          <Input
                            value={item.question || ""}
                            onChange={(e) => handleUpdateFaq(idx, "question", e.target.value)}
                            placeholder="e.g. Do I need a visa to visit Sri Lanka?"
                            className="rounded-xl border-slate-100 bg-slate-50 text-xs h-10"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-slate-600">Answer Text</Label>
                          <Textarea
                            value={item.answer || ""}
                            onChange={(e) => handleUpdateFaq(idx, "answer", e.target.value)}
                            placeholder="Provide a clear, detailed answer..."
                            className="rounded-xl border-slate-100 bg-slate-50 text-xs min-h-[70px]"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Integrations */}
            <TabsContent value="integrations" className="space-y-4 outline-none">
              <Card className="border-black/5 rounded-[28px] overflow-hidden shadow-sm p-6 text-left space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-serif">Analytics & Tracking Integrations</h3>
                  <p className="text-xs text-slate-400 mt-1">Bind Google Analytics tags and Facebook Pixel keys easily.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Google Analytics ID</Label>
                    <Input {...register("integrations.googleAnalyticsId")} placeholder="G-XXXXXX" className="rounded-xl border-slate-100 bg-slate-50 text-xs h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Google Tag Manager ID</Label>
                    <Input {...register("integrations.googleTagManager")} placeholder="GTM-XXXXXX" className="rounded-xl border-slate-100 bg-slate-50 text-xs h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Facebook Pixel ID</Label>
                    <Input {...register("integrations.facebookPixel")} placeholder="Pixel ID" className="rounded-xl border-slate-100 bg-slate-50 text-xs h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bing Webmaster Key</Label>
                    <Input {...register("integrations.bingVerification")} className="rounded-xl border-slate-100 bg-slate-50 text-xs h-11" />
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* SMTP Settings */}
            <TabsContent value="email" className="space-y-4 outline-none">
              <Card className="border-black/5 rounded-[28px] overflow-hidden shadow-sm p-6 text-left space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-serif">Outgoing Transactional Mail (SMTP)</h3>
                  <p className="text-xs text-slate-400 mt-1">Setup system mailer accounts for invoice and verification schedules.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">SMTP Server Host</Label>
                    <Input {...register("email.smtpHost")} placeholder="smtp.gmail.com" className="rounded-xl border-slate-100 bg-slate-50 text-xs h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">SMTP Target Port</Label>
                    <Input {...register("email.smtpPort")} placeholder="587" className="rounded-xl border-slate-100 bg-slate-50 text-xs h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">SMTP Username</Label>
                    <Input {...register("email.smtpUsername")} className="rounded-xl border-slate-100 bg-slate-50 text-xs h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">SMTP Secure Password</Label>
                    <Input {...register("email.smtpPassword")} type="password" className="rounded-xl border-slate-100 bg-slate-50 text-xs h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Transactional Sender Name</Label>
                    <Input {...register("email.senderName")} placeholder="CeylonTravels" className="rounded-xl border-slate-100 bg-slate-50 text-xs h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Transactional Sender Email</Label>
                    <Input {...register("email.senderEmail")} className="rounded-xl border-slate-100 bg-slate-50 text-xs h-11" />
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Advanced Settings */}
            <TabsContent value="advanced" className="space-y-4 outline-none">
              <Card className="border-black/5 rounded-[28px] overflow-hidden shadow-sm p-6 text-left space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-serif">Advanced System Control</h3>
                  <p className="text-xs text-slate-400 mt-1">Control active session tracking and layout notification banners.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between space-x-4 rounded-2xl border border-slate-100 p-4 bg-slate-50/50">
                    <div className="space-y-0.5 text-left">
                      <Label className="text-xs font-bold text-slate-700">Enable Tracker Scripts</Label>
                      <p className="text-[10px] text-slate-400">Enable dynamic GA configurations.</p>
                    </div>
                    <Switch
                      checked={watch("advanced.enableAnalytics" as any)}
                      onCheckedChange={(val) => setValue("advanced.enableAnalytics" as any, val, { shouldDirty: true })}
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-4 rounded-2xl border border-slate-100 p-4 bg-slate-50/50">
                    <div className="space-y-0.5 text-left">
                      <Label className="text-xs font-bold text-slate-700">Hotjar Session Recordings</Label>
                      <p className="text-[10px] text-slate-400">Log visual student interactions.</p>
                    </div>
                    <Switch
                      checked={watch("advanced.sessionRecording" as any)}
                      onCheckedChange={(val) => setValue("advanced.sessionRecording" as any, val, { shouldDirty: true })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Announcement Banner</Label>
                    <Input {...register("layout.announcementBanner")} placeholder="Special seasonal offer — contact us today!" className="rounded-xl border-slate-100 bg-slate-50 text-xs h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Page Footer Notice</Label>
                    <Textarea {...register("layout.footerText")} placeholder="© 2026 Ceylon Travels (Pvt) Ltd. All rights reserved." className="rounded-xl border-slate-100 bg-slate-50 text-xs" rows={2} />
                  </div>
                </div>
              </Card>
            </TabsContent>

          </Tabs>
        </div>

        {/* ──── RIGHT COLUMN: INTERACTIVE LIVE SANDBOX PREVIEWER ──── */}
        <div className="xl:col-span-1 space-y-6">
          <div className="sticky top-24 space-y-6">

            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-400">
              <Eye className="w-4 h-4 text-violet-600 animate-pulse" /> Live Branding Previewer
            </div>

            {/* 1. MOCK BROWSER HEADER SIMULATOR */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 rounded-3xl overflow-hidden shadow-md text-left">
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2.5 flex items-center gap-1.5 border-b">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                <div className="bg-white dark:bg-slate-950 text-[10px] font-mono text-slate-400 px-3 py-0.5 rounded-full ml-4 truncate flex-1 flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5 text-emerald-500" /> https://{(watchedSiteName as string).toLowerCase().replace(/\s+/g, "")}.com
                </div>
              </div>

              {/* Announcement Banner previewer */}
              {watchedBannerText && (
                <div
                  style={{ backgroundColor: watchedPrimaryColor }}
                  className="text-white text-[10px] py-1 px-4 text-center font-bold truncate transition-colors animate-fade-in"
                >
                  📣 {watchedBannerText}
                </div>
              )}

              {/* Mock NavBar */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white dark:bg-slate-950">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 bg-slate-900 text-white rounded flex items-center justify-center text-[10px] font-bold">C</div>
                  <span className="text-xs font-black tracking-tight">{watchedSiteName}</span>
                </div>
                <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400">
                  <span style={{ color: watchedPrimaryColor }} className="font-extrabold">Home</span>
                  <span>Itineraries</span>
                  <button
                    style={{ backgroundColor: watchedPrimaryColor }}
                    className="text-white text-[8px] font-bold px-2.5 py-1 rounded transition-colors shadow-sm"
                  >
                    Get a Quote
                  </button>
                </div>
              </div>

              {/* Mock Branding swatches inside */}
              <div className="p-5 space-y-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Brand Color Palette</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border rounded-xl flex items-center gap-2.5 bg-slate-50/50">
                    <div style={{ backgroundColor: watchedPrimaryColor }} className="w-7 h-7 rounded-lg border shadow-sm"></div>
                    <div className="text-[10px]">
                      <p className="font-bold text-slate-700">Primary</p>
                      <p className="font-mono text-[9px] text-slate-400 uppercase mt-0.5">{watchedPrimaryColor}</p>
                    </div>
                  </div>

                  <div className="p-3 border rounded-xl flex items-center gap-2.5 bg-slate-50/50">
                    <div style={{ backgroundColor: watchedSecondaryColor }} className="w-7 h-7 rounded-lg border shadow-sm"></div>
                    <div className="text-[10px]">
                      <p className="font-bold text-slate-700">Secondary</p>
                      <p className="font-mono text-[9px] text-slate-400 uppercase mt-0.5">{watchedSecondaryColor}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* 2. GOOGLE SEO SERP SIMULATOR CARD */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 rounded-3xl p-5 shadow-md text-left space-y-3">
              <div className="flex justify-between items-center border-b pb-2.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-blue-500" /> Google Search SERP Simulator
                </span>
                <span className="bg-blue-50 text-blue-600 text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">Live</span>
              </div>

              <div className="space-y-1">
                {/* Meta details mock */}
                <div className="text-[11px] text-slate-500 flex items-center gap-1 leading-none">
                  <span>https://www.google.com</span>
                  <span className="text-[8px] text-slate-300">▶</span>
                  <span>search</span>
                </div>
                <h4 className="text-[15px] font-medium text-blue-800 dark:text-blue-400 hover:underline cursor-pointer leading-tight line-clamp-1 font-sans">
                  {watchedMetaTitle}
                </h4>
                <p className="text-[11.5px] text-slate-600 dark:text-slate-400 leading-normal line-clamp-2">
                  {watchedMetaDescription}
                </p>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border text-[9px] text-slate-400 leading-relaxed font-medium">
                💡 **SEO Health Tip:** Title Tag should be under 60 characters to avoid truncation. Meta Description is best under 160 characters.
              </div>
            </div>

            {/* 3. HERO BANNER LIVE PREVIEW CARD */}
            <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-5 shadow-md text-left space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Laptop className="w-3.5 h-3.5 text-emerald-400" /> Landing Hero Preview
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
              </div>

              <div className="relative rounded-2xl bg-black/60 p-4 border border-white/10 space-y-2.5">
                <p className="text-xs font-serif font-bold text-white leading-tight">
                  {watchedHeroTitle}
                </p>
                <p className="text-[10px] text-white/70 line-clamp-2 leading-relaxed font-light">
                  {watchedHeroSubtitle}
                </p>
                <div className="flex gap-2 pt-1">
                  <span
                    style={{ backgroundColor: watchedPrimaryColor }}
                    className="text-[9px] font-bold text-white px-3 py-1 rounded-md shadow-sm"
                  >
                    {watchedHeroButtonText}
                  </span>
                  <span className="text-[9px] font-bold text-white/80 border border-white/30 px-3 py-1 rounded-md">
                    Start Planning
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
