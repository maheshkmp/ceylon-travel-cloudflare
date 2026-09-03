"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { User } from "@repo/types";

interface DeleteUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteUserDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteUserDialogProps) {
  const [confirmEmail, setConfirmEmail] = useState("");
  const [understandChecked, setUnderstandChecked] = useState(false);

  // Reset inputs when opened/closed
  useEffect(() => {
    if (open) {
      setConfirmEmail("");
      setUnderstandChecked(false);
    }
  }, [open]);

  if (!user) return null;

  const matchesEmail = confirmEmail.trim().toLowerCase() === user.email.toLowerCase();
  const canDelete = matchesEmail && understandChecked;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" showClose={!isLoading}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div className="flex-1 space-y-4">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-foreground">
                Delete user: {user.name}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground pt-1 leading-normal">
                This action will permanently delete <strong className="text-foreground">{user.name}</strong> ({user.email}) and all associated data. This action is irreversible.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="confirm-email-input" className="text-xs font-medium text-foreground">
                  Confirm email address
                </Label>
                <p className="text-xs text-muted-foreground">
                  Please type <strong className="text-foreground select-all">{user.email}</strong> to confirm:
                </p>
                <Input
                  id="confirm-email-input"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  placeholder={user.email}
                  className="mt-1"
                  disabled={isLoading}
                  autoComplete="off"
                />
              </div>

              <div className="flex items-start space-x-2.5 pt-1">
                <Checkbox
                  id="understand-checkbox"
                  checked={understandChecked}
                  onCheckedChange={(checked) => setUnderstandChecked(!!checked)}
                  disabled={isLoading}
                  className="mt-1"
                />
                <Label
                  htmlFor="understand-checkbox"
                  className="font-normal text-xs text-muted-foreground leading-normal cursor-pointer select-none"
                >
                  I understand that this user account will be permanently deleted and cannot be recovered.
                </Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={!canDelete || isLoading}
            loading={isLoading}
          >
            Permanently delete user
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
