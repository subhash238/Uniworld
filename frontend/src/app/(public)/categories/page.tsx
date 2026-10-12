import type { Metadata } from "next";
import CategoriesPage from "./CategoriesPage";

export const metadata: Metadata = {
  title: "Security Product Categories | CCTV, IP Camera, DVR, NVR, Access Control",
  description:
    "Explore our complete range of security product categories - CCTV cameras, IP cameras, DVR, NVR, access control systems & accessories. Competitive pricing across Bihar, Jharkhand & Nepal.",
  alternates: {
    canonical: "https://uniworld.in/categories",
  },
  openGraph: {
    title: "Security Product Categories | Uniworld",
    description: "Browse CCTV cameras, IP cameras, DVR, NVR, access control and more from Uniworld.",
    url: "https://uniworld.in/categories",
  },
};

export default function Page() {
  return <CategoriesPage />;
}
