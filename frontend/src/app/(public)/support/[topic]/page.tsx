import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowRight, FiMail, FiMessageCircle } from "react-icons/fi";
import { contactDetails } from "@/lib/contactDetails";
import {
  findSupportLink,
  isDownloadType,
  supportGroups,
  supportHref,
  type SupportDownload,
} from "@/lib/supportLinks";
import DownloadSections from "./DownloadSections";

interface Props {
  params: Promise<{ topic: string }>;
}

export const dynamicParams = false;

async function getDownloads(type: string): Promise<SupportDownload[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const res = await fetch(`${apiUrl}/support-downloads/public?type=${encodeURIComponent(type)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function generateStaticParams() {
  return supportGroups.flatMap((group) => group.links.map((link) => ({ topic: link.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const match = findSupportLink(topic);
  if (!match) return { title: "Support" };

  return {
    title: `${match.link.title} | Support`,
    description: match.link.description,
    alternates: { canonical: `https://uniworld.in${supportHref(topic)}` },
  };
}

export default async function SupportTopicPage({ params }: Props) {
  const { topic } = await params;
  const match = findSupportLink(topic);
  if (!match) notFound();

  const { group, link } = match;
  const downloads = isDownloadType(link.slug) ? await getDownloads(link.slug) : [];
  const whatsappHref = `https://wa.me/917360000121?text=${encodeURIComponent(
    `Hello Uniworld, I need ${link.title} for model: `
  )}`;

  return (
    <div className="bg-[#f4f6f9]">
      <section className="bg-[#101d33] text-white">
        <div className="mx-auto max-w-7xl px-5 py-8 text-center sm:px-8 md:py-10">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{link.title}</h1>
          <nav aria-label="Breadcrumb" className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
            <Link href="/" className="transition hover:text-white">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/support" className="transition hover:text-white">Support</Link>
            <span aria-hidden="true">/</span>
            <span>{group.title}</span>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="font-semibold text-white">{link.title}</span>
          </nav>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl items-start gap-5 px-5 py-6 sm:px-8 md:py-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-6">
        <aside className="rounded-xl border border-slate-200 bg-white p-4 lg:sticky lg:top-28 lg:p-5">
          <h2 className="border-b border-slate-100 pb-2.5 text-base font-bold text-[#1b2a4a]">Categories</h2>
          <div className="mt-3 space-y-4">
            {supportGroups.map((item) => (
              <div key={item.title}>
                <div className="flex items-center justify-between text-sm font-semibold text-[#1b2a4a]">
                  <span>{item.title}</span>
                  <span className="text-xs font-medium text-slate-400">({String(item.links.length).padStart(2, "0")})</span>
                </div>
                <ul className="mt-1.5 space-y-1 border-l border-slate-200 pl-3">
                  {item.links.map((entry) => {
                    const isActive = entry.slug === link.slug;
                    return (
                      <li key={entry.slug}>
                        <Link
                          href={supportHref(entry.slug)}
                          aria-current={isActive ? "page" : undefined}
                          className={`block py-0.5 text-[13px] transition-colors ${
                            isActive ? "font-semibold text-[#e31e24]" : "text-slate-600 hover:text-[#e31e24]"
                          }`}
                        >
                          {entry.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        <div className="space-y-6">
        {downloads.length > 0 && <DownloadSections items={downloads} />}

        <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-7" aria-labelledby="support-topic-heading">
          {downloads.length === 0 && (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#e31e24]">{group.title}</p>
              <h2 id="support-topic-heading" className="mt-1 text-xl font-bold text-[#1b2a4a] sm:text-2xl">{link.title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{link.description}</p>
            </>
          )}

          <div className={`${downloads.length === 0 ? "mt-6 " : ""}rounded-lg border border-dashed border-slate-300 bg-[#f7f9fc] p-5`}>
            <h3 id={downloads.length > 0 ? "support-topic-heading" : undefined} className="text-base font-bold text-[#1b2a4a]">
              {downloads.length > 0 ? "Can't find what you need?" : "Get it from our support team"}
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Share your product model number and our team will send you the right {link.title.toLowerCase()} resources.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#e31e24] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#c9181d]"
              >
                <FiMessageCircle size={17} aria-hidden="true" /> Request on WhatsApp
              </a>
              <a
                href={`mailto:${contactDetails.email}?subject=${encodeURIComponent(`${link.title} request`)}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-bold text-[#1b2a4a] transition hover:border-[#1b2a4a]"
              >
                <FiMail size={17} aria-hidden="true" /> Email us
              </a>
            </div>
          </div>

          <Link href="/support" className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-[#e31e24] hover:underline">
            Back to support <FiArrowRight size={15} aria-hidden="true" />
          </Link>
        </section>
        </div>
      </div>
    </div>
  );
}
