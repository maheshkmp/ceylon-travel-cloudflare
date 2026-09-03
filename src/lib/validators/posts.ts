import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z.string().min(1, "Slug is required").max(100),
  tag: z.string().min(1, "Tag is required").max(50),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  image: z.string().url("Image must be a valid URL"),
  readingTime: z.string().min(1, "Reading time is required"),
  published: z.boolean().default(false),
});

export const updatePostSchema = createPostSchema.partial();

export const listPostsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
  search: z.string().optional(),
  tag: z.string().optional(),
  published: z.coerce.boolean().optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type ListPostsInput = z.infer<typeof listPostsSchema>;
