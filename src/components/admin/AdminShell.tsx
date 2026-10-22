"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Files,
  ImageUp,
  Inbox,
  LayoutDashboard,
  LogOut,
  NotebookPen,
  Settings,
  Users,
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
    href: "/admin/upload-gallery",
    label: "Upload Gallery",
    icon: ImageUp,
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
    href: "/admin/subscribers",
    label: "Subscribers",
    icon: Users,
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
  "/admin/upload-gallery": "Upload Gallery",
  "/admin/manage-posts": "Manage Posts",
  "/admin/contact-messages": "Contact Messages",
  "/admin/subscribers": "Subscribers",
  "/admin/site-settings": "Site Settings",
};

export function AdminShell({ children, userEmail }: AdminShellProps) {
  const pathname = usePathname();
  const isLoginRoute = pathname === "/admin/login";

  if (isLoginRoute) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
          {children}
        </div>
      </div>
    );
  }

  const pageTitle = pageTitleMap[pathname] ?? "Admin Panel";
  const userLabel = userEmail ?? "admin";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[256px_minmax(0,1fr)]">
        <aside className="border-b border-slate-200 bg-white px-4 py-6 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:border-r">
          <div className="px-2">
            <Logo className="block w-[176px]" />
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
              CodeWithLogs CMS
            </p>
          </div>

          <nav className="mt-8 flex flex-col gap-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "inline-flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 border-t border-slate-200 pt-4 lg:mt-auto">
            <div className="flex items-center gap-3 px-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold uppercase text-primary">
                {userLabel.charAt(0)}
              </div>
              <p className="min-w-0 truncate text-sm text-slate-600">{userLabel}</p>
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="mt-3 inline-flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 px-5 py-4 backdrop-blur sm:px-6 lg:px-8">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">{pageTitle}</h1>
            <p className="text-sm text-slate-500">
              Manage blog content, subscribers, contact messages, and site settings.
            </p>
          </header>

          <main className="min-w-0 px-5 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
