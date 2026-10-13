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
      { slug: "firmware", title: "Firmware", description: "Latest firmware for Uniworld cameras, NVRs and DVRs to keep your devices stable and secure." },
      { slug: "software", title: "Software", description: "Client, mobile and video management software for viewing and managing your security system." },
      { slug: "software-datasheet", title: "Software Datasheet", description: "Feature sheets and system requirements for Uniworld software." },
      { slug: "user-manual", title: "User Manual/QIG", description: "User manuals and quick installation guides for Uniworld products." },
      { slug: "certificate", title: "Certificate", description: "CE, FCC and RoHS compliance certificates for Uniworld products." },
      { slug: "sira-certificate", title: "SIRA Certificate", description: "SIRA approval certificates for supported models." },
    ],
  },
  {
    title: "Tools",
    links: [
      { slug: "lens-calculator", title: "Lens Calculator", description: "Find the right lens and field of view for the area you want to cover." },
      { slug: "hdd-bandwidth-calculator", title: "HDD & Bandwidth Calculator", description: "Estimate the storage and network bandwidth your recording setup needs." },
      { slug: "storage-calculator", title: "Storage Calculator", description: "Plan recording days and hard disk capacity for your cameras." },
    ],
  },
  {
    title: "Service",
    links: [
      { slug: "service", title: "Service", description: "Repair, replacement and warranty service for Uniworld products." },
    ],
  },
  {
    title: "Others",
    links: [
      { slug: "faqs", title: "FAQs", description: "Answers to common questions about Uniworld products and setup." },
      { slug: "technical-videos", title: "Technical Videos", description: "Step-by-step videos for installation, configuration and remote viewing." },
      { slug: "compatibility-list", title: "Compatibility List", description: "Check which cameras, recorders and hard disks work together." },
      { slug: "troubleshooting", title: "Troubleshooting", description: "Quick fixes for common camera, recorder and connectivity issues." },
      { slug: "security-advisories", title: "Security Advisories", description: "Security notices and recommended updates for Uniworld devices." },
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
