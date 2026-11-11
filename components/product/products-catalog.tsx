"use client";

import { useState } from "react";
import { CategoryFilter } from "./category-filter";
import { ProductGrid } from "./product-grid";
import { useReveal } from "@/components/ui/reveal";
import type { Product } from "@/lib/types";

export function ProductsCatalog({ products }: { products: Product[] }) {
  useReveal();
  const [filtered, setFiltered] = useState<Product[]>(products);

  return (
    <>
      <CategoryFilter products={products} onFilter={setFiltered} />

      <ProductGrid products={filtered} headingLevel={2} />

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-step-lead text-muted">
            No products found in this category.
          </p>
        </div>
      )}
    </>
  );
}
