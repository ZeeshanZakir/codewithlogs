import "server-only";

import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import { Profile } from "@/lib/profile";
import { getRole, isAccessExpired, type AdminRole } from "@/lib/roles";

export type AdminUser = {
  email: string;
  role: AdminRole;
};

/**
 * The signed-in CMS user, or null. Writer accounts are re-checked against the
 * database so deleting or expiring the profile cuts off an existing session.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) return null;

  const role = getRole(session);

  if (role === "writer") {
    await dbConnect();
    const profile = await Profile.findOne({ email: email.toLowerCase() }).lean();

    if (
      !profile ||
      profile.role !== "writer" ||
      isAccessExpired(profile.expiresAt?.toISOString())
    ) {
      return null;
    }
  }

  return { email, role };
}

/** Any CMS user: admin or an active writer. */
export async function requireEditor() {
  const user = await getAdminUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireEditor();

  if (user.role !== "admin") {
    throw new Error("Forbidden");
  }

  return user;
}
