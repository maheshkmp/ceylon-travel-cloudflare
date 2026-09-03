"use client";

export const runtime = 'edge';

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInquiries, updateInquiryStatus } from "@/actions/inquiries";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { AdminGuard } from "@/components/layout/auth-guard";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { 
  MoreHorizontal, Mail, Phone, Calendar, Users, Eye, 
  Heart, TreePine, Sparkles, Palmtree, Milestone, Compass, DollarSign, Clock
} from "lucide-react";
import { format } from "date-fns";

const formatArrivalDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "Flexible";
  const parsed = Date.parse(dateStr);
  if (isNaN(parsed)) {
    return dateStr;
  }
  return format(new Date(dateStr), "MMM d, yyyy");
};

const STYLE_ICONS: Record<string, any> = {
  Honeymoon: Heart,
  Wildlife: TreePine,
  Luxury: Sparkles,
  Surfing: Palmtree,
  Culture: Milestone,
  Adventure: Compass,
};

export default function AdminInquiriesPage() {
  const [page, setPage] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "inquiries", { page }],
    queryFn: async () => {
      const res = await fetch(`/api/admin/inquiries?page=${page}&pageSize=20`);
      if (!res.ok) throw new Error("Failed to fetch inquiries");
      const json = await res.json();
      return { data: json.data ?? [], pagination: json.meta };
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "inquiries"] });
      toast({ title: "Inquiry status updated" });
    },
    onError: (err: any) => toast({ title: "Failed to update", description: err.message, variant: "destructive" }),
  });

  const statusColors: Record<string, string> = {
    new: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    contacted: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    quoted: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    booked: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    lost: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  };

  const columns: Column<any>[] = [
    {
      key: "name",
      header: "Traveler",
      cell: (inq) => (
        <div className="flex flex-col cursor-pointer" onClick={() => setSelectedInquiry(inq)}>
          <span className="font-semibold text-sm text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1.5">
            {inq.name}
            {inq.status === "new" && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />}
          </span>
          <span className="text-xs text-muted-foreground">{inq.email}</span>
          {inq.nationality && (
            <span className="text-[11px] font-medium text-slate-600 mt-0.5">{inq.nationality}</span>
          )}
        </div>
      ),
    },
    {
      key: "details",
      header: "Journey Details",
      cell: (inq) => (
        <div className="flex flex-col gap-1 cursor-pointer" onClick={() => setSelectedInquiry(inq)}>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar size={12}/> {formatArrivalDate(inq.arrivalDate)}</span>
            <span className="flex items-center gap-1"><Users size={12}/> {inq.travelers} pax</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {inq.style && (
              <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 font-bold uppercase tracking-wider bg-blue-50 text-blue-700 hover:bg-blue-50 border-none shrink-0">
                {inq.style}
              </Badge>
            )}
            {inq.interests?.slice(0, 2).map((it: string) => (
              <span key={it} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground italic">{it}</span>
            ))}
            {inq.interests?.length > 2 && <span className="text-[10px] text-muted-foreground">+{inq.interests.length - 2}</span>}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (inq) => (
        <Badge variant="outline" className={cn("capitalize px-2 py-0 h-5 text-[10px] font-semibold", statusColors[inq.status])}>
          {inq.status}
        </Badge>
      ),
    },
    {
      key: "date",
      header: "Received",
      cell: (inq) => <span className="text-xs text-muted-foreground">{format(new Date(inq.createdAt), "MMM d, yyyy")}</span>,
    },
    {
      key: "actions",
      header: "",
      width: "48px",
      cell: (inq) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Manage Inquiry</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setSelectedInquiry(inq)}>
              <Eye className="w-3.5 h-3.5 mr-2" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.open(`mailto:${inq.email}`)}>
              <Mail className="w-3.5 h-3.5 mr-2" /> Email Traveler
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.open(`https://wa.me/${inq.whatsapp.replace(/\D/g, "")}`)}>
              <Phone className="w-3.5 h-3.5 mr-2" /> WhatsApp
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground">Update Status</DropdownMenuLabel>
            {["contacted", "quoted", "booked", "lost"].map(s => (
              <DropdownMenuItem key={s} onClick={() => updateStatusMutation.mutate({ id: inq.id, status: s })}>
                <div className={cn("w-2 h-2 rounded-full mr-2", statusColors[s]?.split(" ")[1]?.replace("text-", "bg-"))} />
                Mark as {s}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <AdminGuard>
      <div className="space-y-8">
        <PageHeader 
          title="Inquiries & Leads" 
          description="Manage incoming travel requests and convert them into bookings"
        />

        <div className="border border-border rounded-lg bg-card overflow-hidden">
          <DataTable
            columns={columns}
            data={data?.data ?? []}
            pagination={data?.pagination}
            isLoading={isLoading}
            onPageChange={setPage}
            rowKey={(inq) => inq.id}
          />
        </div>

        {/* View Details Dialog */}
        <Dialog open={selectedInquiry !== null} onOpenChange={(open) => { if (!open) setSelectedInquiry(null); }}>
          <DialogContent className="max-w-xl p-6 sm:p-8">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <DialogTitle className="text-xl font-bold text-slate-900">Inquiry Details</DialogTitle>
                {selectedInquiry && (
                  <Badge variant="outline" className={cn("capitalize text-[10px] px-2 py-0.5", statusColors[selectedInquiry.status])}>
                    {selectedInquiry.status}
                  </Badge>
                )}
              </div>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Received on {selectedInquiry && format(new Date(selectedInquiry.createdAt), "MMMM d, yyyy 'at' h:mm a")}
              </DialogDescription>
            </DialogHeader>

            {selectedInquiry && (
              <div className="space-y-6 mt-6">
                
                {/* Section 1: Traveler Details */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</span>
                    <span className="text-sm font-semibold text-slate-900">{selectedInquiry.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">WhatsApp / Phone</span>
                    <a href={`https://wa.me/${selectedInquiry.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3.5 h-3.5 shrink-0" /> {selectedInquiry.whatsapp}
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                    <a href={`mailto:${selectedInquiry.email}`} className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5 shrink-0" /> {selectedInquiry.email}
                    </a>
                  </div>
                  {selectedInquiry.nationality && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nationality</span>
                      <span className="text-sm font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                        {selectedInquiry.nationality}
                      </span>
                    </div>
                  )}
                </div>

                {/* Section 2: Journey Specifics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="flex gap-2.5 items-start">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Arrival</span>
                      <span className="text-xs font-semibold text-slate-800">{formatArrivalDate(selectedInquiry.arrivalDate)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration</span>
                      <span className="text-xs font-semibold text-slate-800">{selectedInquiry.duration} Days</span>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Users className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Travelers</span>
                      <span className="text-xs font-semibold text-slate-800">{selectedInquiry.travelers} pax</span>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <DollarSign className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Budget</span>
                      <span className="text-xs font-semibold text-slate-800">{selectedInquiry.budget}</span>
                    </div>
                  </div>

                  {selectedInquiry.style && (
                    <div className="flex gap-2.5 items-start col-span-2">
                      {(() => {
                        const Icon = STYLE_ICONS[selectedInquiry.style] || Compass;
                        return <Icon className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />;
                      })()}
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Trip Style</span>
                        <span className="text-xs font-semibold text-slate-800">{selectedInquiry.style}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 3: Interests */}
                {selectedInquiry.interests && selectedInquiry.interests.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Interests</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedInquiry.interests.map((interest: string) => (
                        <span key={interest} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium border border-slate-200/50">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 4: Special Notes / Message */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Special Requests</span>
                  <div className="bg-slate-50 border-l-4 border-blue-500 rounded-r-xl p-3.5 text-xs md:text-sm text-slate-700 italic leading-relaxed whitespace-pre-wrap">
                    "{selectedInquiry.message}"
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">Update Status</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      {["new", "contacted", "quoted", "booked", "lost"].map(s => (
                        <DropdownMenuItem key={s} onClick={() => updateStatusMutation.mutate({ id: selectedInquiry.id, status: s })}>
                          <div className={cn("w-2 h-2 rounded-full mr-2", statusColors[s]?.split(" ")[1]?.replace("text-", "bg-"))} />
                          Mark as {s}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button variant="default" size="sm" onClick={() => window.open(`mailto:${selectedInquiry.email}`)}>
                    <Mail className="w-3.5 h-3.5 mr-1.5" /> Email Traveler
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => window.open(`https://wa.me/${selectedInquiry.whatsapp.replace(/\D/g, "")}`)}>
                    <Phone className="w-3.5 h-3.5 mr-1.5" /> Open WhatsApp
                  </Button>
                </div>

              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminGuard>
  );
}
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
