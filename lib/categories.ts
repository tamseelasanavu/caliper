import type { ProductCategory } from "./types";

export const PRODUCT_CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "vintage_letter", label: "Vintage Letters" },
  { value: "journaling_frame", label: "Journaling Frames" },
  { value: "vintage_card", label: "Vintage Cards" },
  { value: "phone_case", label: "Phone Cases" },
  { value: "scrapbook", label: "Scrapbooks" },
];

export function categoryLabel(value: string): string {
  return (
    PRODUCT_CATEGORIES.find((category) => category.value === value)?.label ??
    value.replace(/_/g, " ")
  );
}
