import type { Metadata } from "next";
import type { ReactNode } from "react";

import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { getRole } from "@/lib/roles";

export const metadata: Metadata = { robots: { index: false, follow: false } };

type AdminRootLayoutProps = {
  children: ReactNode;
};

export default async function AdminRootLayout({
  children,
}: AdminRootLayoutProps) {
  const session = await auth();

  return (
    <AdminShell userEmail={session?.user?.email} role={getRole(session)}>
      {children}
    </AdminShell>
  );
}
