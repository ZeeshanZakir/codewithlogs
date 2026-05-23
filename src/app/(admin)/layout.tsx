import type { ReactNode } from "react";

import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/AdminShell";

type AdminRootLayoutProps = {
  children: ReactNode;
};

export default async function AdminRootLayout({
  children,
}: AdminRootLayoutProps) {
  const session = await auth();

  return <AdminShell userEmail={session?.user?.email}>{children}</AdminShell>;
}
