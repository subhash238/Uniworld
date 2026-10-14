"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import { FiCamera, FiSearch, FiChevronDown, FiChevronRight } from "react-icons/fi";

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  mrp?: number;
  images: { url: string }[];
  isFeatured?: boolean;
  subCategory?: { id: string; name: string; slug: string; parentId?: string | null } | null;
}

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  children?: SubCategory[];
  _count?: { products: number };
}

interface CategoryDetail {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  subCategories: SubCategory[];
  products: Product[];
}

interface CategoryNav {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
  subCategories?: SubCategory[];
}

export default function CategoryDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const subSlugFromUrl = searchParams.get("sub") || "";
   const [searchDraft, setSearchDraft] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryDetail | null>(null);
  const [allCategories, setAllCategories] = useState<CategoryNav[]>([]);
  const [selectedSubSlug, setSelectedSubSlug] = useState<string>(subSlugFromUrl);
  const [searchModel, setSearchModel] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const currentSlug = params.slug as string;

  useEffect(() => {
    if (subSlugFromUrl) {
      setSelectedSubSlug(subSlugFromUrl);
    }
  }, [subSlugFromUrl]);

  useEffect(() => {
    if (currentSlug) {
      loadData();
    }
  }, [currentSlug]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [catRes, allCatsRes] = await Promise.all([
        api.get(`/categories/public/${currentSlug}`),
        api.get("/categories/public"),
      ]);
      setCategory(catRes.data);
      setAllCategories(allCatsRes.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products by selected subcategory and search model
  const filteredProducts = useMemo(() => {
    if (!category) return [];
    let list = category.products || [];

    if (selectedSubSlug) {
      const allSubs = category.subCategories.flatMap((s) => [s, ...(s.children || [])]);
      const selected = allSubs.find((s) => s.slug === selectedSubSlug);
      const childIds = new Set((selected?.children || []).map((c) => c.id));
      list = list.filter((p) => {
        if (p.subCategory?.slug === selectedSubSlug) return true;
        // products assigned to a nested child count for the parent filter
        if (selected && p.subCategory && childIds.has(p.subCategory.id)) return true;
        // fallback keyword match
        const subCat = category.subCategories.find((s) => s.slug === selectedSubSlug);
        if (subCat && (p.name.toLowerCase().includes(subCat.name.toLowerCase()) || p.description?.toLowerCase().includes(subCat.name.toLowerCase()))) {
          return true;
        }
        return false;
      });
    }

    if (searchModel.trim()) {
      const q = searchModel.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }

    return list;
  }, [category, selectedSubSlug, searchModel]);

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-gray-50">
        <div className="h-9 w-9 rounded-full border-3 border-gray-900 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 text-lg">Category not found</p>
        <Link href="/products" className="mt-4 inline-block text-blue-600 font-medium hover:underline">
          &larr; Back to Products
        </Link>
      </div>
    );
  }

  const flatSubs = category.subCategories.flatMap((s) => [s, ...(s.children || [])]);
  const activeSub = flatSubs.find((s) => s.slug === selectedSubSlug);
  const activeSubCategoryName = activeSub
    ? activeSub.parentId
      ? `${flatSubs.find((s) => s.id === activeSub.parentId)?.name ?? ""} ${activeSub.name}`.trim()
      : activeSub.name
    : undefined;

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* 1. CP PLUS Dark Top Banner with Breadcrumb & Category Title */}
      <div className="bg-[#17253d] text-white py-10 px-4 sm:px-6">
        {/* <div className="mx-auto max-w-7xl" style={{ backgroundImage: `url('/images/og-image.jpg')` }} />
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide">
            {activeSubCategoryName ? `${activeSubCategoryName} - ${category.name}` : category.name}
          </h1> */}
          {/* Breadcrumb matching CP PLUS */}
          <nav aria-label="Breadcrumb" className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-white transition">Products</Link>
            <span>/</span>
            <Link href={`/categories/${category.slug}`} onClick={() => setSelectedSubSlug("")} className="hover:text-white transition">
              {category.name}
            </Link>
            {activeSubCategoryName && (
              <>
                <span>/</span>
                <span className="text-white font-semibold">{activeSubCategoryName}</span>
              </>
            )}
          </nav>
           <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
             {activeSubCategoryName ? `${activeSubCategoryName} - ${category.name}` : category.name}
           </h1>
        {/* </div> */}
      </div>

      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 md:py-8">
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-6">
          {/* 2. Left Sidebar (CP PLUS Filter By & Category Accordion) */}
          <aside className="rounded-xl border border-slate-200 bg-white p-4 lg:sticky lg:top-24 lg:p-5">
          <h2 className="text-base font-bold text-[#1b2a4a]">Find products</h2>

             <form onSubmit={(event) => { event.preventDefault(); setSearchModel(searchDraft.trim()) ; }} className="mt-3">
              <label htmlFor="product-search" className="mb-2 block text-sm font-semibold text-slate-700">Product name</label>
              <div className="flex gap-2">
                <input
                  id="product-search"
                  type="search"
                  placeholder="Search products"
                  value={searchDraft}
                  onChange={(event) => setSearchDraft(event.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1b2a4a] focus:outline-2 focus:outline-[#1b2a4a]"
                />
                <button type="submit" aria-label="Search products" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#1b2a4a] text-white transition hover:bg-[#314c74] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B00]">
                  <FiSearch size={18} aria-hidden="true" />
                </button>
              </div>
            </form>

            {/* Categories Tree */}
            <div className="mt-4 border-t border-slate-100 pt-3">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                Categories
              </h3>
              <div className="space-y-1">
                {allCategories.map((cat) => {
                  const isCurrent = cat.slug === currentSlug;
                  return (
                    <div key={cat.id} className="border-b border-gray-50 last:border-0 pb-1">
                      <div className="flex items-center justify-between py-1.5">
                        <Link
                          href={`/categories/${cat.slug}`}
                          className={`text-xs font-medium transition-colors ${
                            isCurrent ? "text-red-600 font-bold" : "text-gray-700 hover:text-red-600"
                          }`}
                        >
                          {cat.name}
                        </Link>
                        <span className="text-[11px] text-gray-400 font-medium">
                          ({cat._count?.products || 0})
                        </span>
                      </div>

                      
                      {isCurrent && category.subCategories && category.subCategories.length > 0 && (
                        <div className="pl-3.5 pt-1 pb-2 space-y-1.5 border-l-2 border-red-500/20 ml-1">
                          <button
                            type="button"
                            onClick={() => setSelectedSubSlug("")}
                            className={`flex items-center gap-1.5 text-xs text-left w-full transition ${
                              !selectedSubSlug ? "text-red-600 font-semibold" : "text-gray-500 hover:text-gray-800"
                            }`}
                          >
                            <span className="text-[10px]">&bull;</span> All {category.name}
                          </button>
                          {category.subCategories.filter((sub) => !sub.parentId).map((sub) => {
                            const isSubActive = selectedSubSlug === sub.slug;
                            return (
                              <div key={sub.id}>
                                <button
                                  type="button"
                                  onClick={() => setSelectedSubSlug(sub.slug)}
                                  className={`flex items-center gap-1.5 text-xs text-left w-full transition ${
                                    isSubActive ? "text-red-600 font-semibold" : "text-gray-500 hover:text-gray-800"
                                  }`}
                                >
                                  <span className={`text-[10px] ${isSubActive ? "text-red-600" : "text-gray-400"}`}>&bull;</span>
                                  {sub.name}
                                </button>
                                {(sub.children || []).length > 0 && (
                                  <div className="pl-4 pt-1 space-y-1">
                                    {sub.children!.map((child) => {
                                      const isChildActive = selectedSubSlug === child.slug;
                                      return (
                                        <button
                                          key={child.id}
                                          type="button"
                                          onClick={() => setSelectedSubSlug(child.slug)}
                                          className={`flex items-center gap-1.5 text-[11px] text-left w-full transition ${
                                            isChildActive ? "text-red-600 font-semibold" : "text-gray-400 hover:text-gray-700"
                                          }`}
                                        >
                                          <span className={`text-[9px] ${isChildActive ? "text-red-600" : "text-gray-300"}`}>&bull;</span>
                                          {child.name}
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
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
            {/* Top Bar matching CP PLUS: Item Count & Quick Tags */}
            {/* <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-gray-200 bg-white rounded-lg p-3.5 shadow-sm text-xs text-gray-600"> */}
              {/* <div className="font-medium text-gray-800">
                We found <span className="font-bold text-red-600">{filteredProducts.length}</span> items
              </div> */}
              {/* <div className="hidden md:flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-400">
                <span className="font-semibold text-gray-600">Find by:</span>
                <span className="hover:text-gray-700 cursor-pointer">Product Series</span> &bull;
                <span className="hover:text-gray-700 cursor-pointer">Audio</span> &bull;
                <span className="hover:text-gray-700 cursor-pointer">BodyType</span> &bull;
                <span className="hover:text-gray-700 cursor-pointer">IR Range</span> &bull;
                <span className="hover:text-gray-700 cursor-pointer">Resolution</span>
              </div> */}
            {/* </div> */}

            {/* Sub-header title */}
            <div className="mt-4 mb-3 flex items-baseline justify-between">
              <h2 className="text-base font-bold text-gray-900">
                Uniworld <span className="text-xs font-normal text-gray-500 ml-1.5">{activeSubCategoryName || category.name}</span>
              </h2>
            </div>

            {/* Product Tiles Grid (Exact 3-Column CP PLUS Style Grid) */}
            {filteredProducts.length === 0 ? (
              <div className="border border-gray-200 bg-white rounded-lg p-16 text-center text-gray-500 shadow-sm">
                <FiCamera size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium">No products found matching your filter.</p>
                {selectedSubSlug && (
                  <button
                    onClick={() => setSelectedSubSlug("")}
                    className="mt-3 text-xs text-red-600 font-semibold underline"
                  >
                    Clear sub-category filter
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 border-t border-l border-gray-200 bg-white shadow-sm rounded-lg overflow-hidden">
                {filteredProducts.map((product, idx) => (
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
                        {product.description || (product.subCategory?.name ? `${product.subCategory.name} Camera` : category.name)}
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
          </main>
        </div>
      </div>
    </div>
  );
}
