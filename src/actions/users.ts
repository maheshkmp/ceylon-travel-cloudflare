"use server";

import { eq, desc, count } from "drizzle-orm";
import { getDb } from "@/db/client";
import { users } from "@/db/schema";
import { checkAdmin } from "./utils";

export async function getUsers(page: number = 1, pageSize: number = 10) {
  await checkAdmin();
  const db = getDb();
  
  const [totalResult, rows] = await Promise.all([
    db.select({ count: count() }).from(users),
    db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt))
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

export async function getUserById(id: string) {
  await checkAdmin();
  const db = getDb();
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return user || null;
}

export async function updateUser(id: string, data: Partial<typeof users.$inferInsert>) {
  await checkAdmin();
  const db = getDb();
  
  const [updatedUser] = await db
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();

  return updatedUser;
}

export async function deleteUser(id: string) {
  await checkAdmin();
  const db = getDb();
  await db.delete(users).where(eq(users.id, id));
}

export async function verifyUserEmail(id: string) {
  await checkAdmin();
  const db = getDb();
  const [updatedUser] = await db
    .update(users)
    .set({ emailVerified: true, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return updatedUser;
}

export async function updateUserRole(id: string, role: string) {
  await checkAdmin();
  const db = getDb();
  const [updatedUser] = await db
    .update(users)
    .set({ role: role, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return updatedUser;
}
