"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FiHome, FiBox, FiGrid, FiShoppingCart, FiImage, FiUsers, FiMail, FiLogOut, FiMenu, FiX, FiLayers, FiFileText, FiTag } from "react-icons/fi";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/admin/dashboard", icon: FiHome, label: "Dashboard" },
  { href: "/admin/products", icon: FiBox, label: "Products" },
  { href: "/admin/categories", icon: FiGrid, label: "Categories" },
  { href: "/admin/subcategories", icon: FiLayers, label: "Sub Categories" },
  { href: "/admin/offers", icon: FiTag, label: "We Offer" },
  { href: "/admin/banners", icon: FiImage, label: "Banners" },
  { href: "/admin/press", icon: FiFileText, label: "Print & Press" },
  { href: "/admin/orders", icon: FiShoppingCart, label: "Orders" },
  { href: "/admin/dealers", icon: FiUsers, label: "Dealers" },
  { href: "/admin/inquiries", icon: FiMail, label: "Inquiries" },
];

export default function AdminSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !admin) {
      router.push("/admin/login");
    }
  }, [admin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!admin) return null;

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-gray-700">
          <img src="/images/logo-nav.jpeg" alt="Uniworld" className="h-12 rounded-lg p-1 bg-white" />
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${pathname === item.href ? "bg-primary text-white" : "text-gray-300 hover:bg-gray-800"}`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <div className="text-sm text-gray-400 mb-2">{admin.name}</div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm">
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between md:justify-end">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <FiMenu size={24} />
          </button>
          <span className="text-sm text-gray-600">Welcome, {admin.name}</span>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
