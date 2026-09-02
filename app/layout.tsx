import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import Script from "next/script";
import "./globals.css";
import StructuredData from "./components/StructuredData";
import KeyboardShortcuts from "./components/KeyboardShortcuts";
import { SITE_URL } from "./lib/site";

const GA_MEASUREMENT_ID = "G-HYQFG0M7C0";

const SITE_NAME = "Everest Hack Club";
const SITE_DESC =
  "Everest Hack Club is a student-led coding and technology community in Biratnagar, Nepal. Join us to build projects, learn programming, and connect with young makers. Build. Break. Learn.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESC,
  keywords: [
    "Everest Hack Club",
    "Hack Club Biratnagar",
    "Hack Club Nepal",
    "coding club Biratnagar",
    "student coding community Nepal",
    "programming club Biratnagar",
    "tech community Nepal",
    "learn coding Biratnagar",
    "student hackers Nepal",
    "Everest College coding club",
    "hackathon Nepal",
    "tech events Biratnagar",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "technology",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: `${SITE_NAME} | Build. Break. Learn.`,
    description:
      "Student-led coding community in Biratnagar, Nepal. Join young makers building the future.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Build. Break. Learn.`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Build. Break. Learn.`,
    description: "Student-led coding community in Biratnagar, Nepal",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)",  color: "#0d0d0d" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Resolve the saved theme on the server so the correct class is in the very
  // first byte of HTML — no flash, and no inline <script> in the React tree.
  // When no cookie is set, globals.css falls back to `prefers-color-scheme`
  // via the `:root:not(.light)` rule.
  const stored = (await cookies()).get("theme")?.value;
  const themeClass = stored === "dark" || stored === "light" ? stored : "";

  return (
    <html lang="en" className={`h-full antialiased ${themeClass}`.trim()}>
      <head>
        {/* Geo tags */}
        <meta name="geo.region"    content="NP-2" />
        <meta name="geo.placename" content="Biratnagar" />
        <meta name="geo.position"  content="26.4525;87.2718" />
        <meta name="ICBM"          content="26.4525, 87.2718" />

        <StructuredData />
      </head>
      <body className="min-h-full flex flex-col">
        <KeyboardShortcuts />
        {children}

        {/* Google Analytics (gtag.js) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script id="google-analytics">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', '${GA_MEASUREMENT_ID}');`}
        </Script>
      </body>
    </html>
  );
}
