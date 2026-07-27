import { getProducts, getCategories, MultiLangString } from "@/lib/db";

// Çoklu dili güvenli bir şekilde string'e çeviren yardımcı fonksiyon
function getLangText(val: MultiLangString | undefined, lang: "tr" | "en" = "tr"): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return lang === "tr" ? (val.tr || val.en || "") : (val.en || val.tr || "");
}

export default async function KategoriPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;

  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  // URL'deki slug ile eşleşen kategoriyi bul
  const category = categories.find((c) => c.slug === slug);
  
  // Bu kategoriye ait ürünleri filtrele
  const categoryProducts = products.filter((p) => p.categoryId === category?.id && p.active);

  // Kategori adını string'e çevir
  const categoryNameStr = getLangText(category?.name, "tr") || "Kategori";

  return (
    <main className="py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      <h1 className="text-4xl font-ion tracking-wide text-center text-[#3A3A3A] mb-12">
        {categoryNameStr.toLocaleUpperCase("tr-TR")}
      </h1>

      {categoryProducts.length === 0 ? (
        <p className="text-center text-gray-500">Bu kategoride henüz ürün bulunmuyor.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categoryProducts.map((product) => {
            const productNameStr = getLangText(product.name, "tr");
            const productDescStr = getLangText(product.subtitle || product.heroDescription, "tr");

            return (
              <a key={product.id} href={`/products/${product.slug}`} className="group border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white block">
                <div className="relative h-48 sm:h-64 bg-gray-50 overflow-hidden">
                  <img src={product.images?.[0] || "/resim1.jpg"} alt={productNameStr} className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <h3 className="font-medium text-lg text-gray-900 truncate">{productNameStr}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{productDescStr}</p>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </main>
  );
}