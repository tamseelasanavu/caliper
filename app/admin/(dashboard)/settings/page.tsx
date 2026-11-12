import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { PasswordForm } from "@/components/admin/password-form";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata: Metadata = { title: "Storefront" };

export default async function StorefrontSettingsPage() {
  const settings = await getSettings();
  return (
    <div className="space-y-8">
      <SettingsForm settings={settings} />
      <PasswordForm />
    </div>
  );
}
