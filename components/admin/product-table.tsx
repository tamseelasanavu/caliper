"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  deleteProductAction,
  toggleFeaturedAction,
} from "@/app/admin/actions";
import { categoryLabel } from "@/lib/categories";
import type { Product } from "@/lib/types";
import {
  BoxIcon,
  EditIcon,
  ImageIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "./icons";
import {
  buttonDanger,
  buttonPrimary,
  buttonSecondary,
  cn,
  inputClass,
} from "./ui";

function priceLabel(product: Product): string {
  if (product.price === undefined || product.price === null) return "DM price";
  return `${product.currency} ${product.price.toLocaleString("en-PK")}`;
}

function FeaturedToggle({ product }: { product: Product }) {
  return (
    <form action={toggleFeaturedAction}>
      <input type="hidden" name="id" value={product.id} />
      <input
        type="hidden"
        name="featured"
        value={String(!product.isFeatured)}
      />
      <button
        type="submit"
        aria-pressed={product.isFeatured}
        title={
          product.isFeatured
            ? "Remove from featured"
            : "Show on the home page"
        }
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors",
          product.isFeatured
            ? "border-jade/40 bg-jade/15 text-jade"
            : "border-muted/25 text-muted hover:border-muted/50 hover:text-ink"
        )}
      >
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            product.isFeatured ? "bg-jade" : "bg-muted/60"
          )}
        />
        {product.isFeatured ? "Featured" : "Standard"}
      </button>
    </form>
  );
}

function DeleteButton({ product }: { product: Product }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className={cn(buttonDanger, "px-2")}
        aria-label={`Delete ${product.name}`}
        title="Delete product"
      >
        <TrashIcon />
      </button>
    );
  }

  return (
    <form
      action={deleteProductAction}
      className="flex items-center justify-end gap-1"
    >
      <input type="hidden" name="id" value={product.id} />
      <span className="text-xs text-muted">Delete?</span>
      <button type="submit" className={cn(buttonDanger, "px-2")}>
        Yes
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className={cn(buttonSecondary, "min-h-8 px-2 text-xs")}
      >
        Cancel
      </button>
    </form>
  );
}

export function ProductTable({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const trimmed = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!trimmed) return products;
    return products.filter((product) =>
      [product.name, product.slug, product.category, categoryLabel(product.category)]
        .join(" ")
        .toLowerCase()
        .includes(trimmed)
    );
  }, [products, trimmed]);

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-muted/30 bg-surface/60 px-6 py-16 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-jade/10 text-jade">
          <BoxIcon width={22} height={22} />
        </span>
        <h2 className="mt-5 text-base font-semibold">Add your first product</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
          Products appear on the storefront as soon as you save them. Start with
          a name, a photo and a description.
        </p>
        <Link
          href="/admin/products/new"
          className={cn(buttonPrimary, "mt-6")}
        >
          <PlusIcon />
          New product
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-muted/20 bg-surface">
      <div className="flex flex-wrap items-center gap-3 border-b border-muted/15 px-4 py-3.5">
        <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <label htmlFor="product-search" className="sr-only">
            Search products
          </label>
          <input
            id="product-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products"
            className={cn(inputClass, "h-9 py-1.5 pl-9 text-sm")}
          />
        </div>
        <p className="ml-auto text-xs tabular-nums text-muted">
          {trimmed
            ? `${filtered.length} of ${products.length} products`
            : `${products.length} ${products.length === 1 ? "product" : "products"}`}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="px-6 py-14 text-center">
          <p className="text-sm text-muted">
            No products match &ldquo;{query.trim()}&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className={cn(buttonSecondary, "mt-4")}
          >
            Clear search
          </button>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-muted/10 md:hidden">
          {filtered.map((product) => (
            <li key={product.id} className="p-4">
              <div className="flex gap-3">
                <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md border border-muted/20 bg-ground">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-muted">
                      <ImageIcon />
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="block truncate font-medium text-ink underline-offset-4 hover:text-jade hover:underline"
                  >
                    {product.name}
                  </Link>
                  <p className="truncate text-xs text-muted">
                    /{product.slug}
                  </p>
                  <p className="mt-1 truncate text-xs text-muted">
                    {categoryLabel(product.category)} · {priceLabel(product)} ·{" "}
                    {product.leadTimeDays} days
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <FeaturedToggle product={product} />
                    <div className="ml-auto flex items-center gap-1">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className={cn(buttonSecondary, "min-h-8 px-2.5 text-xs")}
                      >
                        <EditIcon width={15} height={15} />
                        Edit
                      </Link>
                      <DeleteButton product={product} />
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-muted/15 text-[11px] uppercase tracking-[0.08em] text-muted">
                <th className="px-4 py-2.5 font-semibold">Product</th>
                <th className="hidden px-3 py-2.5 font-semibold sm:table-cell">
                  Category
                </th>
                <th className="hidden px-3 py-2.5 font-semibold md:table-cell">
                  Price
                </th>
                <th className="hidden px-3 py-2.5 font-semibold lg:table-cell">
                  Lead time
                </th>
                <th className="px-3 py-2.5 font-semibold">Featured</th>
                <th className="px-4 py-2.5 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-muted/10 transition-colors last:border-0 hover:bg-ink/[0.03]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-md border border-muted/20 bg-ground">
                        {product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-muted">
                            <ImageIcon />
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="block truncate font-medium text-ink underline-offset-4 hover:text-jade hover:underline"
                        >
                          {product.name}
                        </Link>
                        <p className="truncate text-xs text-muted">
                          /{product.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-3 py-3 text-muted sm:table-cell">
                    {categoryLabel(product.category)}
                  </td>
                  <td className="hidden px-3 py-3 tabular-nums text-muted md:table-cell">
                    {priceLabel(product)}
                  </td>
                  <td className="hidden px-3 py-3 tabular-nums text-muted lg:table-cell">
                    {product.leadTimeDays} days
                  </td>
                  <td className="px-3 py-3">
                    <FeaturedToggle product={product} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className={cn(buttonSecondary, "min-h-8 px-2.5 text-xs")}
                      >
                        <EditIcon width={15} height={15} />
                        Edit
                      </Link>
                      <DeleteButton product={product} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
}
