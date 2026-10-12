import type { Metadata } from "next";
import { Suspense } from "react";
import ProductsPage from "./ProductsPage";

export const metadata: Metadata = {
  title: "Buy CCTV Camera, IP Camera, DVR, NVR Online | Best Prices",
  description:
    "Browse premium CCTV cameras, IP cameras, DVR, NVR & security accessories at competitive wholesale prices. Uniworld delivers across Bihar, Jharkhand & Nepal.",
  alternates: {
    canonical: "https://uniworld.in/products",
  },
  openGraph: {
    title: "Security Products - CCTV, IP Camera, DVR, NVR | Uniworld",
    description: "Shop premium security cameras and surveillance systems. Serving Bihar, Jharkhand & Nepal.",
    url: "https://uniworld.in/products",
  },
};

export default function Page() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center"><div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
      <ProductsPage />
    </Suspense>
  );
}
