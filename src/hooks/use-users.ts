"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  verifyUserEmail, 
  updateUserRole 
} from "@/actions/users";
import type { User, PaginationMeta } from "@repo/types";
import type { ListUsersInput, UpdateUserInput } from "@repo/validators/users";
import { useToast } from "@/hooks/use-toast";

export function useUsers(params?: Partial<ListUsersInput>) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      const res = await getUsers(params?.page, params?.pageSize);
      return {
        data: (res.data ?? []) as unknown as User[],
        pagination: res.meta as PaginationMeta,
      };
    },
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const user = await getUserById(id);
      if (!user) throw new Error("User not found");
      return user as unknown as User;
    },
    enabled: !!id,
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserInput }) => {
      return await updateUser(id, data);
    },
    onSuccess: (updatedUser, { id }) => {
      qc.setQueryData(["users", id], updatedUser);
      qc.invalidateQueries({ queryKey: ["users"] });
      toast({ title: "User updated" });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to update user", description: err.message, variant: "destructive" });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteUser(id);
    },
    onSuccess: (_, id) => {
      qc.removeQueries({ queryKey: ["users", id] });
      qc.invalidateQueries({ queryKey: ["users"] });
      toast({ title: "User deleted" });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to delete user", description: err.message, variant: "destructive" });
    },
  });
}

export function useVerifyEmail() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      return await verifyUserEmail(id);
    },
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.setQueriesData({ queryKey: ["users"] }, (old: { data: User[], pagination: PaginationMeta } | undefined) => {
        if (!old) return old;
        if (old.data && Array.isArray(old.data)) {
          return {
            ...old,
            data: old.data.map((u: User) =>
              u.id === id ? { ...u, emailVerified: true } : u
            ),
          };
        }
        return old;
      });
      toast({ title: "Email verified successfully" });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to verify email", description: err.message, variant: "destructive" });
    },
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      updateUserRole(id, role),
    onSuccess: (_, { id, role }) => {
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.setQueriesData({ queryKey: ["users"] }, (old: { data: User[], pagination: PaginationMeta } | undefined) => {
        if (!old) return old;
        if (old.data && Array.isArray(old.data)) {
          return {
            ...old,
            data: old.data.map((u: User) =>
              u.id === id ? { ...u, role } : u
            ),
          };
        }
        return old;
      });
      toast({ title: "Role updated successfully" });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to update role", description: err.message, variant: "destructive" });
    },
  });
}

export function useChangeUserPassword() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, password }: { id: string; password: string }) => {
      // Stub for changing user password
      throw new Error("Changing passwords via API is not implemented yet in Server Actions");
    },
    onSuccess: () => {
      toast({ title: "Password changed successfully" });
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to change password",
        description: err.message,
        variant: "destructive",
      });
    },
  });
}
