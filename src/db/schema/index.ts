import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  index,
  uniqueIndex,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Better Auth: Users ────────────────────────────────────────────────────
export const users = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    phoneNumber: text("phone_number"),
    role: text("role").notNull().default("user"),
    banned: boolean("banned"),
    banReason: text("ban_reason"),
    banExpires: timestamp("ban_expires"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: uniqueIndex("user_email_idx").on(table.email),
    roleIdx: index("user_role_idx").on(table.role),
    createdAtIdx: index("user_created_at_idx").on(table.createdAt),
  })
);

// ─── Better Auth: Sessions ─────────────────────────────────────────────────
export const sessions = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => ({
    userIdIdx: index("session_user_id_idx").on(table.userId),
    tokenIdx: uniqueIndex("session_token_idx").on(table.token),
    expiresAtIdx: index("session_expires_at_idx").on(table.expiresAt),
  })
);

// ─── Better Auth: Accounts (OAuth providers) ──────────────────────────────
export const accounts = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (table) => ({
    userIdIdx: index("account_user_id_idx").on(table.userId),
    providerIdx: index("account_provider_idx").on(table.providerId, table.accountId),
  })
);

// ─── Better Auth: Verifications ────────────────────────────────────────────
export const verifications = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
  },
  (table) => ({
    identifierIdx: index("verification_identifier_idx").on(table.identifier),
  })
);

// ─── Organizations ─────────────────────────────────────────────────────────
export const organizations = pgTable(
  "organizations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 60 }).notNull().unique(),
    logoUrl: text("logo_url"),
    plan: text("plan").$type<"free" | "pro" | "enterprise">().notNull().default("free"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("organizations_slug_idx").on(table.slug),
    planIdx: index("organizations_plan_idx").on(table.plan),
  })
);

// ─── Org Members ───────────────────────────────────────────────────────────
export const orgMembers = pgTable(
  "org_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role").$type<"owner" | "admin" | "member">().notNull().default("member"),
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
  },
  (table) => ({
    orgUserUniqueIdx: uniqueIndex("org_members_org_user_idx").on(table.orgId, table.userId),
    orgIdIdx: index("org_members_org_id_idx").on(table.orgId),
    userIdIdx: index("org_members_user_id_idx").on(table.userId),
  })
);

// ─── Invitations ───────────────────────────────────────────────────────────
export const invitations = pgTable(
  "invitations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    email: varchar("email", { length: 255 }).notNull(),
    role: text("role").$type<"owner" | "admin" | "member">().notNull().default("member"),
    token: text("token").notNull().unique(),
    invitedBy: text("invited_by")
      .notNull()
      .references(() => users.id),
    expiresAt: timestamp("expires_at").notNull(),
    acceptedAt: timestamp("accepted_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    tokenIdx: uniqueIndex("invitations_token_idx").on(table.token),
    orgIdIdx: index("invitations_org_id_idx").on(table.orgId),
    emailIdx: index("invitations_email_idx").on(table.email),
  })
);

// ─── Audit Logs ────────────────────────────────────────────────────────────
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    orgId: uuid("org_id").references(() => organizations.id, { onDelete: "set null" }),
    action: varchar("action", { length: 100 }).notNull(),
    resource: varchar("resource", { length: 100 }).notNull(),
    resourceId: varchar("resource_id", { length: 255 }),
    metadata: text("metadata").notNull().default("{}"),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    status: varchar("status", { length: 20 }).notNull().default("success"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index("audit_logs_user_id_idx").on(table.userId),
    orgIdIdx: index("audit_logs_org_id_idx").on(table.orgId),
    actionIdx: index("audit_logs_action_idx").on(table.action),
    createdAtIdx: index("audit_logs_created_at_idx").on(table.createdAt),
  })
);

// ─── Blog Posts ────────────────────────────────────────────────────────────
export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  tag: varchar("tag", { length: 50 }).notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  image: text("image").notNull(),
  readingTime: varchar("reading_time", { length: 20 }).notNull(),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Site Settings ─────────────────────────────────────────────────────────
export const siteSettings = pgTable("site_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value").notNull(),
  group: varchar("group", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Inquiries ─────────────────────────────────────────────────────────────
export const inquiries = pgTable("inquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 50 }).notNull(),
  nationality: varchar("nationality", { length: 100 }),
  arrivalDate: varchar("arrival_date", { length: 100 }),
  duration: integer("duration"), // nights
  travelers: integer("travelers").notNull().default(1),
  budget: varchar("budget", { length: 50 }),
  style: varchar("style", { length: 50 }),
  interests: jsonb("interests").$type<string[]>().default([]),
  message: text("message"),
  status: varchar("status", { length: 20 }).notNull().default("new"), // new, contacted, quoted, booked, lost
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Relations ─────────────────────────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  orgMembers: many(orgMembers),
  invitationsSent: many(invitations),
  auditLogs: many(auditLogs),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  members: many(orgMembers),
  invitations: many(invitations),
  auditLogs: many(auditLogs),
}));

export const orgMembersRelations = relations(orgMembers, ({ one }) => ({
  org: one(organizations, { fields: [orgMembers.orgId], references: [organizations.id] }),
  user: one(users, { fields: [orgMembers.userId], references: [users.id] }),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  org: one(organizations, { fields: [invitations.orgId], references: [organizations.id] }),
  invitedByUser: one(users, { fields: [invitations.invitedBy], references: [users.id] }),
}));

export const postsRelations = relations(posts, () => ({
  // Could add author relation here if needed
}));

// ─── Destinations ───────────────────────────────────────────────────────────
export const destinations = pgTable("destinations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  region: varchar("region", { length: 255 }).notNull(),
  image: text("image").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description"),
  featured: boolean("featured").default(false),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Itineraries ─────────────────────────────────────────────────────────────
export const itinerariesTable = pgTable("itineraries", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  duration: varchar("duration", { length: 100 }).notNull(),
  price: varchar("price", { length: 100 }).notNull(),
  pace: varchar("pace", { length: 100 }).notNull(),
  travelStyle: varchar("travel_style", { length: 100 }).notNull(),
  bestFor: varchar("best_for", { length: 255 }).notNull(),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  heroImg: text("hero_img").notNull(),
  mapImg: text("map_img"),
  overview: text("overview").notNull(),
  highlights: jsonb("highlights").$type<string[]>().notNull(),
  days: jsonb("days").$type<{
    day: string;
    title: string;
    place: string;
    body: string;
    img: string;
    activities: string[];
    travelTime: string;
    meals: { b: boolean; l: boolean; d: boolean };
    accommodation: string;
  }[]>().notNull(),
  inclusions: jsonb("inclusions").$type<string[]>().notNull(),
  exclusions: jsonb("exclusions").$type<string[]>().notNull(),
  needToKnow: jsonb("need_to_know").$type<{
    title: string;
    detail: string;
  }[]>().notNull(),
  faqs: jsonb("faqs").$type<{
    question: string;
    answer: string;
  }[]>().default([]),
  order: integer("order").default(0),
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Travel Categories ───────────────────────────────────────────────────────
export const travelCategories = pgTable("travel_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: varchar("label", { length: 100 }).notNull(),
  icon: varchar("icon", { length: 50 }).notNull(),
  image: text("image").notNull(),
  description: text("description"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Testimonials ────────────────────────────────────────────────────────────
export const testimonials = pgTable("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  origin: varchar("origin", { length: 255 }),
  text: text("text").notNull(),
  trip: varchar("trip", { length: 255 }),
  rating: integer("rating").notNull().default(5),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Gallery Images ──────────────────────────────────────────────────────────
export const galleryImages = pgTable("gallery_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: text("url").notNull(),
  alt: varchar("alt", { length: 255 }),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
