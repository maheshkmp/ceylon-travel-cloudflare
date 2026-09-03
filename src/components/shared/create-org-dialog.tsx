"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrganizationSchema, type CreateOrganizationInput } from "@repo/validators/organizations";
import { useCreateOrganization } from "@/hooks/use-organizations";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";
import { slugify } from "@/lib/utils";


interface CreateOrgDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateOrgDialog({ open, onOpenChange }: CreateOrgDialogProps) {
  const createOrg = useCreateOrganization();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrganizationInput>({
    resolver: zodResolver(createOrganizationSchema as any),
  });

  const name = watch("name", "");

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    register("name").onChange(e);
    // Auto-generate slug from name
    setValue("slug", slugify(val), { shouldValidate: !!val });
  }

  async function onSubmit(data: CreateOrganizationInput) {
    try {
      await createOrg.mutateAsync(data);
      reset();
      onOpenChange(false);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("slug")) {
          setError("slug", { message: "This slug is already taken. Try another." });
        } else {
          setError("root", { message: err.message });
        }
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create organization</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errors.root && (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2">
              <p className="text-sm text-destructive">{errors.root.message}</p>
            </div>
          )}

          <FormField label="Organization name" htmlFor="orgName" error={errors.name?.message} required>
            <Input
              id="orgName"
              placeholder="Acme Corp"
              autoFocus
              {...register("name")}
              onChange={handleNameChange}
            />
          </FormField>

          <FormField
            label="Slug"
            htmlFor="orgSlug"
            error={errors.slug?.message}
            hint="Used in URLs — lowercase letters, numbers, and hyphens only"
            required
          >
            <div className="flex items-center">
              <span className="inline-flex items-center h-9 px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground shrink-0">
                app/
              </span>
              <Input
                id="orgSlug"
                placeholder="acme-corp"
                className="rounded-l-none"
                {...register("slug")}
              />
            </div>
          </FormField>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => { reset(); onOpenChange(false); }}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={isSubmitting || createOrg.isPending}>
              Create organization
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
