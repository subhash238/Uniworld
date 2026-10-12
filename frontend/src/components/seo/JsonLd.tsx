export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://uniworld.in",
    name: "Uniworld Security Solutions",
    alternateName: "Uniworld",
    description:
      "Leading distributor of CCTV cameras, IP cameras, DVR, NVR, and access control systems. Proudly serving businesses and homes across Bihar, Jharkhand & Nepal with genuine security products.",
    url: "https://uniworld.in",
    logo: "https://uniworld.in/images/logo-nav.jpeg",
    image: "https://uniworld.in/images/og-image.jpg",
    telephone: "+91-XXXXX-XXXXX",
    email: "info@uniworld.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Your Street Address",
      addressLocality: "Patna",
      addressRegion: "Bihar",
      postalCode: "800001",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "25.6093",
      longitude: "85.1376",
    },
    areaServed: [
      { "@type": "State", name: "Bihar" },
      { "@type": "State", name: "Jharkhand" },
      { "@type": "Country", name: "Nepal" },
      { "@type": "City", name: "Patna" },
      { "@type": "City", name: "Ranchi" },
      { "@type": "City", name: "Jamshedpur" },
      { "@type": "City", name: "Muzaffarpur" },
      { "@type": "City", name: "Gaya" },
      { "@type": "City", name: "Kathmandu" },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "19:00",
    },
    priceRange: "₹₹",
    sameAs: [],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Security Products",
      itemListElement: [
        { "@type": "OfferCatalog", name: "CCTV Cameras" },
        { "@type": "OfferCatalog", name: "IP Cameras" },
        { "@type": "OfferCatalog", name: "DVR Systems" },
        { "@type": "OfferCatalog", name: "NVR Systems" },
        { "@type": "OfferCatalog", name: "Access Control" },
        { "@type": "OfferCatalog", name: "Cables & Accessories" },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Uniworld Security Solutions",
    url: "https://uniworld.in",
    logo: "https://uniworld.in/images/logo-nav.jpeg",
    description: "Leading CCTV camera and security products distributor operating across Bihar, Jharkhand & Nepal.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Patna",
      addressRegion: "Bihar",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-XXXXX-XXXXX",
      contactType: "sales",
      areaServed: ["Bihar", "Jharkhand", "Nepal"],
      availableLanguage: ["Hindi", "English"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the best CCTV camera for home security in Bihar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For home security, we recommend 2MP or 4MP dome cameras with night vision. Our range starts from ₹1,500 and includes leading brands with excellent after-sales support across Bihar, Jharkhand & Nepal.",
        },
      },
      {
        "@type": "Question",
        name: "Do you provide CCTV installation services?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! We provide complete CCTV installation services across Bihar, Jharkhand and select cities in Nepal. Our certified technicians ensure professional setup with free site consultation.",
        },
      },
      {
        "@type": "Question",
        name: "What is the price of a 4-camera CCTV setup?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A complete 4-camera CCTV setup including DVR, hard disk, cables, and installation starts from ₹12,000 depending on camera resolution and brand. Prices are consistent across our Bihar, Jharkhand & Nepal operations. Contact us for a customized quote.",
        },
      },
      {
        "@type": "Question",
        name: "Are you an authorized security products distributor?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Uniworld is an authorized distributor of leading security brands. We provide genuine products with manufacturer warranty and dedicated local support across Bihar, Jharkhand & Nepal.",
        },
      },
      {
        "@type": "Question",
        name: "Do you supply to dealers and retailers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely! We are a wholesale distributor serving dealers and retailers across Bihar, Jharkhand & Nepal. We offer competitive dealer pricing, bulk discounts, and reliable supply chains.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductSchema({
  name,
  description,
  price,
  image,
  sku,
  inStock,
  category,
}: {
  name: string;
  description: string;
  price: number;
  image?: string;
  sku?: string;
  inStock: boolean;
  category: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: image || "https://uniworld.in/images/og-image.jpg",
    sku: sku || undefined,
    category,
    brand: {
      "@type": "Brand",
      name: "Uniworld",
    },
    offers: {
      "@type": "Offer",
      url: "https://uniworld.in",
      priceCurrency: "INR",
      price,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Uniworld Security Solutions",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
