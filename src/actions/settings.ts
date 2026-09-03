"use server";

import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { siteSettings } from "@/db/schema";
import { checkAdmin } from "./utils";
import { revalidatePath } from "next/cache";

export async function getAllSettings() {
  await checkAdmin();
  const db = getDb();
  return await db.select().from(siteSettings);
}

export async function getPublicSettings() {
  const db = getDb();
  const rows = await db.select().from(siteSettings);
  
  const settings: Record<string, any> = {};
  for (const row of rows) {
    const [group, key] = row.key.split(".");
    if (group && key) {
      if (!settings[group]) settings[group] = {};
      settings[group][key] = row.value;
    } else {
      settings[row.key] = row.value;
    }
  }
  return settings;
}

export async function updateSettings(data: { key: string; value: string; group: string }[]) {
  await checkAdmin();
  const db = getDb();
  
  if (!data || !Array.isArray(data)) return { success: true };

  const now = new Date();

  for (const setting of data) {
    if (!setting.key) continue;
    await db
      .insert(siteSettings)
      .values({
        key: setting.key,
        value: setting.value ?? "",
        group: setting.group ?? "general",
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: {
          value: setting.value ?? "",
          group: setting.group ?? "general",
          updatedAt: now,
        },
      });
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/site-settings");

  return { success: true };
}
