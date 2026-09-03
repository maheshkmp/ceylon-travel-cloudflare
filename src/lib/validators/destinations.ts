import { z } from "zod";

export const createDestinationSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").max(100),
  region: z.string().min(1, "Region is required").max(100),
  image: z.string().url("Image must be a valid URL"),
  tagline: z.string().min(1, "Tagline is required").max(255),
  description: z.string().optional(),
  featured: z.boolean().default(true),
  order: z.number().int().default(0),
});

export const updateDestinationSchema = createDestinationSchema.partial();

export const listDestinationsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
  search: z.string().optional(),
  featured: z.coerce.boolean().optional(),
});

export type CreateDestinationInput = z.infer<typeof createDestinationSchema>;
export type UpdateDestinationInput = z.infer<typeof updateDestinationSchema>;
export type ListDestinationsInput = z.infer<typeof listDestinationsSchema>;
