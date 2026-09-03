"use client";

export const runtime = "edge";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateUserSchema, type UpdateUserInput } from "@repo/validators/users";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateUser } from "@/hooks/use-users";
import { authClient, useSession } from "@/lib/auth-client";

import { PageHeader } from "@/components/shared/page-header";
import { FormField } from "@/components/shared/form-field";
import { InlineFilePicker } from "@/components/shared/file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { initials } from "@/lib/utils";

// Password change schema (standalone — Better Auth handles this)
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8)
      .max(128)
      .regex(/[A-Z]/, "Must contain uppercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export default function SettingsPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const updateUser = useUpdateUser();
  const { toast } = useToast();

  // ── Profile form ──────────────────────────────────────────────────────────
  const {
    register: regProfile,
    handleSubmit: handleProfile,
    setValue: setProfileValue,
    formState: { errors: profileErrors, isDirty: profileDirty },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema as any),
    defaultValues: { name: user?.name ?? "" },
  });

  // ── Password form ─────────────────────────────────────────────────────────
  const {
    register: regPw,
    handleSubmit: handlePw,
    reset: resetPw,
    setError: setPwError,
    formState: { errors: pwErrors, isSubmitting: pwSubmitting },
  } = useForm<ChangePasswordInput>({ resolver: zodResolver(changePasswordSchema as any) });

  async function onProfileSave(data: UpdateUserInput) {
    if (!user) return;
    await updateUser.mutateAsync({ id: user.id, data });
  }

  async function onPasswordChange(data: ChangePasswordInput) {
    try {
      const result = await authClient.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: false,
      });
      if (result.error) {
        setPwError("currentPassword", { message: result.error.message ?? "Password change failed" });
        return;
      }
      toast({ title: "Password updated successfully" });
      resetPw();
    } catch (err) {
      setPwError("currentPassword", {
        message: err instanceof Error ? err.message : "Password change failed",
      });
    }
  }

  return (
    <div>
      <PageHeader title="Settings" description="Manage your account and preferences" />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* ── Profile ──────────────────────────────────────────────────────── */}
        <TabsContent value="profile">
          <div className="max-w-lg space-y-6">
            {/* Avatar */}
            <Card>
              <CardHeader>
                <CardTitle>Avatar</CardTitle>
                <CardDescription>Your profile photo shown across the app</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-5">
                  <Avatar className="h-16 w-16">
                    {user?.image && <AvatarFallback className="text-lg">{user ? initials(user.name) : "?"}</AvatarFallback>}
                    <AvatarFallback className="text-lg">
                      {user ? initials(user.name) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <InlineFilePicker
                    folder="avatars"
                    label="Change avatar"
                    currentUrl={user?.image ?? null}
                    onUpload={(r) => setProfileValue("avatarUrl", r.publicUrl, { shouldDirty: true })}
                    onClear={() => setProfileValue("avatarUrl", null, { shouldDirty: true })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Profile details */}
            <Card>
              <CardHeader>
                <CardTitle>Profile details</CardTitle>
                <CardDescription>Update your display name</CardDescription>
              </CardHeader>
              <form onSubmit={handleProfile(onProfileSave)}>
                <CardContent className="space-y-4">
                  <FormField label="Display name" htmlFor="name"
                    error={profileErrors.name?.message} required>
                    <Input id="name" {...regProfile("name")} />
                  </FormField>
                  <FormField label="Email address" htmlFor="email">
                    <Input id="email" type="email" value={user?.email ?? ""} disabled
                      className="opacity-60 cursor-not-allowed" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Email cannot be changed here.
                    </p>
                  </FormField>
                </CardContent>
                <CardFooter className="justify-end border-t border-border">
                  <Button type="submit" size="sm" className="mt-2"
                    loading={updateUser.isPending} disabled={!profileDirty}>
                    Save changes
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </TabsContent>

        {/* ── Security ─────────────────────────────────────────────────────── */}
        <TabsContent value="security">
          <div className="max-w-lg space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change password</CardTitle>
                <CardDescription>
                  At least 8 characters with uppercase and a number
                </CardDescription>
              </CardHeader>
              <form onSubmit={handlePw(onPasswordChange)}>
                <CardContent className="space-y-4">
                  <FormField label="Current password" htmlFor="currentPw"
                    error={pwErrors.currentPassword?.message}>
                    <Input id="currentPw" type="password"
                      autoComplete="current-password" {...regPw("currentPassword")} />
                  </FormField>
                  <Separator />
                  <FormField label="New password" htmlFor="newPw"
                    error={pwErrors.newPassword?.message}>
                    <Input id="newPw" type="password"
                      autoComplete="new-password" {...regPw("newPassword")} />
                  </FormField>
                  <FormField label="Confirm new password" htmlFor="confirmPw"
                    error={pwErrors.confirmPassword?.message}>
                    <Input id="confirmPw" type="password"
                      autoComplete="new-password" {...regPw("confirmPassword")} />
                  </FormField>
                </CardContent>
                <CardFooter className="justify-end border-t border-border">
                  
                  <Button type="submit" size="sm" loading={pwSubmitting} className="mt-2">
                    Update password
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sessions</CardTitle>
                <CardDescription>Sign out of all other devices</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This will immediately invalidate all other active sessions.
                </p>
              </CardContent>
              <CardFooter className="border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 mt-2"
                  onClick={async () => {
                    await authClient.revokeOtherSessions();
                    toast({ title: "Other sessions signed out" });
                  }}
                >
                  Sign out all other sessions
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
