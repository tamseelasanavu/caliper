"use client";

import { useState } from "react";
import { PRODUCT_CATEGORIES } from "@/lib/categories";
import type { Product, ProductCategory } from "@/lib/types";

const CATEGORIES: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "All items" },
  ...PRODUCT_CATEGORIES,
];

export function CategoryFilter({
  products,
  onFilter,
}: {
  products: Product[];
  onFilter?: (filtered: Product[]) => void;
}) {
  const [active, setActive] = useState<ProductCategory | "all">("all");

  const handleFilter = (cat: ProductCategory | "all") => {
    setActive(cat);
    if (onFilter) {
      const filtered = cat === "all" ? products : products.filter((p) => p.category === cat);
      onFilter(filtered);
    }
  };

  return (
    <div
      className="flex flex-wrap gap-3 mb-12"
      data-reveal
      role="group"
      aria-label="Filter the collection by category"
    >
      {CATEGORIES.map((cat, i) => (
        <button
          key={cat.value}
          type="button"
          data-reveal
          style={{ transitionDelay: `${i * 40}ms` }}
          aria-pressed={active === cat.value}
          onClick={() => handleFilter(cat.value)}
          className={`inline-flex min-h-11 items-center px-5 py-3 text-step-small uppercase tracking-[0.18em] border transition-colors ${
            active === cat.value
              ? "bg-jade border-jade text-ground font-semibold"
              : "bg-surface border-muted/30 text-muted hover:border-jade hover:text-jade"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
