"use client";

import { use, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getItineraryById, createItinerary, updateItinerary } from "@/actions/itineraries";
import { createItinerarySchema } from "@repo/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminGuard } from "@/components/layout/auth-guard";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Trash2, Save, ArrowLeft, Camera, Clock,
  MapPin, DollarSign, Image as ImageIcon, CheckCircle2, AlertCircle,
  Layers, CalendarDays, FileText, Tag, Sparkles, Globe, Lock, Unlock,
  ChevronDown, ChevronUp, ChevronRight, ArrowUp, ArrowDown, Undo2, HelpCircle
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/shared/image-upload";

export const runtime = 'edge';

// ─── Field Error Message ────────────────────────────────────────────────
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 text-[11px] font-medium text-destructive mt-1">
      <AlertCircle className="w-3 h-3 shrink-0" /> {msg}
    </p>
  );
}

// ─── Section Header ─────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, description, action }: {
  icon: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-border/50 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-4.5 h-4.5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

// ─── Quick-click Suggestions Component ───────────────────────────────────
function Suggestions({ items, onSelect }: { items: string[]; onSelect: (val: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-1.5">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onSelect(item)}
          className="text-[9px] px-2 py-0.5 rounded bg-muted/70 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all font-semibold border border-border/40 cursor-pointer"
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default function EditItineraryPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const isNew = params.id === "new";
  const router = useRouter();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  // ─── Local State for Advanced CMS Features ──────────────────────────────
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 0: true });
  const [hasDraft, setHasDraft] = useState(false);

  const { data: itinerary, isLoading: isFetching } = useQuery({
    queryKey: ["admin", "itineraries", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/admin/itineraries/${params.id}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to load itinerary");
      }
      return res.json();
    },
    enabled: !isNew,
  });

  const {
    register, control, handleSubmit, reset, watch, setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createItinerarySchema),
    defaultValues: {
      title: "", slug: "", duration: "", price: "", pace: "",
      travelStyle: "", bestFor: "", tags: [""], heroImg: "", mapImg: "",
      overview: "", highlights: [""],
      days: [{ day: "01", title: "", place: "", body: "", img: "", activities: [""], travelTime: "", meals: { b: false, l: false, d: false }, accommodation: "" }],
      inclusions: [""], exclusions: [""], needToKnow: [{ title: "", detail: "" }],
      faqs: [{ question: "", answer: "" }],
    },
  });

  const {
    fields: dayFields,
    append: appendDay,
    remove: removeDay,
    move: moveDay
  } = useFieldArray({ control, name: "days" as any });

  const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = useFieldArray({ control, name: "highlights" as any });
  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({ control, name: "tags" as any });
  const { fields: inclusionFields, append: appendInclusion, remove: removeInclusion } = useFieldArray({ control, name: "inclusions" as any });
  const { fields: exclusionFields, append: appendExclusion, remove: removeExclusion } = useFieldArray({ control, name: "exclusions" as any });
  const { fields: needToKnowFields, append: appendNeedToKnow, remove: removeNeedToKnow } = useFieldArray({ control, name: "needToKnow" as any });
  const { fields: faqFields, append: appendFaq, remove: removeFaq, move: moveFaq } = useFieldArray({ control, name: "faqs" as any });

  useEffect(() => {
    if (itinerary) {
      const data = (itinerary as any).data || itinerary;
      reset(data);
    }
  }, [itinerary, reset]);

  // ─── Auto-generate Slug Effect ──────────────────────────────────────────
  const watchTitle = watch("title");
  useEffect(() => {
    if (isNew && !isSlugManual && watchTitle) {
      const generated = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setValue("slug", generated, { shouldValidate: true });
    }
  }, [watchTitle, isNew, isSlugManual, setValue]);

  // ─── Autosave / Draft Recovery Setup ─────────────────────────────────────
  const DRAFT_KEY = isNew ? "ceylon_itinerary_draft_new" : `ceylon_itinerary_draft_${params.id}`;

  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      // Check if current form is empty before offering restore
      if (isNew && !watchTitle) {
        setHasDraft(true);
      }
    }
  }, [DRAFT_KEY, isNew, watchTitle]);

  const formValues = watch();
  useEffect(() => {
    const timer = setTimeout(() => {
      // Don't save empty default fields
      if (formValues.title || formValues.overview || dayFields.length > 1) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(formValues));
      }
    }, 1000); // 1s debounce

    return () => clearTimeout(timer);
  }, [formValues, DRAFT_KEY, dayFields.length]);

  const handleRestoreDraft = () => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      reset(JSON.parse(saved));
      setHasDraft(false);
      toast({ title: "Draft restored!", description: "Your unsaved progress has been loaded." });
    }
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
    toast({ title: "Draft discarded", description: "Unsaved local progress has been deleted." });
  };

  const handleAppendDay = () => {
    const nextIdx = dayFields.length;
    appendDay({
      day: String(nextIdx + 1).padStart(2, "0"),
      title: "", place: "", body: "", img: "", activities: [""], travelTime: "", meals: { b: false, l: false, d: false }, accommodation: ""
    });
    setExpandedDays(prev => ({ ...prev, [nextIdx]: true }));
  };

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const url = isNew ? "/api/admin/itineraries" : `/api/admin/itineraries/${params.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save journey");
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "itineraries"] });
      localStorage.removeItem(DRAFT_KEY); // Clean draft on success
      toast({ title: isNew ? "Journey created!" : "Journey updated!", description: "Your changes have been saved." });
      router.push("/admin/itineraries");
    },
    onError: (err: any) => toast({ title: "Failed to save", description: err.message, variant: "destructive" }),
  });

  const heroImgUrl = watch("heroImg");
  const mapImgUrl = watch("mapImg");
  const hasOverviewErrors = !!(errors.title || errors.slug || errors.duration || errors.price || errors.heroImg || errors.overview);
  const hasDaysErrors = !!errors.days;

  const watchSlug = watch("slug");
  const watchDuration = watch("duration");
  const watchPrice = watch("price");
  const watchOverview = watch("overview");

  const isOverviewComplete = !!(
    watchTitle &&
    watchSlug &&
    watchDuration &&
    watchPrice &&
    heroImgUrl &&
    watchOverview &&
    !hasOverviewErrors
  );

  const isTimelineComplete = !!(
    isOverviewComplete &&
    dayFields.length > 0 &&
    !hasDaysErrors
  );

  const onError = () => {
    if (hasOverviewErrors) setActiveTab("overview");
    else if (hasDaysErrors) setActiveTab("timeline");
    else setActiveTab("fineprint");
    toast({ title: "Please fix form errors", description: "Some required fields are missing or invalid.", variant: "destructive" });
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative w-12 h-12">
          <div className="w-12 h-12 rounded-full border-4 border-primary/10 absolute inset-0" />
          <div className="w-12 h-12 rounded-full border-4 border-transparent border-t-primary animate-spin absolute inset-0" />
        </div>
        <p className="text-muted-foreground text-sm">Loading journey data...</p>
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="max-w-5xl mx-auto pb-36">

        {/* Draft Recovery Banner */}
        {hasDraft && (
          <div className="mb-6 p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Undo2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Unsaved Draft Found</p>
                <p className="text-xs text-muted-foreground">We found progress from your last edit session. Would you like to restore it?</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" size="sm" variant="ghost" onClick={handleDiscardDraft}>Discard</Button>
              <Button type="button" size="sm" onClick={handleRestoreDraft}>Restore Draft</Button>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" className="shrink-0 shadow-sm" asChild>
            <Link href="/admin/itineraries"><ArrowLeft className="w-4 h-4" /></Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Journey Management</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {isNew ? "Create New Journey" : "Edit Journey"}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isNew ? "Set up a new travel product from scratch." : "Update timeline, images, and pricing for this journey."}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 border border-border/50">
            <Globe className="w-4 h-4 text-primary/70" />
            <span className="font-mono text-xs">{watch("slug") || "your-slug-here"}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data), onError)} className="space-y-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

            {/* Tab Navigation */}
            <TabsList className="w-full h-auto p-1 bg-muted/40 border border-border/60 rounded-xl grid grid-cols-3 mb-8 shadow-sm">
              {[
                { value: "overview", label: "Overview", sublabel: "Details & Media", icon: Layers, hasError: hasOverviewErrors, locked: false },
                { value: "timeline", label: "Timeline", sublabel: "Day-by-day plan", icon: CalendarDays, hasError: hasDaysErrors, locked: !isOverviewComplete },
                { value: "fineprint", label: "Fine Print", sublabel: "What's included", icon: FileText, hasError: false, locked: !isTimelineComplete },
              ].map((tab, i) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  disabled={tab.locked}
                  className={cn(
                    "relative flex flex-col items-center gap-0.5 py-3 px-4 rounded-lg transition-all data-[state=active]:bg-background data-[state=active]:shadow-md",
                    "data-[state=active]:text-foreground text-muted-foreground",
                    tab.locked && "opacity-50 cursor-not-allowed pointer-events-none"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {tab.locked ? (
                      <Lock className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                    ) : (
                      <tab.icon className="w-4 h-4 shrink-0" />
                    )}
                    <span className="font-semibold text-sm">{tab.label}</span>
                    {tab.hasError && (
                      <span className="w-2 h-2 rounded-full bg-destructive shrink-0" />
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-normal hidden sm:block">
                    {tab.locked ? "Complete previous steps" : tab.sublabel}
                  </span>
                  <span className="absolute top-2 right-2 text-[10px] text-muted-foreground/40 font-mono hidden lg:block">{i + 1}/3</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* ─── TAB 1: OVERVIEW & MEDIA ─────────────────────────────── */}
            <TabsContent value="overview" className="animate-in fade-in-0 slide-in-from-right-4 duration-300 space-y-8">

              {/* Core Identity */}
              <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                <SectionHeader icon={Sparkles} title="Journey Identity" description="The name, URL, and core descriptor of this travel product." />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Journey Title <span className="text-destructive">*</span></Label>
                    <Input
                      {...register("title")}
                      className={cn("text-base font-medium h-11", errors.title && "border-destructive")}
                      placeholder="e.g. The Signature Highlands"
                    />
                    <FieldError msg={errors.title?.message as string} />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">URL Slug <span className="text-destructive">*</span></Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-mono">/</span>
                      <Input
                        {...register("slug")}
                        onFocus={() => setIsSlugManual(true)}
                        className={cn("pl-6 font-mono text-sm h-11 bg-muted/30", errors.slug && "border-destructive")}
                        placeholder="signature-highlands"
                      />
                    </div>
                    <FieldError msg={errors.slug?.message as string} />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Duration <span className="text-destructive">*</span></Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                      <Input
                        {...register("duration")}
                        className={cn("pl-9 h-11", errors.duration && "border-destructive")}
                        placeholder="e.g. 7 Days / 6 Nights"
                      />
                    </div>
                    <FieldError msg={errors.duration?.message as string} />
                    <Suggestions
                      items={["3 Days / 2 Nights", "5 Days / 4 Nights", "7 Days / 6 Nights", "10 Days / 9 Nights", "14 Days / 13 Nights"]}
                      onSelect={(val) => setValue("duration", val, { shouldValidate: true })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Price Display <span className="text-destructive">*</span></Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                      <Input
                        {...register("price")}
                        className={cn("pl-9 h-11", errors.price && "border-destructive")}
                        placeholder="from $850 per person"
                      />
                    </div>
                    <FieldError msg={errors.price?.message as string} />
                    <Suggestions
                      items={["from $450 per person", "from $750 per person", "from $1,250 per person", "from $1,850 per person"]}
                      onSelect={(val) => setValue("price", val, { shouldValidate: true })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Pace</Label>
                    <Input {...register("pace")} className="h-11 bg-muted/20" placeholder="Active & Immersive" />
                    <Suggestions
                      items={["Active & Immersive", "Relaxed & Leisurely", "Moderate & Scenic", "Fast-Paced Adventure"]}
                      onSelect={(val) => setValue("pace", val)}
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Travel Style</Label>
                    <Input {...register("travelStyle")} className="h-11 bg-muted/20" placeholder="Private Boutique" />
                    <Suggestions
                      items={["Private Boutique", "Luxury Custom Journey", "Small Group Tour", "Adventure Explorer"]}
                      onSelect={(val) => setValue("travelStyle", val)}
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-sm font-medium">Best For</Label>
                    <Input {...register("bestFor")} className="h-11 bg-muted/20" placeholder="Nature & Culture Lovers, Families, Solo Travellers…" />
                    <Suggestions
                      items={["Nature & Culture Lovers", "Active Families", "Couples & Honeymooners", "Wildlife Seekers"]}
                      onSelect={(val) => setValue("bestFor", val)}
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-sm font-medium">Overview <span className="text-destructive">*</span></Label>
                    <Textarea
                      {...register("overview")}
                      rows={4}
                      className={cn("resize-y bg-muted/10 text-sm leading-relaxed", errors.overview && "border-destructive")}
                      placeholder="Describe the essence and mood of this journey in 2–4 sentences…"
                    />
                    <FieldError msg={errors.overview?.message as string} />
                  </div>
                </div>
              </div>

              {/* Media */}
              <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                <SectionHeader icon={Camera} title="Media Assets" description="Hero and map images displayed on the public itinerary page." />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Hero Image <span className="text-destructive">*</span></Label>
                    <ImageUpload
                      value={heroImgUrl}
                      onChange={(url) => setValue("heroImg", url, { shouldValidate: true })}
                      onRemove={() => setValue("heroImg", "")}
                      label="Upload Hero Image"
                    />
                    <FieldError msg={errors.heroImg?.message as string} />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Route Map Image</Label>
                    <ImageUpload
                      value={mapImgUrl}
                      onChange={(url) => setValue("mapImg", url)}
                      onRemove={() => setValue("mapImg", "")}
                      label="Upload Route Map Image"
                    />
                  </div>
                </div>
              </div>

              {/* Highlights & Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Highlights */}
                <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                  <SectionHeader
                    icon={Sparkles}
                    title="Highlights"
                    description="Key selling points of the journey."
                    action={
                      <Button type="button" variant="outline" size="sm" onClick={() => appendHighlight("")}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add
                      </Button>
                    }
                  />
                  <div className="space-y-2">
                    {highlightFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2 items-center animate-in slide-in-from-top-2 duration-200">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <Input {...register(`highlights.${index}` as any)} className="flex-1 h-9 bg-muted/20 text-sm" placeholder="e.g. Sunrise over the highlands" />
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/50 hover:text-destructive" onClick={() => removeHighlight(index)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}
                    {highlightFields.length === 0 && (
                      <div className="py-6 text-center border border-dashed border-border rounded-lg">
                        <p className="text-xs text-muted-foreground">No highlights yet.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                  <SectionHeader
                    icon={Tag}
                    title="Tags"
                    description="Used for filtering and badging on listing pages."
                    action={
                      <Button type="button" variant="outline" size="sm" onClick={() => appendTag("")}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add
                      </Button>
                    }
                  />
                  <div className="flex flex-wrap gap-2">
                    {tagFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-1 bg-primary/10 border border-primary/20 text-primary pl-3 pr-1 py-1.5 rounded-full animate-in zoom-in-90 duration-200">
                        <Input
                          {...register(`tags.${index}` as any)}
                          className="h-5 w-24 bg-transparent border-none p-0 text-xs focus-visible:ring-0 text-primary placeholder:text-primary/50 font-medium"
                          placeholder="e.g. Wildlife"
                        />
                        <button type="button" className="ml-0.5 w-5 h-5 rounded-full flex items-center justify-center text-primary/60 hover:text-destructive hover:bg-destructive/10 transition-colors" onClick={() => removeTag(index)}>
                          ×
                        </button>
                      </div>
                    ))}
                    {tagFields.length === 0 && (
                      <div className="py-6 w-full text-center border border-dashed border-border rounded-lg">
                        <p className="text-xs text-muted-foreground">No tags yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ─── TAB 2: TIMELINE ─────────────────────────────────────── */}
            <TabsContent value="timeline" className="animate-in fade-in-0 slide-in-from-right-4 duration-300 space-y-6">
              <div className="flex items-center justify-between bg-card rounded-2xl border border-border p-5 shadow-sm">
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-primary" /> Daily Itinerary
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {dayFields.length} day{dayFields.length !== 1 ? "s" : ""} planned — build out the traveler's experience day-by-day.
                  </p>
                </div>
                <Button type="button" size="sm" className="shadow-sm" onClick={handleAppendDay}>
                  <Plus className="w-4 h-4 mr-1.5" /> Add Day {dayFields.length + 1}
                </Button>
              </div>

              <div className="relative space-y-5 pl-0 md:pl-10">
                {/* Vertical connector line */}
                <div className="absolute left-3.5 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-border to-transparent hidden md:block pointer-events-none" />

                {dayFields.map((field, index) => {
                  const isExpanded = expandedDays[index] ?? true;
                  const dayTitle = watch(`days.${index}.title` as any) || "(No Title)";
                  const dayPlace = watch(`days.${index}.place` as any) || "(No Location)";

                  return (
                    <div key={field.id} className="relative flex flex-col md:flex-row gap-4 animate-in slide-in-from-bottom-3 duration-400">
                      {/* Timeline dot */}
                      <div className="hidden md:flex absolute -left-10 top-6 items-center justify-center">
                        <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md ring-4 ring-background">
                          {index + 1}
                        </div>
                      </div>

                      {/* Day card */}
                      <div className="flex-1 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                        
                        {/* ── Card Header ───────────────────────────────────── */}
                        <div className="flex items-center justify-between px-5 py-3 bg-muted/30 border-b border-border/50">
                          
                          {/* Accordion toggle & Index title */}
                          <button
                            type="button"
                            onClick={() => setExpandedDays(prev => ({ ...prev, [index]: !isExpanded }))}
                            className="flex items-center gap-3 text-left focus:outline-none flex-1"
                          >
                            <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                              {index + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                              <span className="font-semibold text-sm text-foreground block md:inline mr-2">
                                Day {index + 1}: {isExpanded ? "" : dayTitle}
                              </span>
                              {!isExpanded && (
                                <span className="text-xs text-muted-foreground truncate hidden sm:inline-block">
                                  at {dayPlace}
                                </span>
                              )}
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                            )}
                          </button>

                          {/* Reordering and Actions block */}
                          <div className="flex items-center gap-1.5 ml-4 shrink-0">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={index === 0}
                              onClick={() => moveDay(index, index - 1)}
                              className="h-8 w-8 text-muted-foreground/60 hover:bg-muted"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={index === dayFields.length - 1}
                              onClick={() => moveDay(index, index + 1)}
                              className="h-8 w-8 text-muted-foreground/60 hover:bg-muted"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                              onClick={() => removeDay(index)}
                              title="Delete Day"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>

                        {/* ── Card Body (Collapsible) ─────────────────────────── */}
                        <div className={cn("p-5 grid grid-cols-1 md:grid-cols-2 gap-5 transition-all duration-300", !isExpanded && "hidden")}>
                          <div className="space-y-1 sm:grid sm:grid-cols-2 sm:gap-4 md:col-span-2">
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Day Title <span className="text-destructive">*</span></Label>
                              <Input
                                {...register(`days.${index}.title` as any)}
                                className={cn("h-9 font-semibold text-sm bg-background/70 border-border/70", errors?.days?.[index]?.title && "border-destructive")}
                                placeholder="Day title…"
                              />
                              <FieldError msg={errors?.days?.[index]?.title?.message as string} />
                              <Suggestions
                                items={["Arrival & Check-in", "Exploring the Ancient City", "Scenic Drive to the Hills", "Wildlife Safari", "Leisurely Day by the Beach"]}
                                onSelect={(val) => setValue(`days.${index}.title` as any, val)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Location / Route <span className="text-destructive">*</span></Label>
                              <div className="relative">
                                <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
                                <Input
                                  {...register(`days.${index}.place` as any)}
                                  className={cn("pl-8 h-9 text-sm bg-background/70 border-border/70", errors?.days?.[index]?.place && "border-destructive")}
                                  placeholder="Location…"
                                />
                              </div>
                              <FieldError msg={errors?.days?.[index]?.place?.message as string} />
                              <Suggestions
                                items={["Colombo", "Negombo → Sigiriya", "Sigiriya → Kandy", "Kandy → Nuwara Eliya", "Ella → Yala", "Yala → Galle", "Galle → Colombo"]}
                                onSelect={(val) => setValue(`days.${index}.place` as any, val)}
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5 md:col-span-2">
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Day Description</Label>
                            <Textarea
                              {...register(`days.${index}.body` as any)}
                              rows={3}
                              className="resize-y bg-muted/10 text-sm leading-relaxed"
                              placeholder="What does the traveler experience on this day?"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Day Image</Label>
                            <ImageUpload
                              value={watch(`days.${index}.img` as any)}
                              onChange={(url) => setValue(`days.${index}.img` as any, url)}
                              onRemove={() => setValue(`days.${index}.img` as any, "")}
                              label="Upload Day Image"
                            />
                            <FieldError msg={errors?.days?.[index]?.img?.message as string} />
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Accommodation</Label>
                            <Input {...register(`days.${index}.accommodation` as any)} className="h-9 bg-muted/10" placeholder="Heritage Boutique Hotel…" />
                            <Suggestions
                              items={["Luxury Boutique Eco-Lodge", "Heritage Colonial Hotel", "Eco-friendly Glamping Tent", "Beachfront Villa", "Premium City Hotel"]}
                              onSelect={(val) => setValue(`days.${index}.accommodation` as any, val)}
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Travel Time</Label>
                            <Input {...register(`days.${index}.travelTime` as any)} className="h-9 bg-muted/10" placeholder="~4 hrs driving" />
                            <Suggestions
                              items={["~2 hrs driving", "~4.5 hrs scenic drive", "~3 hrs mountain train ride", "Leisurely walking pace"]}
                              onSelect={(val) => setValue(`days.${index}.travelTime` as any, val)}
                            />
                          </div>

                          {/* Meals */}
                          <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Meals Included</Label>
                            <div className="flex gap-2">
                              {["b", "l", "d"].map((m) => {
                                const checked = watch(`days.${index}.meals.${m}` as any);
                                return (
                                  <label key={m} className={cn(
                                    "flex-1 text-center py-2 text-xs font-semibold rounded-lg border cursor-pointer transition-all select-none",
                                    checked
                                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                      : "bg-muted/30 text-muted-foreground border-border hover:border-primary/50 hover:bg-muted/60"
                                  )}>
                                    <input type="checkbox" {...register(`days.${index}.meals.${m}` as any)} className="sr-only" />
                                    {m === "b" ? "B'fast" : m === "l" ? "Lunch" : "Dinner"}
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          {/* Activities */}
                          <div className="space-y-2 md:col-span-2 pt-3 border-t border-border/40">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Key Activities</Label>
                              <Button
                                type="button" variant="ghost" size="sm" className="h-7 text-xs text-primary hover:bg-primary/10 gap-1"
                                onClick={() => {
                                  const current = watch(`days.${index}.activities` as any) || [];
                                  setValue(`days.${index}.activities` as any, [...current, ""]);
                                }}
                              >
                                <Plus className="w-3 h-3" /> Add Activity
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {(watch(`days.${index}.activities` as any) || []).map((_: any, actIdx: number) => (
                                <div key={actIdx} className="flex gap-2 items-center">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
                                  <div className="flex-1 space-y-1">
                                    <Input
                                      {...register(`days.${index}.activities.${actIdx}` as any)}
                                      className="h-8 text-xs bg-muted/10 w-full"
                                      placeholder="e.g. Elephant Safari"
                                    />
                                    <Suggestions
                                      items={["Sigiriya Rock Climb", "Temple of the Tooth Visit", "Scenic Train Ride", "Yala Game Drive", "Walking Tour of Galle Fort", "Traditional Cooking Class"]}
                                      onSelect={(val) => setValue(`days.${index}.activities.${actIdx}` as any, val)}
                                    />
                                  </div>
                                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground/50 hover:text-destructive shrink-0"
                                    onClick={() => {
                                      const current = watch(`days.${index}.activities` as any);
                                      setValue(`days.${index}.activities` as any, current.filter((_: any, i: number) => i !== actIdx));
                                    }}>
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {dayFields.length === 0 && (
                  <div className="py-20 text-center bg-card border border-dashed border-border rounded-2xl flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
                      <CalendarDays className="w-6 h-6 text-muted-foreground/40" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">No days added yet</p>
                      <p className="text-sm text-muted-foreground mt-1">Start building the day-by-day experience for travellers.</p>
                    </div>
                    <Button type="button" onClick={handleAppendDay}>
                      <Plus className="w-4 h-4 mr-1.5" /> Add Day 1
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* ─── TAB 3: FINE PRINT ───────────────────────────────────── */}
            <TabsContent value="fineprint" className="animate-in fade-in-0 slide-in-from-right-4 duration-300 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Inclusions */}
                <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                  <SectionHeader
                    icon={CheckCircle2}
                    title="Inclusions"
                    description="What's covered in the package price."
                    action={
                      <Button type="button" variant="outline" size="sm" onClick={() => appendInclusion("")}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add
                      </Button>
                    }
                  />
                  <div className="space-y-2">
                    {inclusionFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2 items-center animate-in slide-in-from-top-2 duration-200">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <div className="flex-1 space-y-1">
                          <Input {...register(`inclusions.${index}` as any)} className="h-9 text-sm bg-muted/10 w-full" placeholder="e.g. All breakfasts & dinners" />
                          <Suggestions
                            items={["Airport pickup & dropoff", "All entrance fees to listed sites", "Private English-speaking driver/guide", "Comfortable air-conditioned transport", "Daily mineral water bottles"]}
                            onSelect={(val) => setValue(`inclusions.${index}` as any, val)}
                          />
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/40 hover:text-destructive shrink-0" onClick={() => removeInclusion(index)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}
                    {inclusionFields.length === 0 && (
                      <div className="py-6 text-center border border-dashed border-border rounded-lg">
                        <p className="text-xs text-muted-foreground">No inclusions added yet.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Exclusions */}
                <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                  <SectionHeader
                    icon={AlertCircle}
                    title="Exclusions"
                    description="What is NOT covered in the package price."
                    action={
                      <Button type="button" variant="outline" size="sm" onClick={() => appendExclusion("")}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add
                      </Button>
                    }
                  />
                  <div className="space-y-2">
                    {exclusionFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2 items-center animate-in slide-in-from-top-2 duration-200">
                        <AlertCircle className="w-4 h-4 text-destructive/60 shrink-0 mt-0.5" />
                        <div className="flex-1 space-y-1">
                          <Input {...register(`exclusions.${index}` as any)} className="h-9 text-sm bg-muted/10 w-full" placeholder="e.g. International flights" />
                          <Suggestions
                            items={["International flight tickets", "Visa processing fees", "Travel insurance", "Lunch & optional beverages", "Tips and personal gratuities"]}
                            onSelect={(val) => setValue(`exclusions.${index}` as any, val)}
                          />
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/40 hover:text-destructive shrink-0" onClick={() => removeExclusion(index)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}
                    {exclusionFields.length === 0 && (
                      <div className="py-6 text-center border border-dashed border-border rounded-lg">
                        <p className="text-xs text-muted-foreground">No exclusions added yet.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Need To Know */}
                <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:col-span-2">
                  <SectionHeader
                    icon={FileText}
                    title="Need to Know & Essential Tips"
                    description="Important information for travelers before booking."
                    action={
                      <Button type="button" variant="outline" size="sm" onClick={() => appendNeedToKnow({ title: "", detail: "" })}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Note
                      </Button>
                    }
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {needToKnowFields.map((field, index) => (
                      <div key={field.id} className="p-4 rounded-xl border border-border/70 bg-muted/20 space-y-3 relative animate-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-2">
                          <span className="text-xs font-bold text-muted-foreground">Note #{index + 1}</span>
                          <Button
                            type="button" variant="ghost" size="icon"
                            onClick={() => removeNeedToKnow(index)} className="h-7 w-7 text-muted-foreground/40 hover:text-destructive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium">Title</Label>
                          <Input
                            {...register(`needToKnow.${index}.title` as any)}
                            className="h-9 text-sm bg-background/80"
                            placeholder="e.g. Visa Requirements"
                          />
                          <Suggestions
                            items={["Visa Requirements", "Best Season", "Packing Tips", "Fitness Level", "Currency & Tipping"]}
                            onSelect={(val) => setValue(`needToKnow.${index}.title` as any, val)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium">Detail</Label>
                          <Textarea
                            {...register(`needToKnow.${index}.detail` as any)}
                            rows={2}
                            className="resize-y text-sm bg-background/80"
                            placeholder="Details..."
                          />
                        </div>
                      </div>
                    ))}
                    {needToKnowFields.length === 0 && (
                      <div className="py-6 md:col-span-2 text-center border border-dashed border-border rounded-lg">
                        <p className="text-xs text-muted-foreground">No notes added yet.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Frequently Asked Questions (FAQ) Section */}
                <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:col-span-2 space-y-4">
                  <SectionHeader
                    icon={HelpCircle}
                    title="Frequently Asked Questions (FAQ)"
                    description="Custom Q&A displayed directly on this itinerary's public page."
                    action={
                      <Button type="button" variant="outline" size="sm" onClick={() => appendFaq({ question: "", answer: "" })}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add FAQ
                      </Button>
                    }
                  />
                  <div className="space-y-4">
                    {faqFields.map((field, index) => (
                      <div key={field.id} className="p-4 rounded-xl border border-border/70 bg-muted/20 space-y-3 relative group animate-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-2">
                          <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px]">
                              Q{index + 1}
                            </span>
                            FAQ #{index + 1}
                          </span>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button" variant="ghost" size="icon" disabled={index === 0}
                              onClick={() => moveFaq(index, index - 1)} className="h-7 w-7 text-muted-foreground/60 hover:bg-muted"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              type="button" variant="ghost" size="icon" disabled={index === faqFields.length - 1}
                              onClick={() => moveFaq(index, index + 1)} className="h-7 w-7 text-muted-foreground/60 hover:bg-muted"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              type="button" variant="ghost" size="icon"
                              onClick={() => removeFaq(index)} className="h-7 w-7 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10"
                              title="Delete FAQ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium">Question</Label>
                          <Input
                            {...register(`faqs.${index}.question` as any)}
                            className="h-9 text-sm bg-background/80"
                            placeholder="e.g. Is this trip suitable for families with children?"
                          />
                          <Suggestions
                            items={[
                              "What is the best time of year to take this trip?",
                              "Are international flights included in the price?",
                              "What is the cancellation & refund policy?",
                              "Can this itinerary be fully customized?",
                              "What type of vehicles are used for transport?"
                            ]}
                            onSelect={(val) => setValue(`faqs.${index}.question` as any, val)}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium">Answer</Label>
                          <Textarea
                            {...register(`faqs.${index}.answer` as any)}
                            rows={2}
                            className="resize-y text-sm bg-background/80"
                            placeholder="Provide a helpful, detailed answer for travelers..."
                          />
                        </div>
                      </div>
                    ))}

                    {faqFields.length === 0 && (
                      <div className="py-8 text-center border border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2">
                        <HelpCircle className="w-8 h-8 text-muted-foreground/30" />
                        <p className="text-xs text-muted-foreground">No FAQs added for this itinerary yet.</p>
                        <Button type="button" variant="outline" size="sm" onClick={() => appendFaq({ question: "", answer: "" })}>
                          <Plus className="w-3.5 h-3.5 mr-1" /> Add First FAQ
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* ─── Sticky Save Bar ─────────────────────────────────────── */}
          <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-4 px-6 py-3.5 bg-background/90 backdrop-blur-lg border-t border-border/80 shadow-[0_-4px_32px_rgba(0,0,0,0.06)] md:pl-[18rem]">
            <div className="hidden md:flex items-center gap-3">
              {Object.keys(errors).length > 0 ? (
                <span className="flex items-center gap-2 text-sm font-medium text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  Fix the highlighted errors before saving.
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Changes will apply immediately after saving.
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <Button type="button" variant="ghost" size="sm" asChild className="text-muted-foreground">
                <Link href="/admin/itineraries">Cancel</Link>
              </Button>
              {activeTab !== "fineprint" ? (
                <Button
                  type="button"
                  size="sm"
                  className="px-6 shadow-sm min-w-[140px]"
                  onClick={() => {
                    if (activeTab === "overview") setActiveTab("timeline");
                    else if (activeTab === "timeline") setActiveTab("fineprint");
                  }}
                  disabled={(activeTab === "overview" && !isOverviewComplete) || (activeTab === "timeline" && !isTimelineComplete)}
                >
                  <span className="flex items-center gap-2">
                    Next <ChevronRight className="w-4 h-4" />
                  </span>
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting || mutation.isPending}
                  size="sm"
                  className="px-6 shadow-sm min-w-[140px]"
                >
                  {isSubmitting || mutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Saving…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save className="w-3.5 h-3.5" />
                      {isNew ? "Create Journey" : "Save Changes"}
                    </span>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </AdminGuard>
  );
}
