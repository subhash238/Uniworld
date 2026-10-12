import AdminSidebar from "@/components/admin/AdminSidebar";

export default function OffersLayout({ children }: { children: React.ReactNode }) {
  return <AdminSidebar>{children}</AdminSidebar>;
}

