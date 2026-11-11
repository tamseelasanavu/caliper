"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { logoutAction } from "@/app/admin/actions";
import {
  BoxIcon,
  CloseIcon,
  ExternalIcon,
  LogoutIcon,
  MenuIcon,
  SettingsIcon,
} from "./icons";
import { cn } from "./ui";

const NAV = [
  { href: "/admin", label: "Products", icon: BoxIcon, match: "products" },
  {
    href: "/admin/settings",
    label: "Storefront",
    icon: SettingsIcon,
    match: "settings",
  },
];

function isActive(pathname: string, match: string): boolean {
  if (match === "products") {
    return pathname === "/admin" || pathname.startsWith("/admin/products");
  }
  return pathname.startsWith("/admin/settings");
}

export function AdminShell({
  children,
  storeName,
}: {
  children: ReactNode;
  storeName: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-h-svh bg-ground font-ui text-ink lg:grid lg:grid-cols-[260px_1fr]">
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-muted/15 bg-surface transition-transform duration-200 ease-out lg:sticky lg:top-0 lg:z-0 lg:h-svh lg:w-auto lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-3 border-b border-muted/15 px-5 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-jade font-display text-lg text-ground">
            {storeName.trim().charAt(0).toUpperCase() || "C"}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{storeName}</p>
            <p className="text-xs text-muted">Store manager</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="ml-auto rounded-md p-2 text-muted hover:bg-ink/5 hover:text-ink lg:hidden"
            aria-label="Close navigation"
          >
            <CloseIcon />
          </button>
        </div>

        <nav aria-label="Dashboard" className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {NAV.map((item) => {
              const active = isActive(pathname, item.match);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-jade/15 text-jade"
                        : "text-muted hover:bg-ink/5 hover:text-ink"
                    )}
                  >
                    <Icon
                      className={active ? "text-jade" : "text-muted"}
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="space-y-1 border-t border-muted/15 px-3 py-4">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <ExternalIcon />
            View storefront
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted transition-colors hover:bg-alert/10 hover:text-alert"
            >
              <LogoutIcon />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-muted/15 bg-ground/95 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-md p-2 text-ink hover:bg-ink/5"
            aria-label="Open navigation"
            aria-expanded={open}
          >
            <MenuIcon />
          </button>
          <p className="truncate text-sm font-semibold">{storeName}</p>
        </header>

        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
