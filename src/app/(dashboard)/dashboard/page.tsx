"use client";

export const runtime = "edge";

import { useSession } from "@/lib/auth-client";
import { useUsers } from "@/hooks/use-users";
import { useOrganizations } from "@/hooks/use-organizations";
import { PageHeader, StatCard } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { RoleBadge } from "@/components/ui/badge";
import { formatRelative } from "@/lib/utils";
import type { User } from "@repo/types";

const recentUsersColumns: Column<User>[] = [
  {
    key: "name",
    header: "User",
    cell: (u) => (
      <div>
        <p className="font-medium text-sm">{u.name}</p>
        <p className="text-xs text-muted-foreground">{u.email}</p>
      </div>
    ),
  },
  {
    key: "role",
    header: "Role",
    cell: (u) => <RoleBadge role={u.role} />,
  },
  {
    key: "createdAt",
    header: "Joined",
    cell: (u) => <span className="text-sm text-muted-foreground">{formatRelative(u.createdAt)}</span>,
  },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: usersData, isLoading: usersLoading } = useUsers({ page: 1, pageSize: 5 });
  const { data: orgsData,  isLoading: orgsLoading  } = useOrganizations({ page: 1, pageSize: 5 });

  const name = session?.user?.name?.split(" ")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8">
      <PageHeader
        title={`${greeting}, ${name}`}
        description="Here's what's happening in your workspace"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users"     value={usersData?.pagination?.total ?? "—"} isLoading={usersLoading} change="+12% this month" trend="up" />
        <StatCard label="Organizations"   value={orgsData?.pagination?.total  ?? "—"} isLoading={orgsLoading}  change="+3 this week"   trend="up" />
        <StatCard label="Active Sessions" value="—" change="Real-time"  trend="neutral" />
        <StatCard label="API Requests"    value="—" change="Last 24h"   trend="neutral" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Recent Users</h2>
          <a href="/users" className="text-xs text-muted-foreground hover:text-foreground transition-colors">View all →</a>
        </div>
        <DataTable
          columns={recentUsersColumns}
          data={usersData?.data ?? []}
          isLoading={usersLoading}
          rowKey={(u) => u.id}
          emptyMessage="No users yet"
        />
      </div>
    </div>
  );
}
