import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const products = await getProducts();

  return [
    {
      url: `${base}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/products`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...products.map((product) => ({
      url: `${base}/products/${product.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
