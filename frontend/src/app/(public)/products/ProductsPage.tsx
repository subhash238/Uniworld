"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import { FiCamera, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  mrp?: number;
  images: { url: string }[];
  isFeatured?: boolean;
  category: { name: string; id: string; slug: string };
  subCategory?: { id: string; name: string; slug: string } | null;
}

interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
  subCategories?: SubCategory[];
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category") || "";
  const subFromUrl = searchParams.get("sub") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [selectedSubCategory, setSelectedSubCategory] = useState(subFromUrl);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
    setSelectedSubCategory(subFromUrl);
    setPage(1);
  }, [categoryFromUrl, subFromUrl]);

  useEffect(() => {
    loadProducts();
  }, [page, selectedCategory, selectedSubCategory, search]);

  const loadCategories = async () => {
    try {
      const res = await api.get("/categories/public");
      setCategories(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "15" });
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedSubCategory) params.append("subCategory", selectedSubCategory);
      if (search) params.append("search", search);

      const res = await api.get(`/products/public?${params}`);
      setProducts(res.data.products || []);
      setTotalPages(res.data.pagination?.pages || 1);
      setTotalProducts(res.data.pagination?.total || (res.data.products || []).length);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const currentCategoryObj = categories.find((c) => c.id === selectedCategory || c.slug === selectedCategory);
  const currentSubCategoryObj = currentCategoryObj?.subCategories?.find(
    (s) => s.id === selectedSubCategory || s.slug === selectedSubCategory
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* 1. CP PLUS Dark Top Header with Breadcrumbs */}
      <div className="relative bg-[#1a1e24] text-white py-10 px-4 sm:px-6">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none" style={{ backgroundImage: `url('/images/og-image.jpg')` }} />
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide">
            {currentSubCategoryObj ? `${currentSubCategoryObj.name} - ${currentCategoryObj?.name}` : currentCategoryObj ? currentCategoryObj.name : "All Products"}
          </h1>
          {/* Breadcrumbs matching CP PLUS */}
          <nav className="mt-3 flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <Link
              href="/products"
              onClick={() => { setSelectedCategory(""); setSelectedSubCategory(""); }}
              className="hover:text-white transition"
            >
              Products
            </Link>
            {currentCategoryObj && (
              <>
                <span>/</span>
                <span className={currentSubCategoryObj ? "hover:text-white cursor-pointer" : "text-white font-semibold"} onClick={() => setSelectedSubCategory("")}>
                  {currentCategoryObj.name}
                </span>
              </>
            )}
            {currentSubCategoryObj && (
              <>
                <span>/</span>
                <span className="text-white font-semibold">{currentSubCategoryObj.name}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
          {/* 2. Left Sidebar (CP PLUS Filter By & Category Tree) */}
          <aside className="border border-gray-200 bg-white rounded-lg shadow-sm p-5 sticky top-24">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 pb-3 border-b border-gray-100">
              Filter By
            </h2>

            {/* Model Number Search Input */}
            <div className="mt-4">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Product
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter Model No."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-900 placeholder-gray-400"
                />
              </div>
              <button
                type="button"
                className="mt-2.5 w-full bg-[#1e2530] text-white text-xs font-bold uppercase tracking-wider py-2 rounded hover:bg-black transition flex items-center justify-center gap-1.5"
              >
                <FiSearch size={13} /> FILTER
              </button>
            </div>

            {/* Categories Tree */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
                Categories
              </h3>
              <div className="space-y-1">
                <div className="border-b border-gray-50 pb-1">
                  <button
                    type="button"
                    onClick={() => { setSelectedCategory(""); setSelectedSubCategory(""); setPage(1); }}
                    className={`text-xs font-medium py-1.5 w-full text-left transition ${
                      !selectedCategory ? "text-red-600 font-bold" : "text-gray-700 hover:text-red-600"
                    }`}
                  >
                    All Categories
                  </button>
                </div>
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id || selectedCategory === cat.slug;
                  return (
                    <div key={cat.id} className="border-b border-gray-50 last:border-0 pb-1">
                      <div className="flex items-center justify-between py-1.5">
                        <button
                          type="button"
                          onClick={() => { setSelectedCategory(cat.id); setSelectedSubCategory(""); setPage(1); }}
                          className={`text-xs font-medium text-left transition-colors ${
                            isSelected ? "text-red-600 font-bold" : "text-gray-700 hover:text-red-600"
                          }`}
                        >
                          {cat.name}
                        </button>
                        <span className="text-[11px] text-gray-400 font-medium">
                          ({cat._count?.products || 0})
                        </span>
                      </div>

                      {/* Subcategories list if category is selected */}
                      {isSelected && cat.subCategories && cat.subCategories.length > 0 && (
                        <div className="pl-3.5 pt-1 pb-2 space-y-1.5 border-l-2 border-red-500/20 ml-1">
                          <button
                            type="button"
                            onClick={() => { setSelectedSubCategory(""); setPage(1); }}
                            className={`flex items-center gap-1.5 text-xs text-left w-full transition ${
                              !selectedSubCategory ? "text-red-600 font-semibold" : "text-gray-500 hover:text-gray-800"
                            }`}
                          >
                            <span className="text-[10px]">&bull;</span> All {cat.name}
                          </button>
                          {cat.subCategories.map((sub) => {
                            const isSubActive = selectedSubCategory === sub.id || selectedSubCategory === sub.slug;
                            return (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() => { setSelectedSubCategory(sub.id); setPage(1); }}
                                className={`flex items-center gap-1.5 text-xs text-left w-full transition ${
                                  isSubActive ? "text-red-600 font-semibold" : "text-gray-500 hover:text-gray-800"
                                }`}
                              >
                                <span className={`text-[10px] ${isSubActive ? "text-red-600" : "text-gray-400"}`}>&bull;</span>
                                {sub.name}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* 3. Main Products Listing Grid */}
          <main>
            {/* Top Bar matching CP PLUS */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-gray-200 bg-white rounded-lg p-3.5 shadow-sm text-xs text-gray-600">
              <div className="font-medium text-gray-800">
                We found <span className="font-bold text-red-600">{totalProducts}</span> items
              </div>
              <div className="hidden md:flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-400">
                <span className="font-semibold text-gray-600">Find by:</span>
                <span className="hover:text-gray-700 cursor-pointer">Product Series</span> &bull;
                <span className="hover:text-gray-700 cursor-pointer">Audio</span> &bull;
                <span className="hover:text-gray-700 cursor-pointer">BodyType</span> &bull;
                <span className="hover:text-gray-700 cursor-pointer">IR Range</span> &bull;
                <span className="hover:text-gray-700 cursor-pointer">Resolution</span>
              </div>
            </div>

            {/* Sub-header title */}
            <div className="mt-4 mb-3 flex items-baseline justify-between">
              <h2 className="text-base font-bold text-gray-900">
                Uniworld <span className="text-xs font-normal text-gray-500 ml-1.5">{currentSubCategoryObj?.name || currentCategoryObj?.name || "All Items"}</span>
              </h2>
            </div>

            {/* Product Tiles Grid (Exact 3-Column CP PLUS Style Grid) */}
            {loading ? (
              <div className="border border-gray-200 bg-white rounded-lg p-20 text-center shadow-sm">
                <div className="h-9 w-9 rounded-full border-3 border-gray-900 border-t-transparent animate-spin mx-auto" />
                <p className="mt-3 text-xs text-gray-500">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="border border-gray-200 bg-white rounded-lg p-16 text-center text-gray-500 shadow-sm">
                <FiCamera size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium">No products found matching your filter.</p>
                {(selectedCategory || selectedSubCategory || search) && (
                  <button
                    onClick={() => { setSelectedCategory(""); setSelectedSubCategory(""); setSearch(""); setPage(1); }}
                    className="mt-3 text-xs text-red-600 font-semibold underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 border-t border-l border-gray-200 bg-white shadow-sm rounded-lg overflow-hidden">
                {products.map((product, idx) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group relative flex flex-col items-center justify-between border-r border-b border-gray-200 p-6 text-center transition-all duration-200 hover:shadow-lg hover:z-10 bg-white"
                  >
                    {/* Red New Ribbon */}
                    {(idx < 3 || product.isFeatured) && (
                      <div className="absolute -left-12 top-3.5 z-20 w-32 -rotate-45 bg-[#e52d27] py-0.5 text-center shadow-sm pointer-events-none">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                          New
                        </span>
                      </div>
                    )}

                    {/* Product Image Area */}
                    <div className="relative h-[160px] w-full flex items-center justify-center">
                      {product.images[0]?.url ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                          className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <FiCamera size={44} className="text-gray-300" />
                      )}
                    </div>

                    {/* Product Name (Bold CP PLUS Model Code Style) */}
                    <div className="mt-4 w-full">
                      <h3 className="text-[14px] font-semibold text-gray-800 leading-snug line-clamp-2 transition-colors group-hover:text-blue-600">
                        {product.name}
                      </h3>

                      {/* Subtitle / Description */}
                      <p className="mt-1.5 text-[11px] text-gray-500 leading-normal line-clamp-2">
                        {product.description || (product.subCategory?.name ? `${product.subCategory.name} Camera` : product.category?.name)}
                      </p>

                      {/* Price (if applicable) */}
                      {product.price > 0 && (
                        <div className="mt-2 text-xs font-bold text-gray-900">
                          ₹{product.price.toLocaleString()}
                          {product.mrp && product.mrp > product.price && (
                            <span className="ml-2 text-[10px] font-normal text-gray-400 line-through">
                              ₹{product.mrp.toLocaleString()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination matching CP PLUS */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <FiChevronLeft size={14} /> Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded text-xs font-bold transition ${
                      page === pageNum
                        ? "bg-[#1e2530] text-white shadow-sm"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Next <FiChevronRight size={14} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
