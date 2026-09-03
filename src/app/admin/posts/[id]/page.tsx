"use client";

import { use, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPostById, createPost, updatePost } from "@/actions/posts";
import { createPostSchema } from "@repo/validators";
import { PageHeader } from "@/components/shared/page-header";
import { AdminGuard } from "@/components/layout/auth-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/shared/editor";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, Image as ImageIcon, Tag, Link as LinkIcon, AlertCircle } from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "@/components/shared/image-upload";

export const runtime = 'edge';

export default function AdminPostEditorPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const isNew = params.id === "new";
  const router = useRouter();
  const { toast } = useToast();
  const qc = useQueryClient();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      tag: "Planning",
      excerpt: "",
      content: "",
      image: "",
      readingTime: "5 min",
      published: true,
    },
  });

  const { data: post, isLoading } = useQuery({
    queryKey: ["admin", "posts", params.id],
    queryFn: async () => {
      if (isNew) return null;
      const res = await fetch(`/api/admin/posts/${params.id}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to load article");
      }
      return res.json();
    },
    enabled: !isNew,
  });

  useEffect(() => {
    if (post) {
      reset(post);
    }
  }, [post, reset]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const url = isNew ? "/api/admin/posts" : `/api/admin/posts/${params.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save article");
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "posts"] });
      toast({ title: isNew ? "Article created" : "Article updated" });
      router.push("/admin/posts");
    },
    onError: (err: any) => {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    },
  });

  const onSubmit = (data: any) => mutation.mutate(data);


  // Auto-slug from title
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title" && isNew) {
        const slug = value.title
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
        setValue("slug", slug || "");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, isNew]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-muted-foreground" /></div>;
  }

  const content = watch("content");

  return (
    <AdminGuard>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/posts"><ArrowLeft className="w-4 h-4" /></Link>
          </Button>
          <PageHeader 
            title={isNew ? "New Article" : "Edit Article"} 
            description="Craft your story with our rich text editor"
            className="mb-0 flex-1"
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 gap-8 pb-20">
          <div className="col-span-2 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label>Article Title <span className="text-destructive">*</span></Label>
              <Input 
                {...register("title")} 
                placeholder="e.g. 10 Best Hidden Waterfalls in Ella" 
                className="text-xl font-medium h-12"
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message as string}</p>}
            </div>

            {/* Rich Editor */}
            <div className="space-y-2">
              <Label>Content <span className="text-destructive">*</span></Label>
              <RichTextEditor 
                content={content} 
                onChange={(val) => setValue("content", val)} 
                placeholder="Tell your story..."
              />
              {errors.content && <p className="text-xs text-destructive">{errors.content.message as string}</p>}
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            <div className="p-6 border border-border rounded-lg bg-card space-y-6">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Post Settings</h3>
              
              <div className="flex items-center justify-between">
                <Label>Publish Article</Label>
                <Switch 
                  checked={watch("published")} 
                  onCheckedChange={(val) => setValue("published", val)} 
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2"><LinkIcon className="w-3.5 h-3.5" /> Slug <span className="text-destructive">*</span></Label>
                <Input {...register("slug")} placeholder="hidden-waterfalls-ella" className="h-8 text-xs" />
                {errors.slug && <p className="text-xs text-destructive">{errors.slug.message as string}</p>}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Tag className="w-3.5 h-3.5" /> Category / Tag <span className="text-destructive">*</span></Label>
                <Input {...register("tag")} placeholder="Adventure" className="h-8 text-xs" />
                {errors.tag && <p className="text-xs text-destructive">{errors.tag.message as string}</p>}
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2"><ImageIcon className="w-3.5 h-3.5" /> Feature Image <span className="text-destructive">*</span></Label>
                <ImageUpload
                  value={watch("image")}
                  onChange={(url) => setValue("image", url, { shouldValidate: true })}
                  onRemove={() => setValue("image", "", { shouldValidate: true })}
                  label="Upload Feature Image"
                />
                {errors.image && <p className="text-xs text-destructive">{errors.image.message as string}</p>}
              </div>

              <div className="space-y-2">
                <Label>Reading Time <span className="text-destructive">*</span></Label>
                <Input {...register("readingTime")} placeholder="5 min" className="h-8 text-xs" />
                {errors.readingTime && <p className="text-xs text-destructive">{errors.readingTime.message as string}</p>}
              </div>

              <div className="space-y-2">
                <Label>Excerpt (Short summary) <span className="text-destructive">*</span></Label>
                <Textarea {...register("excerpt")} rows={4} placeholder="A brief summary for the preview card..." className="text-xs" />
                {errors.excerpt && <p className="text-xs text-destructive">{errors.excerpt.message as string}</p>}
              </div>
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
                <Link href="/admin/posts">Cancel</Link>
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
                    {isNew ? "Publish Article" : "Save Changes"}
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
