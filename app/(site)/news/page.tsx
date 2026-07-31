import type { Metadata } from "next";
import { getNews, getSettings } from "@/lib/db";
import { absoluteUrl } from "@/lib/seo";
import NewsListClient from "@/components/NewsListClient";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteTitle = settings.seoTitle || "Ion Meccanica";
  const title = `Haberler | ${siteTitle}`;
  const description = "ION MECCANICA'dan en son haberler, duyurular ve gelişmeler.";

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl("/news") },
    openGraph: { title, description, url: absoluteUrl("/news"), type: "website" },
  };
}

export default async function NewsPage() {
  const allNews = await getNews();
  const activeNews = allNews
    .filter((n) => n.active)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return <NewsListClient news={activeNews} />;
}
