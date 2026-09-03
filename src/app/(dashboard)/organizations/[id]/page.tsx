"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOrganization, useOrgMembers, useInviteMember, useUpdateOrganization } from "@/hooks/use-organizations";
import { inviteMemberSchema, type InviteMemberInput } from "@repo/validators/organizations";
import { PageHeader } from "@/components/shared/page-header";
import { FormField } from "@/components/shared/form-field";
import { PlanBadge, RoleBadge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, initials } from "@/lib/utils";
import { Building2, UserPlus, Crown, Shield, User } from "lucide-react";
import type { OrgMember } from "@repo/types";

export const runtime = 'edge';


const roleIcon = { owner: Crown, admin: Shield, member: User } as const;
const roleLabel = { owner: "Owner", admin: "Admin", member: "Member" } as const;

function MemberRow({ member }: { member: OrgMember }) {
  const Icon = roleIcon[member.role];
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      <Avatar className="h-8 w-8 shrink-0">
        {member.user.avatarUrl && <AvatarImage src={member.user.avatarUrl} />}
        <AvatarFallback>{initials(member.user.name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{member.user.name}</p>
        <p className="text-xs text-muted-foreground truncate">{member.user.email}</p>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
        <Icon className="w-3.5 h-3.5" />
        <span>{roleLabel[member.role]}</span>
      </div>
    </div>
  );
}

function InviteDialog({ orgId, open, onOpenChange }: { orgId: string; open: boolean; onOpenChange: (o: boolean) => void }) {
  const invite = useInviteMember(orgId);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteMemberInput>({
    resolver: zodResolver(inviteMemberSchema as any),
    defaultValues: { role: "member" },
  });

  async function onSubmit(data: InviteMemberInput) {
    try {
      await invite.mutateAsync(data);
      reset();
      onOpenChange(false);
    } catch (err) {
      if (err instanceof Error) {
        setError("root", { message: err.message });
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Invite a member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errors.root && (
            <p className="text-sm text-destructive rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2">
              {errors.root.message}
            </p>
          )}
          <FormField label="Email address" htmlFor="invite-email" error={errors.email?.message} required>
            <Input
              id="invite-email"
              type="email"
              placeholder="colleague@example.com"
              autoFocus
              {...register("email")}
            />
          </FormField>
          <FormField label="Role" htmlFor="invite-role">
            <Select
              value={watch("role")}
              onValueChange={(v) => setValue("role", v as "admin" | "member")}
            >
              <SelectTrigger id="invite-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={isSubmitting || invite.isPending}>
              Send invite
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function OrganizationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [inviteOpen, setInviteOpen] = useState(false);
  const { data: org, isLoading: orgLoading } = useOrganization(id);
  const { data: members, isLoading: membersLoading } = useOrgMembers(id);

  if (orgLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!org) return <p className="text-sm text-muted-foreground">Organization not found</p>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={org.name}
        description={`/${org.slug} · Created ${formatDate(org.createdAt)}`}
      >
        <PlanBadge plan={org.plan} />
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Details card */}
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border border-border bg-muted flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">{org.name}</p>
                <p className="text-xs text-muted-foreground">/{org.slug}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-border space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Plan</span>
                <PlanBadge plan={org.plan} />
              </div>
              <div className="flex justify-between">
                <span>Created</span>
                <span className="text-foreground">{formatDate(org.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Members</span>
                <span className="text-foreground">{members?.length ?? "—"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Members card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Members</CardTitle>
                <CardDescription className="mt-0.5">
                  {members?.length ?? 0} member{members?.length !== 1 ? "s" : ""}
                </CardDescription>
              </div>
              <Button size="sm" onClick={() => setInviteOpen(true)}>
                <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                Invite
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {membersLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3.5 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                ))}
              </div>
            ) : members?.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No members yet</p>
            ) : (
              <div>
                {members?.map((m) => <MemberRow key={m.userId} member={m} />)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <InviteDialog orgId={id} open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  );
}
