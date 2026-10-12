"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/api";
import {
  FiCamera,
  FiChevronRight,
  FiDownload,
  FiCheck,
  FiShield,
  FiHeadphones,
  FiTruck,
  FiFileText,
  FiSend,
  FiPhone,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";

type SpecValue = string | number | boolean | string[] | null;

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  mrp?: number;
  sku?: string;
  stock: number;
  isFeatured?: boolean;
  specifications: Record<string, SpecValue> | null;
  datasheet: string | null;
  images: { id: string; url: string; isPrimary: boolean }[];
  category: { id: string; name: string; slug: string };
  subCategory?: { id: string; name: string; slug: string } | null;
}

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: { url: string }[];
  category: { name: string };
}

const WHATSAPP_NUMBER = "917360000121";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#FF6B00] focus:bg-white focus:ring-4 focus:ring-[#FF6B00]/12";

const labelClass =
  "mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-500";

function formatSpecKey(key: string) {
  return key
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\b(Ir|Ip|Led|Wdr|Osd|Sd|Onvif|Rtsp|Wifi|Dc|Ac|Emc|Emi)\b/gi, (match) =>
      match.toUpperCase()
    );
}

function formatSpecValue(value: SpecValue) {
  if (value == null) return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.filter(Boolean).join(" · ");
  const text = String(value).trim();
  if (!text || text.toUpperCase() === "NIL") return "—";
  return text;
}

function isMeaningfulSpec(value: SpecValue) {
  if (value == null) return false;
  if (typeof value === "boolean") return true;
  if (Array.isArray(value)) return value.filter(Boolean).length > 0;
  const text = String(value).trim();
  return text.length > 0;
}

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<RelatedProduct[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"specs" | "enquiry">("specs");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    message: "",
  });

  useEffect(() => {
    if (params.slug) loadProduct();
  }, [params.slug]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products/public/${params.slug}`);
      const data: Product = res.data;
      setProduct(data);
      setSelectedImage(0);
      setForm((prev) => ({
        ...prev,
        message: `I am interested in ${data.name}. Please share dealer pricing and availability.`,
      }));

      if (data.category?.id) {
        const relatedRes = await api.get(
          `/products/public?category=${data.category.id}&limit=5`
        );
        const items: RelatedProduct[] = relatedRes.data?.products || [];
        setRelated(items.filter((item) => item.slug !== data.slug).slice(0, 4));
      }
    } catch (error) {
      console.error(error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const highlights = useMemo(() => {
    if (!product?.description) return [];
    return product.description
      .split(/\r?\n/)
      .map((line) => line.replace(/^[-•]\s*/, "").trim())
      .filter(Boolean);
  }, [product]);

  const specEntries = useMemo(() => {
    if (!product?.specifications) return [];
    return Object.entries(product.specifications).filter(([key, value]) => key && isMeaningfulSpec(value));
  }, [product]);

  const discount =
    product?.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  const handleEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setSubmitting(true);
    try {
      await api.post("/contact", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: `Product enquiry: ${product.name}${form.company ? ` | ${form.company}` : ""}`,
        message: form.message,
      });
      toast.success("Enquiry sent. Our team will contact you shortly.");
      setForm({
        name: "",
        phone: "",
        email: "",
        company: "",
        message: `I am interested in ${product.name}. Please share dealer pricing and availability.`,
      });
    } catch {
      toast.error("Could not send enquiry. Please try again or WhatsApp us.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="h-[520px] animate-pulse rounded-[28px] bg-white/80 lg:col-span-6" />
          <div className="space-y-4 lg:col-span-6">
            <div className="h-6 w-32 animate-pulse rounded-full bg-white/80" />
            <div className="h-12 w-4/5 animate-pulse rounded-2xl bg-white/80" />
            <div className="h-10 w-48 animate-pulse rounded-xl bg-white/80" />
            <div className="h-40 animate-pulse rounded-[28px] bg-white/80" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-[720px] px-5 py-24 text-center">
        <div className="luxury-card px-8 py-16">
          <FiCamera size={48} className="mx-auto mb-4 text-slate-300" />
          <h1 className="text-2xl font-bold text-[#1B2A4A]">Product not found</h1>
          <p className="mt-2 text-sm text-slate-500">
            This model may have been moved or is no longer listed.
          </p>
          <Link href="/products" className="premium-button-primary mt-8 inline-flex">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello Uniworld, I want a quote for ${product.name}${product.sku ? ` (SKU: ${product.sku})` : ""}.`
  )}`;

  return (
    <div className="pb-20">
      <div className="mx-auto max-w-[1320px] px-5 py-8 sm:px-8">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-slate-500">
            <li>
              <Link href="/" className="transition hover:text-[#FF6B00]">
                Home
              </Link>
            </li>
            <FiChevronRight size={13} className="text-slate-300" />
            <li>
              <Link href="/products" className="transition hover:text-[#FF6B00]">
                Products
              </Link>
            </li>
            <FiChevronRight size={13} className="text-slate-300" />
            <li>
              <Link
                href={`/categories/${product.category.slug}`}
                className="transition hover:text-[#FF6B00]"
              >
                {product.category.name}
              </Link>
            </li>
            <FiChevronRight size={13} className="text-slate-300" />
            <li className="max-w-[240px] truncate font-semibold text-[#1B2A4A]">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid items-start gap-8 lg:grid-cols-12">
          {/* Gallery */}
          <div className="lg:col-span-6">
            <div className="section-shell p-4 sm:p-6">
              <div className="group relative aspect-square overflow-hidden rounded-[22px] bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)]">
                {discount > 0 && (
                  <span className="absolute left-4 top-4 z-10 rounded-full bg-[#FF6B00] px-3 py-1 text-[11px] font-extrabold tracking-wide text-white shadow-[0_10px_24px_rgba(255,107,0,0.35)]">
                    {discount}% OFF
                  </span>
                )}
                {product.images[selectedImage] ? (
                  <Image
                    src={product.images[selectedImage].url}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 640px"
                    className="object-contain p-8 transition-transform duration-500 group-hover:scale-105 sm:p-12"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <FiCamera size={72} className="text-slate-200" />
                  </div>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setSelectedImage(i)}
                      className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 bg-slate-50 transition ${
                        i === selectedImage
                          ? "border-[#FF6B00] shadow-[0_8px_20px_rgba(255,107,0,0.22)]"
                          : "border-transparent hover:border-slate-300"
                      }`}
                    >
                      <Image src={img.url} alt="" fill className="object-contain p-2" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="section-eyebrow">{product.category.name}</span>
              {product.subCategory?.name && (
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
                  {product.subCategory.name}
                </span>
              )}
              {product.isFeatured && (
                <span className="rounded-full bg-[#1B2A4A] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white">
                  Featured
                </span>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-[#1B2A4A] lg:text-[40px]">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              {product.sku && (
                <span className="rounded-lg bg-slate-100 px-3 py-1.5 font-semibold text-slate-600">
                  SKU <span className="text-[#1B2A4A]">{product.sku}</span>
                </span>
              )}
              <span
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold ${
                  product.stock > 0
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-600"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    product.stock > 0 ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
                {product.stock > 0 ? "In stock · Ready to dispatch" : "Out of stock · Enquire for lead time"}
              </span>
            </div>

            <div className="mt-6 rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                Dealer price
              </p>
              {product.price > 0 ? (
                <div className="mt-2 flex flex-wrap items-end gap-3">
                  <span className="text-4xl font-extrabold tracking-tight text-[#1B2A4A]">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  {product.mrp && product.mrp > product.price && (
                    <>
                      <span className="pb-1 text-lg text-slate-400 line-through">
                        ₹{product.mrp.toLocaleString("en-IN")}
                      </span>
                      <span className="mb-1 rounded-full bg-[#FFF4EC] px-2.5 py-1 text-xs font-bold text-[#FF6B00]">
                        Save {discount}%
                      </span>
                    </>
                  )}
                </div>
              ) : (
                <div className="mt-2">
                  <span className="text-3xl font-extrabold tracking-tight text-[#1B2A4A]">
                    Price on request
                  </span>
                </div>
              )}
              <p className="mt-2 text-xs text-slate-500">
                Final dealer / project pricing is confirmed on enquiry.
              </p>
            </div>

            {highlights.length > 0 && (
              <ul className="mt-6 space-y-3">
                {highlights.slice(0, 6).map((line, i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px] leading-relaxed text-slate-700">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#FFF4EC] text-[#FF6B00]">
                      <FiCheck size={12} strokeWidth={3} />
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("enquiry");
                  document.getElementById("product-enquiry")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="premium-button-primary gap-2"
              >
                Enquire now <FiSend size={15} />
              </button>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="premium-button-secondary gap-2">
                <FaWhatsapp size={16} className="text-[#25D366]" /> WhatsApp quote
              </a>
              {product.datasheet && (
                <a
                  href={product.datasheet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="premium-button-secondary gap-2"
                >
                  <FiDownload size={15} /> Datasheet
                </a>
              )}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { icon: FiShield, title: "Genuine stock", copy: "Authorized distribution" },
                { icon: FiHeadphones, title: "Dealer support", copy: "Quote within 24 hrs" },
                { icon: FiTruck, title: "East India network", copy: "Bihar · JH · Nepal" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3.5"
                >
                  <item.icon className="mb-2 text-[#FF6B00]" size={18} />
                  <p className="text-sm font-bold text-[#1B2A4A]">{item.title}</p>
                  <p className="text-[11px] text-slate-500">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specs + Enquiry */}
        <div id="product-enquiry" className="mt-12 grid items-start gap-8 lg:grid-cols-12">
          <div className="section-shell lg:col-span-7">
            <div className="flex border-b border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab("specs")}
                className={`relative px-6 py-4 text-sm font-bold transition ${
                  activeTab === "specs" ? "text-[#1B2A4A]" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Specifications
                {activeTab === "specs" && (
                  <span className="absolute inset-x-6 bottom-0 h-[3px] rounded-full bg-[#FF6B00]" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("enquiry")}
                className={`relative px-6 py-4 text-sm font-bold lg:hidden ${
                  activeTab === "enquiry" ? "text-[#1B2A4A]" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Request information
                {activeTab === "enquiry" && (
                  <span className="absolute inset-x-6 bottom-0 h-[3px] rounded-full bg-[#FF6B00]" />
                )}
              </button>
            </div>

            <div className={`${activeTab === "enquiry" ? "hidden lg:block" : "block"} p-6 sm:p-8`}>
              {specEntries.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  {specEntries.map(([key, value], idx) => (
                    <div
                      key={key}
                      className={`grid grid-cols-1 sm:grid-cols-[220px_1fr] ${
                        idx % 2 === 0 ? "bg-slate-50/80" : "bg-white"
                      }`}
                    >
                      <div className="px-5 py-3.5 text-[13px] font-bold text-[#1B2A4A] sm:border-r sm:border-slate-100">
                        {formatSpecKey(key)}
                      </div>
                      <div className="px-5 py-3.5 text-[13px] leading-relaxed text-slate-600">
                        {formatSpecValue(value)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 px-6 py-14 text-center">
                  <FiFileText size={32} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-semibold text-slate-600">
                    Detailed specifications will be shared on enquiry.
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Ask for the datasheet if you need the full technical sheet.
                  </p>
                </div>
              )}
            </div>

            <div className={`${activeTab === "enquiry" ? "block lg:hidden" : "hidden"} p-6`}>
              <EnquiryForm
                idPrefix="mobile"
                form={form}
                setForm={setForm}
                submitting={submitting}
                onSubmit={handleEnquiry}
                productName={product.name}
              />
            </div>
          </div>

          <aside className="hidden lg:col-span-5 lg:block">
            <div className="section-shell sticky top-28 p-7">
              <p className="section-eyebrow">Dealer enquiry</p>
              <h2 className="mt-4 text-2xl font-extrabold text-[#1B2A4A]">
                Request pricing for this model
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Share your details and we will send availability, dealer rate, and project support.
              </p>
              <div className="mt-6">
                <EnquiryForm
                  idPrefix="desktop"
                  form={form}
                  setForm={setForm}
                  submitting={submitting}
                  onSubmit={handleEnquiry}
                  productName={product.name}
                />
              </div>
              <a
                href="tel:+917360000121"
                className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-[#1B2A4A] hover:text-[#FF6B00]"
              >
                <FiPhone size={15} /> +91 73600 00121
              </a>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-14">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="section-eyebrow">More from this range</p>
                <h2 className="mt-3 text-2xl font-extrabold text-[#1B2A4A]">Related products</h2>
              </div>
              <Link
                href={`/categories/${product.category.slug}`}
                className="hidden text-sm font-bold text-[#FF6B00] hover:underline sm:inline"
              >
                View category
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((item) => (
                <Link key={item.id} href={`/products/${item.slug}`} className="luxury-card group p-4">
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-2xl bg-slate-50">
                    {item.images[0]?.url ? (
                      <Image
                        src={item.images[0].url}
                        alt={item.name}
                        fill
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <FiCamera className="text-slate-300" size={32} />
                      </div>
                    )}
                  </div>
                  <p className="line-clamp-2 text-sm font-bold text-[#1B2A4A] group-hover:text-[#FF6B00]">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {item.price > 0 ? `₹${item.price.toLocaleString("en-IN")}` : "Price on request"}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function EnquiryForm({
  idPrefix,
  form,
  setForm,
  submitting,
  onSubmit,
  productName,
}: {
  idPrefix: string;
  form: { name: string; phone: string; email: string; company: string; message: string };
  setForm: React.Dispatch<
    React.SetStateAction<{ name: string; phone: string; email: string; company: string; message: string }>
  >;
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  productName: string;
}) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-enquiry-name`} className={labelClass}>
            Full name
          </label>
          <input
            id={`${idPrefix}-enquiry-name`}
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Rahul Kumar"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-enquiry-phone`} className={labelClass}>
            Phone
          </label>
          <input
            id={`${idPrefix}-enquiry-phone`}
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="73600 00121"
            className={inputClass}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-enquiry-email`} className={labelClass}>
            Email
          </label>
          <input
            id={`${idPrefix}-enquiry-email`}
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@company.com"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-enquiry-company`} className={labelClass}>
            Company / shop
          </label>
          <input
            id={`${idPrefix}-enquiry-company`}
            type="text"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder="Optional"
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label htmlFor={`${idPrefix}-enquiry-message`} className={labelClass}>
          Requirement
        </label>
        <textarea
          id={`${idPrefix}-enquiry-message`}
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder={`Quantity, city, and any specs for ${productName}`}
          className={`${inputClass} resize-none`}
        />
      </div>
      <button type="submit" disabled={submitting} className="premium-button-primary w-full gap-2 disabled:opacity-60">
        {submitting ? "Sending..." : "Submit enquiry"}
        <FiSend size={15} />
      </button>
    </form>
  );
}
