"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { updateSettingsAction, type ActionState } from "@/app/admin/actions";
import type { SiteSettings } from "@/lib/types";
import { FormField } from "./form-field";
import { AdminSection } from "./section";
import { buttonPrimary, cn, inputClass } from "./ui";

type Values = Omit<SiteSettings, "defaultLeadTimeDays"> & {
  defaultLeadTimeDays: string;
};

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(buttonPrimary, "px-5")}
    >
      {pending ? "Saving…" : "Save changes"}
    </button>
  );
}

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    updateSettingsAction,
    null
  );

  const [values, setValues] = useState<Values>({
    ...settings,
    defaultLeadTimeDays: String(settings.defaultLeadTimeDays),
  });

  const errors = state?.fieldErrors ?? {};

  const set = <Key extends keyof Values>(key: Key, value: Values[Key]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form action={formAction} className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Storefront</h1>
          <p className="mt-1.5 max-w-prose text-sm text-muted">
            Your store name, contact details and the main home page copy.
            Product content is edited from the Products screen.
          </p>
        </div>
        <SaveButton />
      </div>

      {state?.error && (
        <p
          role="alert"
          className="rounded-lg border border-alert/30 bg-alert/10 px-4 py-3 text-sm text-alert"
        >
          {state.error}
        </p>
      )}
      {state?.success && (
        <p
          role="status"
          className="rounded-lg border border-jade/30 bg-jade/10 px-4 py-3 text-sm text-jade"
        >
          {state.success}
        </p>
      )}

      <AdminSection
        title="Store"
        description="Your store name appears in the navigation, footer and dashboard."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            label="Store name"
            htmlFor="storeName"
            error={errors.storeName}
          >
            <input
              id="storeName"
              name="storeName"
              type="text"
              required
              value={values.storeName}
              onChange={(event) => set("storeName", event.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField
            label="Instagram handle"
            htmlFor="instagramHandle"
            error={errors.instagramHandle}
            hint="Without the @. Used for DM links and the footer."
          >
            <div className="flex items-stretch overflow-hidden rounded-lg border border-muted/25 bg-ground transition-colors focus-within:border-jade focus-within:ring-2 focus-within:ring-jade/20">
              <span className="flex items-center border-r border-muted/20 px-3 text-sm text-muted">
                @
              </span>
              <input
                id="instagramHandle"
                name="instagramHandle"
                type="text"
                required
                value={values.instagramHandle}
                onChange={(event) =>
                  set("instagramHandle", event.target.value.replace(/^@+/, ""))
                }
                className="w-full bg-transparent px-3 py-2.5 text-sm text-ink outline-none placeholder:text-muted/60"
              />
            </div>
          </FormField>
        </div>
      </AdminSection>

      <AdminSection
        title="Home page"
        description="The opening panel on your home page. Keep it warm and specific."
      >
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <FormField
              label="Heading"
              htmlFor="heroTitle"
              error={errors.heroTitle}
            >
              <input
                id="heroTitle"
                name="heroTitle"
                type="text"
                required
                value={values.heroTitle}
                onChange={(event) => set("heroTitle", event.target.value)}
                className={inputClass}
              />
            </FormField>

            <FormField
              label="Second line"
              htmlFor="heroTitleAccent"
              error={errors.heroTitleAccent}
            >
              <input
                id="heroTitleAccent"
                name="heroTitleAccent"
                type="text"
                required
                value={values.heroTitleAccent}
                onChange={(event) => set("heroTitleAccent", event.target.value)}
                className={inputClass}
              />
            </FormField>

            <FormField
              label="Paragraph"
              htmlFor="heroParagraph"
              error={errors.heroParagraph}
            >
              <textarea
                id="heroParagraph"
                name="heroParagraph"
                rows={3}
                required
                value={values.heroParagraph}
                onChange={(event) => set("heroParagraph", event.target.value)}
                className={cn(inputClass, "resize-y")}
              />
            </FormField>

            <FormField
              label="Small note"
              htmlFor="heroNote"
              hint="Shown under a divider beneath the paragraph."
            >
              <textarea
                id="heroNote"
                name="heroNote"
                rows={2}
                value={values.heroNote}
                onChange={(event) => set("heroNote", event.target.value)}
                className={cn(inputClass, "resize-y")}
              />
            </FormField>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
              Preview
            </p>
            <div className="rounded-lg border border-muted/20 bg-ink p-5 text-ground">
              <p className="font-display text-2xl leading-none">
                {values.heroTitle || "Your store name"}
                <span className="mt-1 block">
                  {values.heroTitleAccent || "Keepsakes, made to order."}
                </span>
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ground/80">
                {values.heroParagraph ||
                  "Your hero paragraph will appear here."}
              </p>
              {values.heroNote && (
                <p className="mt-4 border-t border-ground/20 pt-3 text-xs leading-relaxed text-ground/70">
                  {values.heroNote}
                </p>
              )}
            </div>
          </div>
        </div>
      </AdminSection>

      <AdminSection
        title="Footer"
        description="A short line below your store name in the footer."
      >
        <FormField label="Footer description" htmlFor="footerBlurb">
          <textarea
            id="footerBlurb"
            name="footerBlurb"
            rows={3}
            value={values.footerBlurb}
            onChange={(event) => set("footerBlurb", event.target.value)}
            className={cn(inputClass, "resize-y")}
          />
        </FormField>
      </AdminSection>

      <AdminSection
        title="New product defaults"
        description="Starting values for each new product. You can change them per product."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Currency" htmlFor="defaultCurrency">
            <input
              id="defaultCurrency"
              name="defaultCurrency"
              type="text"
              maxLength={6}
              value={values.defaultCurrency}
              onChange={(event) =>
                set("defaultCurrency", event.target.value.toUpperCase())
              }
              placeholder="PKR"
              className={cn(inputClass, "uppercase")}
            />
          </FormField>

          <FormField
            label="Lead time (days)"
            htmlFor="defaultLeadTimeDays"
            error={errors.defaultLeadTimeDays}
          >
            <input
              id="defaultLeadTimeDays"
              name="defaultLeadTimeDays"
              type="number"
              min="0"
              max="120"
              step="1"
              value={values.defaultLeadTimeDays}
              onChange={(event) =>
                set("defaultLeadTimeDays", event.target.value)
              }
              className={inputClass}
            />
          </FormField>
        </div>
      </AdminSection>

      <div className="flex justify-end border-t border-muted/15 pt-5">
        <SaveButton />
      </div>
    </form>
  );
}
