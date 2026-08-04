import type { Metadata } from "next";
import { getProductsPageData } from "@/lib/productsData";
import { getSettings } from "@/lib/db";
import { absoluteUrl, getDescendantAndSelfCategoryIds, buildCategoryItemListJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";
import PlantsPageClient from "./PlantsPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteTitle = settings.seoTitle || "Ion Meccanica";
  const title = `Hatlar | ${siteTitle}`;
  const description =
    "Epoksi fırın hatları ve plaka silim hatları dahil, komple ve entegre doğal taş üretim hatlarımızı inceleyin.";

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl("/plants") },
    openGraph: { title, description, url: absoluteUrl("/plants"), type: "website" },
  };
}

export default async function PlantsPage(props: {
  searchParams: Promise<{ category?: string }>;
}) {
  const searchParams = await props.searchParams;
  const currentCategorySlug = searchParams.category || "";

  const { dbProducts, categories } = await getProductsPageData();

  const rootCategory = categories.find((c) => c.slug === "plants") ?? null;
  let jsonLdBlocks: object[] = [];
  if (rootCategory) {
    const allowedIds = getDescendantAndSelfCategoryIds(categories, rootCategory.id);
    const matchingProducts = dbProducts.filter((p) => p.categoryId && allowedIds.has(p.categoryId));
    const itemListJsonLd = buildCategoryItemListJsonLd(matchingProducts);
    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
      { name: "Ana Sayfa", url: "/" },
      { name: "Hatlar", url: "/plants" },
    ]);
    jsonLdBlocks = [itemListJsonLd, breadcrumbJsonLd];
  }

  return (
    <>
      {jsonLdBlocks.map((block, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }} />
      ))}
      <PlantsPageClient
        dbProducts={dbProducts}
        categories={categories}
        initialCategory={currentCategorySlug}
      />
    </>
  );
}
