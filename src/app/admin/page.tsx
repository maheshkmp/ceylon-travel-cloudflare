"use client";

export const runtime = 'edge';

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminStats, getAdminUsers, updateUserRole as updateUserRoleAction, verifyUserEmail, deleteUser as deleteUserAction } from "@/actions/admin";
import { PageHeader, StatCard } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { SearchInput } from "@/components/shared/search-input";
import { DeleteDialog } from "@/components/shared/delete-dialog";
import { RoleBadge, VerifiedBadge, Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatRelative, initials } from "@/lib/utils";
import { AdminGuard } from "@/components/layout/auth-guard";
import { useToast } from "@/hooks/use-toast";
import { MoreHorizontal, ShieldCheck, Trash2, MailCheck } from "lucide-react";
import type { User } from "@repo/types";

function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch admin stats");
      return res.json();
    },
  });
}

function useAdminUsers(params: Record<string, unknown>) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: async () => {
      const q = new URLSearchParams({
        page: String(params.page || "1"),
        pageSize: String(params.pageSize || "20"),
      });
      if (params.search) q.set("search", String(params.search));
      const res = await fetch(`/api/admin/users?${q.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const json = await res.json();
      return { data: json.data ?? [], pagination: json.meta?.pagination };
    },
  });
}

function useUpdateUserRole() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateRole", id, role }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      return res.json();
    },
    onSuccess: (_data, { id, role }) => {
      qc.setQueriesData({ queryKey: ["admin", "users"] }, (old: any) => {
        if (!old?.data) return old;
        return { ...old, data: old.data.map((u: User) => u.id === id ? { ...u, role } : u) };
      });
      toast({ title: "Role updated" });
    },
    onError: (err: Error) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
  });
}

function useVerifyEmail() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verifyEmail", id }),
      });
      if (!res.ok) throw new Error("Failed to verify email");
      return res.json();
    },
    onSuccess: (_data, id) => {
      qc.setQueriesData({ queryKey: ["admin", "users"] }, (old: any) => {
        if (!old?.data) return old;
        return { ...old, data: old.data.map((u: User) => u.id === id ? { ...u, emailVerified: true } : u) };
      });
      toast({ title: "Email verified" });
    },
    onError: (err: Error) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
  });
}

function useAdminDeleteUser() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin"] });
      toast({ title: "User deleted" });
    },
    onError: (err: Error) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
  });
}

export default function AdminPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data, isLoading } = useAdminUsers({ page, pageSize: 20, search });
  const updateRole = useUpdateUserRole();
  const verifyEmail = useVerifyEmail();
  const deleteUser = useAdminDeleteUser();

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "User",
      sortable: true,
      cell: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-[11px] font-semibold text-primary">{initials(u.name)}</span>
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{u.name}</p>
            <p className="text-xs text-muted-foreground truncate">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      width: "130px",
      cell: (u) => (
        <button
          type="button"
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            const roles: ("user" | "admin")[] = ["user", "admin"];
            const idx = roles.indexOf(u.role as "user" | "admin");
            const next = roles[(idx + 1) % roles.length];
            updateRole.mutate({ id: u.id, role: next as string });
          }}
        >
          <RoleBadge role={u.role} />
        </button>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "110px",
      cell: (u) =>
        u.emailVerified ? (
          <VerifiedBadge verified={true} />
        ) : (
          <button
            type="button"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              verifyEmail.mutate(u.id);
            }}
          >
            <VerifiedBadge verified={false} />
          </button>
        ),
    },
    {
      key: "createdAt",
      header: "Joined",
      sortable: true,
      width: "130px",
      cell: (u) => <span className="text-sm text-muted-foreground">{formatRelative(u.createdAt)}</span>,
    },
    {
      key: "actions",
      header: "",
      width: "48px",
      cell: (u) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={4} className="w-44">
            <DropdownMenuLabel>Change role</DropdownMenuLabel>
            {(["user", "admin"] as const).map((role) => (
              <DropdownMenuItem
                key={role}
                className={u.role === role ? "font-medium text-primary" : ""}
                onSelect={() => updateRole.mutate({ id: u.id, role })}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
                {u.role === role && <span className="ml-auto text-xs">✓</span>}
              </DropdownMenuItem>
            ))}
            {!u.emailVerified && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => verifyEmail.mutate(u.id)}>
                  <MailCheck className="w-3.5 h-3.5" />
                  Verify email
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onSelect={() => setDeleteTarget(u)}>
              <Trash2 className="w-3.5 h-3.5" />
              Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <AdminGuard>
      <div className="space-y-8">
        <PageHeader title="Admin Panel" description="Manage users, sessions, and audit logs">
          <div className="flex items-center gap-1.5 text-xs bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md px-2.5 py-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="text-amber-700 dark:text-amber-300 font-medium">Admin access</span>
          </div>
        </PageHeader>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Users" value={stats?.users?.total ?? "—"} isLoading={statsLoading} />
          <StatCard label="New This Month" value={stats?.users?.newThisMonth ?? "—"} isLoading={statsLoading} />
          <StatCard label="Organizations" value={stats?.organizations?.total ?? "—"} isLoading={statsLoading} />
          <StatCard label="Active Sessions" value={stats?.sessions?.active ?? "—"} isLoading={statsLoading} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">All Users</h2>
            <SearchInput
              value={search}
              onChange={(v) => { setSearch(v); setPage(1); }}
              placeholder="Search users…"
              className="w-56"
            />
          </div>
          <DataTable
            columns={columns}
            data={(data?.data as any) ?? []}
            pagination={data?.pagination as any}
            isLoading={isLoading}
            onPageChange={setPage}
            rowKey={(u) => u.id}
          />
        </div>
      </div>

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.name}?`}
        description="This will permanently delete the user and all their data."
        onConfirm={() => {
          if (deleteTarget) deleteUser.mutate(deleteTarget.id, { onSettled: () => setDeleteTarget(null) });
        }}
        isLoading={deleteUser.isPending}
      />
    </AdminGuard>
  );
}
