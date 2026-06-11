import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { siteConfig } from "@/lib/site";
import { AnalyticsBootstrap } from "@/components/AnalyticsBootstrap";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  alternates: { canonical: "/" },
  keywords: [
    "HokkaiDAO",
    "Solana",
    "builder retreat",
    "hackathon",
    "Sapporo",
    "Hokkaido",
    "Web3",
    "mtnDAO",
  ],
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    site: siteConfig.contactXHandle,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#04080f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <body className="grain antialiased">
        {children}
        <AnalyticsBootstrap />
      </body>
    </html>
  );
}
