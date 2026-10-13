import type { Metadata } from "next";
import Link from "next/link";
import GalleryGrid from "./GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos and videos of Uniworld security products, installations and events.",
  alternates: { canonical: "https://uniworld.in/gallery" },
};

interface GalleryItem {
  id: string;
  title: string;
  mediaType: string;
  fileUrl: string;
}

async function getItems(): Promise<GalleryItem[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const res = await fetch(`${apiUrl}/gallery/public`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const items = await getItems();

  return (
    <div className="bg-[#f4f6f9]">
      <section className="bg-[#101d33] text-white">
        <div className="mx-auto max-w-7xl px-5 py-8 text-center sm:px-8 md:py-10">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Gallery</h1>
          <nav aria-label="Breadcrumb" className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
            <Link href="/" className="transition hover:text-white">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="font-semibold text-white">Gallery</span>
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <p className="font-medium text-slate-700">No photos or videos yet</p>
            <p className="mt-1 text-sm text-slate-500">Check back soon — we update the gallery with new installations and products.</p>
          </div>
        ) : (
          <GalleryGrid items={items} />
        )}
      </div>
    </div>
  );
}
