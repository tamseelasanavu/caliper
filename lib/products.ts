import { randomUUID } from "crypto";
import { unstable_noStore as noStore } from "next/cache";
import { readJson, runExclusive, writeJson } from "./data-store";
import type { Product } from "./types";

const FILE = "products.json";

export type ProductInput = Omit<Product, "id">;

export async function getProducts(): Promise<Product[]> {
  noStore();
  const products = await readJson<Product[]>(FILE, []);
  return Array.isArray(products) ? products : [];
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((product) => product.id === id);
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
}

export function createProduct(input: ProductInput): Promise<Product> {
  return runExclusive(async () => {
    const products = await readJson<Product[]>(FILE, []);
    const product: Product = { ...input, id: randomUUID() };
    await writeJson(FILE, [...products, product]);
    return product;
  });
}

export function updateProduct(
  id: string,
  input: ProductInput
): Promise<Product | undefined> {
  return runExclusive(async () => {
    const products = await readJson<Product[]>(FILE, []);
    let updated: Product | undefined;
    const next = products.map((product) => {
      if (product.id !== id) return product;
      updated = { ...product, ...input, id };
      return updated;
    });
    if (updated) await writeJson(FILE, next);
    return updated;
  });
}

export function deleteProduct(id: string): Promise<void> {
  return runExclusive(async () => {
    const products = await readJson<Product[]>(FILE, []);
    await writeJson(
      FILE,
      products.filter((product) => product.id !== id)
    );
  });
}

export function setProductFeatured(
  id: string,
  isFeatured: boolean
): Promise<void> {
  return runExclusive(async () => {
    const products = await readJson<Product[]>(FILE, []);
    await writeJson(
      FILE,
      products.map((product) =>
        product.id === id ? { ...product, isFeatured } : product
      )
    );
  });
}
