"use client";

import { useState } from "react";
import { FiDownload } from "react-icons/fi";
import { formatFileSize, type SupportDownload } from "@/lib/supportLinks";

const PREVIEW_COUNT = 3;

export default function DownloadSections({ items }: { items: SupportDownload[] }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const sections = items.reduce<Record<string, SupportDownload[]>>((acc, item) => {
    (acc[item.section] ||= []).push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-7">
      {Object.entries(sections).map(([section, files]) => {
        const isExpanded = expanded[section];
        const visible = isExpanded ? files : files.slice(0, PREVIEW_COUNT);
        return (
          <section key={section} aria-label={section}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-[#e31e24] sm:text-xl">{section}</h2>
              {files.length > PREVIEW_COUNT && (
                <button
                  type="button"
                  onClick={() => setExpanded((current) => ({ ...current, [section]: !isExpanded }))}
                  className="shrink-0 rounded border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#1b2a4a] transition hover:border-[#e31e24] hover:text-[#e31e24]"
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? "Show less" : "Show all"}
                </button>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((file) => (
                <article key={file.id} className="rounded-lg border border-slate-200 bg-white p-4 transition hover:shadow-md">
                  <h3 className="line-clamp-2 text-sm font-semibold text-[#1b2a4a]">{file.title}</h3>
                  <p className="mt-1 text-xs text-slate-400">{formatFileSize(file.fileSize)}</p>
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={file.fileName}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[#e31e24] hover:underline"
                  >
                    Download <FiDownload size={14} aria-hidden="true" />
                  </a>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
