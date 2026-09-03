"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getOrganizations, 
  getOrganizationById, 
  getOrgMembers, 
  createOrganization, 
  updateOrganization 
} from "@/actions/organizations";
import type { Organization, OrgMember, PaginationMeta } from "@repo/types";
import type {
  CreateOrganizationInput,
  UpdateOrganizationInput,
  InviteMemberInput,
} from "@repo/validators/organizations";
import { useToast } from "@/hooks/use-toast";

export function useOrganizations(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["organizations", params],
    queryFn: async () => {
      // @ts-ignore
      const res = await getOrganizations(params?.page, params?.limit);
      return {
        data: (res.data ?? []) as unknown as Organization[],
        pagination: res.meta as PaginationMeta,
      };
    },
  });
}

export function useOrganization(id: string) {
  return useQuery({
    queryKey: ["organizations", id],
    queryFn: async () => {
      const org = await getOrganizationById(id);
      if (!org) throw new Error("Organization not found");
      return org as unknown as Organization;
    },
    enabled: !!id,
  });
}

export function useOrgMembers(orgId: string) {
  return useQuery({
    queryKey: ["organizations", orgId, "members"],
    queryFn: async () => {
      const members = await getOrgMembers(orgId);
      return (members ?? []) as unknown as OrgMember[];
    },
    enabled: !!orgId,
  });
}

export function useCreateOrganization() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateOrganizationInput) => {
      return await createOrganization(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["organizations"] });
      toast({ title: "Organization created" });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to create organization", description: err.message, variant: "destructive" });
    },
  });
}

export function useUpdateOrganization() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateOrganizationInput }) => {
      return await updateOrganization(id, data);
    },
    onSuccess: (updatedOrg, { id }) => {
      qc.setQueryData(["organizations", id], updatedOrg);
      qc.invalidateQueries({ queryKey: ["organizations"] });
      toast({ title: "Organization updated" });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to update organization", description: err.message, variant: "destructive" });
    },
  });
}

export function useInviteMember(orgId: string) {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InviteMemberInput) => {
      // orgsApi.invite does not exist in Server Actions yet, 
      // but it was also missing in api/v1. Leaving a stub.
      throw new Error("Invites not implemented");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["organizations", orgId, "members"] });
      toast({ title: "Invitation sent" });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to send invitation", description: err.message, variant: "destructive" });
    },
  });
}
