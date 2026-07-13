import { getProducts } from "@/lib/db";

// Yeni sürümlerde params bir Promise olduğu için await ile beklememiz gerekiyor
export default async function UrunDetayPage(props: { params: Promise<{ slug: string }> }) {
  // Adres çubuğundaki ürün adını güvenli bir şekilde alıyoruz
  const params = await props.params;
  const slug = params.slug;
  
  // Tüm ürünleri çekip, adres çubuğundaki isme sahip olanı buluyoruz
  const products = await getProducts();
  const product = products.find((p) => p.slug === slug);

  // Eğer ürün veritabanında bulunamazsa 404 yerine kendi hata mesajımızı gösterelim
  if (!product) {
    return (
      <div className="py-32 text-center px-4">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Ürün Bulunamadı!</h1>
        <p className="text-gray-600 text-lg">Aradığınız adres: <b className="text-black">{slug}</b></p>
        <a href="/urunler" className="mt-8 inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors">
          Ürünlere Geri Dön
        </a>
      </div>
    );
  }

  return (
    <main className="py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
      {/* Sol Taraf: Ürün Görseli */}
      <div className="w-full md:w-1/2">
        <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 aspect-square relative">
          <img 
            src={product.images?.[0] || "/resim1.jpg"} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Sağ Taraf: Ürün Bilgileri */}
      <div className="w-full md:w-1/2 flex flex-col pt-4 md:pt-10">
        <h1 className="text-3xl md:text-4xl font-serif italic text-[#1A1A1A] mb-4">
          {product.name}
        </h1>
        
        <div className="text-2xl font-semibold text-gray-900 mb-6">
          {product.price} TL
        </div>

        {/* Stok Durumu */}
        {product.stock > 0 ? (
          <div className="inline-block bg-green-50 text-green-700 font-medium px-4 py-1.5 rounded-full text-sm mb-8 w-max">
            Stokta: {product.stock} adet
          </div>
        ) : (
          <div className="inline-block bg-red-50 text-red-700 font-medium px-4 py-1.5 rounded-full text-sm mb-8 w-max">
            Tükendi
          </div>
        )}

        {/* Ürün Açıklaması */}
        <div className="text-gray-600 mb-10 leading-relaxed whitespace-pre-wrap">
          {product.description}
        </div>

        {/* Sepete Ekle Butonu */}
        <button 
          disabled={product.stock === 0}
          className="bg-[#1A1A1A] text-white px-8 py-4 rounded-md font-medium tracking-wide hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {product.stock > 0 ? "SEPETE EKLE" : "STOKTA YOK"}
        </button>
      </div>
    </main>
  );
}