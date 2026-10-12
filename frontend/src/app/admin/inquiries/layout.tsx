import AdminSidebar from "@/components/admin/AdminSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminSidebar>{children}</AdminSidebar>;
}
