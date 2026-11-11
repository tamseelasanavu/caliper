"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { buildOrderMessage, INSTAGRAM_HANDLE } from "@/lib/order";
import { FileUploadWidget } from "@/components/ui/file-upload-widget";

export function CustomizationForm({
  product,
  instagramHandle,
}: {
  product: Product;
  instagramHandle?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handle = instagramHandle || INSTAGRAM_HANDLE;
  const dmUrl = `https://ig.me/m/${handle}`;
  const fields = product.customizationFields ?? [];

  const update = (id: string, value: string) =>
    setValues((prev) => ({ ...prev, [id]: value }));

  const isComplete = fields.every((f) => {
    if (!f.required) return true;
    const v = values[f.id];
    return v !== undefined && v.trim() !== "";
  });

  const handleOrder = async () => {
    if (!isComplete) return;
    const message = buildOrderMessage(product, values);
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      setCopied(false);
    }
    window.open(dmUrl, "_blank", "noopener");
  };

  return (
    <div className="bg-surface border border-muted/30 p-6 md:p-8" data-reveal>
      <h2 className="font-display text-step-subhead mb-6">Customise your order</h2>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        {fields.map((field) => (
          <div key={field.id}>
            <label
              htmlFor={`f-${field.id}`}
              className="block text-step-body mb-2"
            >
              {field.label}
              {field.required && <span className="text-jade"> *</span>}
            </label>

            {field.type === "text" && (
              <input
                id={`f-${field.id}`}
                type="text"
                value={values[field.id] ?? ""}
                onChange={(e) => update(field.id, e.target.value)}
                className="w-full bg-ground border border-muted/40 px-4 py-3 text-step-body focus:border-jade"
              />
            )}

            {field.type === "textarea" && (
              <textarea
                id={`f-${field.id}`}
                rows={4}
                value={values[field.id] ?? ""}
                onChange={(e) => update(field.id, e.target.value)}
                className="w-full bg-ground border border-muted/40 px-4 py-3 text-step-body focus:border-jade resize-y"
              />
            )}

            {field.type === "select" && (
              <select
                id={`f-${field.id}`}
                value={values[field.id] ?? ""}
                onChange={(e) => update(field.id, e.target.value)}
                className="w-full bg-ground border border-muted/40 px-4 py-3 text-step-body focus:border-jade"
              >
                <option value="" disabled>
                  Choose one…
                </option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {field.type === "image_upload" && (
              <FileUploadWidget
                value={values[field.id] ?? ""}
                onChange={(url) => update(field.id, url)}
                uploading={uploading}
                setUploading={setUploading}
              />
            )}
          </div>
        ))}
      </form>

      <button
        type="button"
        onClick={handleOrder}
        disabled={!isComplete}
        aria-describedby="order-status"
        className="mt-8 w-full btn-press inline-block bg-jade text-ground px-7 py-4 text-step-small uppercase tracking-[0.18em] font-semibold disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-jade disabled:hover:text-ground"
      >
        Order via Instagram DM
      </button>

      <p
        id="order-status"
        aria-live="polite"
        className="mt-3 text-step-small text-muted text-center"
      >
        {isComplete
          ? `${copied ? "Your order is copied — paste it into the DM to @" : "Opens a DM with @"}${handle}.`
          : "Complete the required fields above to continue."}
      </p>
    </div>
  );
}
