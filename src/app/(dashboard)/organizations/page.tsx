"use client";

export const runtime = "edge";

import { useState } from "react";
import { useOrganizations } from "@/hooks/use-organizations";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { SearchInput } from "@/components/shared/search-input";
import { PlanBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateOrgDialog } from "@/components/shared/create-org-dialog";
import { formatRelative } from "@/lib/utils";
import type { Organization } from "@repo/types";
import type { Column } from "@/components/shared/data-table";
import { Building2 } from "lucide-react";

const columns: Column<Organization>[] = [
  {
    key: "name",
    header: "Organization",
    sortable: true,
    cell: (o) => (
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-md border border-border bg-muted flex items-center justify-center shrink-0">
          <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-sm text-foreground truncate">{o.name}</p>
          <p className="text-xs text-muted-foreground truncate">/{o.slug}</p>
        </div>
      </div>
    ),
  },
  {
    key: "plan",
    header: "Plan",
    width: "120px",
    cell: (o) => <PlanBadge plan={o.plan} />,
  },
  {
    key: "createdAt",
    header: "Created",
    sortable: true,
    width: "140px",
    cell: (o) => (
      <span className="text-sm text-muted-foreground">{formatRelative(o.createdAt)}</span>
    ),
  },
];

export default function OrganizationsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading } = useOrganizations({ page, pageSize: 20, search });

  return (
    <div>
      <PageHeader title="Organizations" description="Manage teams and workspaces">
        <Button size="sm" onClick={() => setCreateOpen(true)}>New organization</Button>
      </PageHeader>

      <div className="flex items-center gap-2 mb-4">
        <SearchInput
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder="Search organizations…"
          className="w-64"
        />
        <div className="ml-auto text-xs text-muted-foreground">
          {data?.pagination && `${data.pagination.total} organizations`}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        pagination={data?.pagination}
        isLoading={isLoading}
        onPageChange={setPage}
        rowKey={(o) => o.id}
        emptyMessage={search ? `No organizations matching "${search}"` : "No organizations yet"}
      />
      <CreateOrgDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
