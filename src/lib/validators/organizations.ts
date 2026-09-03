import { z } from "zod";
import { listQuerySchema } from "./query";

// ─── Org Schema ───────────────────────────────────────────────────────────

export const organizationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(60).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
  logoUrl: z.string().url().nullable(),
  plan: z.enum(["free", "pro", "enterprise"]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type OrganizationSchema = z.infer<typeof organizationSchema>;

// ─── Create Org ───────────────────────────────────────────────────────────

export const createOrganizationSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;

// ─── Update Org ───────────────────────────────────────────────────────────

export const updateOrganizationSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  logoUrl: z.string().url().nullable().optional(),
});

export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;

// ─── Invite Member ────────────────────────────────────────────────────────

export const inviteMemberSchema = z.object({
  email: z.string().email().toLowerCase(),
  role: z.enum(["admin", "member"]).default("member"),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;

// ─── List Orgs ────────────────────────────────────────────────────────────

export const listOrganizationsSchema = listQuerySchema.extend({
  plan: z.enum(["free", "pro", "enterprise"]).optional(),
});

export type ListOrganizationsInput = z.infer<typeof listOrganizationsSchema>;
