"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

const FRAMES = [
  {
    src: "/assets/calliper/envelope-wax-seal.jpg",
    alt: "Kraft envelope sealed with wax and dried flowers",
  },
  {
    src: "/assets/calliper/frame-baby-name.webp",
    alt: "Personalised baby name journaling frame",
  },
  {
    src: "/assets/calliper/phone-case-fortuner-1.jpg",
    alt: "Hand-drawn custom phone case",
  },
];

export function Hero({
  settings,
}: {
  settings: Pick<
    SiteSettings,
    "heroTitle" | "heroTitleAccent" | "heroParagraph" | "heroNote"
  >;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      if (document.visibilityState === "visible") {
        setActive((i) => (i + 1) % FRAMES.length);
      }
    }, 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-[100svh] grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 md:p-6 lg:h-[100svh]">
      {/* The object: a filled receipt-style panel */}
      <div
        className="lg:col-span-7 flex flex-col justify-center bg-ink text-ground p-6 md:p-12 lg:p-16 min-h-[46svh] lg:min-h-0"
      >
        <h1 className="font-display text-step-head">
          {settings.heroTitle}
          <span className="block">{settings.heroTitleAccent}</span>
        </h1>
        <p className="text-step-lead max-w-prose mt-8 mb-6">
          {settings.heroParagraph}
        </p>
        <p className="text-step-small max-w-prose mb-10 pt-4">
          {settings.heroNote}
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/products"
            className="btn-press inline-block bg-jade text-ground px-7 py-4 text-step-small uppercase tracking-[0.18em] font-semibold"
          >
            Browse the collection
          </Link>
          <a
            href="#how"
            className="btn-outline inline-block px-7 py-4 text-step-small uppercase tracking-[0.18em] font-semibold"
          >
            How it works
          </a>
        </div>
      </div>

      {/* Slow crossfade frame of the subject's world */}
      <div className="lg:col-span-5 relative h-[42svh] lg:h-full overflow-hidden">
        {FRAMES.map((f, i) => (
          <Image
            key={f.src}
            src={f.src}
            alt={f.alt}
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 41.6vw, 100vw"
            className={`hero-frame object-cover ${
              i === active ? "is-active" : ""
            }`}
          />
        ))}
      </div>
    </section>
  );
}
