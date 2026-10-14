"use client";

import { useEffect, useState } from "react";
import { FiPlay, FiX } from "react-icons/fi";

interface GalleryItem {
  id: string;
  title: string;
  mediaType: string;
  fileUrl: string;
}

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = items.find((item) => item.id === openId);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpenId(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setOpenId(item.id)}
            className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-lg border border-slate-200 bg-slate-100 text-left sm:mb-4"
          >
            {item.mediaType === "video" ? (
              <video src={item.fileUrl} muted playsInline preload="metadata" className="block w-full transition group-hover:scale-105" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.fileUrl} alt={item.title} loading="lazy" className="block w-full transition group-hover:scale-105" />
            )}
            {item.mediaType === "video" && (
              <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white">
                <FiPlay size={14} aria-hidden="true" />
              </span>
            )}
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-8 text-sm font-medium text-white">
              {item.title}
            </span>
          </button>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4" role="dialog" aria-modal="true" aria-label={open.title} onClick={() => setOpenId(null)}>
          <button type="button" onClick={() => setOpenId(null)} aria-label="Close" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20">
            <FiX size={20} />
          </button>
          <div className="max-h-[85vh] max-w-4xl" onClick={(event) => event.stopPropagation()}>
            {open.mediaType === "video" ? (
              <video src={open.fileUrl} controls autoPlay className="max-h-[80vh] w-auto rounded-lg" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={open.fileUrl} alt={open.title} className="max-h-[80vh] w-auto rounded-lg" />
            )}
            <p className="mt-3 text-center text-sm font-medium text-white">{open.title}</p>
          </div>
        </div>
      )}
    </>
  );
}
