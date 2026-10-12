"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import { FiCamera } from "react-icons/fi";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  _count: { products: number };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await api.get("/categories/public");
      setCategories(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Security Product Categories</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:ring-blue-300 hover:shadow-xl"
          >
            <div className="relative aspect-video overflow-hidden bg-white p-6">
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={`${cat.name} - Buy in Bihar`}
                  fill
                  className="object-contain transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <FiCamera size={48} className="text-gray-300" />
                </div>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-primary">
                {cat.name}
              </h2>
              {cat.description && (
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                  {cat.description}
                </p>
              )}
              <span className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-primary">
                {cat._count.products} Products
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
