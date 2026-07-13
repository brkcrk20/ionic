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
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-semibold text-lg text-[#1A1A1A]">
                    {product.price} TL
                  </span>
                  
                  {/* Stok Durumu */}
                  {product.stock > 0 ? (
                    <span className="text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                      Stokta
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
                      Tükendi
                    </span>
                  )}
                </div>
              </div>
              
            </a>
          ))}
        </div>
      )}
    </main>
  );
}