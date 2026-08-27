import type { Metadata, Viewport } from "next";
import "./globals.css";
import StructuredData from "./components/StructuredData";

export const metadata: Metadata = {
  title: "Everest Hack Club | Student Coding Community in Biratnagar, Nepal",
  description: "Everest Hack Club is a student-led coding and technology community in Biratnagar, Nepal. Join us to build projects, learn programming, and connect with young makers. Build. Break. Learn.",
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
    "Everest College coding club"
  ],
  authors: [{ name: "Everest Hack Club" }],
  openGraph: {
    title: "Everest Hack Club | Build. Break. Learn.",
    description: "Student-led coding community in Biratnagar, Nepal. Join young makers building the future.",
    url: "https://everesthackclub.com",
    siteName: "Everest Hack Club",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Everest Hack Club | Build. Break. Learn.",
    description: "Student-led coding community in Biratnagar, Nepal",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <meta name="geo.region" content="NP-2" />
        <meta name="geo.placename" content="Biratnagar" />
        <meta name="geo.position" content="26.4525;87.2718" />
        <meta name="ICBM" content="26.4525, 87.2718" />
        <StructuredData />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
