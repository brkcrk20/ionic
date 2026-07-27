import { notFound } from "next/navigation";
import { getProducts, getCategories } from "@/lib/db";
import PositronDetail from "./PositronDetail";
import DynamicProductDetail from "./DynamicProductDetail";

export default async function ProductDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  if (slug === "positron") {
    return <PositronDetail />;
  }

  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const product = products.find((p) => p.slug === slug);

  if (!product || !product.active) {
    notFound();
  }

  const category = categories.find((c) => c.id === product.categoryId) ?? null;

  // Kategori adını string'e normalize ediyoruz
  let categoryNameString: string | null = null;
  if (category?.name) {
    if (typeof category.name === "string") {
      categoryNameString = category.name;
    } else {
      categoryNameString = category.name.tr || category.name.en || "";
    }
  }

  return <DynamicProductDetail product={product} categoryName={categoryNameString} />;
}