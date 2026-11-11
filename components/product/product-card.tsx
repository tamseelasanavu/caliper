import Link from "next/link";
import type { ElementType } from "react";
import type { Product } from "@/lib/types";
import { SmartImage } from "@/components/ui/smart-image";

export function ProductCard({
  product,
  index = 0,
  headingLevel = 3,
}: {
  product: Product;
  index?: number;
  headingLevel?: 2 | 3;
}) {
  const Heading = `h${headingLevel}` as ElementType;

  return (
    <div data-reveal style={{ transitionDelay: `${index * 60}ms` }}>
      <Link
        href={`/products/${product.slug}`}
        className="card-lift group relative flex h-full flex-col bg-surface p-5 md:p-6"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden mb-5">
          {product.images[0] ? (
            <SmartImage
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="img-breathe object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-ground text-step-small text-muted">
              Photo coming soon
            </div>
          )}
        </div>
        <Heading className="font-display text-step-subhead leading-tight mb-3">
          {product.name}
        </Heading>
        <p className="text-step-body text-muted mb-6 line-clamp-2">{product.description}</p>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-4 gap-y-2 bg-ground/40 px-4 py-3 -mx-5 md:-mx-6 -mb-5 md:-mb-6">
          <p className="font-display text-step-lead">
            {product.price
              ? `${product.currency} ${product.price.toLocaleString("en-PK")}`
              : "DM for price"}
          </p>
          <p className="text-step-small text-muted capitalize">
            {product.category.replace(/_/g, " ")} · ready in {product.leadTimeDays} days
          </p>
        </div>
      </Link>
    </div>
  );
}
