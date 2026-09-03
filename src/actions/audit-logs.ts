"use server";

import { desc, count, ilike, eq, or, and, sql, sum } from "drizzle-orm";
import { getDb } from "@/db/client";
import { auditLogs, users } from "@/db/schema";
import { checkAdmin } from "./utils";

export async function getAuditLogs(page: number = 1, pageSize: number = 20, search?: string, resource?: string, status?: string) {
  await checkAdmin();
  const db = getDb();
  
  const baseQuery = db.select({
    id: auditLogs.id,
    action: auditLogs.action,
    resource: auditLogs.resource,
    resourceId: auditLogs.resourceId,
    ipAddress: auditLogs.ipAddress,
    createdAt: auditLogs.createdAt,
    status: auditLogs.status,
    userId: auditLogs.userId,
    userName: users.name,
    userEmail: users.email,
  }).from(auditLogs).leftJoin(users, eq(auditLogs.userId, users.id));

  const countQuery = db.select({ count: count() }).from(auditLogs).leftJoin(users, eq(auditLogs.userId, users.id));

  const filters = [];
  if (search) {
    filters.push(
      or(
        ilike(auditLogs.action, `%${search}%`),
        ilike(users.name, `%${search}%`),
        ilike(auditLogs.ipAddress, `%${search}%`)
      )
    );
  }
  if (resource && resource !== "all") {
    filters.push(eq(auditLogs.resource, resource));
  }
  if (status && status !== "all") {
    filters.push(eq(auditLogs.status, status));
  }
  if (filters.length > 0) {
    const combinedFilter = and(...filters);
    baseQuery.where(combinedFilter);
    countQuery.where(combinedFilter);
  }

  const [totalResult, rows] = await Promise.all([
    countQuery,
    baseQuery
      .orderBy(desc(auditLogs.createdAt))
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

export async function getAuditLogStats() {
  await checkAdmin();
  const db = getDb();

  const [stats] = await db
    .select({
      total: count(),
      successCount: sum(sql`CASE WHEN status = 'success' THEN 1 ELSE 0 END`),
      warningCount: sum(sql`CASE WHEN status = 'warning' THEN 1 ELSE 0 END`),
      failedCount: sum(sql`CASE WHEN status = 'failed' THEN 1 ELSE 0 END`),
    })
    .from(auditLogs);

  return {
    total: Number(stats?.total ?? 0),
    successCount: Number(stats?.successCount ?? 0),
    warningCount: Number(stats?.warningCount ?? 0),
    failedCount: Number(stats?.failedCount ?? 0),
  };
}
