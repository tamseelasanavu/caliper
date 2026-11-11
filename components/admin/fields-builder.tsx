"use client";

import { useState } from "react";
import type { CustomizationField } from "@/lib/types";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  TrashIcon,
} from "./icons";
import {
  buttonSecondary,
  cn,
  hintClass,
  inputClass,
  labelClass,
} from "./ui";

const TYPE_OPTIONS: { value: CustomizationField["type"]; label: string }[] = [
  { value: "text", label: "Short text" },
  { value: "textarea", label: "Long text" },
  { value: "select", label: "Choices" },
  { value: "image_upload", label: "Photo upload" },
];

function OptionsInput({
  initial,
  onOptions,
}: {
  initial: string;
  onOptions: (options: string[]) => void;
}) {
  const [text, setText] = useState(initial);

  return (
    <input
      type="text"
      value={text}
      onChange={(event) => {
        setText(event.target.value);
        onOptions(
          event.target.value
            .split(",")
            .map((option) => option.trim())
            .filter(Boolean)
        );
      }}
      placeholder="Aged Ivory, Tea-Stained Kraft, Blush Rose"
      className={cn(inputClass, "h-9 py-1.5 text-sm")}
    />
  );
}

export function FieldsBuilder({
  value,
  onChange,
}: {
  value: CustomizationField[];
  onChange: (fields: CustomizationField[]) => void;
}) {
  const update = (index: number, patch: Partial<CustomizationField>) => {
    onChange(
      value.map((field, fieldIndex) =>
        fieldIndex === index ? { ...field, ...patch } : field
      )
    );
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(value.filter((_, fieldIndex) => fieldIndex !== index));
  };

  const add = () => {
    const id = `field-${Math.random().toString(36).slice(2, 8)}`;
    onChange([
      ...value,
      { id, label: "", type: "text", required: false },
    ]);
  };

  return (
    <div>
      {value.length === 0 ? (
        <div className="rounded-lg border border-dashed border-muted/30 bg-ground/40 px-4 py-8 text-center">
          <p className="text-sm font-medium text-ink">No options yet</p>
          <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-muted">
            Add fields customers fill in before ordering — names, messages,
            photo uploads or choice lists.
          </p>
          <button
            type="button"
            onClick={add}
            className={cn(buttonSecondary, "mt-4 min-h-9 px-3 text-xs")}
          >
            <PlusIcon width={15} height={15} />
            Add a field
          </button>
        </div>
      ) : (
        <ul className="divide-y divide-muted/10 rounded-lg border border-muted/20">
          {value.map((field, index) => (
            <li key={field.id} className="p-4">
              <div className="flex flex-wrap items-start gap-3">
                <div className="min-w-[160px] flex-1">
                  <label className={labelClass} htmlFor={`label-${field.id}`}>
                    Field label
                  </label>
                  <input
                    id={`label-${field.id}`}
                    type="text"
                    value={field.label}
                    onChange={(event) =>
                      update(index, { label: event.target.value })
                    }
                    placeholder="Recipient's name"
                    className={cn(inputClass, "h-9 py-1.5 text-sm")}
                  />
                </div>

                <div className="w-[150px]">
                  <label className={labelClass} htmlFor={`type-${field.id}`}>
                    Type
                  </label>
                  <select
                    id={`type-${field.id}`}
                    value={field.type}
                    onChange={(event) =>
                      update(index, {
                        type: event.target.value as CustomizationField["type"],
                      })
                    }
                    className={cn(inputClass, "h-9 py-1.5 text-sm")}
                  >
                    {TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-muted">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(event) =>
                        update(index, { required: event.target.checked })
                      }
                      className="h-4 w-4 rounded border-muted/40 bg-ground accent-jade"
                    />
                    Required
                  </label>
                </div>

                <div className="ml-auto flex items-center gap-1 pt-5">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="rounded p-1.5 text-muted transition-colors hover:bg-ink/5 hover:text-ink disabled:opacity-30"
                    aria-label={`Move field ${index + 1} up`}
                  >
                    <ChevronUpIcon width={15} height={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === value.length - 1}
                    className="rounded p-1.5 text-muted transition-colors hover:bg-ink/5 hover:text-ink disabled:opacity-30"
                    aria-label={`Move field ${index + 1} down`}
                  >
                    <ChevronDownIcon width={15} height={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="rounded p-1.5 text-muted transition-colors hover:bg-alert/10 hover:text-alert"
                    aria-label={`Remove field ${index + 1}`}
                  >
                    <TrashIcon width={15} height={15} />
                  </button>
                </div>
              </div>

              {field.type === "select" && (
                <div className="mt-3 max-w-xl">
                  <label
                    className={labelClass}
                    htmlFor={`options-${field.id}`}
                  >
                    Choices
                  </label>
                  <OptionsInput
                    key={field.id}
                    initial={(field.options ?? []).join(", ")}
                    onOptions={(options) => update(index, { options })}
                  />
                  <p className={hintClass}>
                    Separate each choice with a comma.
                  </p>
                </div>
              )}

              {field.type === "image_upload" && (
                <p className={hintClass}>
                  Customers will upload a JPEG or PNG here.
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      {value.length > 0 && (
        <button
          type="button"
          onClick={add}
          className={cn(buttonSecondary, "mt-3 min-h-9 px-3 text-xs")}
        >
          <PlusIcon width={15} height={15} />
          Add another field
        </button>
      )}
    </div>
  );
}
