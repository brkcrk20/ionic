import HeroSlider from "@/components/HeroSlider";

export default function Home() {
  return (
    <main className="w-full">
      {/* Navbar'ı buradan sildik (eğer layout.tsx içinde varsa) */}
      
      {/* Slider artık Navbar'ın hemen altına gelecek şekilde tasarlandı */}
      <div className="mt-0"> 
        <HeroSlider />
      </div>

      {/* İçerik Bölümü */}
      <section className="py-14 md:py-20 px-4 sm:px-6 lg:px-12">
        <h2 className="text-center font-serif italic text-3xl md:text-4xl text-[#1A1A1A] mb-10 md:mb-14">
          Koleksiyonlar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="relative h-64 md:h-72 overflow-hidden group cursor-pointer">
            <img
              src="/resim1.jpg"
              alt="Koleksiyon 1"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="relative h-64 md:h-72 overflow-hidden group cursor-pointer">
            <img
              src="/resim2.jpg"
              alt="Koleksiyon 2"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="relative h-64 md:h-72 overflow-hidden group cursor-pointer">
            <img
              src="/resim3.jpg"
              alt="Koleksiyon 3"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </section>
    </main>
  );
}