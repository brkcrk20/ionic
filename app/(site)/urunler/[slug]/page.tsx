import { getProducts, getCategories, getSettings } from "@/lib/db";
import ProductGallery from "./ProductGallery";

export default async function UrunDetayPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;

  const [products, categories, settings] = await Promise.all([
    getProducts(),
    getCategories(),
    getSettings(),
  ]);
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="py-32 text-center px-4">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Ürün Bulunamadı!</h1>
        <p className="text-gray-600 text-lg">
          Aradığınız adres: <b className="text-black">{slug}</b>
        </p>
        <a
          href="/urunler"
          className="mt-8 inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
        >
          Ürünlere Geri Dön
        </a>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.categoryId);
  const images = product.images.length > 0 ? product.images : ["/resim1.jpg"];

  return (
    <main className="py-16 md:py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-400 mb-8 flex items-center gap-2 flex-wrap">
        <a href="/" className="hover:text-black transition-colors">Anasayfa</a>
        <span>/</span>
        <a href="/urunler" className="hover:text-black transition-colors">Ürünler</a>
        {category && (
          <>
            <span>/</span>
            <a href={`/kategori/${category.slug}`} className="hover:text-black transition-colors">
              {category.name}
            </a>
          </>
        )}
        <span>/</span>
        <span className="text-gray-600">{product.name}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
        {/* Sol Taraf: Görsel Galerisi */}
        <div className="w-full md:w-1/2">
          <ProductGallery images={images} name={product.name} />
        </div>

        {/* Sağ Taraf: Ürün Bilgileri */}
        <div className="w-full md:w-1/2 flex flex-col pt-2 md:pt-4">
          {category && (
            <a
              href={`/kategori/${category.slug}`}
              className="text-xs font-medium tracking-widest text-gray-400 hover:text-black transition-colors mb-3"
            >
              {category.name.toLocaleUpperCase("tr-TR")}
            </a>
          )}

          <h1 className="text-3xl md:text-4xl font-ion tracking-wide text-[#3A3A3A] mb-6">
            {product.name.toLocaleUpperCase("tr-TR")}
          </h1>

          {product.description && (
            <div className="text-gray-600 mb-8 leading-relaxed whitespace-pre-wrap">
              {product.description}
            </div>
          )}

          {product.specs.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold tracking-wide text-gray-500 mb-3">
                TEKNİK ÖZELLİKLER
              </h2>
              <dl className="border-t border-gray-100">
                {product.specs.map((spec, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-2 gap-4 py-3 border-b border-gray-100 text-sm"
                  >
                    <dt className="text-gray-500">{spec.label}</dt>
                    <dd className="text-[#3A3A3A] font-medium">
                      {spec.value}
                      {spec.unit ? ` ${spec.unit}` : ""}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <a
            href={
              settings.email
                ? `mailto:${settings.email}?subject=${encodeURIComponent(
                    `${product.name} hakkında bilgi almak istiyorum`
                  )}`
                : settings.phone
                ? `tel:${settings.phone}`
                : "/urunler"
            }
            className="inline-block text-center bg-[#B87333] text-white px-8 py-4 rounded-md font-medium tracking-wide hover:bg-[#a3652c] transition-colors w-max"
          >
            BİLGİ VE TEKLİF ALIN
          </a>
        </div>
      </div>
    </main>
  );
}
