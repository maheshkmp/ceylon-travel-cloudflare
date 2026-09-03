"use client";

import { useEffect, useState } from "react";
import { useUpdateUser, useChangeUserPassword } from "@/hooks/use-users";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { User } from "@repo/types";

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AVAILABLE_ROLES = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },

  { value: "teacher", label: "Teacher" },
  { value: "student", label: "Student" },
  { value: "affiliates", label: "Affiliate" },
];

export function EditUserDialog({ user, open, onOpenChange }: EditUserDialogProps) {
  const updateUser = useUpdateUser();
  const changePassword = useChangeUserPassword();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user && open) {
      setName(user.name || "");
      setPhoneNumber(user.phoneNumber || "");
      const roles = (user.role || "user").split(",").map((r) => r.trim());
      setSelectedRoles(roles);
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [user, open]);

  function handleRoleChange(role: string, checked: boolean) {
    if (checked) {
      setSelectedRoles((prev) => [...prev, role]);
    } else {
      setSelectedRoles((prev) => prev.filter((r) => r !== role));
    }
  }

  function handleResetPassword(e: React.MouseEvent) {
    e.preventDefault();
    if (!user) return;
    if (newPassword.length < 8) {
      toast({
        title: "Validation error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        title: "Validation error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    changePassword.mutate(
      { id: user.id, password: newPassword },
      {
        onSuccess: () => {
          setNewPassword("");
          setConfirmPassword("");
        },
      }
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    // Default to at least "user" if no roles are selected
    const rolesToSave = selectedRoles.length > 0 ? selectedRoles.join(",") : "user";

    updateUser.mutate(
      {
        id: user.id,
        data: {
          name,
          phoneNumber: phoneNumber || null,
          role: rolesToSave,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  }

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col p-0">
        <div className="p-6 pb-0">
          <DialogHeader className="mb-0">
            <DialogTitle>Edit user details</DialogTitle>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 space-y-4 px-6 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-email">Email address (cannot be changed)</Label>
            <Input
              id="edit-email"
              value={user.email}
              disabled
              className="bg-muted text-muted-foreground select-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-name">Display name</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-phone">Phone number</Label>
            <Input
              id="edit-phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. +1 (555) 019-2834"
            />
          </div>

          <div className="space-y-2">
            <Label>User roles (Select multiple)</Label>
            <div className="grid grid-cols-1 gap-2 pt-1">
              {AVAILABLE_ROLES.map((role) => (
                <div key={role.value} className="flex items-center space-x-2.5">
                  <Checkbox
                    id={`role-${role.value}`}
                    checked={selectedRoles.includes(role.value)}
                    onCheckedChange={(checked) =>
                      handleRoleChange(role.value, !!checked)
                    }
                  />
                  <Label
                    htmlFor={`role-${role.value}`}
                    className="font-normal text-sm cursor-pointer select-none"
                  >
                    {role.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border mt-4 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Account security</h3>
            <p className="text-xs text-muted-foreground -mt-2">
              Reset this user's password. Password must be at least 8 characters.
            </p>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-password">New password</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-confirm-password">Confirm new password</Label>
                <Input
                  id="edit-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetPassword}
                disabled={changePassword.isPending || !newPassword || !confirmPassword}
                className="w-full mt-2"
              >
                {changePassword.isPending ? "Updating password…" : "Update password"}
              </Button>
            </div>
          </div>
        </form>

        <DialogFooter className="p-4 pt-2 mt-0 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateUser.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={updateUser.isPending}>
            {updateUser.isPending ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
