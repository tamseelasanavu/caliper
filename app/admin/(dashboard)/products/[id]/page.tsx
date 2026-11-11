import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import { ProductForm } from "@/components/admin/product-form";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  return { title: product ? `Edit ${product.name}` : "Product not found" };
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <ProductForm
      product={product}
      defaults={{
        currency: product.currency,
        leadTimeDays: product.leadTimeDays,
      }}
    />
  );
}
