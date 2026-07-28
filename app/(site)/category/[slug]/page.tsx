import { getProductsPageData } from "@/lib/productsData";
import ProductsPageClient from "../../products/ProductsPageClient";

export default async function KategoriPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;

  // Kullanıcı herhangi bir kategori veya alt kategoriye tıkladığında,
  // /products sayfasına yönlendirmek yerine aynı listeyi doğrudan bu kategoriye
  // filtrelenmiş şekilde gösteriyoruz (client-side redirect yerine).
  const { dbProducts, categories } = await getProductsPageData();

  return (
    <ProductsPageClient
      dbProducts={dbProducts}
      categories={categories}
      initialCategory={slug}
    />
  );
}