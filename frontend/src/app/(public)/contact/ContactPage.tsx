"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { contactDetails } from "@/lib/contactDetails";
import toast from "react-hot-toast";
import { FiPhone, FiMail, FiMapPin, FiSend, FiMessageSquare, FiArrowUpRight, FiLoader, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const emptyForm = { name: "", email: "", phone: "", subject: "", message: "" };
const fieldClassName = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1b2a4a] focus:outline-2 focus:outline-[#1b2a4a] disabled:bg-slate-50 disabled:text-slate-500";

export default function ContactPage() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const updateField = (field: keyof typeof emptyForm, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setStatus("idle");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setStatus("idle");
    try {
      await api.post("/contact", form);
      setStatus("success");
      toast.success("Your enquiry has been submitted.");
      setForm(emptyForm);
    } catch {
      setStatus("error");
      toast.error("Failed to send your enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f9fa]">
      <section className="bg-[#17253d] px-5 py-7 text-white sm:px-8 md:py-8">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-2 text-xs text-slate-300">
            <Link href="/" className="hover:text-white">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Contact</span>
          </nav>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Contact Uniworld</h1>
          <p className="mt-2 text-sm leading-6 text-slate-300">Product guidance, dealer enquiries and support. Let’s talk about what you need.</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl items-start gap-5 px-5 py-6 sm:px-8 md:py-8 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-6">
        <section aria-labelledby="enquiry-heading" className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 lg:order-2">
          <h2 id="enquiry-heading" className="text-xl font-bold text-[#1b2a4a]">Send us an enquiry</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Tell us about your product, project or dealer requirements.</p>
          <p className="mt-2 text-xs text-slate-500">Fields marked * are required.</p>

          <form onSubmit={handleSubmit} aria-busy={loading} className="mt-5">
            {status !== "idle" && (
              <div role={status === "error" ? "alert" : "status"} className={`mb-4 flex items-start gap-2 rounded-lg border p-3 text-sm leading-6 ${status === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}>
                {status === "success" ? <FiCheckCircle size={18} className="mt-1 shrink-0" aria-hidden="true" /> : <FiAlertCircle size={18} className="mt-1 shrink-0" aria-hidden="true" />}
                <p>{status === "success" ? "Thank you. Your enquiry has been submitted, and our team will get back to you." : "Something went wrong. Your details are still here—please try again or contact our team directly."}</p>
              </div>
            )}
            <fieldset disabled={loading} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold text-slate-700">Your name <span aria-hidden="true" className="text-[#b94e00]">*</span></label>
                  <input id="contact-name" name="name" type="text" autoComplete="name" placeholder="Your full name" required value={form.name} onChange={(event) => updateField("name", event.target.value)} className={fieldClassName} />
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold text-slate-700">Email address <span aria-hidden="true" className="text-[#b94e00]">*</span></label>
                  <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required value={form.email} onChange={(event) => updateField("email", event.target.value)} className={fieldClassName} />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="mb-2 block text-sm font-semibold text-slate-700">Phone number <span className="font-normal text-slate-500">(optional)</span></label>
                  <input id="contact-phone" name="phone" type="tel" autoComplete="tel" placeholder="Your contact number" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} className={fieldClassName} />
                </div>
                <div>
                  <label htmlFor="contact-subject" className="mb-2 block text-sm font-semibold text-slate-700">Subject <span className="font-normal text-slate-500">(optional)</span></label>
                  <input id="contact-subject" name="subject" type="text" placeholder="What can we help with?" value={form.subject} onChange={(event) => updateField("subject", event.target.value)} className={fieldClassName} />
                </div>
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold text-slate-700">Your message <span aria-hidden="true" className="text-[#b94e00]">*</span></label>
                <textarea id="contact-message" name="message" required rows={5} placeholder="Share the products or solution you’re looking for." value={form.message} onChange={(event) => updateField("message", event.target.value)} className={`${fieldClassName} min-h-[140px] resize-y`} />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button type="submit" disabled={loading} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#FF6B00] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#e95f00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B00] disabled:cursor-wait disabled:opacity-60">
                  {loading ? <FiLoader size={16} className="animate-spin" aria-hidden="true" /> : <FiSend size={16} aria-hidden="true" />}
                  {loading ? "Sending…" : "Send enquiry"}
                </button>
                <p className="text-xs leading-5 text-slate-500">We’ll use these details to respond to your enquiry.</p>
              </div>
            </fieldset>
          </form>
        </section>

        <aside className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 lg:order-1">
          <h2 className="text-xl font-bold text-[#1b2a4a]">Reach our team</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Choose a direct contact channel or send us your requirements.</p>
          <ul className="mt-4 divide-y divide-slate-100">
            {[
              { icon: FiPhone, label: "Phone", text: contactDetails.phone, href: contactDetails.phoneHref },
              { icon: FiMail, label: "Email", text: contactDetails.email, href: `mailto:${contactDetails.email}` },
              { icon: FiMessageSquare, label: "WhatsApp", text: "Chat with our team", href: contactDetails.whatsappHref },
            ].map((channel) => {
              const external = channel.label === "WhatsApp";
              return (
                <li key={channel.label} className="py-3 first:pt-0">
                  <a href={channel.href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className="group flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF6B00]">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fff4ec] text-[#b94e00]"><channel.icon size={18} aria-hidden="true" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs text-slate-500">{channel.label}</span>
                      <span className="mt-1 block break-words text-sm font-semibold text-[#1b2a4a] group-hover:text-[#b94e00]">{channel.text}</span>
                    </span>
                    <FiArrowUpRight size={16} className="shrink-0 text-slate-400" aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 border-t border-slate-100 pt-4">
            <h2 className="text-lg font-bold text-[#1b2a4a]">Our offices</h2>
            <div className="mt-3 space-y-4">
              {contactDetails.offices.map((office) => (
                <div key={office.name} className="flex items-start gap-3">
                  <FiMapPin size={18} className="mt-1 shrink-0 text-[#b94e00]" aria-hidden="true" />
                  <div>
                    <h3 className="text-sm font-semibold text-[#1b2a4a]">{office.name}</h3>
                    <address className="mt-1 text-sm not-italic leading-6 text-slate-600">{office.address}</address>
                    <a href={office.mapsHref} target="_blank" rel="noopener noreferrer" aria-label={`Get directions to ${office.name}`} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#b94e00] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B00]">Get directions <FiArrowUpRight size={13} aria-hidden="true" /></a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
