"use client";

export const runtime = 'edge';

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Plus, MoreHorizontal, Trash2, Edit,
  ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft,
  ChevronsRight, Heart, MessageSquare, FileText, User, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPosts, updatePost, deletePost } from "@/actions/posts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/page-header";

const CATEGORIES = ["Travel Tips", "Photography", "Culture", "Wildlife", "Food & Drink", "General"];

export default function AdminPostsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const qc = useQueryClient();

  const { data: postsData, isLoading } = useQuery({
    queryKey: ["admin", "posts"],
    queryFn: async () => {
      const res = await fetch("/api/admin/posts?page=1&pageSize=1000");
      if (!res.ok) throw new Error("Failed to fetch posts");
      const json = await res.json();
      return json.data || [];
    },
  });

  const posts = useMemo(() => {
    const raw = postsData || [];
    return raw.map((p: any) => ({
      id: p.id,
      title: p.title,
      subtitle: p.excerpt || "",
      content: p.content,
      category: p.tag || "General",
      readTime: p.readingTime || "5 min read",
      date: p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
      createdAt: p.createdAt,
      status: p.published ? "published" : "draft",
      published: p.published,
      claps: 0,
      commentsCount: 0,
      author: { name: "Ceylon Travels Team", avatar: "" },
      imageUrl: p.image || "",
    }));
  }, [postsData]);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "posts"] });
      toast({ title: "Status updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete post");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "posts"] });
      toast({ title: "Post deleted" });
    },
  });

  const filteredPosts = useMemo(() => {
    let result = posts.filter((p: any) => {
      const q = search.toLowerCase();
      const matchesSearch = !q || p.title.toLowerCase().includes(q) || p.author.name.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });

    result.sort((a: any, b: any) => {
      if (sortBy === "date") return sortOrder === "desc"
        ? new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime()
        : new Date(a.createdAt || a.date).getTime() - new Date(b.createdAt || b.date).getTime();
      if (sortBy === "claps") return sortOrder === "desc" ? b.claps - a.claps : a.claps - b.claps;
      if (sortBy === "title") return sortOrder === "desc" ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [posts, search, statusFilter, categoryFilter, sortBy, sortOrder]);

  const paginatedPosts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredPosts.slice(start, start + pageSize);
  }, [filteredPosts, page, pageSize]);

  const totalPages = Math.ceil(filteredPosts.length / pageSize) || 1;

  const stats = useMemo(() => ({
    total: posts.length,
    published: posts.filter((p: any) => p.status === "published").length,
    drafts: posts.filter((p: any) => p.status === "draft").length,
    claps: posts.reduce((sum: number, p: any) => sum + p.claps, 0)
  }), [posts]);


  const handleSort = (field: string) => {
    if (sortBy === field) setSortOrder(s => s === "asc" ? "desc" : "asc");
    else { setSortBy(field); setSortOrder("desc"); }
    setPage(1);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, published: newStatus === "published" });
  };

  const handleDeletePost = (id: string) => {
    deleteMutation.mutate(id);
  };

  const SortIcon = ({ active }: { active: boolean }) => (
    <ArrowUpDown className={cn("w-3.5 h-3.5", active ? "text-foreground" : "text-muted-foreground/50")} />
  );

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-24 px-4 sm:px-6 pt-6">
      <PageHeader title="Posts" description="Create and manage blog posts">
        <Button onClick={() => router.push("/admin/posts/new")}>
          <Plus className="w-4 h-4 mr-2" /> New Post
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Posts" value={stats.total} isLoading={isLoading} />
        <StatCard label="Published" value={stats.published} isLoading={isLoading} />
        <StatCard label="Drafts" value={stats.drafts} isLoading={isLoading} />
        <StatCard label="Total Claps" value={stats.claps} isLoading={isLoading} />
      </div>

      <div className="rounded-lg border border-border bg-card p-4 space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="h-9 rounded-md border border-border bg-background px-3 text-sm"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
              className="h-9 rounded-md border border-border bg-background px-3 text-sm"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <th onClick={() => handleSort("title")} className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <span className="flex items-center gap-1.5">Post <SortIcon active={sortBy === "title"} /></span>
                </th>
                <th className="p-4">Author</th>
                <th onClick={() => handleSort("claps")} className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <span className="flex items-center gap-1.5">Engagement <SortIcon active={sortBy === "claps"} /></span>
                </th>
                <th onClick={() => handleSort("date")} className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <span className="flex items-center gap-1.5">Date <SortIcon active={sortBy === "date"} /></span>
                </th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground/60" />
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-muted-foreground">
                    <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground/60" />
                    <p className="font-medium">No posts yet</p>
                    <p className="text-sm mt-1">Create your first post to get started.</p>
                  </td>
                </tr>
              ) : (
                paginatedPosts.map((p: any) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {p.imageUrl && (
                          <div className="w-14 h-9 rounded-md overflow-hidden shrink-0 border border-border bg-muted">
                            <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-medium text-sm text-foreground truncate max-w-[340px]">{p.title}</h4>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                            <span>{p.category}</span>
                            <span>·</span>
                            <span>{p.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                        <span className="text-sm text-foreground">{p.author.name}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-0.5 text-sm">
                        <p className="flex items-center gap-1.5 text-foreground">
                          <Heart className="w-3.5 h-3.5 text-muted-foreground" /> {p.claps}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5" /> {p.commentsCount}
                        </p>
                      </div>
                    </td>

                    <td className="p-4 text-sm text-muted-foreground">{p.date}</td>

                    <td className="p-4">
                      <select
                        value={p.status}
                        onChange={(e) => handleStatusChange(p.id, e.target.value)}
                        className={cn(
                          "h-7 px-2 rounded-md border text-xs font-medium cursor-pointer transition-colors",
                          p.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800"
                            : "bg-muted text-muted-foreground border-border"
                        )}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </td>

                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => router.push(`/admin/posts/${p.id}`)}>
                            <Edit className="w-3.5 h-3.5 mr-2 text-muted-foreground" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={() => handleDeletePost(p.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredPosts.length > 0 && (
          <div className="border-t border-border p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {Math.min(filteredPosts.length, (page - 1) * pageSize + 1)} to{" "}
              {Math.min(filteredPosts.length, page * pageSize)} of {filteredPosts.length}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                  className="h-8 rounded-md border border-border bg-background px-2 text-sm"
                >
                  {[5, 10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPage(1)} disabled={page === 1}>
                  <ChevronsLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={page === i + 1 ? "default" : "ghost"}
                    className="h-8 w-8 text-sm p-0"
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPage(totalPages)} disabled={page === totalPages}>
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
