import type { Metadata, Viewport } from "next";
import { Lora } from "next/font/google";
import { siteConfig } from "@/lib/site";
import { AnalyticsBootstrap } from "@/components/AnalyticsBootstrap";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: "400",
  style: "normal",
  display: "swap",
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
    <html lang="en" className={lora.variable}>
      <body className="grain antialiased">
        {children}
        <AnalyticsBootstrap />
      </body>
    </html>
  );
}
