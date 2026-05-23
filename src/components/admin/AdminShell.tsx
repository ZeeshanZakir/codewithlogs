"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  FileText,
  Files,
  Inbox,
  LayoutDashboard,
  LogOut,
  NotebookPen,
  Settings,
} from "lucide-react";

import { Logo } from "@/components/branding/Logo";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  children: React.ReactNode;
  userEmail?: string | null;
};

const navItems = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/new-post",
    label: "New Post",
    icon: NotebookPen,
  },
  {
    href: "/admin/manage-posts",
    label: "Manage Posts",
    icon: Files,
  },
  {
    href: "/admin/contact-messages",
    label: "Contact Messages",
    icon: Inbox,
  },
  {
    href: "/admin/site-settings",
    label: "Site Settings",
    icon: Settings,
  },
];

const pageTitleMap: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/new-post": "New Post",
  "/admin/manage-posts": "Manage Posts",
  "/admin/contact-messages": "Contact Messages",
  "/admin/site-settings": "Site Settings",
};

export function AdminShell({ children, userEmail }: AdminShellProps) {
  const pathname = usePathname();
  const isLoginRoute = pathname === "/admin/login";

  if (isLoginRoute) {
    return (
      <div className="min-h-screen bg-[#0b1020] text-white">
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
          {children}
        </div>
      </div>
    );
  }

  const pageTitle = pageTitleMap[pathname] ?? "Admin Panel";

  return (
    <div className="min-h-screen bg-[#0b1020] text-white">
      <div className="grid min-h-screen lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="border-b border-white/10 bg-[#0f172a] px-5 py-6 lg:border-b-0 lg:border-r">
          <div className="space-y-3">
            <Logo className="block w-[190px]" imageClassName="rounded-lg bg-white p-2" />
            <div>
              <p className="font-semibold text-white">Admin Panel</p>
              <p className="text-sm text-white/55">CodeWithLogs CMS</p>
            </div>
          </div>

          <nav className="mt-10 flex flex-col gap-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "inline-flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </aside>

        <div className="min-w-0 bg-[#111827]">
          <header className="border-b border-white/10 px-5 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <h1 className="text-xl font-semibold text-white">{pageTitle}</h1>
                  <p className="text-sm text-white/55">
                    Manage blog content, contact messages, and site settings.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
                  {userEmail ?? "admin"}
                </div>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/admin/login" })}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          </header>

          <main className="min-w-0 px-5 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
