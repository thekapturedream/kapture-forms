import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fontSans = localFont({
  src: "./fonts/Manrope-VariableFont_wght.ttf",
  variable: "--font-sans",
  display: "swap",
  weight: "200 800",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://forms.thekapture.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kapture Forms — pre-built compliance forms for every industry",
    template: "%s · Kapture Forms",
  },
  description:
    "Pre-built, audit-hashed compliance forms for UK care, HR, finance, legal, and more. Five export formats. Pay once or run hosted. By Kapture.",
  keywords: [
    "Kapture Forms",
    "compliance forms",
    "UK care onboarding",
    "CQC forms",
    "audit hash",
    "form templates",
  ],
  applicationName: "Kapture Forms",
  authors: [{ name: "Kapture" }],
  openGraph: {
    type: "website",
    title: "Kapture Forms — pre-built compliance forms",
    description:
      "Pre-built, audit-hashed compliance forms. Pay once or run hosted. £29 a pack.",
    url: siteUrl,
    siteName: "Kapture Forms",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kapture Forms",
    description:
      "Pre-built, audit-hashed compliance forms. £29 a pack. By Kapture.",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/kapture-sun.svg" },
};

export const viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontMono.variable}`}>
      <body className="bg-white text-kapture-black antialiased">{children}</body>
    </html>
  );
}
