import type { Metadata } from "next";
import HomePage from "./HomePage";
import { FAQSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Uniworld Security Solutions | Trusted CCTV & Surveillance Distributor",
  description:
    "Uniworld is a premier distributor of CCTV cameras, IP cameras, DVR, NVR & access control systems operating across Bihar, Jharkhand & Nepal. Wholesale & retail at competitive prices.",
  alternates: {
    canonical: "https://uniworld.in",
  },
  openGraph: {
    title: "Uniworld Security Solutions - CCTV & Surveillance Distributor",
    description:
      "Your trusted partner for premium security cameras & surveillance systems. Operating across Bihar, Jharkhand & Nepal.",
    url: "https://uniworld.in",
  },
};

export default function Page() {
  return (
    <>
      <FAQSchema />
      <HomePage />
    </>
  );
}
