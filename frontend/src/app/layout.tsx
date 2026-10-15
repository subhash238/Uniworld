import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import WhatsAppButton from "@/components/public/WhatsAppButton";
export const metadata: Metadata = {
  metadataBase: new URL("https://uniworld.in"),
  title: {
    default: "Uniworld - Leading CCTV Camera & Security Distributor | Bihar, Jharkhand & Nepal",
    template: "%s | Uniworld Security Solutions",
  },
  description:
    "Uniworld is a leading distributor of CCTV cameras, IP cameras, DVR, NVR, and access control systems across Bihar, Jharkhand & Nepal. Wholesale prices on premium security products.",
  keywords: [
    "CCTV camera dealer Bihar",
    "CCTV camera dealer Jharkhand",
    "CCTV camera Patna",
    "CCTV camera Ranchi",
    "security camera Bihar",
    "security camera Jharkhand",
    "IP camera dealer Bihar",
    "IP camera dealer Nepal",
    "DVR NVR dealer Bihar Jharkhand",
    "access control system Bihar",
    "CCTV installation Bihar Jharkhand",
    "security solutions Bihar Jharkhand Nepal",
    "best CCTV camera price Bihar",
    "surveillance camera distributor Patna Ranchi",
    "Uniworld security",
    "CCTV dealer Muzaffarpur",
    "CCTV dealer Ranchi",
    "CCTV dealer Jamshedpur",
    "CCTV dealer Nepal",
    "security products Jharkhand",
    "Hikvision dealer Bihar Jharkhand",
    "CP Plus dealer Bihar",
    "camera distributor Bihar Jharkhand Nepal",
  ],
  authors: [{ name: "Uniworld Security Solutions" }],
  creator: "Uniworld",
  publisher: "Uniworld Security Solutions",
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
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://uniworld.in",
    siteName: "Uniworld Security Solutions",
    title: "Uniworld - Leading CCTV Camera & Security Distributor | Bihar, Jharkhand & Nepal",
    description:
      "Premium CCTV cameras, IP cameras, DVR, NVR & security systems at wholesale prices. Authorized distributor serving Bihar, Jharkhand & Nepal.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Uniworld - CCTV & Security Solutions Bihar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Uniworld - Leading CCTV Camera & Security Distributor | Bihar, Jharkhand & Nepal",
    description:
      "Premium CCTV cameras, IP cameras, DVR, NVR & security systems at wholesale prices across Bihar, Jharkhand & Nepal.",
    images: ["/images/og-image.jpg"],
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://uniworld.in",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#1B2A4A" />
        <meta name="geo.region" content="IN-BR" />
        <meta name="geo.placename" content="Bihar, India" />
      </head>
      <body className="font-[Manrope]" suppressHydrationWarning>
        <Toaster position="top-right" />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
