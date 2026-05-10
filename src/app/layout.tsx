import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const fontSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kapture-forms.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Forms · store — pre-built compliance forms for every industry",
    template: "%s · forms · store",
  },
  description:
    "The forms store. Pre-built, branded, audit-hashed compliance forms for healthcare, HR, finance, legal, education, hospitality, real estate, construction, public sector, logistics. Five export formats. Pay once or run hosted. By Kapture.",
  keywords: [
    "compliance forms",
    "UK care onboarding",
    "CQC forms",
    "audit hash",
    "Kapture",
    "kooper care",
    "form templates",
  ],
  applicationName: "Kapture Forms",
  authors: [{ name: "Kapture" }],
  openGraph: {
    type: "website",
    title: "Forms · store — by Kapture",
    description:
      "Pre-built, branded, audit-hashed compliance forms. Pay once or run hosted with magic-link invitations and a queue.",
    url: siteUrl,
    siteName: "Kapture Forms",
  },
  twitter: {
    card: "summary_large_image",
    title: "Forms · store — by Kapture",
    description:
      "Pre-built, branded, audit-hashed compliance forms. Pay once or run hosted.",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/kapture-sun.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable} ${fontSerif.variable}`}
    >
      <body className="bg-white text-kapture-black antialiased">{children}</body>
    </html>
  );
}
