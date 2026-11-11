import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

export function Footer({ settings }: { settings: SiteSettings }) {
  const instagramUrl = `https://www.instagram.com/${settings.instagramHandle}`;
  const dmUrl = `https://ig.me/m/${settings.instagramHandle}`;

  return (
    <footer className="bg-surface/40">
      <div className="px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <p className="font-display text-step-head mb-4">{settings.storeName}</p>
            <p className="text-step-body text-muted max-w-xs">
              {settings.footerBlurb}
            </p>
          </div>

          <div>
            <p className="text-step-body font-semibold mb-4">
              Orders
            </p>
            <p className="text-step-body">
              Every piece is made to order.
            </p>
            <p className="text-step-body text-muted mt-2">
              Send us a DM with your idea and we&rsquo;ll confirm the details.
            </p>
            <Link
              href="/products"
              className="mt-4 inline-block text-step-body link-shift"
            >
              Browse the collection →
            </Link>
          </div>

          <div>
            <p className="text-step-body font-semibold mb-4">
              Contact
            </p>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-step-body link-shift"
            >
              @{settings.instagramHandle}
            </a>
            <br />
            <a
              href={dmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-step-body link-shift"
            >
              Message us on Instagram →
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-step-small text-muted">
            © {new Date().getFullYear()} {settings.storeName}. All rights reserved.
          </p>
          <p className="text-step-small text-muted">
            Photography and video: {settings.storeName}.
          </p>
        </div>
      </div>
    </footer>
  );
}
