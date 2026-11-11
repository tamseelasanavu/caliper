import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated, usesDefaultPassword } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await isAuthenticated()) redirect("/admin");

  const settings = await getSettings();
  const showDefaultHint =
    process.env.NODE_ENV !== "production" && usesDefaultPassword();

  return (
    <main
      id="main"
      tabIndex={-1}
      className="font-ui flex min-h-svh items-center justify-center bg-ground px-4 py-10 text-ink md:px-6"
    >
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-muted/20 bg-surface lg:grid lg:grid-cols-[0.95fr_1fr]">
        <div className="relative hidden min-h-[540px] lg:block">
          <Image
            src="/assets/calliper/envelope-wax-seal.jpg"
            alt="A wax-sealed vintage envelope from the studio"
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 0vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-ground/55" />
          <div className="absolute inset-x-0 bottom-0 p-8">
            <p className="font-display text-3xl leading-none text-ink">
              {settings.storeName}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/75">
              Your made-to-order collection, managed in one place.
            </p>
          </div>
        </div>

        <div className="px-6 py-9 sm:px-9 md:px-11 md:py-12">
          <div className="mb-8 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-jade font-display text-xl text-ground">
              {settings.storeName.trim().charAt(0).toUpperCase() || "C"}
            </span>
            <div>
              <p className="text-sm font-semibold">{settings.storeName}</p>
              <p className="text-xs text-muted">Store manager</p>
            </div>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-2 mb-8 text-sm leading-relaxed text-muted">
            Enter the admin password to manage products, photos and storefront
            content.
          </p>

          <LoginForm showDefaultHint={showDefaultHint} />

          <Link
            href="/"
            className="mt-8 inline-block text-xs font-medium text-muted underline-offset-4 transition-colors hover:text-jade hover:underline"
          >
            ← Back to storefront
          </Link>
        </div>
      </div>
    </main>
  );
}
