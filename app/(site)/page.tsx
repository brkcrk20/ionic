import HeroVideo from "@/components/HeroVideo";
import { getCategories, getSlider } from "@/lib/db";

export const dynamic = "force-dynamic";

const FALLBACK_IMAGES = ["/resim1.jpg", "/resim2.jpg", "/resim3.jpg"];

export default async function Home() {
  const [categories, slider] = await Promise.all([getCategories(), getSlider()]);
  const topLevel = categories.filter((c) => !c.parentId);
  const withImages = topLevel.filter((c) => c.image);

  // Admin panelinden görsel eklenmiş kategori yoksa, tanıtım amaçlı örnek görseller gösterilir
  const collections =
    withImages.length > 0
      ? withImages
      : FALLBACK_IMAGES.map((src, i) => ({
          id: `fallback-${i}`,
          name: `Koleksiyon ${i + 1}`,
          image: src,
        }));

  return (
    <main className="w-full">
      <div className="mt-0">
        <HeroVideo />
      </div>

      <section className="py-14 md:py-20 px-4 sm:px-6 lg:px-12">
        <h2 className="text-center font-ion tracking-wide text-3xl md:text-4xl text-[#3A3A3A] mb-10 md:mb-14">
          KOLEKSİYONLAR
        </h2>

        {topLevel.length === 0 ? (
          <p className="text-center text-sm text-gray-400">
            Kategoriler admin panelinden eklendiğinde burada listelenecek.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {collections.map((item) => (
              <div key={item.id} className="relative h-64 md:h-72 overflow-hidden group cursor-pointer">
                <img
                  src={item.image ?? "/resim1.jpg"}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors flex items-end">
                  <span className="text-white font-ion tracking-wide text-lg px-5 py-4">{item.name.toLocaleUpperCase("tr-TR")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}