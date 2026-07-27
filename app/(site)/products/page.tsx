import { getProducts, getCategories } from "@/lib/db";
import ProductsListClient from "./ProductsListClient";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const activeProducts = products.filter((p) => p.active);

  return <ProductsListClient products={activeProducts} categories={categories} />;
}
