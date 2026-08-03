import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/JsonLd";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL("https://nasahgroup.com"),
  title: {
    default: "Nasah Group LTD — Building technology that simplifies everyday life.",
    template: "%s — Nasah Group LTD",
  },
  description:
    "Nasah Group LTD is a technology company building a connected ecosystem of products, AI, and developer tools.",
  keywords: [
    "Nasah Group LTD",
    "Nasah",
    "technology ecosystem",
    "AI products",
    "developer platform",
    "API",
  ],
  alternates: {
    canonical: "https://nasahgroup.com",
  },
  openGraph: {
    title: "Nasah Group LTD",
    description:
      "Building technology that simplifies everyday life — one connected ecosystem.",
    url: "https://nasahgroup.com",
    siteName: "Nasah Group LTD",
    type: "website",
    images: [{ url: "/opengraph-image.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nasah Group LTD",
    description:
      "Building technology that simplifies everyday life — one connected ecosystem.",
    images: ["/opengraph-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
