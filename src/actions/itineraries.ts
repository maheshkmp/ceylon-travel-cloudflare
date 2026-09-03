"use server";

import { headers } from "next/headers";
import { revalidateTag } from "next/cache";
import { eq, desc, count, ilike, or, asc, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { itinerariesTable } from "@/db/schema";
import { checkAdmin } from "./utils";

export async function getItineraries(page: number = 1, pageSize: number = 10, search?: string, statusFilter?: string) {
  const db = getDb();
  
  const baseQuery = db.select().from(itinerariesTable);
  const countQuery = db.select({ count: count() }).from(itinerariesTable);

  const filters = [];
  if (search) {
    filters.push(
      or(
        ilike(itinerariesTable.title, `%${search}%`),
        ilike(itinerariesTable.slug, `%${search}%`)
      )
    );
  }

  if (statusFilter) {
    filters.push(eq(itinerariesTable.status, statusFilter));
  }

  if (filters.length > 0) {
    const { and } = await import("drizzle-orm");
    baseQuery.where(and(...filters));
    countQuery.where(and(...filters));
  }
  
  const [totalResult, rows] = await Promise.all([
    countQuery,
    baseQuery
      .orderBy(asc(itinerariesTable.order), desc(itinerariesTable.createdAt))
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

export async function getItineraryById(id: string) {
  const db = getDb();
  const [itinerary] = await db
    .select()
    .from(itinerariesTable)
    .where(eq(itinerariesTable.id, id))
    .limit(1);

  return itinerary || null;
}

export async function getItineraryBySlug(slug: string) {
  const db = getDb();
  const [itinerary] = await db
    .select()
    .from(itinerariesTable)
    .where(eq(itinerariesTable.slug, slug))
    .limit(1);

  return itinerary || null;
}

export async function createItinerary(data: typeof itinerariesTable.$inferInsert) {
  await checkAdmin();
  const db = getDb();
  
  const [createdItinerary] = await db
    .insert(itinerariesTable)
    .values({
      ...data,
      updatedAt: new Date(),
    })
    .returning();

  revalidateTag("home-itineraries");
  return createdItinerary;
}

export async function updateItinerary(id: string, data: Partial<typeof itinerariesTable.$inferInsert>) {
  await checkAdmin();
  const db = getDb();
  
  const [updatedItinerary] = await db
    .update(itinerariesTable)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(itinerariesTable.id, id))
    .returning();

  revalidateTag("home-itineraries");
  return updatedItinerary;
}

export async function deleteItinerary(id: string) {
  await checkAdmin();
  const db = getDb();
  await db.delete(itinerariesTable).where(eq(itinerariesTable.id, id));
  revalidateTag("home-itineraries");
}

export async function reorderItineraries(updates: { id: string; order: number }[]) {
  await checkAdmin();
  const db = getDb();
  
  await Promise.all(
    updates.map((update) =>
      db
        .update(itinerariesTable)
        .set({ order: update.order })
        .where(eq(itinerariesTable.id, update.id))
    )
  );
  revalidateTag("home-itineraries");
}

export async function updateItineraryStatus(id: string, status: string) {
  await checkAdmin();
  const db = getDb();
  
  const [updatedItinerary] = await db
    .update(itinerariesTable)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(itinerariesTable.id, id))
    .returning();

  revalidateTag("home-itineraries");
  return updatedItinerary;
}
