"use server";

import { eq, desc, count } from "drizzle-orm";
import { getDb } from "@/db/client";
import { inquiries } from "@/db/schema";
import { createInquirySchema } from "@/lib/validators/inquiries";
import { checkAdmin } from "./utils";

export async function getInquiries(page: number = 1, pageSize: number = 10) {
  await checkAdmin();
  const db = getDb();
  
  const [totalResult, rows] = await Promise.all([
    db.select({ count: count() }).from(inquiries),
    db
      .select()
      .from(inquiries)
      .orderBy(desc(inquiries.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
  ]);

  const total = Number(totalResult[0]?.count ?? 0);
  
  return {
    data: rows,
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  };
}

export async function submitInquiry(data: any) {
  try {
    const validated = createInquirySchema.parse(data);
    const db = getDb();
    
    const [createdInquiry] = await db
      .insert(inquiries)
      .values({
        name: validated.name,
        email: validated.email,
        whatsapp: validated.whatsapp,
        nationality: validated.nationality || null,
        arrivalDate: validated.arrivalDate || null,
        duration: validated.duration ? Number(validated.duration) : null,
        travelers: validated.travelers ? Number(validated.travelers) : 1,
        budget: validated.budget || null,
        style: validated.style || null,
        interests: Array.isArray(validated.interests) ? validated.interests : [],
        message: validated.message || null,
        status: "new",
        updatedAt: new Date(),
      })
      .returning();

    if (!createdInquiry) {
      throw new Error("Failed to create inquiry record");
    }

    return {
      ...createdInquiry,
      createdAt: createdInquiry.createdAt ? createdInquiry.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: createdInquiry.updatedAt ? createdInquiry.updatedAt.toISOString() : new Date().toISOString(),
    };
  } catch (error: any) {
    console.error("submitInquiry error:", error);
    throw new Error(error?.message || "Failed to submit inquiry. Please try again.");
  }
}

export async function updateInquiryStatus(id: string, status: string) {
  await checkAdmin();
  const db = getDb();
  
  const [updatedInquiry] = await db
    .update(inquiries)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(inquiries.id, id))
    .returning();

  return updatedInquiry;
}
