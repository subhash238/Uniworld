import AdminSidebar from "@/components/admin/AdminSidebar";

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <AdminSidebar>{children}</AdminSidebar>;
}
