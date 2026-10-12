import type { Metadata } from "next";
import DealersPage from "./DealersPage";

export const metadata: Metadata = {
  title: "Authorized CCTV Dealers & Distributors | Bihar, Jharkhand & Nepal",
  description:
    "Find authorized Uniworld CCTV dealers and distributors near you. Genuine security products with warranty. Dealer network across Bihar, Jharkhand & Nepal.",
  alternates: {
    canonical: "https://uniworld.in/dealers",
  },
  openGraph: {
    title: "Authorized CCTV Dealers | Uniworld",
    description: "Find authorized security product dealers near you across Bihar, Jharkhand & Nepal.",
    url: "https://uniworld.in/dealers",
  },
};

export default function Page() {
  return <DealersPage />;
}
