"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import {
  FiShield,
  FiCamera,
  FiMonitor,
  FiUsers,
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
} from "react-icons/fi";

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  mrp?: number;
  images: { url: string }[];
  category: { name: string };
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

const defaultOfferItems: OfferItem[] = [
  {
    id: "offer-cloud",
    title: "Upgrade to Cloud Storage",
    description: "ezyKam+ Seamless, Secure, Reliable. New flexible subscription plans with 7 days of event recording.",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80",
    link: "/products",
    buttonText: "View More",
    position: "featured",
    order: 0,
  },
  {
    id: "offer-net",
    title: "Network Cameras",
    description: "Advanced IP cameras delivering high-resolution video, seamless connectivity, and intelligent AI analytics.",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
    link: "/products",
    buttonText: "View More",
    position: "grid",
    order: 1,
  },
  {
    id: "offer-dash",
    title: "Dash Cam",
    description: "Compact and reliable CarKam range offering crystal-clear footage for enhanced on-road vehicle security.",
    image: "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80",
    link: "/products",
    buttonText: "View More",
    position: "grid",
    order: 2,
  },
  {
    id: "offer-ptz",
    title: "Speed Dome(PTZ)",
    description: "Precision pan-tilt-zoom cameras for expansive area coverage and zoomed-in details with rapid positioning.",
    image: "https://images.unsplash.com/photo-1520697830682-bbb6e85e2b0b?auto=format&fit=crop&w=800&q=80",
    link: "/products",
    buttonText: "View More",
    position: "grid",
    order: 3,
  },
  {
    id: "offer-4g",
    title: "4G Cameras",
    description: "Wireless, high-performance cameras leveraging 4G connectivity for real-time monitoring in remote setups.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    link: "/products",
    buttonText: "View More",
    position: "grid",
    order: 4,
  },
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
  const [offers, setOffers] = useState<OfferItem[]>(defaultOfferItems);
  const [activeProductsCategoryId, setActiveProductsCategoryId] = useState<string>("");
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
        api.get("/products/public?limit=12&sort=latest").catch(() => ({ data: { products: [] } })),
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
      if (offersRes.data && Array.isArray(offersRes.data) && offersRes.data.length > 0) {
        setOffers(offersRes.data);
      } else {
        setOffers(defaultOfferItems);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const carouselBanners = banners.length > 1
    ? [banners[banners.length - 1], ...banners, banners[0]]
    : banners;
  const catalogProducts = [...featuredProducts, ...trendingProducts];
  const catalogShowcaseProducts = catalogProducts
    .filter((product, index, products) =>
      Boolean(product.images[0]?.url) &&
      products.findIndex((candidate) => candidate.id === product.id) === index,
    )
    .slice(0, 6);
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

  const activeCategoryProducts = showcaseCategory
    ? catalogProducts.filter(
        (product, index, products) =>
          product.category?.name === showcaseCategory.name &&
          Boolean(product.images[0]?.url) &&
          products.findIndex((candidate) => candidate.id === product.id) === index,
      )
    : [];

  const displayGridProducts = (
    activeCategoryProducts.length > 0
      ? activeCategoryProducts
      : catalogShowcaseProducts
  ).slice(0, 6);

  return (
    <div className="pb-8 sm:pb-10">
      {banners.length > 0 ? (
        <section
          className="relative w-full overflow-hidden bg-white"
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
      ) : (
        <section className="relative isolate overflow-hidden bg-[#101d33] text-white">
          <div className="absolute inset-0 -z-10 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:56px_56px]" />
          <div className="container mx-auto grid items-center gap-8 px-5 py-9 sm:grid-cols-[1.15fr_0.85fr] sm:gap-6 sm:px-8 sm:py-6 lg:min-h-[520px] lg:grid-cols-[1.02fr_0.98fr] lg:gap-12 lg:px-12 lg:py-14">
            <div className="max-w-xl">
              <span className="mb-3 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f5a55f] lg:mb-4">
                <span className="h-px w-8 bg-[#f5a55f]" />
                Uniworld Security Solutions
              </span>
              <h1 className="max-w-[13ch] text-[2.5rem] font-extrabold leading-[1.04] sm:text-[1.875rem] lg:text-[3.75rem]">
                Security built around your world.
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-5 text-slate-300 sm:mt-3 sm:text-[13px] sm:leading-[18px] lg:mt-5 lg:text-base lg:leading-7">
                CCTV, networking and access control for homes, businesses and institutions across Bihar, Jharkhand and Nepal.
              </p>
              <div className="mt-3 flex flex-wrap gap-3 lg:mt-7">
                <Link href="/products" className="inline-flex min-h-10 items-center justify-center bg-[#e86c22] px-5 text-sm font-bold text-white transition-colors hover:bg-[#cf5917] lg:min-h-12 lg:px-6">
                  Explore products <FiChevronRight className="ml-2" aria-hidden="true" />
                </Link>
                <Link href="/contact" className="inline-flex min-h-10 items-center justify-center border border-white/35 px-5 text-sm font-bold text-white transition-colors hover:border-white hover:bg-white hover:text-[#101d33] lg:min-h-12 lg:px-6">
                  Speak to our team
                </Link>
              </div>
              <div className="mt-8 hidden flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/15 pt-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-300 lg:flex lg:text-[11px]">
                <span>Bihar</span><span className="h-1 w-1 rounded-full bg-[#e86c22]" />
                <span>Jharkhand</span><span className="h-1 w-1 rounded-full bg-[#e86c22]" />
                <span>Nepal</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[560px] sm:max-w-none">
              <div className="relative aspect-[1.18/1] overflow-hidden border border-white/15 bg-[#f2f1ed]">
                {heroProduct ? (
                  <Image
                    src={heroProduct.images[0].url}
                    alt={heroProduct.name}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain p-8 sm:p-12"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[#1b2a4a]">
                    <FiCamera size={76} strokeWidth={1} aria-hidden="true" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-[#0d1728]/90 to-transparent px-5 pb-5 pt-14 text-white sm:px-7 sm:pb-6">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#f5a55f]">Security systems</p>
                    {heroProduct && <p className="mt-1 max-w-[30ch] text-sm font-semibold sm:text-base">{heroProduct.name}</p>}
                  </div>
                  <FiShield className="mb-1 shrink-0 text-white/75" size={22} aria-hidden="true" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 -z-10 h-full w-full border border-[#e86c22]/60" />
            </div>
          </div>
        </section>
      )}

      {/* We Offer - CP PLUS UI/UX Layout */}
      <section className="bg-white py-10 md:py-14 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              We Offer
            </h2>
            <Link
              href="/products"
              className="inline-flex h-9 items-center justify-center rounded border border-gray-300 px-4 text-xs font-bold uppercase tracking-wider text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
            >
              SHOW ALL
            </Link>
          </div>
          <p className="mt-3 w-full text-sm leading-relaxed text-gray-600 sm:text-[15px]">
            Uniworld offers a comprehensive range of advanced security and surveillance solutions to meet the ever-changing requirements of different industries. At present, we are serving many different verticals comprising defence, government, hotels, hospitals, educational institutes, homes, infrastructure, and transportation among others. Being a major surveillance system brand globally, we bring efficient, reliable, scalable, and integrated solutions to our customers.
          </p>

          {(() => {
            const featuredOffer = offers.find((o) => o.position === "featured") || offers[0];
            const gridCards = offers.filter((o) => o.id !== featuredOffer?.id);

            return (
              <div className={`mt-6 grid gap-4 items-stretch ${featuredOffer ? "lg:grid-cols-2 lg:gap-5" : "grid-cols-1"}`}>
                {/* Left: Featured Large Offer Poster Banner */}
                {featuredOffer && (
                  <Link
                    href={featuredOffer.link || "/products"}
                    className="group relative flex aspect-[16/10] lg:aspect-auto lg:min-h-[440px] w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:border-gray-300"
                  >
                    <Image
                      src={featuredOffer.image}
                      alt={featuredOffer.title || "Featured Offer"}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover p-0 transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </Link>
                )}

                {/* Right: Grid of Cards (CP PLUS Style) */}
                {gridCards.length > 0 && (
                  <div className={`grid gap-4 h-full ${gridCards.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
                    {gridCards.map((card, idx) => (
                    <Link
                      key={card.id}
                      href={card.link || "/products"}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-gray-900 text-white shadow-sm transition-all duration-300 hover:shadow-xl min-h-[205px]"
                    >
                      {/* Card Background Image (Pure Poster Support) */}
                      <Image
                        src={card.image}
                        alt={card.title || "Offer"}
                        fill
                        sizes="(max-width: 640px) 100vw, 25vw"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Optional overlay and text only if title is customized or description provided */}
                      {card.description ? (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
                          <div className="relative z-10 p-5">
                            <h3 className="text-xl font-bold text-white drop-shadow-md leading-tight group-hover:text-blue-100 transition-colors">
                              {card.title}
                            </h3>
                            <p className="mt-1 text-xs text-white/90 line-clamp-2 max-w-[95%] drop-shadow leading-relaxed">
                              {card.description}
                            </p>
                          </div>
                        </>
                      ) : null}

                      {/* Optional View More button if buttonText is provided */}
                      {card.buttonText && (
                        <div className="relative z-10 flex items-center justify-between p-5 pt-0 mt-auto">
                          <span className="inline-flex items-center gap-1.5 rounded border border-white/70 bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-white group-hover:text-gray-900 group-hover:border-white shadow-sm">
                            {card.buttonText}
                          </span>
                        </div>
                      )}
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
                  Trending Items
                </h2>
                <p className="text-sm text-gray-500">
                  Check out our best and trending products that you can find suitable for your next project.
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
              {visibleTrendingProducts.map((product, idx) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group relative flex w-[190px] sm:w-[205px] shrink-0 snap-start flex-col rounded-lg border border-gray-200/90 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 overflow-hidden pb-4"
                >
                  {/* CP PLUS Red Corner 'New' Ribbon (on first 4 items or if featured) */}
                  {(idx < 4 || (product as any).isFeatured) && (
                    <div className="absolute -left-12 top-3 z-20 w-32 -rotate-45 bg-[#e52d27] py-0.5 text-center shadow-sm pointer-events-none">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                        New
                      </span>
                    </div>
                  )}

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

      {/* Our Products - CP PLUS Exact UI/UX */}
      {categories.length > 0 && (
        <section className="bg-white py-10 md:py-14 border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  Our Products
                </h2>
                <p className="mt-2 w-full text-xs sm:text-sm leading-relaxed text-gray-500 max-w-5xl">
                  Uniworld offers a wide portfolio of products, which has been designed to meet customers&apos; unique requirements. It covers CCTV Cameras, HD IP Security Cameras, DVRs, Time &amp; Attendance Systems, Video Door Phones, and much more.
                </p>
              </div>
              <Link
                href="/products"
                className="inline-flex h-9 shrink-0 self-start sm:self-center items-center justify-center rounded border border-gray-300 px-4 text-xs font-bold uppercase tracking-wider text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
              >
                SHOW ALL
              </Link>
            </div>

            {/* Main Content Layout matching CP PLUS */}
            <div className="mt-8 grid grid-cols-1 gap-0 border border-gray-200 bg-white shadow-sm lg:grid-cols-[220px_280px_1fr]">
              {/* Column 1: TOP CATEGORIES list */}
              <div className="border-b border-gray-200 lg:border-b-0 lg:border-r bg-white p-5">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  TOP CATEGORIES
                </p>
                <div className="flex flex-col divide-y divide-gray-100">
                  {categories.map((category) => {
                    const isSelected = (showcaseCategory?.id === category.id);
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setActiveProductsCategoryId(category.id)}
                        className={`py-2.5 text-left text-[13px] font-medium transition-colors ${
                          isSelected
                            ? "text-red-600 font-semibold"
                            : "text-gray-700 hover:text-red-600"
                        }`}
                      >
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Column 2: Center Featured Banner (CP PLUS style) */}
              <div className="relative min-h-[380px] lg:min-h-full border-b border-gray-200 lg:border-b-0 lg:border-r overflow-hidden bg-gray-900 flex flex-col justify-end group">
                {/* Background Image */}
                <Image
                  src={
                    showcaseCategory?.image ||
                    displayGridProducts[0]?.images[0]?.url ||
                    "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={showcaseCategory?.name || "Category Showcase"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 280px"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />

                {/* CP PLUS Solid Bottom Backdrop Card (prevents text clashing with image graphics) */}
                <div className="relative z-10 bg-gradient-to-t from-gray-950/95 via-gray-950/80 to-transparent pt-12 pb-6 px-6 text-white">
                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight drop-shadow-md">
                    {showcaseCategory?.name}
                  </h3>
                  <p className="mt-2 text-xs text-gray-200/90 line-clamp-2 leading-relaxed drop-shadow">
                    Explore high-performance {showcaseCategory?.name?.toLowerCase()} models with crystal-clear imaging and dependable 24/7 security.
                  </p>
                  <Link
                    href={`/categories/${showcaseCategory?.slug || "products"}`}
                    className="mt-3.5 inline-flex items-center text-xs font-semibold uppercase tracking-wider text-white underline underline-offset-4 hover:text-red-400 transition-colors"
                  >
                    View Details &rarr;
                  </Link>
                </div>
              </div>

              {/* Column 3: 3x2 Grid of SubCategories / Products (Matching CP PLUS reference) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-y sm:divide-y-0 sm:gap-px bg-gray-200">
                {showcaseCategory?.subCategories && showcaseCategory.subCategories.length > 0
                  ? showcaseCategory.subCategories.slice(0, 6).map((subCat) => {
                      // Find product matching this subCategory or fallback to first category product
                      const subProduct = catalogProducts.find(
                        (p) =>
                          p.category?.name === showcaseCategory.name &&
                          (p.name.toLowerCase().includes(subCat.name.toLowerCase()) ||
                            p.description?.toLowerCase().includes(subCat.name.toLowerCase())),
                      ) || activeCategoryProducts[0] || catalogShowcaseProducts[0];

                      return (
                        <Link
                          key={subCat.id}
                          href={`/categories/${showcaseCategory.slug}?sub=${subCat.slug}`}
                          className="group flex flex-col items-center justify-between bg-white p-5 text-center transition-all duration-200 hover:shadow-md hover:z-10 relative"
                        >
                          {/* SubCategory Product Image */}
                          <div className="relative h-[130px] w-full flex items-center justify-center">
                            {subProduct?.images[0]?.url ? (
                              <Image
                                src={subProduct.images[0].url}
                                alt={subCat.name}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 200px"
                                className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <FiCamera size={40} className="text-gray-300" />
                            )}
                          </div>

                          {/* SubCategory Title & Description (CP PLUS 2 MP / 4 MP / 5 MP Style) */}
                          <div className="mt-3 w-full">
                            <h4 className="text-[14px] font-semibold text-gray-800 leading-snug line-clamp-1 transition-colors group-hover:text-red-600">
                              {subCat.name}
                            </h4>
                            <p className="mt-1.5 text-[11px] text-gray-500 leading-tight line-clamp-2">
                              {subCat.name} {showcaseCategory.name}
                            </p>
                          </div>
                        </Link>
                      );
                    })
                  : displayGridProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        className="group flex flex-col items-center justify-between bg-white p-5 text-center transition-all duration-200 hover:shadow-md hover:z-10 relative"
                      >
                        {/* Product Image */}
                        <div className="relative h-[130px] w-full flex items-center justify-center">
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 200px"
                            className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        {/* Product Model & Subtitle (CP PLUS Typography) */}
                        <div className="mt-3 w-full">
                          <h4 className="text-[14px] font-semibold text-gray-800 leading-snug line-clamp-2 transition-colors group-hover:text-red-600">
                            {product.name}
                          </h4>
                          <p className="mt-1.5 text-[11px] text-gray-500 leading-tight line-clamp-2">
                            {product.description || product.category?.name}
                          </p>
                        </div>
                      </Link>
                    ))}

                {/* If fewer than 6 tiles, fill empty tiles with clean placeholder */}
                {Array.from({
                  length: Math.max(
                    0,
                    6 -
                      (showcaseCategory?.subCategories && showcaseCategory.subCategories.length > 0
                        ? Math.min(6, showcaseCategory.subCategories.length)
                        : displayGridProducts.length),
                  ),
                }).map((_, i) => (
                  <div key={`empty-${i}`} className="hidden sm:flex flex-col items-center justify-center bg-white p-5 text-center opacity-40">
                    <div className="h-[130px] w-full flex items-center justify-center">
                      <FiCamera size={36} className="text-gray-300" />
                    </div>
                    <span className="mt-3 text-xs text-gray-400">Coming soon</span>
                  </div>
                ))}
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
        <section className="bg-[#f0f2f2] py-6 md:py-8">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#263445] sm:text-2xl">Print &amp; Press</h2>
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
                    <div className="relative aspect-[16/9] overflow-hidden bg-slate-200">
                      <Image src={item.image} alt={item.title} fill sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 360px" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                    </div>
                    <div className="min-h-[76px] border-t border-slate-200 bg-white px-4 py-3">
                      <h3 className="line-clamp-1 text-sm font-semibold text-[#263445]">{item.title}</h3>
                      {item.description && <p className="mt-1 line-clamp-2 text-xs leading-4 text-slate-500">{item.description}</p>}
                    </div>
                  </>
                );

                return (
                  <article key={item.id} className="group w-[280px] shrink-0 snap-start overflow-hidden border border-slate-200 bg-white transition-shadow hover:shadow-[0_12px_28px_rgba(15,23,42,0.1)] sm:w-[320px]">
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
                        alt={`${product.name} - Buy Online Bihar`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <FiCamera size={40} className="text-slate-300" />
                      </div>
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

    </div>
  );
}
