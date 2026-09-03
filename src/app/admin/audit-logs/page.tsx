"use client";

export const runtime = 'edge';

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import {
  Search, Shield, Clock, Eye, Download,
  AlertTriangle, CheckCircle2, XCircle, ArrowUpDown,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  RefreshCw, Loader2, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/page-header";
import { getAuditLogs, getAuditLogStats } from "@/actions/audit-logs";
import type { AuditLog, AuditLogStats } from "@repo/types";

function formatTimeAgo(isoString: string) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.round(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.round(diffHrs / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return new Date(isoString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatDate(isoString: string) {
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function AuditLogsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const queryParams = useMemo(() => ({
    page,
    pageSize,
    search: search || undefined,
    resource: resourceFilter !== "all" ? resourceFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  }), [page, pageSize, search, resourceFilter, statusFilter]);

  const { data: logsRes, isLoading } = useQuery({
    queryKey: ["audit-logs", queryParams],
    queryFn: async () => {
      const q = new URLSearchParams({
        page: String(queryParams.page),
        pageSize: String(queryParams.pageSize),
      });
      if (queryParams.search) q.set("search", queryParams.search);
      if (queryParams.resource) q.set("resource", queryParams.resource);
      if (queryParams.status) q.set("status", queryParams.status);

      const res = await fetch(`/api/admin/audit-logs?${q.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch audit logs");
      const json = await res.json();
      return {
        data: (json.data ?? []) as AuditLog[],
        pagination: json.meta ?? { page, pageSize, total: 0, totalPages: 1, hasNext: false, hasPrev: false },
      };
    },
    refetchInterval: 30_000,
  });

  const { data: statsRes, isLoading: statsLoading } = useQuery({
    queryKey: ["audit-logs-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/audit-logs?mode=stats");
      if (!res.ok) throw new Error("Failed to fetch audit log stats");
      return res.json() as Promise<AuditLogStats>;
    },
    refetchInterval: 60_000,
  });

  const logs = logsRes?.data ?? [];
  const pagination = logsRes?.pagination ?? { page, pageSize, total: 0, totalPages: 1, hasNext: false, hasPrev: false };
  const stats = statsRes;

  const resourceTypes = ["all", "user", "course", "session", "organization", "affiliate", "auth"];

  const SortIcon = ({ active }: { active: boolean }) => (
    <ArrowUpDown className={cn("w-3.5 h-3.5", active ? "text-foreground" : "text-muted-foreground/50")} />
  );

  const statusConfig = {
    success: { icon: CheckCircle2, class: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800" },
    warning: { icon: AlertTriangle, class: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800" },
    failed: { icon: XCircle, class: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-800" },
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-24 px-4 sm:px-6 pt-6">
      <PageHeader title="Audit Logs" description="Security and administrative event ledger">
        <Button
          variant="outline"
          onClick={async () => {
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            if (resourceFilter !== "all") params.set("resource", resourceFilter);
            if (statusFilter !== "all") params.set("status", statusFilter);
            const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
            try {
              const res = await fetch(`${baseUrl}/api/v1/admin/audit-logs/export?${params.toString()}`, { credentials: "include" });
              if (!res.ok) throw new Error("Export failed");
              const blob = await res.blob();
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `audit-logs-${Date.now()}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            } catch {
              // silently fail — toast not imported in this file scope
            }
          }}
        >
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Events" value={stats?.total ?? "—"} isLoading={statsLoading} />
        <StatCard label="Successful" value={stats?.successCount ?? "—"} isLoading={statsLoading} />
        <StatCard label="Warnings" value={stats?.warningCount ?? "—"} isLoading={statsLoading} />
        <StatCard label="Failed / Threats" value={stats?.failedCount ?? "—"} isLoading={statsLoading} />
      </div>

      <div className="rounded-lg border border-border bg-card p-4 space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by action, user, or IP..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <select
              value={resourceFilter}
              onChange={(e) => { setResourceFilter(e.target.value); setPage(1); }}
              className="h-9 rounded-md border border-border bg-background px-3 text-sm"
            >
              {resourceTypes.map(res => (
                <option key={res} value={res}>{res === "all" ? "All Resources" : res.charAt(0).toUpperCase() + res.slice(1)}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="h-9 rounded-md border border-border bg-background px-3 text-sm"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <th className="p-4">Action</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Resource</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">
                  <span className="flex items-center gap-1.5">Time <SortIcon active={true} /></span>
                </th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border text-foreground">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-muted-foreground">
                    <Loader2 className="w-6 h-6 mx-auto mb-3 animate-spin" />
                    <p className="text-sm">Loading audit logs...</p>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-muted-foreground">
                    <Shield className="w-10 h-10 mx-auto mb-3 text-muted-foreground/60" />
                    <p className="font-medium">No audit logs found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              ) : (
                logs.map((l) => {
                  const StatusIcon = statusConfig[l.status].icon;
                  return (
                    <tr
                      key={l.id}
                      className="hover:bg-muted/30 transition-colors group cursor-pointer"
                      onClick={() => router.push(`/admin/audit-logs/${l.id}` as Route)}
                    >
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-muted text-xs font-mono font-medium text-foreground border border-border">
                          {l.action}
                        </span>
                      </td>

                      <td className="p-4">
                        {l.userName ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground">
                              {l.userName.charAt(0)}
                            </div>
                            <div className="text-sm leading-snug">
                              <p className="font-medium text-foreground">{l.userName}</p>
                              {l.userEmail && <p className="text-xs text-muted-foreground">{l.userEmail}</p>}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground italic">System</span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="text-sm">
                          <span className="capitalize text-foreground">{l.resource}</span>
                          {l.resourceId && <p className="text-xs text-muted-foreground font-mono">{l.resourceId}</p>}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="text-sm">
                          <p className="font-mono text-foreground">{l.ipAddress || "—"}</p>
                          {l.location && <p className="text-xs text-muted-foreground">{l.location}</p>}
                        </div>
                      </td>

                      <td className="p-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5" title={formatDate(l.createdAt)}>
                          <Clock className="w-3.5 h-3.5 shrink-0" /> {formatTimeAgo(l.createdAt)}
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border",
                          statusConfig[l.status].class
                        )}>
                          <StatusIcon className="w-3 h-3" />
                          {l.status}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {pagination.total > 0 && (
          <div className="border-t border-border p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {Math.min(pagination.total, (page - 1) * pageSize + 1)} to{" "}
              {Math.min(pagination.total, page * pageSize)} of {pagination.total}
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
                {Array.from({ length: Math.min(pagination.totalPages, 10) }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={page === i + 1 ? "default" : "ghost"}
                    className="h-8 w-8 text-sm p-0"
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                {pagination.totalPages > 10 && <span className="text-sm text-muted-foreground px-1">...</span>}
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPage(pagination.totalPages)} disabled={page === pagination.totalPages}>
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
