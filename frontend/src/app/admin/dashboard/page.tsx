"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { FiBox, FiGrid, FiShoppingCart, FiMail, FiUsers } from "react-icons/fi";

interface Stats {
  products: number;
  categories: number;
  orders: number;
  inquiries: number;
  dealers: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ products: 0, categories: 0, orders: 0, inquiries: 0, dealers: 0 });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [products, categories, orders, inquiries, dealers] = await Promise.all([
        api.get("/products?limit=1"),
        api.get("/categories"),
        api.get("/orders?limit=1"),
        api.get("/contact?limit=1"),
        api.get("/dealers"),
      ]);
      setStats({
        products: products.data.pagination?.total || 0,
        categories: categories.data.length || 0,
        orders: orders.data.pagination?.total || 0,
        inquiries: inquiries.data.pagination?.total || 0,
        dealers: dealers.data.length || 0,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const statCards = [
    { label: "Products", value: stats.products, icon: FiBox, color: "bg-primary-light" },
    { label: "Categories", value: stats.categories, icon: FiGrid, color: "bg-green-500" },
    { label: "Orders", value: stats.orders, icon: FiShoppingCart, color: "bg-yellow-500" },
    { label: "Inquiries", value: stats.inquiries, icon: FiMail, color: "bg-purple-500" },
    { label: "Dealers", value: stats.dealers, icon: FiUsers, color: "bg-red-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-3xl font-bold mt-1">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon size={24} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
