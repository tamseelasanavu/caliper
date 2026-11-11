export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const inputClass =
  "w-full rounded-lg border border-muted/25 bg-ground px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-jade focus:outline-none focus:ring-2 focus:ring-jade/20 disabled:cursor-not-allowed disabled:opacity-50";

export const labelClass =
  "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted";

export const hintClass = "mt-1.5 text-xs text-muted";

export const errorClass = "mt-1.5 text-xs text-alert";

export const buttonPrimary =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-jade px-4 text-sm font-semibold text-ground transition-colors hover:bg-jade/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jade disabled:cursor-not-allowed disabled:opacity-50";

export const buttonSecondary =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-muted/25 bg-surface px-4 text-sm font-medium text-ink transition-colors hover:border-muted/50 hover:bg-surface/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jade disabled:cursor-not-allowed disabled:opacity-50";

export const buttonGhost =
  "inline-flex min-h-9 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-muted transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jade";

export const buttonDanger =
  "inline-flex min-h-9 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold text-alert transition-colors hover:bg-alert/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alert";
