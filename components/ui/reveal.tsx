"use client";

import { useEffect } from "react";

/**
 * Global scroll-reveal for every [data-reveal] element, including elements
 * added later (e.g. after category filtering). Respects
 * prefers-reduced-motion: elements simply stay visible.
 */
export function useReveal() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    const observe = (el: Element) => {
      const target = el as HTMLElement;
      if (target.classList.contains("is-in")) return;
      io.observe(target);
    };

    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach(observe);

    // Pick up [data-reveal] nodes added after first paint (filtering, hydration).
    const mo = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches("[data-reveal]")) observe(node);
            node.querySelectorAll<HTMLElement>("[data-reveal]").forEach(observe);
          }
        });
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}
