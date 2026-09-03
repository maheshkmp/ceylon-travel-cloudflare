"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, FileText, Eye, Image as ImageIcon, Clock, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/shared/editor";
import { useToast } from "@/hooks/use-toast";

export interface Post {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  category: string;
  readTime: string;
  date: string;
  status: "published" | "draft";
  claps: number;
  author: { name: string; avatar: string };
  imageUrl: string;
  commentsCount: number;
}

export const CATEGORIES = ["Coding", "Design", "Economics", "Life"];

export function generateId() {
  return `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function estimateReadTime(content: string) {
  const text = content.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export function getPosts(): Post[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("cf-posts") || "[]");
  } catch {
    return [];
  }
}

export function savePosts(posts: Post[]) {
  localStorage.setItem("cf-posts", JSON.stringify(posts));
}

interface PostEditorProps {
  post?: Post;
  mode: "create" | "edit";
}

export function PostEditor({ post, mode }: PostEditorProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [title, setTitle] = useState(post?.title || "");
  const [subtitle, setSubtitle] = useState(post?.subtitle || "");
  const [content, setContent] = useState(post?.content || "");
  const [author, setAuthor] = useState(post?.author.name || "");
  const [category, setCategory] = useState(post?.category || "Coding");
  const [imageUrl, setImageUrl] = useState(post?.imageUrl || "");
  const [status, setStatus] = useState<"draft" | "published">(post?.status || "draft");

  const readTime = estimateReadTime(content);

  const handleSave = useCallback((publishStatus: "draft" | "published") => {
    if (!title.trim()) {
      toast({ title: "Validation error", description: "Title is required", variant: "destructive" });
      return;
    }

    const now = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const posts = getPosts();

    const updated: Post = {
      id: post?.id || generateId(),
      title: title.trim(),
      subtitle: subtitle.trim() || "No subtitle",
      content,
      category,
      readTime,
      date: post?.date || now,
      status: publishStatus,
      claps: post?.claps || 0,
      author: { name: author.trim() || "Anonymous", avatar: "" },
      imageUrl: imageUrl.trim(),
      commentsCount: post?.commentsCount || 0,
    };

    if (mode === "edit") {
      const idx = posts.findIndex(p => p.id === post?.id);
      if (idx >= 0) posts[idx] = updated;
    } else {
      posts.unshift(updated);
    }

    savePosts(posts);
    toast({ title: mode === "edit" ? "Post updated" : "Post created" });
    router.push("/admin/posts");
  }, [title, subtitle, content, category, readTime, author, imageUrl, status, post, mode, router, toast]);

  return (
    <div className="max-w-[1400px] mx-auto pb-24 px-4 sm:px-6 pt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full w-10 h-10">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-foreground tracking-tight">
              {mode === "create" ? "New Post" : "Edit Post"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "create" ? "Create a new blog post" : "Update your blog post"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={() => handleSave("draft")}>
            <Save className="w-4 h-4 mr-2" /> Save Draft
          </Button>
          <Button onClick={() => handleSave("published")}>
            <FileText className="w-4 h-4 mr-2" /> Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <Input
              placeholder="Post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold border-0 px-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/40"
            />
            <Input
              placeholder="Add a subtitle..."
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="text-base border-0 px-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/40"
            />
          </div>

          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing..."
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-5 space-y-5">
            <h3 className="text-sm font-semibold text-foreground">Post Settings</h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Author
                </Label>
                <Input
                  placeholder="Author name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Category
                </Label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" /> Cover Image URL
                </Label>
                <Input
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                {imageUrl && (
                  <div className="mt-2 rounded-md overflow-hidden border border-border">
                    <img src={imageUrl} alt="Cover preview" className="w-full h-28 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Read Time
                </Label>
                <div className="h-10 rounded-md border border-border bg-muted/50 px-3 flex items-center text-sm text-muted-foreground">
                  {readTime}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Status</Label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                  className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
          </div>

          <Button className="w-full" onClick={() => handleSave(status)}>
            {status === "published" ? <Eye className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {status === "published" ? "Publish Now" : "Save as Draft"}
          </Button>
        </div>
      </div>
    </div>
  );
}
