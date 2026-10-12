"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import {
  FiShield,
  FiCamera,
  FiMonitor,
  FiChevronLeft,
  FiChevronRight,
  FiArrowUpRight,
  FiCreditCard,
  FiBookOpen,
  FiHeart,
  FiTool,
  FiDroplet,
  FiHome,
  FiShoppingBag,
  FiEye,
  FiNavigation,
  FiTruck,
  FiArrowRight,
  FiMapPin,
  FiCheck,
} from "react-icons/fi";

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  mrp?: number;
  images: { url: string }[];
  category: { id: string; name: string };
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
  image?: string;
  _count: { products: number };
  subCategories?: SubCategory[];
}

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
}

interface PressItem {
  id: string;
  title: string;
  description?: string | null;
  image: string;
  link?: string | null;
}

interface OfferItem {
  id: string;
  title: string;
  description?: string | null;
  image: string;
  link?: string | null;
  buttonText?: string | null;
  position: "featured" | "grid";
  order: number;
}

const securityRanges = [
  { icon: FiCamera, title: "CCTV & surveillance", description: "Find the right camera and recorder for your space." },
  { icon: FiMonitor, title: "Networking essentials", description: "Build a connected system with switches, cables and accessories." },
  { icon: FiShield, title: "Access control", description: "Manage entry points with door and attendance systems." },
];

const solutionSectors = [
  {
    icon: FiCreditCard,
    title: "Banking & Finance",
    description: "Surveillance coverage for branches, ATMs, cash areas and customer entrances.",
  },
  {
    icon: FiBookOpen,
    title: "Education & Campus",
    description: "Help monitor campus entrances, shared spaces and perimeter areas.",
  },
  {
    icon: FiHeart,
    title: "Healthcare & Hospitality",
    description: "Support visibility across patient, guest and staff areas while respecting privacy.",
  },
  {
    icon: FiTool,
    title: "Industrial & Warehousing",
    description: "Cover production floors, loading bays, inventory and restricted zones.",
  },
  {
    icon: FiShield,
    title: "Public Safety",
    description: "Plan reliable camera coverage for civic spaces and public-facing facilities.",
  },
  {
    icon: FiDroplet,
    title: "Oil, Gas & Energy",
    description: "Monitor plant perimeters, equipment yards and distributed operating sites.",
  },
  {
    icon: FiHome,
    title: "Real Estate",
    description: "Secure residential communities, construction sites and shared facilities.",
  },
  {
    icon: FiShoppingBag,
    title: "Retail & Commercial",
    description: "Improve visibility around storefronts, stock areas, entrances and checkout zones.",
  },
  {
    icon: FiEye,
    title: "Safe City & Infrastructure",
    description: "Build connected surveillance coverage for streets and essential public assets.",
  },
  {
    icon: FiNavigation,
    title: "Smart Traffic",
    description: "Monitor roads, junctions and vehicle movement with networked camera systems.",
  },
  {
    icon: FiTruck,
    title: "Transport & Logistics",
    description: "Bring visibility to terminals, depots, stations and freight operations.",
  },
];

export default function HomePage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pressItems, setPressItems] = useState<PressItem[]>([]);
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [activeProductsCategoryId, setActiveProductsCategoryId] = useState<string>("");
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const trendingRef = useRef<HTMLDivElement>(null);
  const pressRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [trackIndex, setTrackIndex] = useState(1);
  const [isLoopReset, setIsLoopReset] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    if (banners.length === 0) return;
    const nextIndex = (currentSlide + 1) % banners.length;
    setCurrentSlide(nextIndex);
    setTrackIndex(banners.length > 1 && currentSlide === banners.length - 1 ? banners.length + 1 : nextIndex + 1);
  }, [banners.length, currentSlide]);

  const prevSlide = () => {
    if (banners.length === 0) return;
    const previousIndex = (currentSlide - 1 + banners.length) % banners.length;
    setCurrentSlide(previousIndex);
    setTrackIndex(banners.length > 1 && currentSlide === 0 ? 0 : previousIndex + 1);
  };

  const handleBannerTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
    if (trackIndex === banners.length + 1) {
      setIsLoopReset(true);
      setTrackIndex(1);
      setCurrentSlide(0);
    } else if (trackIndex === 0) {
      setIsLoopReset(true);
      setTrackIndex(banners.length);
      setCurrentSlide(banners.length - 1);
    }
  };

  const handleBannerTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleBannerTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    if (touchStartX.current === null) return;
    const swipeDistance = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance < 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [banners.length, nextSlide]);

  useEffect(() => {
    if (!isLoopReset) return;
    const firstFrame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsLoopReset(false));
    });
    return () => cancelAnimationFrame(firstFrame);
  }, [isLoopReset]);

  const loadData = async () => {
    try {
      const [bannersRes, productsRes, trendingRes, categoriesRes, pressRes, offersRes] = await Promise.all([
        api.get("/banners/public").catch(() => ({ data: [] })),
        api.get("/products/public?featured=true&limit=8").catch(() => ({ data: { products: [] } })),
        api.get("/products/public?limit=12").catch(() => ({ data: { products: [] } })),
        api.get("/categories/public").catch(() => ({ data: [] })),
        api.get("/press/public").catch(() => ({ data: [] })),
        api.get("/offers/public").catch(() => ({ data: [] })),
      ]);
      setBanners(bannersRes.data);
      setFeaturedProducts(productsRes.data.products || []);
      setTrendingProducts(trendingRes.data.products || []);
      setCategories(categoriesRes.data);
      if (categoriesRes.data && categoriesRes.data.length > 0) {
        setActiveProductsCategoryId(categoriesRes.data[0].id);
      }
      setPressItems(pressRes.data || []);
      setOffers(Array.isArray(offersRes.data) ? offersRes.data : []);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!activeProductsCategoryId) return;
    let cancelled = false;
    setCategoryLoading(true);
    setCategoryError(false);
    setCategoryProducts([]);

    api.get(`/products/public?category=${encodeURIComponent(activeProductsCategoryId)}&limit=6`)
      .then((response) => {
        if (!cancelled) setCategoryProducts(response.data.products || []);
      })
      .catch(() => {
        if (!cancelled) setCategoryError(true);
      })
      .finally(() => {
        if (!cancelled) setCategoryLoading(false);
      });

    return () => { cancelled = true; };
  }, [activeProductsCategoryId]);

  const carouselBanners = banners.length > 1
    ? [banners[banners.length - 1], ...banners, banners[0]]
    : banners;
  const catalogProducts = [...featuredProducts, ...trendingProducts];
  const visibleTrendingProducts = trendingProducts.filter(
    (product) => product.images[0]?.url,
  );
  const heroProduct = catalogProducts.find(
    (product) => product.images[0]?.url,
  );
  const showcaseCategory =
    categories.find((c) => c.id === activeProductsCategoryId) ||
    categories.find((category) => category._count.products > 0 && category.image) ||
    categories.find((category) => category._count.products > 0) ||
    categories[0];

  return (
    <div className="pb-8 sm:pb-10">
      <section className="relative overflow-hidden bg-[#101d33] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(49,76,116,0.7),transparent_65%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-20">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[11px] font-semibold tracking-wide text-slate-200">
              <FiMapPin className="text-[#ff9c54]" aria-hidden="true" /> Bihar · Jharkhand · Nepal
            </p>
            <h1 className="max-w-[14ch] text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              A safer world.<br /><span className="text-[#ff9c54]">Starts with Uniworld.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
              CCTV cameras, networking and access control for your home, business or next project. Find the right security solution, with a team you can talk to.
            </p>
            <div className="mt-8 flex flex-col gap-3 min-[400px]:flex-row">
              <Link href="/products" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#FF6B00] px-6 text-sm font-bold text-white transition-colors hover:bg-[#e95f00] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff9c54]">
                Browse products <FiArrowRight aria-hidden="true" />
              </Link>
              <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/30 px-6 text-sm font-bold text-white transition-colors hover:bg-white hover:text-[#101d33] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                Get dealer pricing
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-xs font-medium text-slate-300">
              <span className="inline-flex items-center gap-2"><FiCheck className="text-[#ff9c54]" aria-hidden="true" /> Product guidance</span>
              <span className="inline-flex items-center gap-2"><FiCheck className="text-[#ff9c54]" aria-hidden="true" /> Dealer enquiries</span>
              <span className="inline-flex items-center gap-2"><FiCheck className="text-[#ff9c54]" aria-hidden="true" /> Local support</span>
            </div>
          </div>
          <div className="relative rounded-3xl border border-white/15 bg-white/[0.04] p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
              <span>Security, thoughtfully connected</span><FiShield size={18} className="text-[#ff9c54]" aria-hidden="true" />
            </div>
            <div className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-[#f4f6f8]">
              <Image src={heroProduct?.images[0]?.url || "/images/security-camera.svg"} alt={heroProduct?.name || "Illustration of a CCTV security camera"} fill unoptimized priority sizes="(max-width: 1024px) 90vw, 520px" className="object-contain p-8 sm:p-12" />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#ff9c54]">Explore our range</p>
                <p className="mt-1 line-clamp-1 text-sm font-semibold">{heroProduct?.name || "CCTV & surveillance solutions"}</p>
              </div>
              <Link href={heroProduct ? `/products/${heroProduct.slug}` : "/products"} aria-label={heroProduct ? `View ${heroProduct.name}` : "View security products"} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 transition-colors hover:bg-white hover:text-[#101d33] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"><FiArrowUpRight size={20} aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
      </section>
      {banners.length > 0 ? (
        <section
          className="relative mx-auto my-6 max-w-7xl overflow-hidden rounded-xl border border-slate-200 bg-white sm:my-8"
          aria-label="Uniworld announcements"
          onTouchStart={banners.length > 1 ? handleBannerTouchStart : undefined}
          onTouchEnd={banners.length > 1 ? handleBannerTouchEnd : undefined}
        >
          <div
            onTransitionEnd={handleBannerTransitionEnd}
            className={`relative flex ${isLoopReset ? "transition-none" : "transition-transform duration-1000 ease-out"}`}
            style={{ transform: `translateX(-${(banners.length > 1 ? trackIndex : 0) * 100}%)` }}
          >
            {carouselBanners.map((banner, idx) => {
              const isLeadingClone = banners.length > 1 && idx === 0;
              const isTrailingClone = banners.length > 1 && idx === carouselBanners.length - 1;
              const slideContent = (
                <div className="relative aspect-[1900/568] w-full bg-white">
                  <Image
                    src={banner.image}
                    alt={banner.title || "Uniworld security solutions"}
                    fill
                    unoptimized
                    priority={idx === (banners.length > 1 ? 1 : 0)}
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>
              );

              return (
                <div key={isLeadingClone ? `leading-${banner.id}` : isTrailingClone ? `trailing-${banner.id}` : banner.id} className="relative min-w-full">
                  {banner.link ? <Link href={banner.link} className="block">{slideContent}</Link> : slideContent}
                </div>
              );
            })}
          </div>

          {banners.length > 1 && (
            <>
              <button onClick={prevSlide} className="absolute left-2 top-1/2 z-10 flex h-11 w-9 -translate-y-1/2 items-center justify-center border border-white/70 bg-white/75 text-[#263445] shadow-sm backdrop-blur-sm transition-colors hover:bg-[#e86c22] hover:text-white sm:left-4 sm:h-12 sm:w-10" aria-label="Previous slide">
                <FiChevronLeft size={18} />
              </button>
              <button onClick={nextSlide} className="absolute right-2 top-1/2 z-10 flex h-11 w-9 -translate-y-1/2 items-center justify-center border border-white/70 bg-white/75 text-[#263445] shadow-sm backdrop-blur-sm transition-colors hover:bg-[#e86c22] hover:text-white sm:right-4 sm:h-12 sm:w-10" aria-label="Next slide">
                <FiChevronRight size={18} />
              </button>
              <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 drop-shadow-md">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentSlide(i);
                      setTrackIndex(banners.length > 1 ? i + 1 : i);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? "w-6 bg-[#e86c22]" : "w-1.5 bg-white/80 hover:bg-white"}`}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === currentSlide ? "true" : undefined}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      ) : null}

      <section className="bg-white py-10 md:py-14 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Security for every space
            </h2>
            <Link
              href="/products"
              className="inline-flex h-9 shrink-0 self-start items-center justify-center rounded border border-gray-300 px-4 text-xs font-bold uppercase tracking-wider text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
            >
              Explore the range <FiArrowUpRight className="ml-2" aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
            From a single camera to a connected security system. Explore products for homes, businesses and institutions, and let us help you choose.
          </p>

          {(() => {
            const featuredOffer = offers.find((o) => o.position === "featured") || offers[0];
            const gridCards = featuredOffer ? [featuredOffer, ...offers.filter((o) => o.id !== featuredOffer.id)] : [];

            return (
              <div className="mt-8 grid items-stretch gap-5 lg:grid-cols-2">
                  <Link
                    href="/products"
                    className="group relative flex min-h-[380px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-[#edf2f7] p-7 sm:min-h-[440px] sm:p-9 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF6B00]"
                  >
                    <div className="relative z-10">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#b94e00]">Built around your needs</p>
                      <h3 className="mt-3 max-w-[15ch] text-3xl font-bold leading-tight text-[#1b2a4a]">The right view.<br />The right protection.</h3>
                    </div>
                    <div className="relative my-4 h-48 sm:h-56">
                      <Image src="/images/security-camera.svg" alt="Illustration of a CCTV camera" fill sizes="(max-width: 1024px) 90vw, 560px" className="object-contain transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <span className="relative z-10 inline-flex items-center gap-2 text-sm font-bold text-[#1b2a4a]">Find your security solution <FiArrowRight aria-hidden="true" /></span>
                  </Link>

                {gridCards.length > 0 && (
                  <div className={`grid gap-4 h-full ${gridCards.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
                    {gridCards.map((card) => (
                      <Link key={card.id} href={card.link || "/products"} className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF6B00]">
                        <div className="relative aspect-[16/10] bg-slate-50">
                          <Image src={card.image} alt={card.title || "Uniworld offer"} fill sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px" className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.03]" />
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                          <h3 className="text-sm font-bold leading-5 text-[#1b2a4a]">{card.title}</h3>
                          {card.description && <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{card.description}</p>}
                          <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-semibold text-[#b94e00]">{card.buttonText || "Explore"}<FiArrowUpRight aria-hidden="true" /></span>
                        </div>
                      </Link>
                  ))}
                </div>
                )}
                {gridCards.length === 0 && (
                  <div className="grid gap-4">
                    {securityRanges.map((range) => (
                      <Link key={range.title} href="/products" className="group flex items-center gap-5 rounded-xl border border-slate-200 bg-white p-6 transition-colors hover:border-[#FF6B00]/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF6B00]">
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#fff4ec] text-[#b94e00]"><range.icon size={25} aria-hidden="true" /></span>
                        <div><h3 className="font-bold text-[#1b2a4a]">{range.title}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{range.description}</p></div>
                        <FiArrowUpRight className="ml-auto shrink-0 text-slate-400 group-hover:text-[#b94e00]" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </section>

      {/* Trending Items - CP PLUS Style */}
      {visibleTrendingProducts.length > 0 && (
        <section className="bg-[#f2f4f6] py-10 md:py-12 border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Header row */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                <h2 className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight">
                  Latest products
                </h2>
                <p className="text-sm text-gray-500">
                  Discover the latest additions to our security range.
                </p>
              </div>

              {/* Prev / Next navigation arrows matching CP PLUS (square white box with rounded corners and light border) */}
              <div className="flex gap-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={() =>
                    trendingRef.current?.scrollBy({
                      left: -260,
                      behavior: "smooth",
                    })
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 hover:border-gray-400 active:scale-95"
                  aria-label="Previous"
                >
                  <FiChevronLeft size={18} />
                </button>
                <button
                  onClick={() =>
                    trendingRef.current?.scrollBy({
                      left: 260,
                      behavior: "smooth",
                    })
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 hover:border-gray-400 active:scale-95"
                  aria-label="Next"
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Slider cards list */}
            <div
              ref={trendingRef}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 pt-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {visibleTrendingProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group relative flex w-[190px] sm:w-[205px] shrink-0 snap-start flex-col rounded-lg border border-gray-200/90 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 overflow-hidden pb-4"
                >
                  {/* Product Image Area */}
                  <div className="relative h-[135px] w-full shrink-0 bg-white p-3 flex items-center justify-center">
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 190px, 205px"
                      className="object-contain p-3.5 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Product Details Area (Centered CP PLUS Layout) */}
                  <div className="flex flex-col items-center justify-start px-3.5 pt-1 text-center">
                    {/* Model / Product Name (Bold CP PLUS style) */}
                    <h3 className="w-full text-[13px] font-semibold text-gray-800 leading-snug line-clamp-2 transition-colors group-hover:text-blue-600">
                      {product.name}
                    </h3>

                    {/* Subtitle / Description (Clean Gray Subtext) */}
                    {product.description ? (
                      <p className="mt-1.5 w-full text-[11px] text-gray-500 leading-[16px] line-clamp-2">
                        {product.description}
                      </p>
                    ) : (
                      <p className="mt-1.5 w-full text-[11px] text-gray-500 leading-[16px] line-clamp-2">
                        {product.category?.name || "Surveillance Equipment"}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="border-b border-slate-100 bg-[#f7f9fc] py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#b94e00]">Find your fit</p>
                <h2 className="text-2xl font-bold tracking-tight text-[#1b2a4a] sm:text-3xl">Explore our products</h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">Choose a category to discover the products available for your project.</p>
              </div>
              <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1b2a4a] hover:text-[#b94e00]">View all products <FiArrowRight aria-hidden="true" /></Link>
            </div>
            <div className="mt-8 grid min-w-0 gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
              <div className="min-w-0">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Categories</p>
                <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
                  {categories.map((category) => {
                    const isSelected = showcaseCategory?.id === category.id;
                    return (
                      <button key={category.id} type="button" aria-pressed={isSelected} aria-controls="category-products" onClick={() => setActiveProductsCategoryId(category.id)}
                        className={`flex shrink-0 items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B00] ${isSelected ? "border-[#1b2a4a] bg-[#1b2a4a] text-white" : "border-slate-200 bg-white text-slate-600 hover:border-[#1b2a4a]"}`}>
                        {category.name}<FiChevronRight className="shrink-0" aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div id="category-products" aria-busy={categoryLoading} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
                  <h3 className="text-lg font-bold text-[#1b2a4a]">{showcaseCategory?.name}</h3>
                  <Link href={`/categories/${showcaseCategory?.slug}`} className="inline-flex items-center gap-1 text-xs font-semibold text-[#b94e00]">Browse category <FiArrowUpRight aria-hidden="true" /></Link>
                </div>
                {showcaseCategory?.subCategories && showcaseCategory.subCategories.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {showcaseCategory.subCategories.map((subCategory) => (
                      <Link key={subCategory.id} href={`/categories/${showcaseCategory.slug}?sub=${subCategory.slug}`} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 hover:border-[#b94e00] hover:text-[#b94e00]">
                        {subCategory.name}<FiArrowUpRight aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                )}
                {categoryLoading ? (
                  <p role="status" className="py-16 text-center text-sm text-slate-500">Loading products…</p>
                ) : categoryProducts.length > 0 ? (
                  <div className="mt-6 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 xl:grid-cols-3">
                    {categoryProducts.map((product) => (
                      <Link key={product.id} href={`/products/${product.slug}`} className="group flex flex-col rounded-xl border border-slate-100 p-4 transition-all hover:border-slate-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B00]">
                        <div className="relative aspect-[4/3] rounded-lg bg-[#f7f9fc]">
                          <Image src={product.images[0]?.url || "/images/security-camera.svg"} alt={product.images[0]?.url ? product.name : "Security product illustration"} fill sizes="(max-width: 420px) 80vw, (max-width: 1280px) 40vw, 260px" className="object-contain p-4 transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-slate-500">{product.category?.name}</p>
                        <h4 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-[#1b2a4a]">{product.name}</h4>
                        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-semibold text-[#b94e00]">View product <FiArrowUpRight aria-hidden="true" /></span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p role="status" className="text-sm leading-6 text-slate-500">{categoryError ? "Products could not be loaded right now." : "Looking for a product in this range?"}</p>
                    <Link href="/contact" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#b94e00]">Ask our team <FiArrowRight aria-hidden="true" /></Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Industry Solutions */}
      <section className="bg-white py-8 md:py-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-6 max-w-3xl md:mb-8">
            <p className="mb-3 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#e86c22]">
              <span className="h-px w-8 bg-[#e86c22]" />
              Security by environment
            </p>
            <h2 className="text-3xl font-extrabold leading-tight text-[#14243c] sm:text-4xl">
              Our solutions
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              From busy campuses to distributed operations, explore security systems suited to the spaces and teams you need to protect.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {solutionSectors.map((solution) => (
              <Link
                key={solution.title}
                href="/contact"
                className="group flex min-h-[154px] items-start gap-4 border border-slate-200 bg-white p-5 transition-all duration-300 hover:border-[#e86c22]/50 hover:shadow-[0_14px_34px_rgba(15,23,42,0.08)] sm:p-6"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-slate-200 bg-[#f5f6f5] text-[#536273] transition-colors group-hover:border-[#e86c22]/30 group-hover:bg-[#fff5ed] group-hover:text-[#d96320]">
                  <solution.icon size={23} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col items-start">
                  <span className="text-[15px] font-bold leading-5 text-[#263445]">{solution.title}</span>
                  <span className="mt-1.5 line-clamp-2 text-xs leading-[18px] text-slate-600 sm:text-[13px]">{solution.description}</span>
                  <span className="mt-auto inline-flex items-center gap-1 pt-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#d96320]">
                    Discuss your project
                    <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" size={13} aria-hidden="true" />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Print & Press */}
      {pressItems.length > 0 && (
        <section className="bg-[#f0f2f2] py-10 md:py-14">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#263445] sm:text-3xl">News &amp; updates</h2>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">News, events and media coverage from Uniworld.</p>
              </div>
              {pressItems.length > 1 && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => pressRef.current?.scrollBy({ left: -300, behavior: "smooth" })}
                    className="flex h-9 w-9 items-center justify-center border border-slate-300 bg-white text-[#263445] transition-colors hover:border-[#263445] hover:bg-[#263445] hover:text-white"
                    aria-label="Previous press items"
                  >
                    <FiChevronLeft size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={() => pressRef.current?.scrollBy({ left: 300, behavior: "smooth" })}
                    className="flex h-9 w-9 items-center justify-center border border-slate-300 bg-white text-[#263445] transition-colors hover:border-[#263445] hover:bg-[#263445] hover:text-white"
                    aria-label="Next press items"
                  >
                    <FiChevronRight size={17} />
                  </button>
                </div>
              )}
            </div>

            <div ref={pressRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {pressItems.map((item) => {
                const isExternalLink = Boolean(item.link && /^https?:\/\//i.test(item.link));
                const cardContent = (
                  <>
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      <Image src={item.image} alt={item.title} fill sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 360px" className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]" />
                    </div>
                    <div className="min-h-[120px] border-t border-slate-200 bg-white p-5">
                      <h3 className="line-clamp-2 text-base font-semibold leading-6 text-[#263445]">{item.title}</h3>
                      {item.description && <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{item.description}</p>}
                      {item.link && <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#b94e00]">Read more <FiArrowUpRight aria-hidden="true" /></span>}
                    </div>
                  </>
                );

                return (
                  <article key={item.id} className="group w-[min(280px,85vw)] shrink-0 snap-start overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-[0_12px_28px_rgba(15,23,42,0.1)] sm:w-[320px]">
                    {item.link ? (
                      <a href={item.link} target={isExternalLink ? "_blank" : undefined} rel={isExternalLink ? "noopener noreferrer" : undefined} className="block">
                        {cardContent}
                      </a>
                    ) : cardContent}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="mb-6 text-center md:mb-8">
              <span className="section-eyebrow">
                <span className="h-px w-6 bg-[#FF6B00]" />
                Featured range
              </span>
              <h2 className="mt-4 text-3xl font-extrabold text-[#0f172a] md:text-4xl">
                High-performance products for every environment
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_66px_rgba(15,23,42,0.12)]"
                >
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-[#fff4ec]">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
                        className="object-contain p-5 transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <Image src="/images/security-camera.svg" alt="Security product illustration" fill sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px" className="object-contain p-5" />
                    )}
                  </div>
                  <div className="p-5">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF6B00]">
                      {product.category.name}
                    </p>
                    <h3 className="mb-3 line-clamp-2 text-base font-bold text-[#0f172a]">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-extrabold text-[#1B2A4A]">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.mrp && (
                        <span className="text-sm text-slate-400 line-through">
                          ₹{product.mrp.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/products"
                className="premium-button-primary"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto mt-10 max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-[#1b2a4a] p-7 text-white sm:p-10 md:flex-row md:items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#ff9c54]">Let’s build your security setup</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Not sure where to start?</h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">Tell us about your space. Our team can help with product selection and dealer enquiries.</p>
          </div>
          <Link href="/contact" className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-lg bg-[#FF6B00] px-6 text-sm font-bold text-white transition-colors hover:bg-[#e95f00] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Speak to our team <FiArrowRight aria-hidden="true" /></Link>
        </div>
      </section>
    </div>
  );
}
