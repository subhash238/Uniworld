export interface SupportLink {
  slug: string;
  title: string;
  description: string;
}

export interface SupportGroup {
  title: string;
  links: SupportLink[];
}

export const supportGroups: SupportGroup[] = [
  {
    title: "Download",
    links: [
      { slug: "certificate", title: "Certificate", description: "CE, FCC and RoHS compliance certificates for Uniworld products." },
    ],
  },
  {
    title: "Tools",
    links: [
      { slug: "lens-calculator", title: "Lens Calculator", description: "Find the right lens and field of view for the area you want to cover." },
      { slug: "hdd-bandwidth-calculator", title: "HDD & Bandwidth Calculator", description: "Estimate the storage and network bandwidth your recording setup needs." },
    ],
  },
];

export const supportHref = (slug: string) => `/support/${slug}`;

export function findSupportLink(slug: string) {
  for (const group of supportGroups) {
    const link = group.links.find((item) => item.slug === slug);
    if (link) return { group, link };
  }
  return null;
}

export const downloadTypes = supportGroups.find((group) => group.title === "Download")?.links ?? [];

export const isDownloadType = (slug: string) => downloadTypes.some((link) => link.slug === slug);

export interface SupportDownload {
  id: string;
  title: string;
  type: string;
  section: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
