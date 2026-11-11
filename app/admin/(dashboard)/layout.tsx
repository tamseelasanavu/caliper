import type { Metadata } from "next";
import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Store manager",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdmin();
  const settings = await getSettings();

  return <AdminShell storeName={settings.storeName}>{children}</AdminShell>;
}
