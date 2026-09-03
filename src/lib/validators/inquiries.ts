import { z } from "zod";

export const createInquirySchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email address").max(255),
  whatsapp: z.string().min(1, "WhatsApp number is required").max(50),
  nationality: z.string().optional().nullable(),
  arrivalDate: z.string().optional().nullable(),
  duration: z.coerce.number().int().min(1).optional().nullable(),
  travelers: z.coerce.number().int().min(1).default(1),
  budget: z.string().optional().nullable(),
  style: z.string().optional().nullable(),
  interests: z.array(z.string()).default([]),
  message: z.string().optional().nullable(),
});

export const updateInquiryStatusSchema = z.object({
  status: z.enum(["new", "contacted", "quoted", "booked", "lost"]),
});

export const listInquiriesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
  status: z.string().optional(),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
export type ListInquiriesInput = z.infer<typeof listInquiriesSchema>;
