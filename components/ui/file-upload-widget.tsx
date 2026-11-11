"use client";

import { useRef, useState } from "react";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export function FileUploadWidget({
  onChange,
  uploading,
  setUploading,
}: {
  value: string;
  onChange: (url: string) => void;
  uploading: boolean;
  setUploading: (v: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    setError("");
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Please upload a JPEG or PNG image.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Image must be under 5MB.");
      return;
    }

    // Local object URL for an instant preview regardless of server state.
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onChange(`/uploads?file=${encodeURIComponent(file.name)}`);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) onChange(data.url);
      else setError(data.error || "Upload unavailable — attach the photo in your Instagram DM.");
    } catch {
      setError("Upload unavailable — attach the photo in your Instagram DM.");
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setError("");
    onChange("");
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {preview ? (
        <div className="relative">
          <div className="relative aspect-video w-full overflow-hidden border border-muted/40">
            <img
              src={preview}
              alt="Upload preview"
              className="h-full w-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="mt-3 text-step-small text-muted underline underline-offset-4 hover:text-jade transition-colors"
          >
            Remove photo
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border border-dashed border-muted/50 px-4 py-8 text-step-body text-muted hover:border-jade hover:text-jade transition-colors"
          disabled={uploading}
        >
          {uploading ? "Uploading…" : "Click to upload a photo (JPEG or PNG, max 5MB)"}
        </button>
      )}
      {error && (
        <p role="alert" className="mt-2 text-step-small text-alert">
          {error}
        </p>
      )}
    </div>
  );
}
