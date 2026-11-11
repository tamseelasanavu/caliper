"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { saveProductAction, type ActionState } from "@/app/admin/actions";
import { PRODUCT_CATEGORIES } from "@/lib/categories";
import { slugify } from "@/lib/slug";
import type {
  CustomizationField,
  Product,
  ProductCategory,
} from "@/lib/types";
import { FieldsBuilder } from "./fields-builder";
import { FormField as Field } from "./form-field";
import { ArrowLeftIcon, PlusIcon } from "./icons";
import { ImageManager } from "./image-manager";
import { AdminSection as Section } from "./section";
import { buttonPrimary, buttonSecondary, cn, inputClass } from "./ui";

type FormValues = {
  name: string;
  slug: string;
  description: string;
  category: ProductCategory;
  price: string;
  currency: string;
  leadTimeDays: string;
  isMakeToOrder: boolean;
  isFeatured: boolean;
};

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(buttonPrimary, "px-5")}
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

export function ProductForm({
  product,
  defaults,
}: {
  product?: Product;
  defaults: { currency: string; leadTimeDays: number };
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    saveProductAction,
    null
  );

  const [values, setValues] = useState<FormValues>({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    category: product?.category ?? "vintage_letter",
    price: product?.price !== undefined ? String(product.price) : "",
    currency: product?.currency ?? defaults.currency,
    leadTimeDays: String(product?.leadTimeDays ?? defaults.leadTimeDays),
    isMakeToOrder: product?.isMakeToOrder ?? true,
    isFeatured: product?.isFeatured ?? false,
  });
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [fields, setFields] = useState<CustomizationField[]>(
    product?.customizationFields ?? []
  );

  const errors = state?.fieldErrors ?? {};

  const set = <Key extends keyof FormValues>(
    key: Key,
    value: FormValues[Key]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const isEditing = Boolean(product);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="id" value={product?.id ?? ""} />
      <input
        type="hidden"
        name="customizationFields"
        value={JSON.stringify(fields)}
        readOnly
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-ink"
          >
            <ArrowLeftIcon width={15} height={15} />
            Products
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isEditing ? "Edit product" : "New product"}
          </h1>
          <p className="mt-1.5 max-w-prose text-sm text-muted">
            {isEditing
              ? "Update the details below. Saved changes appear on the storefront right away."
              : "Give the piece a name, photos and a description. You can refine it later."}
          </p>
        </div>
        <SaveButton label={isEditing ? "Save changes" : "Create product"} />
      </div>

      {state?.error && (
        <p
          role="alert"
          className="rounded-lg border border-alert/30 bg-alert/10 px-4 py-3 text-sm text-alert"
        >
          {state.error}
        </p>
      )}

      <Section
        title="Details"
        description="The name, description and price customers see on the storefront."
      >
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Product name" htmlFor="name" error={errors.name}>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={values.name}
                onChange={(event) => {
                  const name = event.target.value;
                  setValues((prev) => ({
                    ...prev,
                    name,
                    slug: slugTouched ? prev.slug : slugify(name),
                  }));
                }}
                placeholder="Customised Vintage Letter"
                className={inputClass}
              />
            </Field>

            <Field
              label="Link"
              htmlFor="slug"
              error={errors.slug}
              hint="Used in the product page address."
            >
              <div
                className={cn(
                  "flex items-stretch overflow-hidden rounded-lg border bg-ground transition-colors focus-within:ring-2",
                  errors.slug
                    ? "border-alert/60 focus-within:border-alert focus-within:ring-alert/20"
                    : "border-muted/25 focus-within:border-jade focus-within:ring-jade/20"
                )}
              >
                <span className="flex items-center border-r border-muted/20 px-3 text-xs text-muted">
                  /products/
                </span>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  value={values.slug}
                  onChange={(event) => {
                    setSlugTouched(true);
                    set("slug", event.target.value);
                  }}
                  placeholder="customised-vintage-letter"
                  className="w-full bg-transparent px-3 py-2.5 text-sm text-ink outline-none placeholder:text-muted/60"
                />
              </div>
            </Field>
          </div>

          <Field
            label="Description"
            htmlFor="description"
            error={errors.description}
          >
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              value={values.description}
              onChange={(event) => set("description", event.target.value)}
              placeholder="Describe the piece, the materials and what makes it personal."
              className={cn(inputClass, "resize-y")}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Category" htmlFor="category" error={errors.category}>
              <select
                id="category"
                name="category"
                value={values.category}
                onChange={(event) =>
                  set("category", event.target.value as ProductCategory)
                }
                className={inputClass}
              >
                {PRODUCT_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Price"
              htmlFor="price"
              error={errors.price}
              hint="Leave blank to show “DM for price”."
            >
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={values.price}
                onChange={(event) => set("price", event.target.value)}
                placeholder="0"
                className={inputClass}
              />
            </Field>

            <Field label="Currency" htmlFor="currency">
              <input
                id="currency"
                name="currency"
                type="text"
                maxLength={6}
                value={values.currency}
                onChange={(event) =>
                  set("currency", event.target.value.toUpperCase())
                }
                placeholder="PKR"
                className={cn(inputClass, "uppercase")}
              />
            </Field>

            <Field
              label="Lead time (days)"
              htmlFor="leadTimeDays"
              error={errors.leadTimeDays}
            >
              <input
                id="leadTimeDays"
                name="leadTimeDays"
                type="number"
                min="0"
                max="120"
                step="1"
                value={values.leadTimeDays}
                onChange={(event) => set("leadTimeDays", event.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-muted/20 bg-ground/40 px-4 py-3">
              <input
                type="checkbox"
                name="isMakeToOrder"
                value="true"
                checked={values.isMakeToOrder}
                onChange={(event) => set("isMakeToOrder", event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-muted/40 bg-ground accent-jade"
              />
              <span>
                <span className="block text-sm font-medium">Made to order</span>
                <span className="mt-0.5 block text-xs text-muted">
                  Show the lead time alongside this piece.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-muted/20 bg-ground/40 px-4 py-3">
              <input
                type="checkbox"
                name="isFeatured"
                value="true"
                checked={values.isFeatured}
                onChange={(event) => set("isFeatured", event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-muted/40 bg-ground accent-jade"
              />
              <span>
                <span className="block text-sm font-medium">
                  Feature on home page
                </span>
                <span className="mt-0.5 block text-xs text-muted">
                  Featured pieces appear in the first collection row.
                </span>
              </span>
            </label>
          </div>
        </div>
      </Section>

      <Section
        title="Photos"
        description="The cover photo appears on product cards. Add up to 12 photos."
      >
        <ImageManager
          value={images}
          onChange={setImages}
          error={errors.images}
        />
      </Section>

      <Section
        title="Customisation"
        description="Fields customers fill in before they order. These are copied into their Instagram message."
      >
        <FieldsBuilder value={fields} onChange={setFields} />
      </Section>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-muted/15 pt-5">
        <Link href="/admin" className={cn(buttonSecondary, "px-4")}>
          Cancel
        </Link>
        <div className="flex items-center gap-3">
          {!isEditing && (
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <PlusIcon width={14} height={14} />
              Saved products go live immediately
            </span>
          )}
          <SaveButton label={isEditing ? "Save changes" : "Create product"} />
        </div>
      </div>
    </form>
  );
}
