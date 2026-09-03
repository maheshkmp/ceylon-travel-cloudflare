"use client";

import { use, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDestinationById, createDestination, updateDestination } from "@/actions/destinations";
import { createDestinationSchema } from "@repo/validators";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminGuard } from "@/components/layout/auth-guard";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Camera, MapPin, Globe, Loader2, Image as ImageIcon, Eye, AlertCircle } from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "@/components/shared/image-upload";
import { RichTextEditor } from "@/components/shared/editor";
import { cn } from "@/lib/utils";

export const runtime = 'edge';

export default function EditDestinationPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const isNew = params.id === "new";
  const router = useRouter();
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: destination, isLoading: isFetching } = useQuery({
    queryKey: ["admin", "destinations", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/admin/destinations/${params.id}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to load destination");
      }
      return res.json();
    },
    enabled: !isNew,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm({
    resolver: zodResolver(createDestinationSchema),
    defaultValues: {
      name: "",
      slug: "",
      region: "",
      image: "",
      tagline: "",
      description: "",
      featured: true,
      order: 0,
    },
  });

  const [imageUrl, nameVal, taglineVal, regionVal, descriptionVal] = watch(["image", "name", "tagline", "region", "description"]);

  // Auto-slug generator
  useEffect(() => {
    if (isNew && nameVal && !dirtyFields.slug) {
      const generatedSlug = nameVal
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [nameVal, isNew, dirtyFields.slug, setValue]);

  useEffect(() => {
    if (destination) {
      const data = (destination as any).data || destination;
      reset({
        ...data,
        description: data.description || "",
      });
    }
  }, [destination, reset]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const url = isNew ? "/api/admin/destinations" : `/api/admin/destinations/${params.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save destination");
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "destinations"] });
      toast({ title: isNew ? "Destination created" : "Destination updated" });
      router.push("/admin/destinations");
    },
    onError: (err: any) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
  });

  if (isFetching) return <div className="p-12 text-center text-muted-foreground flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading location details...</div>;

  return (
    <AdminGuard>
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="shrink-0" asChild>
              <Link href="/admin/destinations"><ArrowLeft size={18}/></Link>
            </Button>
            <PageHeader 
              title={isNew ? "Add Destination" : "Edit Destination"} 
              description="Manage iconic landmarks and featured locations"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Content - Left side (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Core Details Card */}
            <Card className="shadow-sm border-border/50">
              <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand" /> Core Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Location Name <span className="text-destructive">*</span></Label>
                    <Input 
                      {...register("name")} 
                      placeholder="e.g. Sigiriya Rock" 
                      className={cn(errors.name && "border-destructive focus-visible:ring-destructive")} 
                    />
                    {errors.name && <p className="text-[11px] text-destructive font-medium">{errors.name.message as string}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>URL Slug <span className="text-destructive">*</span></Label>
                    <Input 
                      {...register("slug")} 
                      placeholder="e.g. sigiriya-rock" 
                      className={cn("bg-muted/30 font-mono text-sm", errors.slug && "border-destructive focus-visible:ring-destructive")} 
                    />
                    {errors.slug && <p className="text-[11px] text-destructive font-medium">{errors.slug.message as string}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Region <span className="text-destructive">*</span></Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input 
                        {...register("region")} 
                        className={cn("pl-9", errors.region && "border-destructive focus-visible:ring-destructive")} 
                        placeholder="e.g. Cultural Triangle" 
                      />
                    </div>
                    {errors.region && <p className="text-[11px] text-destructive font-medium">{errors.region.message as string}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tagline (Short Teaser) <span className="text-destructive">*</span></Label>
                    <Input 
                      {...register("tagline")} 
                      placeholder="e.g. The 8th Wonder of the World" 
                      className={cn(errors.tagline && "border-destructive focus-visible:ring-destructive")} 
                    />
                    {errors.tagline && <p className="text-[11px] text-destructive font-medium">{errors.tagline.message as string}</p>}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Label>Description</Label>
                  <RichTextEditor
                    content={descriptionVal || ""}
                    onChange={(val) => setValue("description", val, { shouldValidate: true })}
                    placeholder="Write a captivating description of this destination..."
                  />
                  {errors.description && <p className="text-[11px] text-destructive font-medium">{errors.description.message as string}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Media Card */}
            <Card className="shadow-sm border-border/50">
              <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Camera className="w-4 h-4 text-brand" /> Media
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Label>Cover Image <span className="text-destructive">*</span></Label>
                  <p className="text-xs text-muted-foreground mb-4">High resolution image (at least 1200x800px) that represents the destination.</p>
                  <ImageUpload
                    value={imageUrl}
                    onChange={(url) => setValue("image", url, { shouldValidate: true })}
                    onRemove={() => setValue("image", "", { shouldValidate: true })}
                    label="Upload Destination Cover"
                  />
                  {errors.image && <p className="text-[11px] text-destructive font-medium">{errors.image.message as string}</p>}
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Sidebar - Preview & Settings */}
          <div className="space-y-6">
            
            {/* Display Settings Card */}
            <Card className="shadow-sm border-border/50">
              <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
                <CardTitle className="text-base font-semibold">Display Settings</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-start space-x-3 p-3 rounded-md border border-border/50 bg-muted/20">
                  <input
                    type="checkbox"
                    id="featured"
                    {...register("featured")}
                    className="w-4 h-4 mt-0.5 rounded border-gray-300 text-brand focus:ring-brand"
                  />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="featured" className="cursor-pointer font-medium">Feature on Landing Page</Label>
                    <p className="text-xs text-muted-foreground">This destination will appear in the main slider on the homepage.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Display Order</Label>
                  <Input {...register("order", { valueAsNumber: true })} type="number" min={0} />
                  <p className="text-xs text-muted-foreground">Lower numbers appear first in the list.</p>
                </div>
              </CardContent>
            </Card>

            {/* Live Preview Card */}
            <div className="sticky top-6">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-muted-foreground">
                <Eye className="w-4 h-4" /> Live Preview
              </h3>
              
              <div className="flex-none w-full max-w-[280px] mx-auto h-[360px] relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/50 group/card bg-slate-900">
                {imageUrl ? (
                  <img
                    src={imageUrl} 
                    alt="Preview" 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 bg-slate-800">
                    <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                    <span className="text-xs font-medium uppercase tracking-widest opacity-60">No Image</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-slate-950/20 group-hover/card:bg-transparent transition-colors duration-500" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,8,0.9) 0%, rgba(10,10,8,0.2) 60%, transparent 100%)" }} />
                
                {regionVal && (
                  <div className="absolute top-4 left-4 z-10">
                    <div className="px-2.5 py-1 rounded-sm bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-sm">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span className="text-[9px] font-bold text-white uppercase tracking-[0.15em]">{regionVal}</span>
                    </div>
                  </div>
                )}

                <div className="absolute bottom-5 left-5 right-5 z-10 transition-transform duration-500 group-hover/card:-translate-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-white text-xl tracking-tight whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontFamily: "var(--font-serif)" }}>
                      {nameVal || "Destination Name"}
                    </h3>
                  </div>
                  <p className="text-white/70 text-[11px] leading-relaxed opacity-100 max-h-[60px] overflow-hidden transition-all duration-500">
                    {taglineVal || "Add a catchy tagline to hook viewers."}
                  </p>
                </div>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-4">This is how the card will look on the public destinations slider.</p>
            </div>

            </div>
          </div>

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
              <Link href="/admin/destinations">Cancel</Link>
            </Button>
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
                  {isNew ? "Publish Destination" : "Save Changes"}
                </span>
              )}
            </Button>
          </div>
        </div>
      </form>
      </div>
    </AdminGuard>
  );
}
