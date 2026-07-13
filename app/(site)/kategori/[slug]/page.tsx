import { getProducts, getCategories } from "@/lib/db";

export default async function KategoriPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;

  const products = await getProducts();
  const categories = await getCategories();

  // URL'deki slug ile eşleşen kategoriyi bul
  const category = categories.find((c) => c.slug === slug);
  
  // Bu kategoriye ait ürünleri filtrele
  const categoryProducts = products.filter((p) => p.categoryId === category?.id && p.active);

  return (
    <main className="py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      <h1 className="text-4xl font-serif italic text-center text-[#1A1A1A] mb-12">
        {category?.name || "Kategori"}
      </h1>

      {categoryProducts.length === 0 ? (
        <p className="text-center text-gray-500">Bu kategoride henüz ürün bulunmuyor.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categoryProducts.map((product) => (
            <a key={product.id} href={`/urunler/${product.slug}`} className="group border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white block">
              <div className="relative h-64 bg-gray-50 overflow-hidden">
                <img src={product.images?.[0] || "/resim1.jpg"} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <h3 className="font-medium text-lg text-gray-900 truncate">{product.name}</h3>
                <span className="font-semibold text-lg text-[#1A1A1A]">{product.price} TL</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}