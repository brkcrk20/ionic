import { getCategories, getProducts } from "@/lib/db";
import ProductsPageClient from "./ProductsPageClient";

const STATIC_POSITRON = {
  id: "static-positron",
  name: "POSITRON 60",
  code: "POSITRON",
  category: "Fırın Kule",
  image: "/Positron_3.jpg",
  slug: "positron",
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const dbProducts = products
    .filter((p) => p.active)
    .map((p) => ({
      id: p.id,
      name: p.name,
      code: p.slug.toUpperCase().replace(/-/g, " "),
      category: categories.find((c) => c.id === p.categoryId)?.name ?? "Genel",
      image: p.images[0] || "/resim1.jpg",
      slug: p.slug,
    }));

  const withPositron = dbProducts.some((item) => item.slug === STATIC_POSITRON.slug)
    ? dbProducts
    : [STATIC_POSITRON, ...dbProducts];

  return <ProductsPageClient dbProducts={withPositron} />;
}
