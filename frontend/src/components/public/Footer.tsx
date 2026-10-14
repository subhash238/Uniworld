"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FiPhone, FiMail, FiMapPin, FiArrowUpRight, FiMessageSquare, FiPenTool } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import api from "@/lib/api";
import { contactDetails } from "@/lib/contactDetails";
import { supportGroups, supportHref } from "@/lib/supportLinks";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function Footer() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get<Category[]>("/categories/public")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Failed to load footer categories:", error));
  }, []);

  return (
    <footer className="bg-[#172027] text-slate-300">
      {pathname !== "/contact" && pathname !== "/support" && <section className="border-y border-slate-200 bg-[#f1f3f4] text-[#243240]">
        <div className="container mx-auto px-4 py-8 sm:px-6 md:py-10">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c76a36]">Support &amp; enquiries</p>
              <h2 className="mt-1 text-xl font-bold text-[#172b42] sm:text-2xl">Talk to the Uniworld team</h2>
            </div>
            <p className="text-xs text-slate-500">Choose the channel that works for you.</p>
          </div>

          <div className="grid grid-cols-1 divide-y divide-slate-200 sm:grid-cols-2 sm:divide-y-0 xl:grid-cols-4">
            <a href={contactDetails.phoneHref} className="group flex min-h-[82px] items-center gap-4 px-2 py-4 sm:border-r sm:border-slate-200 sm:px-4 xl:pl-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center text-[#c76a36]"><FiPhone size={21} /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Call our team</span>
                <span className="mt-1 block text-sm font-semibold text-[#172b42] group-hover:text-[#c76a36]">{contactDetails.phone}</span>
              </span>
              <FiArrowUpRight className="shrink-0 text-slate-400 transition-colors group-hover:text-[#c76a36]" size={16} />
            </a>

            <a href={`mailto:${contactDetails.email}`} className="group flex min-h-[82px] items-center gap-4 px-2 py-4 sm:border-r sm:border-slate-200 sm:px-4 xl:pl-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center text-[#c76a36]"><FiMail size={21} /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Email enquiries</span>
                <span className="mt-1 block truncate text-sm font-semibold text-[#172b42] group-hover:text-[#c76a36]">{contactDetails.email}</span>
              </span>
              <FiArrowUpRight className="shrink-0 text-slate-400 transition-colors group-hover:text-[#c76a36]" size={16} />
            </a>

            <Link href="/contact" className="group flex min-h-[82px] items-center gap-4 px-2 py-4 sm:border-r sm:border-slate-200 sm:px-4 xl:pl-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center text-[#c76a36]"><FiPenTool size={21} /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Write to us</span>
                <span className="mt-1 block text-sm font-semibold text-[#172b42] group-hover:text-[#c76a36]">Send an enquiry</span>
              </span>
              <FiArrowUpRight className="shrink-0 text-slate-400 transition-colors group-hover:text-[#c76a36]" size={16} />
            </Link>

            <a href={contactDetails.whatsappHref} target="_blank" rel="noopener noreferrer" className="group flex min-h-[82px] items-center gap-4 px-2 py-4 sm:px-4 xl:pl-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center text-[#c76a36]"><FiMessageSquare size={21} /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">WhatsApp support</span>
                <span className="mt-1 block text-sm font-semibold text-[#172b42] group-hover:text-[#c76a36]">Chat with our team</span>
              </span>
              <FiArrowUpRight className="shrink-0 text-slate-400 transition-colors group-hover:text-[#c76a36]" size={16} />
            </a>
          </div>
        </div>
      </section>}

      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-8 py-10 sm:grid-cols-2 sm:gap-8 md:py-12 lg:grid-cols-[1.3fr_0.7fr_0.8fr_0.9fr_1.1fr] lg:gap-8 lg:py-14">
          <div>
            <Image src="/images/logo-nav.jpeg" alt="Uniworld" width={220} height={70} className="mb-5 h-14 w-auto bg-white p-1" unoptimized />
            <p className="max-w-xs text-sm leading-6 text-slate-400">
              Security and surveillance systems for homes, businesses and institutions across Bihar, Jharkhand and Nepal.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a href="https://www.facebook.com/share/19YQ2zX2nb/" target="_blank" rel="noopener noreferrer" aria-label="Uniworld on Facebook" className="flex h-9 w-9 items-center justify-center border border-white/10 text-slate-400 transition-colors hover:border-[#f3a15e]/40 hover:text-white"><FaFacebookF size={14} /></a>
              <a href="https://www.instagram.com/uniworld_vision/" target="_blank" rel="noopener noreferrer" aria-label="Uniworld on Instagram" className="flex h-9 w-9 items-center justify-center border border-white/10 text-slate-400 transition-colors hover:border-[#f3a15e]/40 hover:text-white"><FaInstagram size={16} /></a>
              <a href="https://x.com/uniworldVision" target="_blank" rel="noopener noreferrer" aria-label="Uniworld on X" className="flex h-9 w-9 items-center justify-center border border-white/10 text-slate-400 transition-colors hover:border-[#f3a15e]/40 hover:text-white"><FaXTwitter size={14} /></a>
              <a href="https://www.linkedin.com/company/uniworld-vision-private-limited" target="_blank" rel="noopener noreferrer" aria-label="Uniworld on LinkedIn" className="flex h-9 w-9 items-center justify-center border border-white/10 text-slate-400 transition-colors hover:border-[#f3a15e]/40 hover:text-white"><FaLinkedinIn size={15} /></a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-white">Explore</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/products" className="transition-colors hover:text-white">Products</Link></li>
              <li><Link href="/categories" className="transition-colors hover:text-white">Categories</Link></li>
              <li><Link href="/dealers" className="transition-colors hover:text-white">Our dealers</Link></li>
              <li><Link href="/support" className="transition-colors hover:text-white">Support</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-white">Product ranges</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {categories.length > 0 ? categories.slice(0, 6).map((category) => (
                <li key={category.id}><Link href={`/categories/${category.slug}`} className="transition-colors hover:text-white">{category.name}</Link></li>
              )) : (
                <li><Link href="/categories" className="transition-colors hover:text-white">Browse all categories</Link></li>
              )}
              {categories.length > 6 && <li><Link href="/categories" className="inline-flex items-center gap-1 text-[#f3a15e] hover:text-white">All categories <FiArrowUpRight size={13} /></Link></li>}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-white">Support</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {supportGroups.flatMap((group) => group.links).map((link) => (
                <li key={link.slug}><Link href={supportHref(link.slug)} className="transition-colors hover:text-white">{link.title}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-white">Visit Uniworld</h3>
            <ul className="space-y-4 text-sm leading-5 text-slate-400">
              {contactDetails.offices.map((office) => (
                <li key={office.name} className="flex items-start gap-3">
                  <FiMapPin className="mt-0.5 shrink-0 text-[#f3a15e]" aria-hidden="true" />
                  <a href={office.mapsHref} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                    {office.name}<br />{office.address}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p suppressHydrationWarning>&copy; {new Date().getFullYear()} Uniworld. All rights reserved.</p>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>Designed &amp; developed by <span className="font-medium text-slate-300">Subhash Jha</span></span>
            <span aria-hidden="true" className="text-slate-700">|</span>
            <a href="tel:+918368929791" className="inline-flex items-center gap-1.5 transition-colors hover:text-white" aria-label="Call Subhash Jha at 83689 29791">
              <FiPhone size={12} /> +91 83689 29791
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
