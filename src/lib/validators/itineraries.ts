import { z } from "zod";

export const itineraryDaySchema = z.object({
  day: z.string(),
  title: z.string().min(1, "Day title is required"),
  place: z.string().min(1, "Location is required"),
  body: z.string().optional().or(z.literal("")),
  img: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  activities: z.array(z.string()),
  travelTime: z.string().optional().or(z.literal("")),
  meals: z.object({
    b: z.boolean(),
    l: z.boolean(),
    d: z.boolean(),
  }),
  accommodation: z.string().optional().or(z.literal("")),
});

export const itineraryNeedToKnowSchema = z.object({
  title: z.string(),
  detail: z.string(),
});

export const itineraryFaqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

export const createItinerarySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  duration: z.string().min(1, "Duration is required"),
  price: z.string().min(1, "Price is required"),
  pace: z.string().optional().or(z.literal("")),
  travelStyle: z.string().optional().or(z.literal("")),
  bestFor: z.string().optional().or(z.literal("")),
  tags: z.array(z.string()),
  heroImg: z.string().url("Hero image is required"),
  mapImg: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  overview: z.string().min(1, "Overview is required"),
  highlights: z.array(z.string()),
  days: z.array(itineraryDaySchema),
  inclusions: z.array(z.string()),
  exclusions: z.array(z.string()),
  needToKnow: z.array(itineraryNeedToKnowSchema),
  faqs: z.array(itineraryFaqSchema).optional().default([]),
});

export const updateItinerarySchema = createItinerarySchema.partial();

export const listItinerariesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
});

export type CreateItineraryInput = z.infer<typeof createItinerarySchema>;
export type UpdateItineraryInput = z.infer<typeof updateItinerarySchema>;
export type ListItinerariesInput = z.infer<typeof listItinerariesSchema>;
