import type { Product } from "@/lib/types";
import { ProductCard } from "./product-card";

export function ProductGrid({
  products,
  columns = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  headingLevel = 3,
}: {
  products: Product[];
  columns?: string;
  headingLevel?: 2 | 3;
}) {
  return (
    <div className={`grid gap-4 md:gap-6 ${columns}`}>
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          index={i}
          headingLevel={headingLevel}
        />
      ))}
    </div>
  );
}
