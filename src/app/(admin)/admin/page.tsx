import { redirect } from "next/navigation";

import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function AdminIndexPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/admin/dashboard");
  } else {
    redirect("/admin/login");
  }

  return null;
}
