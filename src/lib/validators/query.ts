import { z } from "zod";

// ─── Pagination ────────────────────────────────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

// ─── Sorting ───────────────────────────────────────────────────────────────

export const sortSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type SortInput = z.infer<typeof sortSchema>;

// ─── Search / Filter ───────────────────────────────────────────────────────

export const searchSchema = z.object({
  search: z.string().max(200).optional(),
});

export type SearchInput = z.infer<typeof searchSchema>;

// ─── Base List Query ───────────────────────────────────────────────────────

export const listQuerySchema = paginationSchema.merge(sortSchema).merge(searchSchema);
export type ListQueryInput = z.infer<typeof listQuerySchema>;

// ─── ID Param ─────────────────────────────────────────────────────────────

export const idParamSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export type IdParam = z.infer<typeof idParamSchema>;

// ─── Date Range ───────────────────────────────────────────────────────────

export const dateRangeSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export type DateRange = z.infer<typeof dateRangeSchema>;
