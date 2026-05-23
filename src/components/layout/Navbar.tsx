"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/branding/Logo";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/tools", label: "Tools" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Logo
          priority
          className="block w-[170px] shrink-0 sm:w-[210px] lg:w-[240px]"
          imageClassName="block"
        />

        <nav className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium text-text/70 transition-colors hover:text-primary",
                  isActive && "bg-surface text-primary",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-primary/90"
        >
          Hire Me
        </Link>
      </div>
    </header>
  );
}
