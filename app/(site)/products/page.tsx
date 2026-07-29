import { getProductsPageData } from "@/lib/productsData";
import ProductsPageClient from "./ProductsPageClient";

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