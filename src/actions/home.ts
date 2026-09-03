"use server";

import { asc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { travelCategories, testimonials, galleryImages } from "@/db/schema";

export async function getTravelCategories() {
  const db = getDb();
  return db.select().from(travelCategories).orderBy(asc(travelCategories.order));
}

export async function getTestimonials() {
  const db = getDb();
  return db.select().from(testimonials).orderBy(asc(testimonials.order));
}

export async function getGalleryImages() {
  const db = getDb();
  return db.select().from(galleryImages).orderBy(asc(galleryImages.order));
}
