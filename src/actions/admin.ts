"use server";

import { desc, count, eq, ilike, or } from "drizzle-orm";
import { getDb } from "@/db/client";
import { users, sessions, organizations } from "@/db/schema";
import { checkAdmin } from "./utils";

export async function getAdminStats() {
  await checkAdmin();
  const db = getDb();
  
  const [userCount, orgCount, sessionCount] = await Promise.all([
    db.select({ count: count() }).from(users),
    db.select({ count: count() }).from(organizations),
    db.select({ count: count() }).from(sessions),
  ]);

  return {
    users: { total: Number(userCount[0]?.count ?? 0), newThisMonth: 0 },
    organizations: { total: Number(orgCount[0]?.count ?? 0) },
    sessions: { active: Number(sessionCount[0]?.count ?? 0) },
  };
}

export async function getAdminUsers(page: number = 1, pageSize: number = 20, search?: string) {
  await checkAdmin();
  const db = getDb();

  const baseQuery = db.select().from(users);
  const countQuery = db.select({ count: count() }).from(users);

  if (search) {
    const filter = or(
      ilike(users.name, `%${search}%`),
      ilike(users.email, `%${search}%`)
    );
    baseQuery.where(filter);
    countQuery.where(filter);
  }

  const [totalResult, rows] = await Promise.all([
    countQuery,
    baseQuery
      .orderBy(desc(users.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
  ]);

  const total = Number(totalResult[0]?.count ?? 0);
  
  return {
    data: rows,
    meta: {
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      }
    }
  };
}

export async function updateUserRole(id: string, role: string) {
  await checkAdmin();
  const db = getDb();
  await db.update(users).set({ role: role as any }).where(eq(users.id, id));
}

export async function verifyUserEmail(id: string) {
  await checkAdmin();
  const db = getDb();
  await db.update(users).set({ emailVerified: true }).where(eq(users.id, id));
}

export async function deleteUser(id: string) {
  await checkAdmin();
  const db = getDb();
  await db.delete(users).where(eq(users.id, id));
}

export async function getAdminSessions(page: number = 1, pageSize: number = 25) {
  await checkAdmin();
  const db = getDb();

  const [totalResult, rows] = await Promise.all([
    db.select({ count: count() }).from(sessions),
    db
      .select({
        id: sessions.id,
        userId: sessions.userId,
        userAgent: sessions.userAgent,
        ipAddress: sessions.ipAddress,
        expiresAt: sessions.expiresAt,
        createdAt: sessions.createdAt,
        updatedAt: sessions.updatedAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(sessions)
      .leftJoin(users, eq(sessions.userId, users.id))
      .orderBy(desc(sessions.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
  ]);

  const total = Number(totalResult[0]?.count ?? 0);
  
  return {
    data: rows.map(r => ({
      ...r,
      lastUsedAt: r.updatedAt,
    })),
    meta: {
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      }
    }
  };
}
