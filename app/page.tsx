import Link from "next/link";
import { RevealProvider } from "@/components/ui/reveal-provider";
import { Hero } from "@/components/product/hero";
import { ProductGrid } from "@/components/product/product-grid";
import { HowItWorks } from "@/components/product/how-it-works";
import { InstagramGrid } from "@/components/social/instagram-grid";
import { getProducts } from "@/lib/products";
import { getSettings } from "@/lib/settings";
import { FALLBACK_FEED } from "@/lib/instagram-feed";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, settings] = await Promise.all([
    getProducts(),
    getSettings(),
  ]);

  const featured = products.filter((product) => product.isFeatured);
  const showcase = (featured.length > 0 ? featured : products).slice(0, 3);

  return (
    <RevealProvider>
      <main id="main" tabIndex={-1}>
        <Hero settings={settings} />

        <section className="px-4 md:px-6 py-16 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10" data-reveal>
            <h2 className="font-display text-step-head">
              <span className="whitespace-nowrap">Made-to-order</span> keepsakes
            </h2>
            <Link
              href="/products"
              className="text-step-small uppercase tracking-[0.18em] link-shift"
            >
              View the full collection →
            </Link>
          </div>

          {showcase.length > 0 ? (
            <ProductGrid products={showcase} />
          ) : (
            <p className="text-step-body text-muted max-w-prose">
              New pieces are being added soon — follow along on Instagram.
            </p>
          )}
        </section>

        <HowItWorks />

        <InstagramGrid
          posts={FALLBACK_FEED}
          storeName={settings.storeName}
          instagramHandle={settings.instagramHandle}
        />
      </main>
    </RevealProvider>
  );
}
