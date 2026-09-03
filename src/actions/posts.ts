"use server";

import { eq, desc, count } from "drizzle-orm";
import { getDb } from "@/db/client";
import { posts } from "@/db/schema";
import { checkAdmin } from "./utils";
import { revalidatePath } from "next/cache";

export async function getPosts(page: number = 1, pageSize: number = 10, publishedOnly: boolean = false) {
  const db = getDb();
  
  const whereClause = publishedOnly ? eq(posts.published, true) : undefined;
  
  const countQuery = db.select({ count: count() }).from(posts);
  const baseQuery = db.select().from(posts);
  
  if (whereClause) {
    countQuery.where(whereClause);
    baseQuery.where(whereClause);
  }
  
  const [totalResult, rows] = await Promise.all([
    countQuery,
    baseQuery
      .orderBy(desc(posts.createdAt))
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

export async function getPostById(id: string) {
  const db = getDb();
  const [post] = await db
    .select()
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1);

  return post || null;
}

export async function getPostBySlug(slug: string) {
  const db = getDb();
  const [post] = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);

  return post || null;
}

export async function createPost(data: typeof posts.$inferInsert) {
  await checkAdmin();
  const db = getDb();
  
  const [createdPost] = await db
    .insert(posts)
    .values({
      ...data,
      updatedAt: new Date(),
    })
    .returning();

  revalidatePath("/blog");
  revalidatePath("/journal");
  revalidatePath("/");
  if (createdPost?.slug) {
    revalidatePath(`/blog/${createdPost.slug}`);
  }

  return createdPost;
}

export async function updatePost(id: string, data: Partial<typeof posts.$inferInsert>) {
  await checkAdmin();
  const db = getDb();
  
  const [updatedPost] = await db
    .update(posts)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, id))
    .returning();

  revalidatePath("/blog");
  revalidatePath("/journal");
  revalidatePath("/");
  if (updatedPost?.slug) {
    revalidatePath(`/blog/${updatedPost.slug}`);
  }

  return updatedPost;
}

export async function deletePost(id: string) {
  await checkAdmin();
  const db = getDb();
  const [postToDelete] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  await db.delete(posts).where(eq(posts.id, id));

  revalidatePath("/blog");
  revalidatePath("/journal");
  revalidatePath("/");
  if (postToDelete?.slug) {
    revalidatePath(`/blog/${postToDelete.slug}`);
  }
}

