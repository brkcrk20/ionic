import { getProductBySlug, getCategories } from "@/lib/db";
import Link from "next/link";
import ProductDetailView from "./ProductDetailView";

export default async function ProductDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product || !product.active) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center gap-4 px-6 text-center bg-white">
        <h1 className="text-2xl font-extrabold text-[#3A3A3A]">Ürün bulunamadı</h1>
        <p className="text-gray-500 max-w-md">
          Aradığınız ürün kaldırılmış veya yayından kaldırılmış olabilir.
        </p>
        <Link
          href="/products"
          className="mt-2 inline-flex items-center gap-2 bg-[#B87332] text-white text-sm font-bold rounded-lg px-5 py-2.5 hover:bg-[#a3632a] transition-colors"
        >
          Tüm Ürünlere Dön
        </Link>
      </div>
    );
  }

  const categories = await getCategories();
  const category = categories.find((c) => c.id === product.categoryId) ?? null;

  return <ProductDetailView product={product} categoryName={category?.name ?? null} />;
}
