import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata: Metadata = { title: "Storefront" };

export default async function StorefrontSettingsPage() {
  const settings = await getSettings();
  return <SettingsForm settings={settings} />;
}
