"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import { FiArrowRight, FiCamera, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";

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

function ProductImage({ src, name }: { src?: string; name: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  return (
    <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-xl bg-slate-50 sm:h-44">
      {src && failedSrc !== src ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1280px) 45vw, 280px"
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <FiCamera size={32} aria-hidden="true" />
          <span className="text-xs font-medium">Image unavailable</span>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category") || "";
  const subFromUrl = searchParams.get("sub") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryToken, setRetryToken] = useState(0);
  const [searchDraft, setSearchDraft] = useState("");
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

  const loadCategories = async () => {
    try {
      const res = await api.get("/categories/public");
      setCategories(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const currentCategoryObj = categories.find((c) => c.id === selectedCategory || c.slug === selectedCategory);
  const currentSubCategoryObj = currentCategoryObj?.subCategories?.find(
    (s) => s.id === selectedSubCategory || s.slug === selectedSubCategory
  );

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      setLoading(true);
      setError(false);
      try {
        const params = new URLSearchParams({ page: page.toString(), limit: "15" });
        if (selectedCategory) params.set("category", currentCategoryObj?.id || selectedCategory);
        if (selectedSubCategory) params.set("subCategory", currentSubCategoryObj?.id || selectedSubCategory);
        if (search) params.set("search", search);

        const res = await api.get(`/products/public?${params}`);
        if (cancelled) return;
        const nextProducts = Array.isArray(res.data.products) ? res.data.products : [];
        setProducts(nextProducts);
        setTotalPages(res.data.pagination?.pages || 1);
        setTotalProducts(res.data.pagination?.total ?? nextProducts.length);
      } catch (error) {
        if (cancelled) return;
        console.error(error);
        setError(true);
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProducts();
    return () => { cancelled = true; };
  }, [page, selectedCategory, selectedSubCategory, search, currentCategoryObj?.id, currentSubCategoryObj?.id, retryToken]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSearchDraft("");
    setSearch("");
    setPage(1);
  };

  const visiblePages = Array.from(
    { length: Math.min(totalPages, 5) },
    (_, index) => Math.max(1, Math.min(page - 2, totalPages - 4)) + index,
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <div className="bg-[#17253d] px-5 py-7 text-white sm:px-8 md:py-8">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <Link href="/" className="hover:text-white">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/products" onClick={clearFilters} className="hover:text-white">Products</Link>
            {currentCategoryObj && <><span aria-hidden="true">/</span><span>{currentCategoryObj.name}</span></>}
            {currentSubCategoryObj && <><span aria-hidden="true">/</span><span>{currentSubCategoryObj.name}</span></>}
          </nav>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {currentSubCategoryObj ? `${currentSubCategoryObj.name} - ${currentCategoryObj?.name}` : currentCategoryObj ? currentCategoryObj.name : "All Products"}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 md:py-8">
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-6">
          <aside className="rounded-xl border border-slate-200 bg-white p-4 lg:sticky lg:top-24 lg:p-5">
            <h2 className="text-base font-bold text-[#1b2a4a]">Find products</h2>
            <form onSubmit={(event) => { event.preventDefault(); setSearch(searchDraft.trim()); setPage(1); }} className="mt-3">
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

            <div className="mt-4 border-t border-slate-100 pt-3">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-600">Categories</h3>
              <select
                aria-label="Filter by category"
                value={currentCategoryObj?.id || selectedCategory}
                onChange={(event) => { setSelectedCategory(event.target.value); setSelectedSubCategory(""); setPage(1); }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-[#1b2a4a] lg:hidden"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name} ({cat._count?.products || 0})</option>)}
              </select>
              <div className="hidden space-y-1 lg:block">
                <div className="shrink-0 lg:shrink">
                  <button
                    type="button"
                    onClick={() => { setSelectedCategory(""); setSelectedSubCategory(""); setPage(1); }}
                    aria-pressed={!selectedCategory}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors ${
                      !selectedCategory ? "bg-[#1b2a4a] text-white" : "text-slate-600 hover:bg-slate-50 hover:text-[#1b2a4a]"
                    }`}
                  >
                    All Categories
                  </button>
                </div>
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id || selectedCategory === cat.slug;
                  return (
                    <div key={cat.id} className="shrink-0 lg:shrink">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => { setSelectedCategory(cat.id); setSelectedSubCategory(""); setPage(1); }}
                          aria-pressed={isSelected}
                          className={`w-full whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors lg:whitespace-normal ${
                            isSelected ? "bg-[#1b2a4a] text-white" : "text-slate-600 hover:bg-slate-50 hover:text-[#1b2a4a]"
                          }`}
                        >
                          {cat.name} <span className={isSelected ? "text-slate-300" : "text-slate-400"}>({cat._count?.products || 0})</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {currentCategoryObj?.subCategories && currentCategoryObj.subCategories.length > 0 && (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-600">{currentCategoryObj.name} types</h3>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => { setSelectedSubCategory(""); setPage(1); }} aria-pressed={!selectedSubCategory} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${!selectedSubCategory ? "border-[#1b2a4a] bg-[#1b2a4a] text-white" : "border-slate-200 text-slate-600 hover:border-[#1b2a4a]"}`}>All</button>
                    {currentCategoryObj.subCategories.map((sub) => (
                      <button key={sub.id} type="button" onClick={() => { setSelectedSubCategory(sub.id); setPage(1); }} aria-pressed={selectedSubCategory === sub.id || selectedSubCategory === sub.slug} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${selectedSubCategory === sub.id || selectedSubCategory === sub.slug ? "border-[#1b2a4a] bg-[#1b2a4a] text-white" : "border-slate-200 text-slate-600 hover:border-[#1b2a4a]"}`}>{sub.name}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-[#1b2a4a]">{currentSubCategoryObj?.name || currentCategoryObj?.name || "All products"}</h2>
                <p role="status" className="mt-1 text-sm text-slate-500">{loading ? "Loading products…" : error ? "Products unavailable" : `${totalProducts} ${totalProducts === 1 ? "product" : "products"}${search ? ` matching “${search}”` : ""}`}</p>
              </div>
              {(selectedCategory || selectedSubCategory || search) && (
                <button type="button" onClick={clearFilters} className="text-sm font-semibold text-[#b94e00] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B00]">Clear filters</button>
              )}
            </div>

            {loading ? (
              <div className="rounded-xl border border-slate-200 bg-white px-5 py-16 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#FF6B00]" aria-hidden="true" />
                <p className="mt-3 text-sm text-slate-600">Loading products…</p>
              </div>
            ) : error ? (
              <div role="alert" className="rounded-xl border border-slate-200 bg-white px-5 py-16 text-center">
                <p className="text-sm font-semibold text-[#1b2a4a]">Products couldn’t be loaded right now.</p>
                <button type="button" onClick={() => setRetryToken((token) => token + 1)} className="mt-3 text-sm font-semibold text-[#b94e00] hover:underline">Try again</button>
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white px-5 py-16 text-center text-slate-600">
                <FiSearch size={32} className="mx-auto mb-3 text-slate-400" aria-hidden="true" />
                <p className="text-sm font-medium">No products found{search || selectedCategory ? " for these filters" : " yet"}.</p>
                {(selectedCategory || selectedSubCategory || search) && (
                  <button type="button" onClick={clearFilters} className="mt-3 text-sm font-semibold text-[#b94e00] hover:underline">Clear all filters</button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group flex min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-3 transition-shadow hover:border-slate-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B00]"
                  >
                    <ProductImage src={product.images?.[0]?.url} name={product.name} />
                    <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
                      <div className="mb-2 flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-wide text-[#b94e00]">
                        <span className="truncate">{product.category?.name}</span>
                        {product.isFeatured && <span className="shrink-0 rounded-full bg-[#fff4ec] px-2 py-1 text-[10px] normal-case tracking-normal">Featured</span>}
                      </div>
                      <h3 className="line-clamp-2 text-base font-bold leading-6 text-[#1b2a4a]">{product.name}</h3>
                      {product.description && <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600">{product.description}</p>}
                      {product.price > 0 && (
                        <div className="mt-3 text-sm font-bold text-[#1b2a4a]">
                          ₹{product.price.toLocaleString()}
                          {product.mrp && product.mrp > product.price && (
                            <span className="ml-2 text-xs font-normal text-slate-400 line-through">
                              ₹{product.mrp.toLocaleString()}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="mt-auto pt-4">
                        <span className="flex items-center gap-1 border-t border-slate-100 pt-3 text-sm font-bold text-[#b94e00] group-hover:text-[#e95f00]">View details <FiArrowRight size={16} aria-hidden="true" /></span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!loading && !error && totalPages > 1 && (
              <nav aria-label="Product pages" className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex min-h-10 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:border-[#1b2a4a] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FiChevronLeft size={16} aria-hidden="true" /> Previous
                </button>

                {visiblePages.map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    aria-label={`Page ${pageNum}`}
                    aria-current={page === pageNum ? "page" : undefined}
                    className={`h-10 w-10 rounded-lg text-sm font-bold transition ${
                      page === pageNum
                        ? "bg-[#1b2a4a] text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-[#1b2a4a]"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex min-h-10 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:border-[#1b2a4a] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next <FiChevronRight size={16} aria-hidden="true" />
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
