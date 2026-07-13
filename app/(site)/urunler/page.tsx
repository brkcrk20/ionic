import { getProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function UrunlerPage() {
  const products = await getProducts();
  const activeProducts = products.filter((p) => p.active);

  return (
    <main className="py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      <h1 className="text-4xl font-serif italic text-center text-[#1A1A1A] mb-12">
        Tüm Ürünlerimiz
      </h1>
      
      {activeProducts.length === 0 ? (
        <p className="text-center text-gray-500">
          Şu an gösterilecek bir ürün bulunmuyor. Yönetim panelinden ürün ekleyebilirsiniz.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {activeProducts.map((product) => (
            <a 
              key={product.id} 
              href={`/urunler/${product.slug}`} 
              className="group border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white block"
            >
              
              {/* Ürün Görseli */}
              <div className="relative h-64 bg-gray-50 overflow-hidden">
                <img 
                  src={product.images?.[0] || "/resim1.jpg"} 
                  alt={product.name}
                  className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              
              {/* Ürün Bilgileri */}
              <div className="p-5">
                <h3 className="font-medium text-lg text-gray-900 truncate">
                  {product.name}
                </h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                  {product.description}
                </p>

                {product.specs.length > 0 && (
                  <p className="mt-3 text-xs text-gray-400 truncate">
                    {product.specs
                      .slice(0, 2)
                      .map((s) => `${s.label}: ${s.value}${s.unit ? ` ${s.unit}` : ""}`)
                      .join(" · ")}
                  </p>
                )}
              </div>
              
            </a>
          ))}
        </div>
      )}
    </main>
  );
}