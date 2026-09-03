import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function checkAdmin() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });
  
  if (!session) {
    throw new Error("Authentication required");
  }
  if (session.user.role !== "admin") {
    throw new Error("Requires admin role or higher");
  }
  return session.user;
}
