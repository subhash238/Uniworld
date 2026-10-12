import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { LocalBusinessSchema, OrganizationSchema } from "@/components/seo/JsonLd";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <LocalBusinessSchema />
      <OrganizationSchema />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
