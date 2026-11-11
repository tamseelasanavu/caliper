import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getProducts } from "@/lib/products";
import { getSettings } from "@/lib/settings";
import { categoryLabel } from "@/lib/categories";
import { CustomizationForm } from "@/components/product/customization-form";
import { ProductGrid } from "@/components/product/product-grid";
import { RevealProvider } from "@/components/ui/reveal-provider";
import { SmartImage } from "@/components/ui/smart-image";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      type: "website",
      title: product.name,
      description: product.description,
      images: product.images.slice(0, 1).map((url) => ({ url })),
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const [product, products, settings] = await Promise.all([
    getProductBySlug(slug),
    getProducts(),
    getSettings(),
  ]);

  if (!product) {
    notFound();
  }

  const related = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 3);
  const suggestions =
    related.length > 0
      ? related
      : products.filter((item) => item.id !== product.id).slice(0, 3);

  return (
    <RevealProvider>
      <main id="main" tabIndex={-1}>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-3">
        {/* Gallery */}
        <div className="p-2 md:p-3 order-2 lg:order-1">
          <div className="flex flex-col gap-2 md:gap-3 lg:h-full">
            <div
              className="relative aspect-[4/3] overflow-hidden bg-surface lg:aspect-auto lg:min-h-[320px] lg:flex-1"
              data-reveal
            >
              <SmartImage
                src={product.images[0]}
                alt={`${product.name} — view 1`}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            {product.images.length > 1 && (
              <div
                className={`grid gap-2 md:gap-3 ${
                  product.images.length === 4 ? "grid-cols-3" : "grid-cols-2"
                }`}
              >
                {product.images.slice(1).map((src, i) =>
                  product.images.length === 2 ? (
                    <div
                      key={src}
                      className="relative col-span-2 aspect-[16/9] overflow-hidden bg-surface"
                      data-reveal
                    >
                      <SmartImage
                        src={src}
                        alt={`${product.name} — view ${i + 2}`}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      key={src}
                      className="relative aspect-square overflow-hidden bg-surface"
                      data-reveal
                    >
                      <SmartImage
                        src={src}
                        alt={`${product.name} — view ${i + 2}`}
                        fill
                        sizes="(min-width: 1024px) 16vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Details & Form */}
        <div className="bg-surface/40 p-6 md:p-12 lg:p-16 flex flex-col justify-center order-1 lg:order-2">
          <div data-reveal>
            <h1 className="font-display text-step-head leading-tight mb-4">
              {product.name}
            </h1>
            <p className="text-step-small text-muted mb-8">
              {categoryLabel(product.category)} · ready in {product.leadTimeDays} days
            </p>
            <p className="font-display text-step-lead text-jade mb-8">
              {product.price
                ? `${product.currency} ${product.price.toLocaleString("en-PK")}`
                : "DM for price"}
            </p>
            <p className="text-step-body text-muted leading-relaxed max-w-prose mb-12">
              {product.description}
            </p>
          </div>

          <CustomizationForm
            product={product}
            instagramHandle={settings.instagramHandle}
          />
        </div>
      </section>

      {/* Related */}
      {suggestions.length > 0 && (
        <section className="px-4 md:px-6 py-16 md:py-24">
          <div className="mb-10" data-reveal>
            <h2 className="font-display text-step-head">More from the studio</h2>
          </div>
          <ProductGrid products={suggestions} />
        </section>
      )}
    </main>
    </RevealProvider>
  );
}
