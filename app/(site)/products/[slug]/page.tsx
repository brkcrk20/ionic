import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts, getCategories, getSettings } from "@/lib/db";
import { buildProductMeta, buildProductJsonLd, buildBreadcrumbJsonLd, absoluteUrl, getLangText } from "@/lib/seo";
import DynamicProductDetail from "./DynamicProductDetail";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  const product = products.find((p) => p.slug === slug && p.active);
  if (!product) return {};

  const siteTitle = settings.seoTitle || "Ion Meccanica";
  const { title, description } = buildProductMeta(product, siteTitle);
  const url = absoluteUrl(`/products/${product.slug}`);
  const image = product.heroImage || product.images[0];

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: image ? [{ url: absoluteUrl(image) }] : undefined,
    },
  };
}

export default async function ProductDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const product = products.find((p) => p.slug === slug);

  if (!product || !product.active) {
    notFound();
  }

  const category = categories.find((c) => c.id === product.categoryId) ?? null;
  // JSON-LD ve metadata için varsayılan bir metin kalabilir
  const categoryNameString = category ? getLangText(category.name) : null;

  const productJsonLd = buildProductJsonLd(product, categoryNameString);
  const breadcrumbItems = [
    { name: "Ana Sayfa", url: "/" },
    { name: "Ürünler", url: "/products" },
    ...(category ? [{ name: categoryNameString || "", url: `/category/${category.slug}` }] : []),
    { name: getLangText(product.name), url: `/products/${product.slug}` },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <DynamicProductDetail product={product} category={category} />
    </>
  );
}
