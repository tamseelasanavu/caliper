import type { ReactNode } from "react";

export function AdminSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-muted/20 bg-surface">
      <div className="border-b border-muted/15 px-5 py-4">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {description && (
          <p className="mt-1 max-w-prose text-xs leading-relaxed text-muted">
            {description}
          </p>
        )}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
