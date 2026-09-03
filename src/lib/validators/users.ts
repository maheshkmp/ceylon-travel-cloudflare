import { z } from "zod";
import { listQuerySchema } from "./query";

// ─── User Schema ──────────────────────────────────────────────────────────

export const userSchema = z.object({
  id: z.string().min(1, "ID is required"),
  email: z.string().email(),
  name: z.string().min(2).max(100),
  role: z.enum(["user", "admin"]),
  avatarUrl: z.string().url().nullable(),
  emailVerified: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type UserSchema = z.infer<typeof userSchema>;

// ─── Create User ──────────────────────────────────────────────────────────

export const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(128),
  role: z.enum(["user", "admin"]).default("user"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

// ─── Update User ──────────────────────────────────────────────────────────

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  avatarUrl: z.string().url().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  role: z.string().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// ─── Update User Role (Admin) ─────────────────────────────────────────────

export const updateUserRoleSchema = z.object({
  role: z.enum(["user", "admin"]),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;

// ─── List Users ───────────────────────────────────────────────────────────

export const listUsersSchema = listQuerySchema.extend({
  role: z.enum(["user", "admin"]).optional(),
  emailVerified: z.coerce.boolean().optional(),
});

export type ListUsersInput = z.infer<typeof listUsersSchema>;
