"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FiHome, FiBox, FiGrid, FiShoppingCart, FiImage, FiUsers, FiMail, FiLogOut, FiMenu, FiX, FiLayers, FiFileText, FiTag, FiDownload, FiCamera, FiChevronDown } from "react-icons/fi";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/admin/dashboard", icon: FiHome, label: "Dashboard" },
  { href: "/admin/products", icon: FiBox, label: "Products" },
  { href: "/admin/categories", icon: FiGrid, label: "Categories" },
  { href: "/admin/subcategories", icon: FiLayers, label: "Sub Categories" },
  { href: "/admin/offers", icon: FiTag, label: "We Offer" },
  { href: "/admin/banners", icon: FiImage, label: "Banners" },
  { href: "/admin/press", icon: FiFileText, label: "Print & Press" },
  { href: "/admin/downloads", icon: FiDownload, label: "Support Downloads" },
  { href: "/admin/gallery", icon: FiCamera, label: "Gallery" },
  { href: "/admin/orders", icon: FiShoppingCart, label: "Orders" },
  { href: "/admin/dealers", icon: FiUsers, label: "Dealers" },
  { href: "/admin/inquiries", icon: FiMail, label: "Inquiries" },
];

export default function AdminSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

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
      <aside className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col bg-gray-900 text-white transform transition-transform md:sticky md:top-0 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <img src="/images/logo-nav.jpeg" alt="Uniworld" className="h-12 rounded-lg p-1 bg-white" />
            <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
          </div>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <FiX size={22} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
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

      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 flex items-center justify-between bg-white px-6 py-3 shadow-sm">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <FiMenu size={24} />
          </button>

          <div className="relative ml-auto">
            <button
              onClick={() => setProfileOpen((open) => !open)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                {(admin.name || "A").charAt(0).toUpperCase()}
              </span>
              <span className="hidden sm:block">{admin.name}</span>
              <FiChevronDown size={14} className={`text-gray-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="truncate text-sm font-medium text-gray-900">{admin.name}</p>
                    <p className="truncate text-xs text-gray-500">Administrator</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <FiLogOut size={15} /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
