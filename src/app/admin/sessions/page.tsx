"use client";

export const runtime = 'edge';

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminSessions } from "@/actions/admin";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { formatRelative, formatDate, initials, truncate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Monitor, Smartphone, Globe, LogOut, Activity } from "lucide-react";
import type { PaginationMeta } from "@repo/types";

interface SessionRow {
  id: string;
  userId: string;
  userAgent: string | null;
  ipAddress: string | null;
  lastUsedAt: Date;
  expiresAt: Date;
  createdAt: Date;
  userName: string | null;
  userEmail: string | null;
}

function DeviceIcon({ userAgent }: { userAgent: string | null }) {
  if (!userAgent) return <Monitor className="w-4 h-4 text-muted-foreground" />;
  if (/Mobile|Android|iPhone/i.test(userAgent))
    return <Smartphone className="w-4 h-4 text-muted-foreground" />;
  return <Monitor className="w-4 h-4 text-muted-foreground" />;
}

function parseDevice(ua: string | null): string {
  if (!ua) return "Unknown device";
  if (/Chrome/i.test(ua)) return "Chrome";
  if (/Firefox/i.test(ua)) return "Firefox";
  if (/Safari/i.test(ua)) return "Safari";
  if (/Edge/i.test(ua)) return "Edge";
  return truncate(ua, 30);
}

export default function SessionsPage() {
  const [page, setPage] = useState(1);
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "sessions", page],
    queryFn: async () => {
      const res = await fetch(`/api/admin/sessions?page=${page}&pageSize=25`);
      if (!res.ok) throw new Error("Failed to fetch sessions");
      const json = await res.json();
      return {
        data: (json.data ?? []) as unknown as SessionRow[],
        pagination: json.meta?.pagination as PaginationMeta,
      };
    },
    refetchInterval: 30_000, // refresh every 30s
  });

  const columns: Column<SessionRow>[] = [
    {
      key: "user",
      header: "User",
      cell: (row) => row.userName ? (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-[11px] font-semibold text-primary">
              {initials(row.userName)}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{row.userName}</p>
            <p className="text-xs text-muted-foreground truncate">{row.userEmail}</p>
          </div>
        </div>
      ) : (
        <span className="text-xs text-muted-foreground font-mono">{row.userId.slice(0, 8)}…</span>
      ),
    },
    {
      key: "device",
      header: "Device",
      cell: (row) => (
        <SimpleTooltip content={row.userAgent ?? "Unknown"}>
          <div className="flex items-center gap-2 cursor-default">
            <DeviceIcon userAgent={row.userAgent} />
            <span className="text-sm">{parseDevice(row.userAgent)}</span>
          </div>
        </SimpleTooltip>
      ),
    },
    {
      key: "ip",
      header: "IP Address",
      width: "130px",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-sm font-mono">{row.ipAddress ?? "—"}</span>
        </div>
      ),
    },
    {
      key: "lastUsedAt",
      header: "Last active",
      width: "130px",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="text-sm text-muted-foreground">{formatRelative(row.lastUsedAt)}</span>
        </div>
      ),
    },
    {
      key: "expiresAt",
      header: "Expires",
      width: "130px",
      cell: (row) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(row.expiresAt)}
        </span>
      ),
    },
    {
      key: "sessionId",
      header: "Session ID",
      width: "120px",
      cell: (row) => (
        <span className="text-xs font-mono text-muted-foreground">
          {row.id.slice(0, 8)}…
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Active Sessions"
        description="All currently active user sessions across the platform"
      >
        <div className="flex items-center gap-2">
          <Badge variant="success">
            {data?.pagination?.total ?? "—"} active
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={() => qc.invalidateQueries({ queryKey: ["admin", "sessions"] })}
          >
            Refresh
          </Button>
        </div>
      </PageHeader>

      {!isLoading && data?.data.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No active sessions"
          description="Active user sessions will appear here."
        />
      ) : (
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          pagination={data?.pagination}
          isLoading={isLoading}
          onPageChange={setPage}
          rowKey={(r) => r.id}
          emptyMessage="No active sessions"
        />
      )}

      <p className="mt-3 text-xs text-muted-foreground">
        Auto-refreshes every 30 seconds. Session data is read-only here — users manage their own sessions from Settings.
      </p>
    </div>
  );
}
