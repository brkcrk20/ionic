import type { Metadata } from "next";
import { getNews, getSettings } from "@/lib/db";
import { absoluteUrl } from "@/lib/seo";
import NewsPageClient from "@/components/NewsPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteTitle = settings.seoTitle || "Ion Meccanica";
  const title = `Haberler & Projeler | ${siteTitle}`;
  const description = settings.seoDescription || "ION Meccanica haberler ve projeler";

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl("/news") },
    openGraph: { title, description, url: absoluteUrl("/news"), type: "website" },
  };
}

export default async function NewsPage() {
  const newsList = await getNews();
  const activeNews = newsList
    .filter((item) => item.active)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return <NewsPageClient news={activeNews} />;
}
