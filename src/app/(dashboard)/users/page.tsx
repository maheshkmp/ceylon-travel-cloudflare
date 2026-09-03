"use client";

export const runtime = "edge";

import { useState } from "react";
import Link from "next/link";
import { useUsers, useDeleteUser, useVerifyEmail, useUpdateUserRole } from "@/hooks/use-users";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { SearchInput } from "@/components/shared/search-input";
import { EditUserDialog } from "@/components/users/edit-user-dialog";
import { DeleteUserDialog } from "@/components/users/delete-user-dialog";
import { RoleBadge, VerifiedBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatRelative, initials } from "@/lib/utils";
import { MoreHorizontal, Trash2, Pencil, ExternalLink, Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import type { User } from "@repo/types";
import type { Route } from "next";

const ALL_ROLES = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },

  { value: "teacher", label: "Teacher" },
  { value: "student", label: "Student" },
  { value: "affiliates", label: "Affiliate" },
] as const;

export default function UsersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [editTarget, setEditTarget] = useState<User | null>(null);

  const { data, isLoading } = useUsers({ page, pageSize: 20, search, sortBy, sortOrder });
  const deleteUser = useDeleteUser();
  const verifyEmail = useVerifyEmail();
  const updateRole = useUpdateUserRole();

  const { user: currentUser } = useAuth();
  const isAdmin = (currentUser?.role as string || "")
    .split(",")
    .some(r => r.trim() === "admin");

  function handleSort(by: string, order: "asc" | "desc") {
    setSortBy(by);
    setSortOrder(order);
    setPage(1);
  }

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "User",
      sortable: true,
      cell: (u) => {
        const isTeacher = u.role?.includes("teacher");
        const profileHref = isTeacher ? `/admin/teachers/${u.id}` : `/users/${u.id}`;
        return (
          <div className="flex items-center gap-3">
            <Link
              href={profileHref as Route}
              className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity"
            >
              <span className="text-[11px] font-semibold text-primary">{initials(u.name)}</span>
            </Link>
            <div className="min-w-0">
              <Link
                href={profileHref as Route}
                className="font-medium text-sm hover:underline hover:text-primary transition-colors truncate block"
              >
                {u.name}
              </Link>
              <p className="text-xs text-muted-foreground truncate">{u.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      width: "220px",
      cell: (u) => !isAdmin ? (
        <RoleBadge role={u.role} />
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="cursor-pointer hover:opacity-75 transition-opacity focus:outline-none"
              onClick={(e) => e.stopPropagation()}
              aria-label="Change role"
            >
              <RoleBadge role={u.role} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" sideOffset={4} className="bg-popover border border-border">
            <p className="px-2 py-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Change role</p>
            <DropdownMenuSeparator />
            {ALL_ROLES.map((r) => {
              const currentRoles = (u.role || "user").split(",").map(x => x.trim());
              const isActive = currentRoles.includes(r.value);
              return (
                <DropdownMenuItem
                  key={r.value}
                  onSelect={() => {
                    let next: string[];
                    if (isActive && currentRoles.length > 1) {
                      next = currentRoles.filter(x => x !== r.value);
                    } else if (!isActive) {
                      next = [...currentRoles, r.value];
                    } else {
                      return;
                    }
                    updateRole.mutate({ id: u.id, role: next.join(",") });
                  }}
                  className={isActive ? "font-medium" : ""}
                >
                  <span className={`w-2 h-2 rounded-full mr-2 shrink-0 ${isActive ? "bg-primary" : "bg-border"}`} />
                  {r.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      key: "emailVerified",
      header: "Email",
      width: "130px",
      cell: (u) => {
        const isVerifying = verifyEmail.isPending && verifyEmail.variables === u.id;
        return u.emailVerified || !isAdmin ? (
          <VerifiedBadge verified={u.emailVerified} />
        ) : (
          <button
            className="cursor-pointer hover:opacity-75 transition-opacity focus:outline-none flex items-center gap-1.5 group"
            onClick={(e) => {
              e.stopPropagation();
              verifyEmail.mutate(u.id);
            }}
            disabled={isVerifying}
            title="Click to verify email"
          >
            <VerifiedBadge verified={false} />
            {isVerifying ? (
              <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
            ) : (
              <ShieldCheck className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            )}
          </button>
        );
      },
    },
    {
      key: "phoneNumber",
      header: "Phone",
      width: "150px",
      cell: (u) => <span className="text-sm text-muted-foreground">{u.phoneNumber || "—"}</span>,
    },
    {
      key: "createdAt",
      header: "Joined",
      sortable: true,
      width: "140px",
      cell: (u) => <span className="text-sm text-muted-foreground">{formatRelative(u.createdAt)}</span>,
    },
    {
      key: "actions",
      header: "",
      width: "48px",
      cell: (u) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={4} className="bg-popover border border-border">
            <DropdownMenuItem onSelect={() => {
              const profileHref = u.role?.includes("teacher") ? `/admin/teachers/${u.id}` : `/users/${u.id}`;
              router.push(profileHref as Route);
            }}>
              <ExternalLink className="w-3.5 h-3.5" />
              View profile
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setEditTarget(u)}>
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onSelect={() => setDeleteTarget(u)}>
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Users" description="Manage all registered users">
        <Button size="sm">Invite user</Button>
      </PageHeader>

      <div className="flex items-center gap-2 mb-4">
        <SearchInput
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder="Search by name or email…"
          className="w-64"
        />
        <div className="ml-auto text-xs text-muted-foreground">
          {data?.pagination && `${data.pagination.total} users`}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        pagination={data?.pagination}
        isLoading={isLoading}
        onPageChange={setPage}
        onSortChange={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
        rowKey={(u) => u.id}
        emptyMessage={search ? `No users matching "${search}"` : "No users yet"}
      />

      <DeleteUserDialog
        user={deleteTarget}
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteUser.mutate(deleteTarget.id, {
              onSettled: () => setDeleteTarget(null),
            });
          }
        }}
        isLoading={deleteUser.isPending}
      />

      <EditUserDialog
        user={editTarget}
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
      />
    </div>
  );
}
