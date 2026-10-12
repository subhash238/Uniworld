import type { Metadata } from "next";
import ContactPage from "./ContactPage";

export const metadata: Metadata = {
  title: "Contact Us | Get a Free CCTV & Security Quote",
  description:
    "Contact Uniworld for CCTV camera quotes, security system inquiries & dealer partnerships. Serving Bihar, Jharkhand & Nepal. Call us or fill the form for a prompt response.",
  alternates: {
    canonical: "https://uniworld.in/contact",
  },
  openGraph: {
    title: "Contact Uniworld Security Solutions",
    description: "Get a free quote for CCTV cameras and security systems. Trusted distributor across Bihar, Jharkhand & Nepal.",
    url: "https://uniworld.in/contact",
  },
};

export default function Page() {
  return <ContactPage />;
}
