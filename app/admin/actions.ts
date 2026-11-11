"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createSession,
  destroySession,
  isAdminConfigured,
  passwordMatches,
  requireAdmin,
} from "@/lib/auth";
import {
  createProduct,
  deleteProduct,
  getProducts,
  setProductFeatured,
  updateProduct,
  type ProductInput,
} from "@/lib/products";
import { DEFAULT_SETTINGS, updateSettings } from "@/lib/settings";
import { slugify } from "@/lib/slug";
import type {
  CustomizationField,
  ProductCategory,
  SiteSettings,
} from "@/lib/types";

export type ActionState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string>;
} | null;

const CATEGORY_VALUES: ProductCategory[] = [
  "vintage_letter",
  "journaling_frame",
  "vintage_card",
  "phone_case",
  "scrapbook",
];

const FIELD_TYPES: CustomizationField["type"][] = [
  "text",
  "textarea",
  "image_upload",
  "select",
];

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseStringArray(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string" || !value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(
        (item) =>
          item.startsWith("/") ||
          item.startsWith("https://") ||
          item.startsWith("http://")
      );
  } catch {
    return [];
  }
}

function parseFields(value: FormDataEntryValue | null): CustomizationField[] {
  if (typeof value !== "string" || !value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    const seen = new Set<string>();
    const fields: CustomizationField[] = [];

    parsed.forEach((raw, index) => {
      if (!raw || typeof raw !== "object") return;
      const item = raw as Record<string, unknown>;
      const label = typeof item.label === "string" ? item.label.trim() : "";
      const type = FIELD_TYPES.includes(item.type as CustomizationField["type"])
        ? (item.type as CustomizationField["type"])
        : "text";
      if (!label) return;

      let id = slugify(typeof item.id === "string" ? item.id : label);
      if (!id) id = `field-${index + 1}`;
      while (seen.has(id)) id = `${id}-${index + 1}`;
      seen.add(id);

      const options =
        type === "select" && Array.isArray(item.options)
          ? item.options
              .filter((option): option is string => typeof option === "string")
              .map((option) => option.trim())
              .filter(Boolean)
          : undefined;

      fields.push({
        id,
        label,
        type,
        required: item.required === true,
        ...(options && options.length > 0 ? { options } : {}),
      });
    });

    return fields;
  } catch {
    return [];
  }
}

function parseProduct(formData: FormData): {
  product?: ProductInput;
  fieldErrors: Record<string, string>;
  slug?: string;
} {
  const fieldErrors: Record<string, string> = {};
  const name = text(formData, "name");
  const rawSlug = text(formData, "slug");
  const slug = slugify(rawSlug || name);
  const description = text(formData, "description");
  const category = text(formData, "category") as ProductCategory;
  const currency = (text(formData, "currency") || "PKR").toUpperCase();
  const priceRaw = text(formData, "price");
  const leadRaw = text(formData, "leadTimeDays");
  const images = parseStringArray(formData.get("images"));
  const customizationFields = parseFields(formData.get("customizationFields"));

  if (!name) fieldErrors.name = "Give this product a name.";
  if (!slug) fieldErrors.slug = "Add a link slug, for example vintage-letter.";
  if (!description) fieldErrors.description = "Write a short description.";
  if (!CATEGORY_VALUES.includes(category)) {
    fieldErrors.category = "Choose a category.";
  }
  if (images.length === 0) {
    fieldErrors.images = "Add at least one photo.";
  }
  if (images.length > 12) {
    fieldErrors.images = "Use up to 12 photos.";
  }

  let price: number | undefined;
  if (priceRaw) {
    const parsed = Number(priceRaw.replace(/,/g, ""));
    if (!Number.isFinite(parsed) || parsed < 0) {
      fieldErrors.price = "Enter a price of 0 or more.";
    } else {
      price = Math.round(parsed * 100) / 100;
    }
  }

  let leadTimeDays = 0;
  if (leadRaw) {
    const parsed = Number.parseInt(leadRaw, 10);
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 120) {
      fieldErrors.leadTimeDays = "Use a lead time between 0 and 120 days.";
    } else {
      leadTimeDays = parsed;
    }
  }

  const product: ProductInput = {
    slug,
    name,
    description,
    ...(price !== undefined ? { price } : {}),
    currency,
    images,
    category,
    isMakeToOrder: formData.get("isMakeToOrder") === "true",
    leadTimeDays,
    ...(customizationFields.length > 0
      ? { customizationFields }
      : {}),
    isFeatured: formData.get("isFeatured") === "true",
  };

  return { product, fieldErrors, slug };
}

function revalidateStore() {
  revalidatePath("/", "layout");
  revalidatePath("/admin");
}

export async function loginAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!isAdminConfigured()) {
    return {
      error:
        "Admin access is not configured. Set ADMIN_PASSWORD in the server environment and restart.",
    };
  }

  const password = text(formData, "password");
  if (!passwordMatches(password)) {
    return { error: "That password is not correct. Try again." };
  }
  await createSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

export async function saveProductAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const id = text(formData, "id");
  const { product, fieldErrors, slug } = parseProduct(formData);

  if (Object.keys(fieldErrors).length > 0 || !product) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors,
    };
  }

  const products = await getProducts();
  const duplicate = products.find(
    (item) => item.slug === slug && item.id !== id
  );
  if (duplicate) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: { slug: "Another product already uses this link." },
    };
  }

  if (id) {
    const updated = await updateProduct(id, product);
    if (!updated) return { error: "That product could not be found." };
  } else {
    await createProduct(product);
  }

  revalidateStore();
  redirect("/admin?saved=1");
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;
  await deleteProduct(id);
  revalidateStore();
}

export async function toggleFeaturedAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;
  await setProductFeatured(id, formData.get("featured") === "true");
  revalidateStore();
}

function cleanHandle(value: string): string {
  return value
    .replace(/^@+/, "")
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/\/+$/, "")
    .replace(/[^a-zA-Z0-9._]/g, "");
}

export async function updateSettingsAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const fieldErrors: Record<string, string> = {};
  const storeName = text(formData, "storeName");
  const heroTitle = text(formData, "heroTitle");
  const heroTitleAccent = text(formData, "heroTitleAccent");
  const heroParagraph = text(formData, "heroParagraph");
  const heroNote = text(formData, "heroNote");
  const instagramHandle = cleanHandle(text(formData, "instagramHandle"));
  const footerBlurb = text(formData, "footerBlurb");
  const defaultCurrency = (text(formData, "defaultCurrency") || "PKR")
    .toUpperCase()
    .slice(0, 6);
  const leadRaw = text(formData, "defaultLeadTimeDays");

  if (!storeName) fieldErrors.storeName = "Add your store name.";
  if (!heroTitle) fieldErrors.heroTitle = "Add the hero heading.";
  if (!heroTitleAccent) {
    fieldErrors.heroTitleAccent = "Add the second hero line.";
  }
  if (!heroParagraph) {
    fieldErrors.heroParagraph = "Add the hero paragraph.";
  }
  if (!instagramHandle) {
    fieldErrors.instagramHandle = "Add your Instagram handle.";
  }

  let defaultLeadTimeDays = DEFAULT_SETTINGS.defaultLeadTimeDays;
  const parsedLead = Number.parseInt(leadRaw, 10);
  if (!Number.isFinite(parsedLead) || parsedLead < 0 || parsedLead > 120) {
    fieldErrors.defaultLeadTimeDays = "Use 0 to 120 days.";
  } else {
    defaultLeadTimeDays = parsedLead;
  }

  const next: SiteSettings = {
    storeName,
    heroTitle,
    heroTitleAccent,
    heroParagraph,
    heroNote,
    instagramHandle,
    footerBlurb,
    defaultCurrency,
    defaultLeadTimeDays,
  };

  if (Object.keys(fieldErrors).length > 0) {
    return { error: "Please fix the highlighted fields.", fieldErrors };
  }

  await updateSettings(next);
  revalidateStore();
  return { success: "Storefront content saved." };
}
