"use server";

import { eq, desc, asc, count, ilike, or } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { getDb } from "@/db/client";
import { destinations, itinerariesTable } from "@/db/schema";
import { checkAdmin } from "./utils";

export async function getDestinations(page: number = 1, pageSize: number = 10, search?: string) {
  const db = getDb();
  
  const baseQuery = db.select().from(destinations);
  const countQuery = db.select({ count: count() }).from(destinations);

  if (search) {
    const searchFilter = or(
      ilike(destinations.name, `%${search}%`),
      ilike(destinations.region, `%${search}%`)
    );
    baseQuery.where(searchFilter);
    countQuery.where(searchFilter);
  }
  
  const [totalResult, rows] = await Promise.all([
    countQuery,
    baseQuery
      .orderBy(asc(destinations.order), desc(destinations.createdAt))
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

export async function getDestinationById(id: string) {
  const db = getDb();
  const [destination] = await db
    .select()
    .from(destinations)
    .where(eq(destinations.id, id))
    .limit(1);

  return destination || null;
}

export async function getDestinationBySlug(slug: string) {
  const db = getDb();
  const [destination] = await db
    .select()
    .from(destinations)
    .where(eq(destinations.slug, slug))
    .limit(1);

  return destination || null;
}

export async function createDestination(data: typeof destinations.$inferInsert) {
  await checkAdmin();
  const db = getDb();
  
  const [createdDestination] = await db
    .insert(destinations)
    .values({
      ...data,
      updatedAt: new Date(),
    })
    .returning();

  revalidateTag("home-destinations");
  return createdDestination;
}

export async function updateDestination(id: string, data: Partial<typeof destinations.$inferInsert>) {
  await checkAdmin();
  const db = getDb();
  
  const [updatedDestination] = await db
    .update(destinations)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(destinations.id, id))
    .returning();

  revalidateTag("home-destinations");
  return updatedDestination;
}

export async function deleteDestination(id: string) {
  await checkAdmin();
  const db = getDb();
  await db.delete(destinations).where(eq(destinations.id, id));
  revalidateTag("home-destinations");
}

export async function reorderDestinations(updates: { id: string; order: number }[]) {
  await checkAdmin();
  const db = getDb();
  
  await Promise.all(
    updates.map((update) =>
      db
        .update(destinations)
        .set({ order: update.order })
        .where(eq(destinations.id, update.id))
    )
  );
  revalidateTag("home-destinations");
}

export async function getRelatedItinerariesForDestination(destinationName: string, destinationSlug: string) {
  const db = getDb();
  const allItineraries = await db
    .select()
    .from(itinerariesTable)
    .where(eq(itinerariesTable.status, "published"));

  const nameLower = destinationName.toLowerCase().trim();
  const slugLower = destinationSlug.toLowerCase().trim();

  const matched = allItineraries.filter((itin) => {
    if (itin.title?.toLowerCase().includes(nameLower)) return true;
    if (itin.overview?.toLowerCase().includes(nameLower)) return true;
    if (itin.tags?.some((t: string) => t.toLowerCase().includes(nameLower) || t.toLowerCase().includes(slugLower))) return true;
    if (itin.highlights?.some((h: string) => h.toLowerCase().includes(nameLower))) return true;
    if (Array.isArray(itin.days)) {
      return itin.days.some((day: any) => 
        day.place?.toLowerCase().includes(nameLower) ||
        day.title?.toLowerCase().includes(nameLower) ||
        day.body?.toLowerCase().includes(nameLower)
      );
    }
    return false;
  });

  if (matched.length > 0) return matched;
  return allItineraries.slice(0, 3);
}
