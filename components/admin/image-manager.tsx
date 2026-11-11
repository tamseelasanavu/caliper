"use client";

import { useId, useRef, useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ImageIcon,
  PlusIcon,
  TrashIcon,
} from "./icons";
import {
  buttonSecondary,
  cn,
  errorClass,
  hintClass,
  inputClass,
  labelClass,
} from "./ui";

const MAX_SIZE = 8 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export function ImageManager({
  value,
  onChange,
  error,
}: {
  value: string[];
  onChange: (images: string[]) => void;
  error?: string;
}) {
  const fileInputId = useId();
  const urlInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  };

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError("");

    const selected = Array.from(files);
    for (const file of selected) {
      if (!ACCEPTED.includes(file.type)) {
        setUploadError("Use JPEG, PNG, WebP or AVIF images.");
        return;
      }
      if (file.size > MAX_SIZE) {
        setUploadError("Each image must be under 8MB.");
        return;
      }
    }

    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of selected) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const data = (await response.json()) as { url?: string; error?: string };
        if (!response.ok || !data.url) {
          throw new Error(data.error || "Upload failed.");
        }
        uploaded.push(data.url);
      }
      onChange([...value, ...uploaded]);
    } catch (uploadFailure) {
      setUploadError(
        uploadFailure instanceof Error ? uploadFailure.message : "Upload failed."
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const addUrl = () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    if (
      !trimmed.startsWith("/") &&
      !trimmed.startsWith("http://") &&
      !trimmed.startsWith("https://")
    ) {
      setUploadError("Paste a full image URL or a path starting with /.");
      return;
    }
    setUploadError("");
    onChange([...value, trimmed]);
    setUrl("");
  };

  return (
    <div>
      <input
        type="hidden"
        name="images"
        value={JSON.stringify(value)}
        readOnly
      />

      {value.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {value.map((src, index) => (
            <li
              key={`${src}-${index}`}
              className="group relative overflow-hidden rounded-lg border border-muted/20 bg-ground"
            >
              <div className="relative aspect-[4/5]">
                <img
                  src={src}
                  alt={`Product image ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
              {index === 0 && (
                <span className="absolute left-2 top-2 rounded bg-ground/85 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-jade">
                  Cover
                </span>
              )}
              <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-1">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="rounded bg-ground/85 p-1.5 text-ink backdrop-blur transition-colors hover:bg-ground disabled:opacity-40"
                    aria-label={`Move image ${index + 1} earlier`}
                  >
                    <ChevronUpIcon width={14} height={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === value.length - 1}
                    className="rounded bg-ground/85 p-1.5 text-ink backdrop-blur transition-colors hover:bg-ground disabled:opacity-40"
                    aria-label={`Move image ${index + 1} later`}
                  >
                    <ChevronDownIcon width={14} height={14} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="rounded bg-ground/85 p-1.5 text-alert backdrop-blur transition-colors hover:bg-ground"
                  aria-label={`Remove image ${index + 1}`}
                >
                  <TrashIcon width={14} height={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {value.length === 0 && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-muted/35 bg-ground/50 px-4 py-10 text-muted transition-colors hover:border-jade/60 hover:text-jade disabled:opacity-50"
        >
          <ImageIcon width={24} height={24} />
          <span className="text-sm font-medium">
            {uploading ? "Uploading…" : "Upload photos"}
          </span>
          <span className="text-xs">
            JPEG, PNG, WebP or AVIF · up to 8MB each
          </span>
        </button>
      )}

      <input
        ref={fileInputRef}
        id={fileInputId}
        type="file"
        accept={ACCEPTED.join(",")}
        multiple
        className="sr-only"
        onChange={(event) => upload(event.target.files)}
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className={cn(buttonSecondary, "min-h-9 px-3 text-xs")}
        >
          <PlusIcon width={15} height={15} />
          {uploading ? "Uploading…" : "Upload photos"}
        </button>
        <span className={hintClass}>
          First image is the cover. Use the arrows to reorder.
        </span>
      </div>

      <div className="mt-4">
        <label htmlFor={urlInputId} className={labelClass}>
          Or add an image URL
        </label>
        <div className="flex gap-2">
          <input
            id={urlInputId}
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addUrl();
              }
            }}
            placeholder="https://…"
            className={cn(inputClass, "h-9 py-1.5 text-sm")}
          />
          <button
            type="button"
            onClick={addUrl}
            className={cn(buttonSecondary, "min-h-9 shrink-0 px-3 text-xs")}
          >
            Add
          </button>
        </div>
      </div>

      {(uploadError || error) && (
        <p role="alert" className={errorClass}>
          {uploadError || error}
        </p>
      )}
    </div>
  );
}
