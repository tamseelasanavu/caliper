"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type NavLink = {
  href: string;
  label: string;
  external?: boolean;
};

function NavItem({
  link,
  className,
  onClick,
}: {
  link: NavLink;
  className: string;
  onClick?: () => void;
}) {
  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={className}
      >
        {link.label}
      </a>
    );
  }

  return (
    <Link href={link.href} onClick={onClick} className={className}>
      {link.label}
    </Link>
  );
}

export function Navbar({
  settings,
}: {
  settings: { storeName: string; instagramHandle: string };
}) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const instagramUrl = `https://www.instagram.com/${settings.instagramHandle}`;
  const dmUrl = `https://ig.me/m/${settings.instagramHandle}`;
  const links: NavLink[] = [
    { href: "/products", label: "Shop" },
    { href: "/#how", label: "How it works" },
    { href: instagramUrl, label: "Instagram", external: true },
  ];

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-ground/95 backdrop-blur">
      <nav className="flex items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="font-display text-step-lead tracking-tight">
          {settings.storeName}
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <NavItem
              key={link.href}
              link={link}
              className="text-step-small uppercase tracking-[0.18em] link-shift"
            />
          ))}
          <a
            href={dmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-press inline-block bg-jade text-ground px-5 py-2.5 text-step-small uppercase tracking-[0.18em] font-semibold"
          >
            DM to order
          </a>
        </div>

        <button
          ref={toggleRef}
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
          className="md:hidden -mr-2 inline-flex min-h-11 min-w-11 items-center justify-center p-2.5"
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-6 bg-ink transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-6 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-ink transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="md:hidden bg-ground px-4 py-4 space-y-1">
          {links.map((link) => (
            <NavItem
              key={link.href}
              link={link}
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center text-step-body uppercase tracking-[0.18em]"
            />
          ))}
          <a
            href={dmUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="btn-press mt-3 inline-block bg-jade text-ground px-5 py-3 text-step-small uppercase tracking-[0.18em] font-semibold"
          >
            DM to order
          </a>
        </div>
      )}
    </header>
  );
}
