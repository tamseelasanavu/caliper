"use client";

import { useReveal } from "./reveal";

/**
 * Client wrapper for scroll-reveal. Mount once per page that needs
 * [data-reveal] animation.
 */
export function RevealProvider({ children }: { children: React.ReactNode }) {
  useReveal();
  return <>{children}</>;
}
