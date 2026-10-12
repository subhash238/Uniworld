import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminProductsLayout({ children }: { children: React.ReactNode }) {
  return <AdminSidebar>{children}</AdminSidebar>;
}
