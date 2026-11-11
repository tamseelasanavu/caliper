import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/products";
import { PageHeader } from "@/components/admin/page-header";
import { ProductTable } from "@/components/admin/product-table";
import { PlusIcon } from "@/components/admin/icons";
import { buttonPrimary, cn } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Products" };

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [products, params] = await Promise.all([getProducts(), searchParams]);

  return (
    <>
      <PageHeader
        title="Products"
        description="Add, edit and organise the pieces in your storefront. Changes go live immediately."
        action={
          <Link href="/admin/products/new" className={cn(buttonPrimary, "px-4")}>
            <PlusIcon />
            New product
          </Link>
        }
      />

      {params.saved && (
        <p
          role="status"
          className="mb-5 rounded-lg border border-jade/30 bg-jade/10 px-4 py-3 text-sm text-jade"
        >
          Product saved. It is live on the storefront.
        </p>
      )}

      <ProductTable products={products} />
    </>
  );
}
