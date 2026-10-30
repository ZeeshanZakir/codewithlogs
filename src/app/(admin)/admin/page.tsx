import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getHomePath, getRole } from "@/lib/roles";

export const dynamic = "force-dynamic";

export default async function AdminIndexPage() {
  const session = await auth();

  if (session?.user) {
    redirect(getHomePath(getRole(session)));
  } else {
    redirect("/admin/login");
  }

  return null;
}
