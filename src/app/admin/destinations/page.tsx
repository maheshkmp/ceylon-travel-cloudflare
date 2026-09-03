"use client";

export const runtime = 'edge';

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDestinations, deleteDestination, reorderDestinations } from "@/actions/destinations";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { DeleteDialog } from "@/components/shared/delete-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminGuard } from "@/components/layout/auth-guard";
import { useToast } from "@/hooks/use-toast";
import { MoreHorizontal, Plus, Trash2, Edit2, GripVertical, MapPin } from "lucide-react";
import type { Destination } from "@repo/types";
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

function SortableDestinationItem({ 
  dest, 
  setDeleteTarget 
}: { 
  dest: Destination; 
  setDeleteTarget: any;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: dest.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: isDragging ? "relative" as const : "static" as const,
  };

  return (
    <div ref={setNodeRef} style={style} className={cn("group flex items-center gap-4 p-4 transition-colors bg-card hover:bg-muted/30 border-b border-border/50 last:border-0", isDragging && "shadow-xl ring-1 ring-border rounded-lg")}>
      <div 
        {...attributes} 
        {...listeners} 
        className="flex items-center justify-center cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing shrink-0"
      >
        <GripVertical className="w-5 h-5" />
      </div>

      <div className="w-16 h-16 rounded-md overflow-hidden bg-muted shrink-0 border border-border/50 relative">
        <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <Link href={`/admin/destinations/${dest.id}` as any} className="inline-block">
          <h3 className="font-semibold text-base text-foreground hover:text-brand transition-colors truncate">
            {dest.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-500">
            <MapPin className="w-3 h-3" /> {dest.region}
          </span>
          <span className="opacity-30">•</span>
          <span className="truncate">{dest.tagline}</span>
        </div>
      </div>

      <div className="shrink-0 text-sm font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded">
        Order: {dest.order}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem asChild>
            <Link href={`/admin/destinations/${dest.id}`}>
              <Edit2 className="w-3.5 h-3.5 mr-2" />
              Edit Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem destructive onSelect={() => setDeleteTarget(dest)}>
            <Trash2 className="w-3.5 h-3.5 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function AdminDestinationsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Destination | null>(null);
  
  const [items, setItems] = useState<Destination[]>([]);

  const { toast } = useToast();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "destinations", { page, search }],
    queryFn: async () => {
      const q = new URLSearchParams({ page: String(page), pageSize: "50" });
      if (search) q.set("search", search);
      const res = await fetch(`/api/admin/destinations?${q.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch destinations");
      const json = await res.json();
      return { data: json.data ?? [], pagination: json.meta };
    },
  });

  useEffect(() => {
    if (data?.data) {
      setItems(data.data);
    }
  }, [data]);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/destinations/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete destination");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "destinations"] });
      toast({ title: "Destination deleted" });
      setDeleteTarget(null);
    },
    onError: (err: any) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
  });

  const reorderMutation = useMutation({
    mutationFn: async (updates: { id: string; order: number }[]) => {
      const res = await fetch("/api/admin/destinations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to save order");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Order saved" });
    },
    onError: (err: any) => {
      toast({ title: "Failed to save order", description: err.message, variant: "destructive" });
      qc.invalidateQueries({ queryKey: ["admin", "destinations"] });
    },
  });

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Compute new orders
        const updates = newItems.map((item, index) => ({
          id: item.id,
          order: index,
        }));
        
        // Optimistic update of local state order values
        const updatedItems = newItems.map((item, index) => ({ ...item, order: index }));
        
        // Fire mutation
        reorderMutation.mutate(updates);
        
        return updatedItems;
      });
    }
  };

  return (
    <AdminGuard>
      <div className="space-y-8">
        <PageHeader title="Destinations" description="Manage iconic Sri Lankan locations and landmarks. Drag and drop to reorder how they appear on the landing page.">
          <Button asChild size="sm">
            <Link href="/admin/destinations/new">
              <Plus className="w-4 h-4 mr-1.5" />
              Add Destination
            </Link>
          </Button>
        </PageHeader>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">All Locations</h2>
            <SearchInput
              value={search}
              onChange={(v) => { setSearch(v); setPage(1); }}
              placeholder="Search locations…"
              className="w-56"
            />
          </div>
          
          <div className="border border-border/50 rounded-xl overflow-hidden bg-card/50">
            {isLoading ? (
              <div className="p-8 flex items-center justify-center text-muted-foreground animate-pulse">
                Loading destinations...
              </div>
            ) : items.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                No destinations found.
              </div>
            ) : (
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={items.map(i => i.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col">
                    {items.map((dest) => (
                      <SortableDestinationItem
                        key={dest.id}
                        dest={dest}
                        setDeleteTarget={setDeleteTarget}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </div>

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Remove Destination?"
        description={`This will permanently remove "${deleteTarget?.name}" from your listing.`}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        isLoading={deleteMutation.isPending}
      />
    </AdminGuard>
  );
}
