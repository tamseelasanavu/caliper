"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function SiteChrome({
  navbar,
  footer,
  children,
}: {
  navbar: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdmin && navbar}
      {children}
      {!isAdmin && footer}
    </>
  );
}
