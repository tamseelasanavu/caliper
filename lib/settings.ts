import { unstable_noStore as noStore } from "next/cache";
import { readJson, runExclusive, writeJson } from "./data-store";
import type { SiteSettings } from "./types";

const FILE = "settings.json";

export const DEFAULT_SETTINGS: SiteSettings = {
  storeName: "Calliper Creations",
  heroTitle: "Calliper Creations",
  heroTitleAccent: "Made to order.",
  heroParagraph:
    "Customised vintage letters, journaling frames, vintage cards, phone cases and personalised scrapbooks — each piece built around your story.",
  heroNote:
    "Every piece is made to order. Send us a DM on Instagram to start yours.",
  instagramHandle: "calliper_creations",
  footerBlurb:
    "Made-to-order vintage letters, journaling frames, vintage cards, phone cases and personalised scrapbooks — crafted around your story.",
  defaultCurrency: "PKR",
  defaultLeadTimeDays: 5,
};

export async function getSettings(): Promise<SiteSettings> {
  noStore();
  const stored = await readJson<Partial<SiteSettings>>(FILE, {});
  return { ...DEFAULT_SETTINGS, ...stored };
}

export function updateSettings(next: SiteSettings): Promise<void> {
  return runExclusive(() => writeJson(FILE, next));
}
