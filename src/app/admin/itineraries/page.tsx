"use client";

export const runtime = 'edge';

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getItineraries, createItinerary, deleteItinerary, reorderItineraries, updateItineraryStatus } from "@/actions/itineraries";
import { SearchInput } from "@/components/shared/search-input";
import { DeleteDialog } from "@/components/shared/delete-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { AdminGuard } from "@/components/layout/auth-guard";
import { useToast } from "@/hooks/use-toast";
import { 
  MoreVertical, Plus, Trash2, Edit2, ExternalLink, 
  Copy, Star, Eye, Calendar, Clock, ChevronLeft, ChevronRight, GripVertical
} from "lucide-react";
import type { Itinerary } from "@repo/types";
import Link from "next/link";
import { cn } from "@/lib/utils";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function ItinerarySkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-6 p-6 border-b border-border/50 animate-pulse">
      <div className="w-full sm:w-48 h-32 bg-muted rounded-lg shrink-0" />
      <div className="flex-1 space-y-4 py-2">
        <div className="h-5 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-1/4" />
        <div className="flex gap-2 pt-2">
          <div className="h-6 bg-muted rounded-full w-16" />
          <div className="h-6 bg-muted rounded-full w-16" />
        </div>
      </div>
    </div>
  );
}

function SortableItineraryItem({ 
  it, 
  deleteMutation, 
  duplicateMutation, 
  setDeleteTarget 
}: { 
  it: Itinerary; 
  deleteMutation: any; 
  duplicateMutation: any; 
  setDeleteTarget: any;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: it.id });
  
  const qc = useQueryClient();
  const { toast } = useToast();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: isDragging ? "relative" as const : "static" as const,
  };

  const statusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const res = await fetch(`/api/admin/itineraries/${it.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update status");
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "itineraries"] });
      toast({ title: "Status updated" });
    },
    onError: (err: any) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
  });

  const isPublished = (it as any).status === "published";

  return (
    <div ref={setNodeRef} style={style} className={cn("group flex flex-col sm:flex-row gap-6 p-6 transition-colors bg-card hover:bg-muted/30 border-b border-border/50 last:border-0", isDragging && "shadow-xl ring-1 ring-border rounded-lg")}>
      <div 
        {...attributes} 
        {...listeners} 
        className="flex flex-col items-center justify-center cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing shrink-0 sm:pr-2"
      >
        <GripVertical className="w-5 h-5" />
      </div>

      {/* Hero Image */}
      <div className="relative w-full sm:w-48 h-32 rounded-lg overflow-hidden bg-muted border border-border/50 shrink-0">
        <img 
          src={it.heroImg} 
          alt={it.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        {it.tags?.includes("Featured") && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-yellow-500 text-white rounded text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
            <Star className="w-2.5 h-2.5 fill-white" /> Featured
          </div>
        )}
      </div>

      {/* Core Content */}
      <div className="flex-1 flex flex-col min-w-0 py-1 justify-between">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Link href={`/admin/itineraries/${it.id}` as any} className="inline-block">
                <h3 className="font-semibold text-lg text-foreground hover:text-brand transition-colors line-clamp-1">
                  {it.title}
                </h3>
              </Link>
              <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5" /> {it.duration}
                </span>
                <span className="opacity-30">•</span>
                <span className="font-semibold text-foreground">
                  {it.price}
                </span>
              </div>
            </div>
            
            {/* Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 -mr-2 h-8 w-8 text-muted-foreground hover:text-foreground">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={`/admin/itineraries/${it.id}` as any}>
                    <Edit2 className="w-4 h-4 mr-2 text-muted-foreground" /> Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onSelect={() => duplicateMutation.mutate(it)}>
                  <Copy className="w-4 h-4 mr-2 text-muted-foreground" /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={`/itinerary/${it.slug}`} target="_blank">
                    <ExternalLink className="w-4 h-4 mr-2 text-muted-foreground" /> View Public
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50" onSelect={() => setDeleteTarget(it)}>
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="mt-3 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => statusMutation.mutate(isPublished ? "draft" : "published")}
              className={cn(
                "h-6 text-[10px] uppercase tracking-wider px-2", 
                isPublished 
                  ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
              disabled={statusMutation.isPending}
            >
              {isPublished ? (
                <><Eye className="w-3 h-3 mr-1.5 opacity-70" /> Published</>
              ) : (
                "Draft"
              )}
            </Button>
            <code className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded border border-border/50">
              /{it.slug}
            </code>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs font-medium text-foreground mr-2">{it.travelStyle}</span>
            {it.tags?.slice(0, 3).map(tag => (
              <span key={tag} className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1.5 shrink-0">
            <Calendar className="w-3.5 h-3.5 opacity-60" />
            {new Date(it.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminItinerariesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Itinerary | null>(null);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "itineraries", { page, search }],
    queryFn: async () => {
      const q = new URLSearchParams({ page: String(page), pageSize: "10" });
      if (search) q.set("search", search);
      const res = await fetch(`/api/admin/itineraries?${q.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch itineraries");
      const json = await res.json();
      return { 
        data: json.data ?? [], 
        pagination: json.meta 
      };
    },
  });

  const [items, setItems] = useState<Itinerary[]>([]);

  useEffect(() => {
    if (data?.data) {
      setItems(data.data);
    }
  }, [data?.data]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const reorderMutation = useMutation({
    mutationFn: async (updates: {id: string, order: number}[]) => {
      const res = await fetch("/api/admin/itineraries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to reorder itineraries");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "itineraries"] });
      toast({ title: "Order updated" });
    },
    onError: (err: any) => toast({ title: "Failed to reorder", description: err.message, variant: "destructive" }),
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        const updates = newItems.map((item, index) => ({
          id: item.id,
          order: (page - 1) * 10 + index, 
        }));
        
        reorderMutation.mutate(updates);
        return newItems;
      });
    }
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/itineraries/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete itinerary");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "itineraries"] });
      toast({ title: "Itinerary deleted" });
      setDeleteTarget(null);
    },
    onError: (err: any) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
  });

  const duplicateMutation = useMutation({
    mutationFn: async (it: Itinerary) => {
      const { id, createdAt, updatedAt, ...rest } = it;
      const res = await fetch("/api/admin/itineraries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...rest,
          title: `${rest.title} (Copy)`,
          slug: `${rest.slug}-copy-${Math.floor(Math.random() * 1000)}`,
        }),
      });
      if (!res.ok) throw new Error("Failed to duplicate itinerary");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "itineraries"] });
      toast({ title: "Itinerary duplicated", description: "A copy has been created successfully." });
    },
    onError: (err: any) => toast({ title: "Duplication failed", description: err.message, variant: "destructive" }),
  });

  return (
    <AdminGuard>
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Itinerary Management</h1>
            <p className="text-muted-foreground">
              Manage your premium travel products, journey timelines, and pricing.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <SearchInput
              value={search}
              onChange={(v) => { setSearch(v); setPage(1); }}
              placeholder="Search journeys..."
              className="w-full md:w-64"
            />
            <Button asChild className="shrink-0 shadow-sm">
              <Link href="/admin/itineraries/new">
                <Plus className="w-4 h-4 mr-1.5" />
                New Journey
              </Link>
            </Button>
          </div>
        </div>

        {/* List View Container */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
          <div className="bg-muted/30 border-b border-border px-6 py-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Inventory List</h2>
            <Badge variant="secondary" className="font-normal text-xs">
              {data?.pagination?.total ?? 0} total journeys
            </Badge>
          </div>
          
          <div className="flex flex-col">
            {isLoading ? (
              <div className="divide-y divide-border flex flex-col">
                {Array.from({ length: 5 }).map((_, i) => <ItinerarySkeleton key={i} />)}
              </div>
            ) : items.length === 0 ? (
              <div className="px-6 py-20 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground">No itineraries found</h3>
                <p className="text-muted-foreground text-sm mt-1 max-w-sm">
                  Get started by creating your first journey or try adjusting your search filters.
                </p>
                <Button asChild variant="outline" className="mt-6">
                  <Link href="/admin/itineraries/new">Create Itinerary</Link>
                </Button>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={items.map(it => it.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col relative w-full bg-card">
                    {items.map((it: Itinerary) => (
                      <SortableItineraryItem 
                        key={it.id} 
                        it={it} 
                        deleteMutation={deleteMutation}
                        duplicateMutation={duplicateMutation}
                        setDeleteTarget={setDeleteTarget}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
          
          {/* Custom Pagination */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="border-t border-border bg-muted/10 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{Math.min((page - 1) * 10 + 1, data.pagination.total)}</span> to <span className="font-medium text-foreground">{Math.min(page * 10, data.pagination.total)}</span> of <span className="font-medium text-foreground">{data.pagination.total}</span> itineraries
              </p>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!data.pagination.hasPrev}
                  className="h-8 shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <div className="text-sm font-medium text-foreground px-2">
                  Page {page} of {data.pagination.totalPages}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
                  disabled={!data.pagination.hasNext}
                  className="h-8 shadow-sm"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Itinerary?"
        description={`This will permanently delete "${deleteTarget?.title}". All associated stop data will be lost. This action cannot be undone.`}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        isLoading={deleteMutation.isPending}
      />
    </AdminGuard>
  );
}
