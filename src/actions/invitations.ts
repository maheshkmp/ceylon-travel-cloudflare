"use server";

import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { users, invitations, organizations } from "@/db/schema";

export async function validateInvitation(token: string) {
  if (!token) throw new Error("Invalid token");
  const db = getDb();

  const [invitationData] = await db
    .select({
      email: invitations.email,
      role: invitations.role,
      expiresAt: invitations.expiresAt,
      orgName: organizations.name,
    })
    .from(invitations)
    .leftJoin(organizations, eq(invitations.orgId, organizations.id))
    .where(eq(invitations.token, token))
    .limit(1);

  if (!invitationData) throw new Error("Invitation not found");

  return {
    orgName: invitationData.orgName || "Ceylon Travels",
    email: invitationData.email,
    role: invitationData.role,
    expired: new Date() > new Date(invitationData.expiresAt),
  };
}

export async function acceptInvitation(token: string) {
  if (!token) throw new Error("Invalid token");
  const db = getDb();

  const [invitation] = await db
    .select()
    .from(invitations)
    .where(eq(invitations.token, token))
    .limit(1);

  if (!invitation) throw new Error("Invitation not found");
  if (new Date() > new Date(invitation.expiresAt)) throw new Error("Invitation expired");

  await db.update(invitations)
    .set({ acceptedAt: new Date() })
    .where(eq(invitations.token, token));

  return { success: true };
}
