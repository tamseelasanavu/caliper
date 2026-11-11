import type { Metadata } from "next";
import { Rokkitt, Literata } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SiteChrome } from "@/components/layout/site-chrome";
import { getSettings } from "@/lib/settings";
import { getSiteUrl } from "@/lib/site";

const rokkitt = Rokkitt({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-rokkitt",
  display: "swap",
});

const literata = Literata({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-literata",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = `${settings.storeName} | Personalised Vintage Keepsakes`;
  const description =
    settings.footerBlurb ||
    "Made-to-order vintage letters, journaling frames, vintage cards, phone cases and personalised scrapbooks.";

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: title,
      template: `%s | ${settings.storeName}`,
    },
    description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      siteName: settings.storeName,
      title,
      description,
      images: [
        {
          url: "/assets/calliper/envelope-wax-seal.jpg",
          alt: "A wax-sealed vintage envelope from the studio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/assets/calliper/envelope-wax-seal.jpg"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <html lang="en" className={`${rokkitt.variable} ${literata.variable}`}>
      <body className="font-body">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteChrome
          navbar={
            <Navbar
              settings={{
                storeName: settings.storeName,
                instagramHandle: settings.instagramHandle,
              }}
            />
          }
          footer={<Footer settings={settings} />}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
