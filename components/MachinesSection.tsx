// components/MachinesSection.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

// Görsel ve slug bilgisi dilden bağımsızdır; isim/kategori metinleri i18n'den gelir.
const PRODUCT_META = [
  { id: "resin", key: "resin", image: "/resin-line.jpg" },
  { id: "cnc", key: "cnc", image: "/cnc-bridge-saw.jpg" },
  { id: "waterjet", key: "waterjet", image: "/waterjet.jpg" },
  { id: "tile", key: "tile", image: "/tile-line.jpg" },
  { id: "handling", key: "handling", image: "/automation.jpg" },
  { id: "custom", key: "custom", image: "/custom-machine.jpg" },
] as const;

export default function MachinesSection() {
  const { t } = useLanguage();
  const items = t.home.machines.items;
  const [activeId, setActiveId] = useState<(typeof PRODUCT_META)[number]["id"]>(PRODUCT_META[0].id);

  const activeMeta = PRODUCT_META.find((p) => p.id === activeId)!;
  const activeText = items[activeMeta.key];

  return (
    <section className="w-full h-screen snap-start shrink-0 bg-[#3A3A3A] flex flex-col justify-center items-center py-20 px-6 relative overflow-hidden">
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
              href="/urunler"
              className="inline-block bg-transparent border-2 border-[#B87332] text-[#B87332] hover:bg-[#B87332] hover:text-[#F3F1EC] font-bold tracking-wider uppercase text-xs px-6 py-3 rounded-full transition-colors duration-300"
            >
              {t.home.machines.cta}
            </Link>
          </div>
        </div>

        {/* SAĞ: Aktif Kategori Görseli */}
        <div className="lg:col-span-8 h-[50vh] lg:h-[75vh] w-full relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
          <Image
            src={activeMeta.image}
            alt={activeText.name}
            fill
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 66vw"
          />
          {/* Görsel Altı Bilgi Kartı */}
          <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 bg-[#3A3A3A]/90 backdrop-blur-md p-6 rounded-xl border border-white/10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
            <div>
              <span className="text-[#B87332] text-xs font-bold uppercase tracking-widest">{activeText.category}</span>
              <h3 className="text-[#F3F1EC] text-xl font-bold mt-1">{activeText.name}</h3>
            </div>
            <Link
              href={`/kategori/${activeMeta.id}`}
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
