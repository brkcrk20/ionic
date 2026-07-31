import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNews, getSettings } from "@/lib/db";
import { buildNewsMeta, buildNewsJsonLd, buildBreadcrumbJsonLd, absoluteUrl, getLangText } from "@/lib/seo";
import NewsDetailClient from "@/components/NewsDetailClient";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const [news, settings] = await Promise.all([getNews(), getSettings()]);
  const item = news.find((n) => n.slug === slug && n.active);
  if (!item) return {};

  const siteTitle = settings.seoTitle || "Ion Meccanica";
  const { title, description } = buildNewsMeta(item, siteTitle);
  const url = absoluteUrl(`/news/${item.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: item.coverImage ? [{ url: absoluteUrl(item.coverImage) }] : undefined,
    },
  };
}

export default async function NewsDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const news = await getNews();
  const item = news.find((n) => n.slug === slug);

  if (!item || !item.active) {
    notFound();
  }

  const newsJsonLd = buildNewsJsonLd(item);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Ana Sayfa", url: "/" },
    { name: "Haberler", url: "/news" },
    { name: getLangText(item.title), url: `/news/${item.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <NewsDetailClient news={item} />
    </>
  );
}
