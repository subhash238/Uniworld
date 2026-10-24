"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  FiMenu,
  FiX,
  FiPhone,
  FiChevronDown,
  FiChevronRight,
  FiCamera,
  FiArrowUpRight,
  FiMessageCircle,
  FiSearch,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaWhatsapp,
} from "react-icons/fa6";
import { supportGroups, supportHref } from "@/lib/supportLinks";

interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  subCategories: SubCategory[];
}

// Fallback high-quality categories matching CP PLUS structure
const defaultCategories: Category[] = [
  {
    id: "cat-network-camera",
    name: "Network Camera",
    slug: "network-camera",
    image: null,
    subCategories: [
      { id: "sub-2mp", name: "2 MP", slug: "2-mp" },
      { id: "sub-4mp", name: "4 MP", slug: "4-mp" },
      { id: "sub-5mp", name: "5 MP", slug: "5-mp" },
      { id: "sub-6mp", name: "6 MP", slug: "6-mp" },
      { id: "sub-8mp", name: "8 MP", slug: "8-mp" },
      { id: "sub-project", name: "Project Models", slug: "project-models" },
    ],
  },
  {
    id: "cat-nvr",
    name: "Network Video Recorder (NVR)",
    slug: "nvr",
    image: null,
    subCategories: [
      { id: "sub-nvr-4", name: "4 Channel", slug: "4-channel" },
      { id: "sub-nvr-8", name: "8 Channel", slug: "8-channel" },
      { id: "sub-nvr-16", name: "16 Channel", slug: "16-channel" },
      { id: "sub-nvr-32", name: "32 Channel", slug: "32-channel" },
      { id: "sub-nvr-64", name: "64 Channel", slug: "64-channel" },
      { id: "sub-nvr-poe", name: "PoE NVR Series", slug: "poe-nvr" },
    ],
  },
  {
    id: "cat-ahd",
    name: "Analog HD Camera",
    slug: "analog-hd-camera",
    image: null,
    subCategories: [
      { id: "sub-ahd-2mp", name: "2 MP Dome", slug: "2-mp-dome" },
      { id: "sub-ahd-2mp-b", name: "2 MP Bullet", slug: "2-mp-bullet" },
      { id: "sub-ahd-5mp", name: "5 MP Dome", slug: "5-mp-dome" },
      { id: "sub-ahd-5mp-b", name: "5 MP Bullet", slug: "5-mp-bullet" },
      { id: "sub-ahd-color", name: "Color+ Full Night Vision", slug: "color-night-vision" },
      { id: "sub-ahd-audio", name: "Built-in Mic Audio", slug: "audio-cameras" },
    ],
  },
  {
    id: "cat-dvr",
    name: "Digital Video Recorder (DVR)",
    slug: "dvr",
    image: null,
    subCategories: [
      { id: "sub-dvr-4", name: "4 Channel DVR", slug: "4-ch-dvr" },
      { id: "sub-dvr-8", name: "8 Channel DVR", slug: "8-ch-dvr" },
      { id: "sub-dvr-16", name: "16 Channel DVR", slug: "16-ch-dvr" },
      { id: "sub-dvr-32", name: "32 Channel DVR", slug: "32-ch-dvr" },
      { id: "sub-dvr-ai", name: "AI Smart Motion DVR", slug: "ai-dvr" },
    ],
  },
  {
    id: "cat-ptz",
    name: "Speed Dome (PTZ)",
    slug: "speed-dome-ptz",
    image: null,
    subCategories: [
      { id: "sub-ptz-ip", name: "IP PTZ Cameras", slug: "ip-ptz" },
      { id: "sub-ptz-ahd", name: "HD Analog PTZ", slug: "hd-ptz" },
      { id: "sub-ptz-laser", name: "Long Range IR / Laser", slug: "long-range-ptz" },
      { id: "sub-ptz-tracking", name: "Auto Tracking PTZ", slug: "auto-tracking" },
    ],
  },
  {
    id: "cat-vdp",
    name: "Video Door Phones",
    slug: "video-door-phones",
    image: null,
    subCategories: [
      { id: "sub-vdp-analog", name: "Analog 4-Wire VDP Kit", slug: "analog-vdp" },
      { id: "sub-vdp-ip", name: "IP Smart Wi-Fi VDP", slug: "ip-vdp" },
      { id: "sub-vdp-multi", name: "Multi-Apartment System", slug: "multi-apartment" },
    ],
  },
  {
    id: "cat-access",
    name: "Time & Attendance / Access Control",
    slug: "access-control",
    image: null,
    subCategories: [
      { id: "sub-acc-bio", name: "Biometric Fingerprint", slug: "biometric" },
      { id: "sub-acc-face", name: "Facial Recognition", slug: "face-recognition" },
      { id: "sub-acc-card", name: "RFID Card & Pin", slug: "rfid-card" },
      { id: "sub-acc-lock", name: "EM Locks & Power Supplies", slug: "em-locks" },
    ],
  },
  {
    id: "cat-network-switches",
    name: "Switches & Accessories",
    slug: "cables-accessories",
    image: null,
    subCategories: [
      { id: "sub-sw-4", name: "4 Port PoE Switch", slug: "4-port-poe" },
      { id: "sub-sw-8", name: "8 Port PoE Switch", slug: "8-port-poe" },
      { id: "sub-sw-16", name: "16 Port PoE Switch", slug: "16-port-poe" },
      { id: "sub-sw-cables", name: "Cat6 & 3+1 CCTV Cable", slug: "cables" },
      { id: "sub-sw-power", name: "CCTV SMPS Power Supplies", slug: "power-supplies" },
      { id: "sub-sw-bnc", name: "BNC & DC Connectors", slug: "connectors" },
    ],
  },
];

const distributionBrands = [
  { name: "CP PLUS", url: "https://www.cpplusworld.com", logo: "/brands/cpplus.png" },
  { name: "Dahua", url: "https://www.dahuasecurity.com", logo: "/brands/dahua.png" },
  { name: "Western Digital (WD)", url: "https://www.westerndigital.com", logo: "/brands/wd.svg" },
  { name: "Hikvision", url: "https://www.hikvision.com", logo: "/brands/hikvision.svg" },
  { name: "PARMA", url: "https://www.parma.co.in", logo: "/brands/parma.png" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string>(defaultCategories[0].id);

  const [showSupportMenu, setShowSupportMenu] = useState(false);
  const [showMobileSupport, setShowMobileSupport] = useState(false);
  const [showDistMenu, setShowDistMenu] = useState(false);
  const [showMobileDist, setShowMobileDist] = useState(false);

  const megaMenuTimeout = useRef<NodeJS.Timeout | null>(null);
  const megaMenuContainerRef = useRef<HTMLDivElement>(null);
  const supportMenuTimeout = useRef<NodeJS.Timeout | null>(null);
  const supportMenuContainerRef = useRef<HTMLDivElement>(null);
  const distMenuTimeout = useRef<NodeJS.Timeout | null>(null);
  const distMenuContainerRef = useRef<HTMLDivElement>(null);

  // Load categories from backend API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/categories/public`);
        if (res.ok) {
          const data: Category[] = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCategories(data);
            setActiveCategoryId(data[0].id);
          }
        }
      } catch (err) {
        console.error("Categories fetch error:", err);
      }
    };

    fetchCategories();
  }, []);

  // Close mega menu on outside click or ESC key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        megaMenuContainerRef.current &&
        !megaMenuContainerRef.current.contains(event.target as Node)
      ) {
        setShowMegaMenu(false);
      }
      if (
        supportMenuContainerRef.current &&
        !supportMenuContainerRef.current.contains(event.target as Node)
      ) {
        setShowSupportMenu(false);
      }
      if (
        distMenuContainerRef.current &&
        !distMenuContainerRef.current.contains(event.target as Node)
      ) {
        setShowDistMenu(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowMegaMenu(false);
        setShowSupportMenu(false);
        setShowDistMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Hover handlers
  const handleMouseEnter = () => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setShowMegaMenu(true);
  };

  const handleMouseLeave = () => {
    megaMenuTimeout.current = setTimeout(() => {
      setShowMegaMenu(false);
    }, 200);
  };

  // Click toggle handler
  const handleToggleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowMegaMenu((prev) => !prev);
  };

  const closeMegaMenu = useCallback(() => {
    setShowMegaMenu(false);
  }, []);

  const handleSupportMouseEnter = () => {
    if (supportMenuTimeout.current) clearTimeout(supportMenuTimeout.current);
    setShowSupportMenu(true);
  };

  const handleSupportMouseLeave = () => {
    supportMenuTimeout.current = setTimeout(() => {
      setShowSupportMenu(false);
    }, 200);
  };

  const handleDistMouseEnter = () => {
    if (distMenuTimeout.current) clearTimeout(distMenuTimeout.current);
    setShowDistMenu(true);
  };

  const handleDistMouseLeave = () => {
    distMenuTimeout.current = setTimeout(() => {
      setShowDistMenu(false);
    }, 200);
  };

  // Determine active category
  const activeCat = categories.find((c) => c.id === activeCategoryId) || categories[0];

  return (
    <header className="sticky top-0 z-50">
      {/* Top Utility Bar */}
      <div className="border-b border-white/10 bg-[#232a2e] text-white">
        <div className="mx-auto flex h-8 max-w-[1760px] items-center justify-between px-5 sm:px-8 2xl:px-10">
          <div className="hidden items-center gap-5 xl:flex">
            <a
              href="https://www.facebook.com/share/19YQ2zX2nb/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Uniworld on Facebook"
              title="Facebook"
              className="text-white/80 transition-colors hover:text-white"
            >
              <FaFacebookF size={13} />
            </a>
            <a
              href="https://www.instagram.com/uniworld_vision/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Uniworld on Instagram"
              title="Instagram"
              className="text-white/80 transition-colors hover:text-white"
            >
              <FaInstagram size={15} />
            </a>
            <a
              href="https://x.com/uniworldVision"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Uniworld on X"
              title="X"
              className="text-white/80 transition-colors hover:text-white"
            >
              <FaXTwitter size={13} />
            </a>
            <a
              href="https://www.linkedin.com/company/uniworld-vision-private-limited"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Uniworld on LinkedIn"
              title="LinkedIn"
              className="text-white/80 transition-colors hover:text-white"
            >
              <FaLinkedinIn size={14} />
            </a>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-medium sm:gap-5 sm:text-[11px] xl:hidden">
            <a
              href="tel:+917360000121"
              className="flex items-center gap-1.5 transition-colors hover:text-[#f5a55f]"
            >
              <FiPhone size={12} /> +91 73600 00121
            </a>
            <a
              href="https://wa.me/917360000121?text=Hello%20Uniworld"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-white/80 transition-colors hover:text-white"
            >
              <FaWhatsapp size={14} />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>

          <div className="hidden items-center gap-6 text-[11px] font-medium xl:flex">
            <Link href="/about" className="text-white/80 transition-colors hover:text-white">
              About Us
            </Link>
            <Link href="/dealers" className="text-white/80 transition-colors hover:text-white">
              Dealer Network
            </Link>
            <Link
              href="/support"
              className="inline-flex items-center gap-1.5 text-white/80 transition-colors hover:text-white"
            >
              <FiMessageCircle size={13} /> Support
            </Link>
            <a
              href="https://wa.me/917360000121?text=Hello%20Uniworld"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-white/80 transition-colors hover:text-white"
            >
              <FaWhatsapp size={14} /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1760px] px-5 sm:px-8 2xl:px-10">
          <div className="flex h-[64px] items-center justify-between xl:h-[76px]">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center outline-none focus:outline-none">
              <Image
                src="/images/logo-nav.jpeg"
                alt="Uniworld Security Solutions"
                width={250}
                height={80}
                className="h-[46px] w-auto object-contain xl:h-[54px]"
                priority
                unoptimized
              />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="relative hidden items-center gap-7 xl:flex 2xl:gap-9">
              <Link
                href="/"
                className="relative py-4 text-[15px] font-medium text-[#3c444b] transition-colors after:absolute after:inset-x-0 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-[#e31e24] after:transition-transform hover:text-[#e31e24] hover:after:scale-x-100"
              >
                Home
              </Link>

              {/* PRODUCTS - CP PLUS STYLE MEGA MENU TRIGGER */}
              <div
                ref={megaMenuContainerRef}
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={handleToggleClick}
                  className={`group relative flex items-center gap-1.5 py-4 text-[15px] font-medium transition-colors focus:outline-none ${
                    showMegaMenu ? "text-[#e31e24] font-semibold" : "text-[#3c444b] hover:text-[#e31e24]"
                  }`}
                  aria-expanded={showMegaMenu}
                  aria-haspopup="true"
                >
                  <span>Products</span>
                  <FiChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      showMegaMenu ? "rotate-180 text-[#e31e24]" : "text-gray-500 group-hover:text-[#e31e24]"
                    }`}
                  />
                  {/* Small red triangle indicator directly beneath Products pointing up from the mega menu */}
                  {showMegaMenu && (
                    <span className="pointer-events-none absolute -bottom-[1px] left-1/2 -translate-x-1/2 z-[60] h-0 w-0 border-x-[8px] border-x-transparent border-b-[8px] border-b-[#e31e24]" />
                  )}
                </button>

                {/* CP PLUS STYLE MEGA MENU DROPDOWN */}
                {showMegaMenu && (
                  <div
                    className="fixed left-0 right-0 top-[96px] xl:top-[108px] z-50 border-t-[3px] border-[#e31e24] bg-white shadow-[0_25px_60px_rgba(0,0,0,0.18)] animate-fadeIn"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="mx-auto max-w-[1440px] px-6 sm:px-10 py-7">
                      <div className="grid grid-cols-12 gap-8 min-h-[380px]">
                        {/* 1. LEFT COLUMN: Product Categories */}
                        <div className="col-span-12 md:col-span-3 border-r border-gray-100 pr-6">
                          <h3 className="text-[15px] font-bold text-gray-900 tracking-tight pb-2.5 mb-3 border-b border-gray-100">
                            Product Categories
                          </h3>
                          <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                            {categories.map((cat) => {
                              const isSelected = activeCat?.id === cat.id;
                              return (
                                <div
                                  key={cat.id}
                                  onMouseEnter={() => setActiveCategoryId(cat.id)}
                                  onClick={() => setActiveCategoryId(cat.id)}
                                  className="group flex cursor-pointer items-center justify-between py-1.5 transition-colors"
                                >
                                  <Link
                                    href={`/categories/${cat.slug}`}
                                    onClick={closeMegaMenu}
                                    className={`text-[13.5px] leading-snug transition-colors ${
                                      isSelected
                                        ? "font-semibold text-[#e31e24]"
                                        : "font-normal text-[#374151] group-hover:text-[#e31e24]"
                                    }`}
                                  >
                                    {cat.name}
                                  </Link>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* 2. MIDDLE COLUMN: Sub Categories */}
                        <div className="col-span-12 md:col-span-5 px-3">
                          <h3 className="text-[15px] font-bold text-gray-900 tracking-tight pb-2.5 mb-3 border-b border-gray-100">
                            Sub Categories
                          </h3>
                          {activeCat && activeCat.subCategories && activeCat.subCategories.length > 0 ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3.5 content-start pt-1">
                              {activeCat.subCategories.map((sub) => (
                                <Link
                                  key={sub.id}
                                  href={`/products?category=${activeCat.id}&sub=${sub.id}`}
                                  onClick={closeMegaMenu}
                                  className="group flex items-center gap-1.5 text-[13.5px] text-[#4b5563] transition-colors hover:text-[#e31e24]"
                                >
                                  <span className="text-gray-400 font-bold text-sm transition-colors group-hover:text-[#e31e24]">
                                    ›
                                  </span>
                                  <span className="font-normal truncate">{sub.name}</span>
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <div className="pt-8">
                              <p className="text-sm text-gray-500 mb-3">
                                Explore full security lineup in {activeCat?.name}.
                              </p>
                              <Link
                                href={`/categories/${activeCat?.slug || ""}`}
                                onClick={closeMegaMenu}
                                className="inline-flex items-center gap-2 text-xs font-semibold text-[#e31e24] hover:underline"
                              >
                                View all {activeCat?.name} products ›
                              </Link>
                            </div>
                          )}
                        </div>

                        {/* 3. RIGHT COLUMN: Visual Equipment Showcase (CP PLUS Dual Camera Style) */}
                        <div className="col-span-12 md:col-span-4 flex flex-col items-center justify-center pl-6 border-l border-gray-100">
                          <div className="relative w-full h-[280px] flex items-center justify-center">
                            {activeCat?.image ? (
                              <div className="relative w-full h-full">
                                <Image
                                  src={activeCat.image}
                                  alt={activeCat.name}
                                  fill
                                  className="object-contain p-2 filter drop-shadow-lg"
                                />
                              </div>
                            ) : (
                              <SecurityCameraShowcase categoryName={activeCat?.name || "Security Cameras"} />
                            )}
                          </div>

                          <div className="text-center mt-3">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                              Uniworld Vision
                            </span>
                            <p className="text-sm font-semibold text-gray-900 mt-0.5">
                              {activeCat?.name || "High Definition Surveillance"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* <Link
                href="/categories"
                className="relative py-4 text-[15px] font-medium text-[#3c444b] transition-colors after:absolute after:inset-x-0 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-[#e31e24] after:transition-transform hover:text-[#e31e24] hover:after:scale-x-100"
              >
                Categories
              </Link> */}
              <Link
                href="/dealers"
                className="relative py-4 text-[15px] font-medium text-[#3c444b] transition-colors after:absolute after:inset-x-0 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-[#e31e24] after:transition-transform hover:text-[#e31e24] hover:after:scale-x-100"
              >
                Dealers
              </Link>

              {/* DISTRIBUTION - brand partner links */}
              <div
                ref={distMenuContainerRef}
                className="relative"
                onMouseEnter={handleDistMouseEnter}
                onMouseLeave={handleDistMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setShowDistMenu((prev) => !prev)}
                  onFocus={handleDistMouseEnter}
                  className={`group relative flex items-center gap-1.5 py-4 text-[15px] font-medium transition-colors focus:outline-none ${
                    showDistMenu ? "text-[#e31e24]" : "text-[#3c444b] hover:text-[#e31e24]"
                  }`}
                  aria-expanded={showDistMenu}
                  aria-haspopup="true"
                >
                  <span>Distribution</span>
                  <FiChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      showDistMenu ? "rotate-180 text-[#e31e24]" : "text-gray-500 group-hover:text-[#e31e24]"
                    }`}
                  />
                </button>

                {showDistMenu && (
                  <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-[10px]">
                    <div className="w-[240px] border-t-[3px] border-[#e31e24] bg-white px-6 py-5 shadow-[0_25px_60px_rgba(0,0,0,0.18)] animate-fadeIn">
                      <h3 className="mb-2 text-[15px] font-bold tracking-tight text-gray-900">Our brand partners</h3>
                      <ul className="space-y-1.5">
                        {distributionBrands.map((brand) => (
                          <li key={brand.name}>
                            <a
                              href={brand.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setShowDistMenu(false)}
                              className="group flex items-center gap-2.5 text-[13.5px] leading-snug text-[#4b5563] transition-colors hover:text-[#e31e24]"
                            >
                              <img src={brand.logo} alt={`${brand.name} logo`} className="h-6 w-8 shrink-0 object-contain" />
                              <span className="flex-1">{brand.name}</span>
                              <FiArrowUpRight size={13} className="text-gray-400 transition-colors group-hover:text-[#e31e24]" aria-hidden="true" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* SUPPORT - CP PLUS STYLE DROPDOWN (positioned against the nav links row) */}
              <div
                ref={supportMenuContainerRef}
                onMouseEnter={handleSupportMouseEnter}
                onMouseLeave={handleSupportMouseLeave}
              >
                <Link
                  href="/support"
                  onClick={() => setShowSupportMenu(false)}
                  onFocus={handleSupportMouseEnter}
                  className={`group relative flex items-center gap-1.5 py-4 text-[15px] font-medium transition-colors ${
                    showSupportMenu ? "text-[#e31e24]" : "text-[#3c444b] hover:text-[#e31e24]"
                  }`}
                  aria-expanded={showSupportMenu}
                  aria-haspopup="true"
                >
                  <span>Support</span>
                  <FiChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      showSupportMenu ? "rotate-180 text-[#e31e24]" : "text-gray-500 group-hover:text-[#e31e24]"
                    }`}
                  />
                </Link>

                {showSupportMenu && (
                  <div className="absolute right-0 top-full z-50 pt-[10px]">
                    <div className="w-[480px] max-w-[calc(100vw-40px)] border-t-[3px] border-[#e31e24] bg-white px-7 py-6 shadow-[0_25px_60px_rgba(0,0,0,0.18)] animate-fadeIn">
                      <div className="grid grid-cols-2 gap-8">
                        {supportGroups.map((group) => (
                          <div key={group.title}>
                            <h3 className="mb-2 text-[15px] font-bold tracking-tight text-gray-900">
                              {group.title}
                            </h3>
                            <ul className="space-y-1.5">
                              {group.links.map((link) => (
                                <li key={link.slug}>
                                  <Link
                                    href={supportHref(link.slug)}
                                    onClick={() => setShowSupportMenu(false)}
                                    className="block text-[13.5px] leading-snug text-[#4b5563] transition-colors hover:text-[#e31e24]"
                                  >
                                    {link.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Link
                href="/contact"
                className="relative py-4 text-[15px] font-medium text-[#3c444b] transition-colors after:absolute after:inset-x-0 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-[#e31e24] after:transition-transform hover:text-[#e31e24] hover:after:scale-x-100"
              >
                Contact
              </Link>
              <Link
                href="/about"
                className="relative py-4 text-[15px] font-medium text-[#3c444b] transition-colors after:absolute after:inset-x-0 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-[#e31e24] after:transition-transform hover:text-[#e31e24] hover:after:scale-x-100"
              >
                About
              </Link>

              <Link
                href="/gallery"
                className="relative py-4 text-[15px] font-medium text-[#3c444b] transition-colors after:absolute after:inset-x-0 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-[#e31e24] after:transition-transform hover:text-[#e31e24] hover:after:scale-x-100"
              >
                Gallery
              </Link>

              <Link
                href="/products"
                className="flex h-10 w-10 shrink-0 items-center justify-center text-[#303941] transition-colors hover:text-[#e31e24]"
                aria-label="Search products"
                title="Search products"
              >
                <FiSearch size={18} aria-hidden="true" />
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 xl:hidden">
              <button
                className={`flex h-10 w-10 items-center justify-center transition-colors ${
                  isOpen ? "bg-[#e31e24] text-white" : "bg-[#101d33] text-white hover:bg-[#1B2A4A]"
                }`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                {isOpen ? <FiX size={21} /> : <FiMenu size={21} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Drawer */}
          {isOpen && (
            <div className="-mx-5 max-h-[calc(100vh-104px)] overflow-y-auto border-t border-white/10 bg-[#101d33] px-5 pb-6 pt-3 text-white sm:-mx-8 sm:px-8 xl:hidden">
              <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f5a55f]">
                Navigation
              </p>
              <Link
                href="/"
                className="block border-b border-white/10 px-3 py-3 text-sm font-semibold text-white/85 transition-colors hover:text-[#f5a55f]"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="block border-b border-white/10 px-3 py-3 text-sm font-semibold text-white/85 transition-colors hover:text-[#f5a55f]"
                onClick={() => setIsOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/contact"
                className="my-4 flex h-12 items-center justify-center gap-2 bg-[#e31e24] px-5 text-sm font-bold text-white transition-colors hover:bg-[#c9181d]"
                onClick={() => setIsOpen(false)}
              >
                Get a quote <FiArrowUpRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href="/about"
                className="block border-b border-white/10 px-3 py-3 text-sm font-semibold text-white/85 transition-colors hover:text-[#f5a55f]"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <button
                type="button"
                onClick={() => setShowMobileCategories((visible) => !visible)}
                className="flex w-full items-center justify-between border-b border-white/10 px-3 py-3 text-left text-sm font-semibold text-white/85 transition-colors hover:text-[#f5a55f]"
                aria-expanded={showMobileCategories}
              >
                Categories
                <FiChevronDown
                  size={14}
                  className={`transition-transform ${showMobileCategories ? "rotate-180" : ""}`}
                />
              </button>
              {showMobileCategories && categories.length > 0 && (
                <div className="max-h-56 space-y-1 overflow-y-auto border-l border-[#e31e24]/60 py-2 pl-4">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      className="block py-1.5 text-sm text-slate-300 transition-colors hover:text-[#f5a55f]"
                      onClick={() => setIsOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
              <Link
                href="/dealers"
                className="block border-b border-white/10 px-3 py-3 text-sm font-semibold text-white/85 transition-colors hover:text-[#f5a55f]"
                onClick={() => setIsOpen(false)}
              >
                Dealers
              </Link>
              <button
                type="button"
                onClick={() => setShowMobileDist((visible) => !visible)}
                className="flex w-full items-center justify-between border-b border-white/10 px-3 py-3 text-left text-sm font-semibold text-white/85 transition-colors hover:text-[#f5a55f]"
                aria-expanded={showMobileDist}
              >
                Distribution
                <FiChevronDown
                  size={14}
                  className={`transition-transform ${showMobileDist ? "rotate-180" : ""}`}
                />
              </button>
              {showMobileDist && (
                <div className="space-y-1 border-l border-[#e31e24]/60 py-2 pl-4">
                  {distributionBrands.map((brand) => (
                    <a
                      key={brand.name}
                      href={brand.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 py-1.5 text-sm text-slate-300 transition-colors hover:text-[#f5a55f]"
                      onClick={() => setIsOpen(false)}
                    >
                      <img src={brand.logo} alt={`${brand.name} logo`} className="h-6 w-8 shrink-0 object-contain" />
                      <span className="flex-1">{brand.name}</span>
                      <FiArrowUpRight size={12} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowMobileSupport((visible) => !visible)}
                className="flex w-full items-center justify-between border-b border-white/10 px-3 py-3 text-left text-sm font-semibold text-white/85 transition-colors hover:text-[#f5a55f]"
                aria-expanded={showMobileSupport}
              >
                Support
                <FiChevronDown
                  size={14}
                  className={`transition-transform ${showMobileSupport ? "rotate-180" : ""}`}
                />
              </button>
              {showMobileSupport && (
                <div className="space-y-3 border-l border-[#e31e24]/60 py-2 pl-4">
                  <Link
                    href="/support"
                    className="block py-1 text-sm font-semibold text-white transition-colors hover:text-[#f5a55f]"
                    onClick={() => setIsOpen(false)}
                  >
                    Support home
                  </Link>
                  {supportGroups.map((group) => (
                    <div key={group.title}>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f5a55f]">
                        {group.title}
                      </p>
                      {group.links.map((link) => (
                        <Link
                          key={link.slug}
                          href={supportHref(link.slug)}
                          className="block py-1.5 text-sm text-slate-300 transition-colors hover:text-[#f5a55f]"
                          onClick={() => setIsOpen(false)}
                        >
                          {link.title}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              <Link
                href="/contact"
                className="block border-b border-white/10 px-3 py-3 text-sm font-semibold text-white/85 transition-colors hover:text-[#f5a55f]"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/gallery"
                className="block border-b border-white/10 px-3 py-3 text-sm font-semibold text-white/85 transition-colors hover:text-[#f5a55f]"
                onClick={() => setIsOpen(false)}
              >
                Gallery
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

/**
 * Photorealistic Dual Security Camera Showcase (Dome + Bullet Camera)
 * Accurately styled like CP PLUS Equipment Visual with lens reflections, status LED and soft drop shadows
 */
function SecurityCameraShowcase({ categoryName }: { categoryName: string }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      <svg
        viewBox="0 0 500 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[260px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.14)]"
      >
        <defs>
          <radialGradient id="lensGlass" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#0284c7" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
          </radialGradient>
          <radialGradient id="irArray" cx="50%" cy="50%" r="50%">
            <stop offset="65%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#090d16" />
          </radialGradient>
          <linearGradient id="casingWhite" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="metalBezel" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
          <filter id="softShadowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="12" />
            <feOffset dx="0" dy="16" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.18" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Soft Ambient Ground Shadow */}
        <ellipse cx="250" cy="285" rx="195" ry="22" fill="#000000" opacity="0.12" />

        {/* --- DOME CAMERA (Left/Center) --- */}
        <g filter="url(#softShadowFilter)">
          {/* Base Mounting Ring */}
          <ellipse cx="190" cy="235" rx="102" ry="28" fill="url(#metalBezel)" />
          <ellipse cx="190" cy="230" rx="98" ry="25" fill="#f8fafc" />

          {/* Spherical Dome Body Housing */}
          <path d="M 98 220 C 98 130, 282 130, 282 220 Z" fill="url(#casingWhite)" />
          {/* Top highlight reflection curve */}
          <path
            d="M 120 205 C 130 148, 240 148, 260 205 C 230 168, 150 168, 120 205 Z"
            fill="#ffffff"
            opacity="0.65"
          />

          {/* Dark Spherical Camera Turret */}
          <ellipse cx="190" cy="195" rx="60" ry="48" fill="url(#irArray)" />

          {/* Optical Lens Glass */}
          <circle cx="190" cy="195" r="32" fill="url(#lensGlass)" />
          <circle cx="190" cy="195" r="17" fill="#0284c7" opacity="0.55" />
          <circle cx="190" cy="195" r="9" fill="#082f49" />
          {/* Lens Specular Reflection */}
          <ellipse
            cx="182"
            cy="188"
            rx="6.5"
            ry="4"
            fill="#ffffff"
            opacity="0.88"
            transform="rotate(-30 182 188)"
          />
          <circle cx="199" cy="204" r="2.2" fill="#38bdf8" opacity="0.9" />

          {/* Red Status LED indicator */}
          <circle cx="190" cy="155" r="2.5" fill="#ef4444" />
          <circle cx="190" cy="155" r="5.5" fill="#ef4444" opacity="0.35" />

          {/* Brand Wordmark on Dome Ring */}
          <text
            x="190"
            y="247"
            textAnchor="middle"
            fill="#64748b"
            fontSize="8.5"
            fontWeight="bold"
            letterSpacing="2.2"
          >
            UNIWORLD
          </text>
        </g>

        {/* --- BULLET CAMERA (Right Side) --- */}
        <g filter="url(#softShadowFilter)">
          {/* Wall Mount Base */}
          <path d="M 425 230 L 405 215 L 405 245 Z" fill="#94a3b8" />
          <ellipse cx="425" cy="230" rx="8" ry="18" fill="url(#metalBezel)" />

          {/* Swivel Pivot Arm */}
          <rect
            x="365"
            y="222"
            width="46"
            height="12"
            rx="4"
            fill="url(#casingWhite)"
            transform="rotate(-15 365 222)"
          />
          <circle cx="370" cy="226" r="8" fill="#64748b" />

          {/* Bullet Cylindrical Body */}
          <path d="M 275 190 L 380 160 L 387 205 L 282 235 Z" fill="url(#casingWhite)" />
          {/* Top Sunshield Visor */}
          <path d="M 260 186 L 385 150 L 387 165 L 262 201 Z" fill="#ffffff" />
          <path d="M 260 186 L 275 182 L 277 200 L 262 201 Z" fill="#cbd5e1" />

          {/* Front Bezel & Lens Element */}
          <ellipse
            cx="275"
            cy="212"
            rx="14"
            ry="24"
            fill="#0f172a"
            transform="rotate(-15 275 212)"
          />
          <ellipse
            cx="275"
            cy="212"
            rx="9"
            ry="16"
            fill="url(#lensGlass)"
            transform="rotate(-15 275 212)"
          />
          <circle cx="273" cy="210" r="4.5" fill="#0f172a" />
          <ellipse
            cx="270"
            cy="205"
            rx="3.5"
            ry="2"
            fill="#ffffff"
            opacity="0.88"
            transform="rotate(-30 270 205)"
          />

          {/* Brand Wordmark on Bullet Casing */}
          <text
            x="335"
            y="196"
            fill="#64748b"
            fontSize="7.5"
            fontWeight="bold"
            letterSpacing="1.8"
            transform="rotate(-15 335 196)"
          >
            UNIWORLD
          </text>
        </g>
      </svg>
    </div>
  );
}
