import AdminSidebar from "@/components/admin/AdminSidebar";

export default function DownloadsLayout({ children }: { children: React.ReactNode }) {
  return <AdminSidebar>{children}</AdminSidebar>;
}
