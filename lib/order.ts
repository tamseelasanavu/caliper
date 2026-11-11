import type { Product } from "@/lib/types";

export const INSTAGRAM_HANDLE = "calliper_creations";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}`;
export const INSTAGRAM_DM_URL = `https://ig.me/m/${INSTAGRAM_HANDLE}`;

export function buildOrderMessage(
  product: Product,
  values: Record<string, string>
): string {
  const lines: string[] = [];
  lines.push(`Hi Calliper Creations! I'd like to order: ${product.name}`);
  lines.push(
    product.price
      ? `Price: ${product.currency} ${product.price.toLocaleString("en-PK")}`
      : "Price: please confirm"
  );

  const fields = product.customizationFields ?? [];
  fields.forEach((f) => {
    const v = values[f.id];
    if (!v) return;
    if (f.type === "image_upload") {
      lines.push(`${f.label}: photo attached in this DM`);
    } else {
      lines.push(`${f.label}: ${v.trim()}`);
    }
  });

  return lines.join("\n");
}
