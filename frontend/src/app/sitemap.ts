import { MetadataRoute } from "next";

const BASE_URL = "https://uniworld.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/dealers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Fetch dynamic pages from API
  let productPages: MetadataRoute.Sitemap = [];
  let categoryPages: MetadataRoute.Sitemap = [];

  try {
    const productsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/products/public?limit=1000`, {
      next: { revalidate: 3600 },
    });
    if (productsRes.ok) {
      const data = await productsRes.json();
      const products = data.products || [];
      productPages = products.map((product: { slug: string; updatedAt?: string }) => ({
        url: `${BASE_URL}/products/${product.slug}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error("Sitemap: Failed to fetch products", error);
  }

  try {
    const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/categories/public`, {
      next: { revalidate: 3600 },
    });
    if (categoriesRes.ok) {
      const categories = await categoriesRes.json();
      categoryPages = categories.map((cat: { slug: string }) => ({
        url: `${BASE_URL}/categories/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error("Sitemap: Failed to fetch categories", error);
  }

  return [...staticPages, ...productPages, ...categoryPages];
}
