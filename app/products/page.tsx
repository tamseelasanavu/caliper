import type { Metadata } from "next";
import { ProductsCatalog } from "@/components/product/products-catalog";
import { SmartImage } from "@/components/ui/smart-image";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop the collection",
  description:
    "Made-to-order vintage letters, journaling frames, cards, phone cases and scrapbooks — each piece built around your story.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main id="main" tabIndex={-1} className="min-h-[80svh]">
      <section className="px-4 md:px-6 pt-12 md:pt-16 pb-16 md:pb-24">
        <div data-reveal className="max-w-3xl">
          <h1 className="font-display text-step-head">The collection</h1>
          <p className="text-step-body text-muted mt-6 max-w-prose">
            Every piece is made to order — vintage letters, journaling frames,
            cards, phone cases and scrapbooks, built around your story.
          </p>
        </div>

        <div
          className="relative mt-10 md:mt-12 h-[42svh] md:h-[46svh] w-full overflow-hidden bg-surface"
          data-reveal
        >
          <SmartImage
            src="/assets/calliper/hamper-fairy-lights-1.jpg"
            alt="A gift hamper wrapped by hand in the studio"
            fill
            priority
            sizes="100vw"
            className="img-breathe object-cover"
          />
        </div>

        <div className="mt-12 md:mt-16">
          <ProductsCatalog products={products} />
        </div>
      </section>
    </main>
  );
}
