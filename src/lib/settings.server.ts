import { getDb } from "@/db/client";
import { siteSettings } from "@/db/schema";
import { type SiteSettings } from "@repo/validators/settings";

export async function getSiteSettings(): Promise<Partial<SiteSettings>> {
  try {
    if (process.env.NEXT_PHASE === "phase-production-build") {
      return {};
    }
    const db = getDb();
    const rows = await db.select().from(siteSettings).catch(() => []);
    
    // Reduce rows to a nested key-value object
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
    return settings as Partial<SiteSettings>;
  } catch (error) {
    return {};
  }
}
