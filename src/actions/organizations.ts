"use server";

import { eq, desc, count } from "drizzle-orm";
import { getDb } from "@/db/client";
import { organizations, orgMembers } from "@/db/schema";
import { checkAdmin } from "./utils";

export async function getOrganizations(page: number = 1, pageSize: number = 10) {
  await checkAdmin();
  const db = getDb();
  
  const [totalResult, rows] = await Promise.all([
    db.select({ count: count() }).from(organizations),
    db
      .select()
      .from(organizations)
      .orderBy(desc(organizations.createdAt))
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

export async function getOrganizationById(id: string) {
  await checkAdmin();
  const db = getDb();
  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, id))
    .limit(1);

  return org || null;
}

export async function createOrganization(data: typeof organizations.$inferInsert) {
  await checkAdmin();
  const db = getDb();
  
  const [createdOrg] = await db
    .insert(organizations)
    .values({
      ...data,
      updatedAt: new Date(),
    })
    .returning();

  return createdOrg;
}

export async function updateOrganization(id: string, data: Partial<typeof organizations.$inferInsert>) {
  await checkAdmin();
  const db = getDb();
  
  const [updatedOrg] = await db
    .update(organizations)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(organizations.id, id))
    .returning();

  return updatedOrg;
}

export async function deleteOrganization(id: string) {
  await checkAdmin();
  const db = getDb();
  await db.delete(organizations).where(eq(organizations.id, id));
}

export async function getOrgMembers(orgId: string) {
  await checkAdmin();
  const db = getDb();
  return await db
    .select()
    .from(orgMembers)
    .where(eq(orgMembers.orgId, orgId));
}
