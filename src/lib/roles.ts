// Shared by the proxy, server code and client components, so keep it free of
// server-only imports.

export type AdminRole = "admin" | "writer";

/** Routes a writer may open. Everything else under /admin is admin-only. */
export const WRITER_ROUTES = ["/admin/manage-posts", "/admin/new-post"] as const;

export const WRITER_HOME = "/admin/manage-posts";

type SessionLike = {
  user?: { role?: AdminRole; accessExpiresAt?: string | null } | null;
} | null | undefined;

export function getRole(session: SessionLike): AdminRole {
  // Profiles created before roles existed have no role and are admins.
  return session?.user?.role === "writer" ? "writer" : "admin";
}

export function isAccessExpired(accessExpiresAt?: string | null) {
  return Boolean(accessExpiresAt && new Date(accessExpiresAt).getTime() <= Date.now());
}

export function canAccessAdminPath(role: AdminRole, pathname: string) {
  if (role === "admin") return true;
  return WRITER_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function getHomePath(role: AdminRole) {
  return role === "writer" ? WRITER_HOME : "/admin/dashboard";
}
