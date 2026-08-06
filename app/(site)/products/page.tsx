import type { Metadata } from "next";
import { getProductsPageData } from "@/lib/productsData";
import { getSettings } from "@/lib/db";
import { absoluteUrl } from "@/lib/seo";
import ProductsPageClient from "./ProductsPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteTitle = settings.seoTitle || "Ion Meccanica";
  const title = `Ürünler | ${siteTitle}`;
  const description =
    settings.seoDescription ||
    "Doğal taş işleme makineleri";

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl("/products") },
    openGraph: { title, description, url: absoluteUrl("/products"), type: "website" },
  };
}

export default async function ProductsPage(props: {
  searchParams: Promise<{ category?: string }>;
}) {
  const searchParams = await props.searchParams;
  const currentCategorySlug = searchParams.category || "";

  const { dbProducts, categories } = await getProductsPageData();

  return (
    <ProductsPageClient 
      dbProducts={dbProducts} 
      categories={categories}
      initialCategory={currentCategorySlug} 
    />
  );
}