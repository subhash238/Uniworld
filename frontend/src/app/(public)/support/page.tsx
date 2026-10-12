import type { Metadata } from "next";
import Link from "next/link";
import { contactDetails } from "@/lib/contactDetails";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiBriefcase,
  FiCheckCircle,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPhone,
  FiTool,
  FiHeadphones,
} from "react-icons/fi";

export const metadata: Metadata = {
  title: "Customer Support",
  description:
    "Contact Uniworld for product guidance, security system questions, dealer enquiries, and customer support.",
  alternates: { canonical: "https://uniworld.in/support" },
};

const supportWhatsappHref = "https://wa.me/919204057803?text=Hello%20Uniworld%2C%20I%20need%20support%20with%20a%20security%20product.";

const supportChannels = [
  {
    title: "Call our team",
    description: "Talk directly with Uniworld about products or an existing enquiry.",
    detail: "+91 92040 57803",
    href: "tel:+919204057803",
    action: "Call now",
    icon: FiPhone,
  },
  {
    title: "WhatsApp",
    description: "Send your question, product photo, or details of the issue by chat.",
    detail: "+91 92040 57803",
    href: supportWhatsappHref,
    action: "Chat on WhatsApp",
    icon: FiMessageCircle,
  },
  {
    title: "Email support",
    description: "Share the full details of your question and we will get back to you.",
    detail: contactDetails.email,
    href: `mailto:${contactDetails.email}?subject=Uniworld%20Support%20Request`,
    action: "Write an email",
    icon: FiMail,
  },
];

const supportTopics = [
  {
    title: "Choosing a product",
    description: "Need help comparing cameras, recorders, or accessories? Tell us what you need to secure and where it will be used.",
    href: "/products",
    action: "Browse products",
    icon: FiCheckCircle,
  },
  {
    title: "Product or setup question",
    description: "For help with a product you already have, share its model and a short description or photo of the issue.",
    href: "https://wa.me/917360000121?text=Hello%20Uniworld%2C%20I%20need%20help%20with%20a%20product.",
    action: "Get product help",
    icon: FiTool,
  },
  {
    title: "Dealer and business enquiries",
    description: "Looking to buy in bulk or become a dealer? Send your business and location details to the team.",
    href: "/dealers",
    action: "Dealer information",
    icon: FiBriefcase,
  },
];

export default function SupportPage() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-[#101d33] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(49,76,116,0.8),transparent_65%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-5 py-8 sm:px-8 md:py-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div>
            <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-xs text-slate-300">
              <Link href="/" className="hover:text-white">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Support</span>
            </nav>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ff9c54]">Uniworld customer care</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">Your security.<br /><span className="text-[#ff9c54]">Our support.</span></h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">Product guidance, help with an existing system or a dealer enquiry. Choose the right way to reach our team.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href={supportWhatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#FF6B00] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#e95f00] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"><FiMessageCircle size={18} aria-hidden="true" />Chat on WhatsApp</a>
              <Link href="/contact" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/30 px-5 py-3 text-sm font-bold transition hover:bg-white hover:text-[#101d33] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Send a support request <FiArrowRight size={16} aria-hidden="true" /></Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.12)] sm:p-6">
            <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-[#ff9c54]"><FiHeadphones size={22} aria-hidden="true" /></span><h2 className="text-lg font-bold">A few details help us help you</h2></div>
            <ol className="mt-5 space-y-4">
              {[
                { title: "Product or model", description: "Keep the product name or model number handy." },
                { title: "Your question", description: "Share a short description of what you need help with." },
                { title: "A useful photo", description: "Add a photo of the product or issue, if useful." },
              ].map((item, index) => (
                <li key={item.title} className="flex gap-3"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-[#ff9c54]">0{index + 1}</span><div><h3 className="text-sm font-semibold">{item.title}</h3><p className="mt-1 text-sm leading-6 text-slate-300">{item.description}</p></div></li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="support-channels" className="bg-[#f7f9fc] py-8 md:py-10" aria-labelledby="contact-support-heading">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b94e00]">Talk to us</p><h2 id="contact-support-heading" className="mt-1 text-2xl font-bold text-[#1b2a4a]">Choose how to reach us</h2></div>
            <p className="text-sm text-slate-600">Call, chat or email—whatever works for you.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {supportChannels.map(({ title, description, detail, href, action, icon: Icon }) => (
              <article key={title} className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(16,29,51,0.04)] transition hover:-translate-y-0.5 hover:border-[#f3a15e] hover:shadow-[0_14px_36px_rgba(16,29,51,0.09)] sm:p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff4ec] text-[#b94e00]"><Icon size={21} aria-hidden="true" /></span>
                <h3 className="mt-4 text-lg font-bold text-[#1b2a4a]">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{description}</p>
                <p className="mt-4 break-words text-sm font-semibold text-[#1b2a4a]">{detail}</p>
                <a href={href} target={href.startsWith("https://") ? "_blank" : undefined} rel={href.startsWith("https://") ? "noopener noreferrer" : undefined} className="mt-4 inline-flex min-h-10 items-center justify-between gap-2 border-t border-slate-100 pt-3 text-sm font-bold text-[#b94e00] hover:text-[#9e4400] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B00]">
                  {action} <FiArrowUpRight size={16} aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 md:grid-cols-[0.35fr_0.65fr] md:gap-10 md:py-10" aria-labelledby="support-options-heading">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b94e00]">How can we help?</p>
          <h2 id="support-options-heading" className="mt-2 text-2xl font-bold leading-tight text-[#1b2a4a] sm:text-3xl">Start with what you need</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">Find product advice, help with a current setup or information for dealers.</p>
        </div>
        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {supportTopics.map(({ title, description, href, action, icon: Icon }) => (
            <article key={title} className="flex gap-4 py-4 sm:py-5">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f7f9fc] text-[#b94e00]"><Icon size={20} aria-hidden="true" /></span>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-[#1b2a4a]">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
                {href.startsWith("https://") ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-8 items-center gap-1 text-sm font-bold text-[#b94e00] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B00]">{action} <FiArrowUpRight size={15} aria-hidden="true" /></a>
                ) : (
                  <Link href={href} className="mt-2 inline-flex min-h-8 items-center gap-1 text-sm font-bold text-[#b94e00] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B00]">{action} <FiArrowUpRight size={15} aria-hidden="true" /></Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-[#f7f9fc] py-8 md:py-10" aria-labelledby="support-offices-heading">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b94e00]">Our locations</p>
          <h2 id="support-offices-heading" className="mt-2 text-2xl font-bold text-[#1b2a4a]">Visit Uniworld</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {contactDetails.offices.map((office) => (
              <article key={office.name} className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#fff4ec] text-[#b94e00]"><FiMapPin size={20} aria-hidden="true" /></span>
                <div>
                  <h3 className="text-base font-bold text-[#1b2a4a]">{office.name}</h3>
                  <address className="mt-2 text-sm not-italic leading-6 text-slate-600">{office.address}</address>
                  <a href={office.mapsHref} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-8 items-center gap-1 text-sm font-bold text-[#b94e00] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B00]">Open map <FiArrowUpRight size={15} aria-hidden="true" /></a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}