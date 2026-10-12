import type { Metadata } from "next";
import ProductDetailPage from "./ProductDetailPage";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/products/public/${slug}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) return { title: "Product Not Found" };

    const product = await res.json();

    return {
      title: `${product.name} - Buy Online | Best Price in Bihar, Jharkhand & Nepal`,
      description: `Buy ${product.name} at best price. ${product.description?.slice(0, 120) || `${product.category.name} from Uniworld - trusted security distributor across Bihar, Jharkhand & Nepal.`}`,
      alternates: {
        canonical: `https://uniworld.in/products/${slug}`,
      },
      openGraph: {
        title: `${product.name} - Uniworld | Bihar, Jharkhand & Nepal`,
        description: `₹${product.price.toLocaleString()} - ${product.category.name}. Buy from Uniworld - trusted security distributor across Bihar, Jharkhand & Nepal.`,
        url: `https://uniworld.in/products/${slug}`,
        images: product.images?.[0]?.url ? [{ url: product.images[0].url, width: 800, height: 800, alt: product.name }] : undefined,
      },
    };
  } catch {
    return { title: "Product | Uniworld - Bihar, Jharkhand & Nepal" };
  }
}

export default function Page() {
  return <ProductDetailPage />;
}
