import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { inquiries } from "@/db/schema";
import { createInquirySchema } from "@/lib/validators/inquiries";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = createInquirySchema.parse(body);
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

    return NextResponse.json({
      success: true,
      data: {
        ...createdInquiry,
        createdAt: createdInquiry?.createdAt ? createdInquiry.createdAt.toISOString() : new Date().toISOString(),
        updatedAt: createdInquiry?.updatedAt ? createdInquiry.updatedAt.toISOString() : new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Public API Inquiry Submission Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit inquiry" },
      { status: 400 }
    );
  }
}
