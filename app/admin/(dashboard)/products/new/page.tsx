import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = { title: "New product" };

export default async function NewProductPage() {
  const settings = await getSettings();

  return (
    <ProductForm
      defaults={{
        currency: settings.defaultCurrency,
        leadTimeDays: settings.defaultLeadTimeDays,
      }}
    />
  );
}
