import type { Metadata } from "next";
import { getProductsPageData } from "@/lib/productsData";
import { getCategories, getSettings, getProducts } from "@/lib/db";
import {
  buildCategoryMeta,
  buildCategoryItemListJsonLd,
  buildBreadcrumbJsonLd,
  getDescendantAndSelfCategoryIds,
  absoluteUrl,
  getLangText,
} from "@/lib/seo";
import ProductsPageClient from "../../products/ProductsPageClient";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const [categories, products, settings] = await Promise.all([getCategories(), getProducts(), getSettings()]);
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};

  const allowedIds = getDescendantAndSelfCategoryIds(categories, category.id);
  const productCount = products.filter((p) => p.active && p.categoryId && allowedIds.has(p.categoryId)).length;

  const siteTitle = settings.seoTitle || "Ion Meccanica";
  const { title, description } = buildCategoryMeta(category, siteTitle, productCount);
  const url = absoluteUrl(`/category/${category.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: category.image ? [{ url: absoluteUrl(category.image) }] : undefined,
    },
  };
}

export default async function KategoriPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;

  // Kullanıcı herhangi bir kategori veya alt kategoriye tıkladığında,
  // /products sayfasına yönlendirmek yerine aynı listeyi doğrudan bu kategoriye
  // filtrelenmiş şekilde gösteriyoruz (client-side redirect yerine).
  const { dbProducts, categories } = await getProductsPageData();

  const category = categories.find((c) => c.slug === slug) ?? null;

  let jsonLdBlocks: object[] = [];
  if (category) {
    const allowedIds = getDescendantAndSelfCategoryIds(categories, category.id);
    const matchingProducts = dbProducts.filter((p) => p.categoryId && allowedIds.has(p.categoryId));

    const itemListJsonLd = buildCategoryItemListJsonLd(matchingProducts);
    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
      { name: "Ana Sayfa", url: "/" },
      { name: "Ürünler", url: "/products" },
      { name: getLangText(category.name), url: `/category/${category.slug}` },
    ]);
    jsonLdBlocks = [itemListJsonLd, breadcrumbJsonLd];
  }

  return (
    <>
      {jsonLdBlocks.map((block, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }} />
      ))}
      <ProductsPageClient dbProducts={dbProducts} categories={categories} initialCategory={slug} />
    </>
  );
}
