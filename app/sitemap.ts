import type { MetadataRoute } from "next";
import { getCategories, getProducts, getNews } from "@/lib/db";
import { absoluteUrl } from "@/lib/seo";

// Sitenin sabit (admin panelden yönetilmeyen) sayfaları.
// Öncelik ve güncelleme sıklığı sayfanın önemine göre kabaca ayarlandı.
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/products", priority: 0.9, changeFrequency: "daily" },
  { path: "/service", priority: 0.6, changeFrequency: "monthly" },
  { path: "/service/installation-commissioning", priority: 0.5, changeFrequency: "monthly" },
  { path: "/service/maintenance-repair", priority: 0.5, changeFrequency: "monthly" },
  { path: "/service/remote-support", priority: 0.5, changeFrequency: "monthly" },
  { path: "/service/spare-parts", priority: 0.5, changeFrequency: "monthly" },
  { path: "/service/technical-support", priority: 0.5, changeFrequency: "monthly" },
  { path: "/service/training", priority: 0.5, changeFrequency: "monthly" },
  { path: "/about-us", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about-us/company", priority: 0.5, changeFrequency: "monthly" },
  { path: "/about-us/capabilities", priority: 0.5, changeFrequency: "monthly" },
  { path: "/about-us/engineering-technology", priority: 0.5, changeFrequency: "monthly" },
  { path: "/about-us/manufacturing-quality", priority: 0.5, changeFrequency: "monthly" },
  { path: "/ion-oneflow", priority: 0.6, changeFrequency: "monthly" },
  { path: "/ion-oneflow/automation-control", priority: 0.4, changeFrequency: "monthly" },
  { path: "/ion-oneflow/custom-solutions", priority: 0.4, changeFrequency: "monthly" },
  { path: "/ion-oneflow/overview", priority: 0.4, changeFrequency: "monthly" },
  { path: "/ion-oneflow/production-capabilities", priority: 0.4, changeFrequency: "monthly" },
  { path: "/ion-oneflow/rd", priority: 0.4, changeFrequency: "monthly" },
  { path: "/automation-control", priority: 0.4, changeFrequency: "monthly" },
  { path: "/sectors", priority: 0.5, changeFrequency: "monthly" },
  { path: "/why-ion", priority: 0.5, changeFrequency: "monthly" },
  { path: "/news", priority: 0.6, changeFrequency: "weekly" },
  { path: "/careers", priority: 0.4, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  { path: "/request-quote", priority: 0.7, changeFrequency: "yearly" },
  { path: "/projects/detail-1", priority: 0.3, changeFrequency: "yearly" },
  { path: "/projects/detail-2", priority: 0.3, changeFrequency: "yearly" },
  { path: "/projects/detail-3", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, news] = await Promise.all([getProducts(), getCategories(), getNews()]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    priority: route.priority,
    changeFrequency: route.changeFrequency,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
    url: absoluteUrl(`/category/${c.slug}`),
    priority: 0.7,
    changeFrequency: "weekly",
  }));

  const productEntries: MetadataRoute.Sitemap = products
    .filter((p) => p.active)
    .map((p) => ({
      url: absoluteUrl(`/products/${p.slug}`),
      lastModified: p.createdAt ? new Date(p.createdAt) : undefined,
      priority: 0.8,
      changeFrequency: "weekly",
    }));

  const newsEntries: MetadataRoute.Sitemap = news
    .filter((n) => n.active)
    .map((n) => ({
      url: absoluteUrl(`/news/${n.slug}`),
      lastModified: n.date ? new Date(n.date) : undefined,
      priority: 0.5,
      changeFrequency: "monthly",
    }));

  return [...staticEntries, ...categoryEntries, ...productEntries, ...newsEntries];
}
