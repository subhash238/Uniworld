import AdminSidebar from "@/components/admin/AdminSidebar";

export default function PressLayout({ children }: { children: React.ReactNode }) {
  return <AdminSidebar>{children}</AdminSidebar>;
}

