// components/MachinesSection.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

type ProductMetaItem = {
  id: string;
  key: "resin" | "cnc" | "waterjet" | "tile";
  categorySlug: string;
  images: string[];
};

const PRODUCT_META: ProductMetaItem[] = [
  { 
    id: "resin", 
    key: "resin", 
    categorySlug: "resin-lines", 
    images: ["/uploads/products/A-1 Kule Reçine Hattı.webp", "/uploads/products/d6i9hb-2-kule.webp", "/uploads/products/jdxkz0-3-kule.webp", "/uploads/products/mxglou-4-kule-a.webp", "/uploads/products/w6i6jc-5-kule-a.webp"]
  },
  { 
    id: "cnc", 
    key: "cnc", 
    categorySlug: "epoksi-uygulama", 
    images: ["/ion_graviton-combi_cover.webp", "/uploads/products/cf5hvn-ion_positron_cover.webp", "/uploads/products/ktf694-ion_buffer_cover_2.webp"] 
  },
  { id: "waterjet", key: "waterjet", categorySlug: "polishing", images: ["/ion_wax_cover.webp"] },
  { id: "tile", key: "tile", categorySlug: "yukleme-bosaltma", images: ["/ion_aranea_cover.webp" ,"/uploads/products/3k0lyl-ion_manta-l_cover.webp", "/uploads/products/tgbbkd-ion_volta_cover.webp"] },
];

export default function MachinesSection() {
  const { t } = useLanguage();
  const items = t.home.machines.items;
  
  const [activeId, setActiveId] = useState<string>(PRODUCT_META[0].id);
  const [currentImage, setCurrentImage] = useState<string>("");

  const activeMeta = PRODUCT_META.find((p) => p.id === activeId)!;
  const activeText = items[activeMeta.key];

  useEffect(() => {
    if (!activeMeta.images || activeMeta.images.length === 0) {
      setCurrentImage("");
      return;
    }

    const getRandomImage = (excludeImg?: string) => {
      const images = activeMeta.images;
      const filtered = images.length > 1 
        ? images.filter(img => img !== excludeImg) 
        : images;
      const randomIndex = Math.floor(Math.random() * filtered.length);
      return filtered[randomIndex];
    };

    setCurrentImage((prev) => getRandomImage(prev));

    if (activeMeta.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImage((prev) => getRandomImage(prev));
      }, 4500);

      return () => clearInterval(interval);
    }
  }, [activeId]);

  return (
    <section className="w-full min-h-screen md:h-screen md:snap-start shrink-0 bg-[#3A3A3A] flex flex-col justify-center items-center py-20 px-6 relative overflow-hidden">
      <div className="max-w-[1600px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 h-full items-center">

        {/* SOL: Başlık ve Kategoriler */}
        <div className="lg:col-span-4 flex flex-col justify-center h-full z-10">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-[#F3F1EC] mb-6 tracking-tight font-montserrat">
            {t.home.machines.titleLine1} <br className="hidden lg:block" />
            <span className="text-[#B87332]">{t.home.machines.titleLine2}</span>
          </h2>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-10 pr-4">
            {t.home.machines.description}
          </p>

          <div className="flex flex-col gap-2 border-l border-white/10 pl-4">
            {PRODUCT_META.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveId(item.id)}
                className={`text-left text-sm md:text-base font-bold py-3 transition-all duration-300 flex items-center justify-between group ${
                  activeId === item.id ? "text-[#B87332]" : "text-[#F3F1EC]/70 hover:text-[#F3F1EC]"
                }`}
              >
                <span>{items[item.key].name}</span>
                <ChevronRight
                  className={`w-5 h-5 transition-transform duration-300 ${
                    activeId === item.id
                      ? "translate-x-2 text-[#B87332]"
                      : "opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href="/products"
              className="inline-block bg-transparent border-2 border-[#B87332] text-[#B87332] hover:bg-[#B87332] hover:text-[#F3F1EC] font-bold tracking-wider uppercase text-xs px-6 py-3 rounded-full transition-colors duration-300"
            >
              {t.home.machines.cta}
            </Link>
          </div>
        </div>

        {/* SAĞ: Aktif Kategori Görseli */}
        <div className="lg:col-span-8 h-[50vh] lg:h-[75vh] w-full relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] group bg-[#F3F1EC] flex items-center justify-center">
          
          {currentImage && (
            <Image
              key={currentImage}
              src={currentImage}
              alt={activeText.name}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
              priority
            />
          )}

          {/* Görsel Altı Bilgi Kartı */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 lg:bottom-10 lg:left-10 lg:right-auto bg-[#3A3A3A]/90 backdrop-blur-md p-4 sm:p-6 rounded-xl border border-white/10 flex items-center justify-between gap-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0 z-20">
            <div>
              <span className="text-[#B87332] text-xs font-bold uppercase tracking-widest">{activeText.category}</span>
              <h3 className="text-[#F3F1EC] text-xl font-bold mt-1">{activeText.name}</h3>
            </div>
            <Link
              href={activeMeta.categorySlug ? `/category/${activeMeta.categorySlug}` : "/products"}
              className="w-12 h-12 rounded-full bg-[#B87332] flex items-center justify-center text-[#F3F1EC] hover:bg-[#F3F1EC] hover:text-[#3A3A3A] transition-colors shadow-lg"
            >
              <ChevronRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}