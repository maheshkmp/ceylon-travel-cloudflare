"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useUser, useDeleteUser, useVerifyEmail } from "@/hooks/use-users";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/shared/page-header";
import { EditUserDialog } from "@/components/users/edit-user-dialog";
import { DeleteUserDialog } from "@/components/users/delete-user-dialog";
import { RoleBadge, VerifiedBadge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatDate, formatRelative, initials } from "@/lib/utils";
import { ArrowLeft, Mail, Calendar, Shield, Trash2, Clock, Phone, Pencil } from "lucide-react";
import { useState } from "react";

export const runtime = 'edge';

function InfoRow({ icon: Icon, label, value }: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        <div className="mt-0.5 text-sm font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
}

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const { data: user, isLoading } = useUser(id);
  const { user: currentUser } = useAuth();
  const deleteUser = useDeleteUser();
  const verifyEmail = useVerifyEmail();

  const userRoles = (currentUser?.role as string || "user").split(",").map(r => r.trim());
  const isAdmin = userRoles.includes("admin");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-muted-foreground">User not found</p>
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link href="/users">Back to Users</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back nav + header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" className="h-8 w-8 mt-0.5 shrink-0" asChild>
          <Link href="/users"><ArrowLeft className="w-4 h-4" /></Link>
        </Button>
        <PageHeader
          title={user.name}
          description={user.email}
          className="mb-0 flex-1"
        >
          <div className="flex items-center gap-2">
            <RoleBadge role={user.role} />
            {isAdmin && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditOpen(true)}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </Button>
                {currentUser?.id !== user.id && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setDeleteOpen(true)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </Button>
                )}
              </>
            )}
          </div>
        </PageHeader>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-3 pb-4">
              <Avatar className="h-20 w-20">
                {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
                <AvatarFallback className="text-2xl">{initials(user.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <RoleBadge role={user.role} />
                <VerifiedBadge verified={user.emailVerified} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Account details</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border -mt-2">
            <InfoRow icon={Mail} label="Email address" value={
              <span className="font-mono text-sm">{user.email}</span>
            } />
            <InfoRow icon={Shield} label="Role" value={<RoleBadge role={user.role} />} />
            <InfoRow icon={Mail} label="Email status" value={
              <div className="flex items-center gap-2">
                <VerifiedBadge verified={user.emailVerified} />
                {!user.emailVerified && isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-3 text-xs"
                    onClick={() => verifyEmail.mutate(user.id)}
                    disabled={verifyEmail.isPending}
                  >
                    {verifyEmail.isPending ? "Verifying…" : "Verify email"}
                  </Button>
                )}
              </div>
            } />
            <InfoRow icon={Phone} label="Phone number" value={
              user.phoneNumber ? (
                <span className="text-sm font-medium">{user.phoneNumber}</span>
              ) : (
                <span className="text-sm text-muted-foreground italic">No phone number provided</span>
              )
            } />
            <InfoRow icon={Calendar} label="Member since" value={formatDate(user.createdAt)} />
            <InfoRow icon={Clock} label="Last updated" value={formatRelative(user.updatedAt)} />
            <InfoRow icon={Shield} label="User ID" value={
              <span className="font-mono text-xs text-muted-foreground">{user.id}</span>
            } />
          </CardContent>
        </Card>
      </div>

      <DeleteUserDialog
        user={user}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() =>
          deleteUser.mutate(user.id, {
            onSuccess: () => router.push("/users"),
            onSettled: () => setDeleteOpen(false),
          })
        }
        isLoading={deleteUser.isPending}
      />

      <EditUserDialog
        user={user}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  );
}
