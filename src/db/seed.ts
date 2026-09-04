import { getDb } from "./client";
import { users, organizations, orgMembers, accounts } from "./schema";
import { hashPassword } from "better-auth/crypto";

async function seed() {
  console.log("🌱 Seeding database…");
  const db = getDb();
  const now = new Date();

  // Better Auth stores passwords in the `account` table, not on the user.
  // For seeding we create credential accounts directly.
  const passwordHash = await hashPassword("Admin1234!");

  // ── Seed users ────────────────────────────────────────────────────────────
  const seedUsers = [
    { id: "seed-superadmin", email: "superadmin@example.com", name: "Super Admin", role: "admin" as const },
    { id: "seed-admin",      email: "admin@example.com",      name: "Admin User",  role: "admin"       as const },
    ...Array.from({ length: 5 }, (_, i) => ({
      id:    `seed-user-${i + 1}`,
      email: `user${i + 1}@example.com`,
      name:  `Test User ${i + 1}`,
      role:  "user" as const,
    })),
  ];

  for (const u of seedUsers) {
    await db.insert(users).values({
      id:            u.id,
      email:         u.email,
      name:          u.name,
      role:          u.role,
      emailVerified: true,
      createdAt:     now,
      updatedAt:     now,
    }).onConflictDoNothing();

    // Create credential account (Better Auth credential provider)
    await db.insert(accounts).values({
      id:         `${u.id}-credential`,
      accountId:  u.id,
      providerId: "credential",
      userId:     u.id,
      password:   passwordHash,
      createdAt:  now,
      updatedAt:  now,
    }).onConflictDoNothing();
  }

  console.log(`✅ ${seedUsers.length} users seeded`);

  // ── Seed organizations ────────────────────────────────────────────────────
  const orgData = [
    { name: "Acme Corp",       slug: "acme",           plan: "pro"        as const },
    { name: "Startup Inc",     slug: "startup-inc",    plan: "free"       as const },
    { name: "Enterprise Ltd",  slug: "enterprise-ltd", plan: "enterprise" as const },
  ];

  for (const o of orgData) {
    await db.insert(organizations).values({
      ...o,
      createdAt: now,
      updatedAt: now,
    }).onConflictDoNothing();
  }

  // ── Seed org memberships ──────────────────────────────────────────────────
  const [acme] = await db.select().from(organizations).where(
    (await import("drizzle-orm")).eq(organizations.slug, "acme")
  ).limit(1);

  if (acme) {
    await db.insert(orgMembers).values([
      { orgId: acme.id, userId: "seed-admin", role: "owner" },
      { orgId: acme.id, userId: "seed-user-1", role: "member" },
      { orgId: acme.id, userId: "seed-user-2", role: "member" },
    ]).onConflictDoNothing();
  }

  console.log("✅ Organizations and memberships seeded");
  console.log("\n🎉 Seed complete!");
  console.log("\nCredentials (password: Admin1234!):");
  console.log("  superadmin@example.com  → admin");
  console.log("  admin@example.com       → admin");
  console.log("  user1-5@example.com     → user");

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
