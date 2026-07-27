"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { Search, Filter, ChevronDown, ArrowRight } from "lucide-react";

// Örnek Ürün Veri Yapısı (Görsel yolu 'image' alanına eklendi)
const STATIC_PRODUCTS_DATA = [
  {
    id: "static-positron",
    name: "POSITRON 60",
    code: "POSITRON",
    category: "Fırın Kule",
    image: "/Positron_3.jpg", // Görselin public klasöründeki yolu
    slug: "positron",
  },
];

export default function ProductsPageClient({ dbProducts }: { dbProducts: { id: string; name: string; code: string; category: string; image: string; slug: string }[] }) {
  const { lang, t } = useLanguage();
  const isTr = lang === "TR";

  // Sekme Kontrolü: "filter" veya "search"
  const [activeTab, setActiveTab] = useState<"filter" | "search">("filter");

  // Filtreleme State'leri
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedProcessing, setSelectedProcessing] = useState("");
  const [selectedShape, setSelectedShape] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Positron her zaman görünür; DB'deki ürünler bunun üstüne eklenir.
  const merged = [
    ...STATIC_PRODUCTS_DATA,
    ...dbProducts,
  ];
  const seen = new Set<string>();
  const PRODUCTS_DATA = merged.filter((product) => {
    if (seen.has(product.slug)) return false;
    seen.add(product.slug);
    return true;
  });

  return (
    <div className="w-full min-h-screen bg-white pt-16 xl:pt-22 font-montserrat">
      
      {/* 1. ÜST HERO & FİLTRELEME ALANI (Ion Meccanica Renkleri ile) */}
      <div className="w-full bg-[#3A3A3A] text-[#F3F1EC] py-16 px-6 relative overflow-hidden">
        
        {/* Arka plan hafif doku/gölge */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col items-center text-center">
          
          {/* Breadcrumb */}
          <div className="text-xs uppercase tracking-widest text-[#F3F1EC]/60 mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-[#B87332] transition-colors">
              {isTr ? "Anasayfa" : "Homepage"}
            </Link>
            <span>/</span>
            <span className="text-[#B87332] font-bold">
              {isTr ? "Ürünler" : "Products"}
            </span>
          </div>

          {/* Ana Başlık */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-[#F3F1EC]">
            {isTr ? "Ürünler" : "Products"}
          </h1>
          <p className="text-lg md:text-xl text-[#F3F1EC]/80 font-medium mb-8">
            {isTr 
              ? "Doğal taş ve alternatif malzemelerin işlenmesi için ileri düzey sistemler." 
              : "Natural stone and alternative materials processing."}
          </p>
          <p className="text-sm text-[#F3F1EC]/60 max-w-2xl leading-relaxed mb-10">
            {isTr
              ? "Her müşterinin talebini karşılamak üzere tasarlanmış son teknoloji tesisler ve makineler üretiyoruz. Sürekli Ar-Ge yatırımlarımızla sektöre yenilikçi çözümler sunuyoruz."
              : "We make state-of-the-art plants and machinery, designed to always meet the demands of each customer. Our product range is the result of continuous investment in research and development."}
          </p>

          {/* Sekme Seçici (Filter by products / Search by name) */}
          <div className="flex items-center gap-8 border-b border-white/10 pb-4 mb-8 text-sm md:text-base font-bold tracking-wider uppercase">
            <button
              onClick={() => setActiveTab("filter")}
              className={`cursor-pointer pb-1 transition-all flex items-center gap-2 ${
                activeTab === "filter" 
                  ? "text-[#B87332] border-b-2 border-[#B87332]" 
                  : "text-[#F3F1EC]/60 hover:text-[#F3F1EC]"
              }`}
            >
              <Filter size={18} />
              {isTr ? "Ürünlere Göre Filtrele" : "Filter by products"}
            </button>
            <button
              onClick={() => setActiveTab("search")}
              className={`cursor-pointer pb-1 transition-all flex items-center gap-2 ${
                activeTab === "search" 
                  ? "text-[#B87332] border-b-2 border-[#B87332]" 
                  : "text-[#F3F1EC]/60 hover:text-[#F3F1EC]"
              }`}
            >
              <Search size={18} />
              {isTr ? "Makine Adı veya Kodu ile Ara" : "Search by machine name or code"}
            </button>
          </div>

        </div>
      </div>

      {/* 2. ORTA FİLTRE / ARAMA ÇUBUĞU (İkonik Sarı Şerit - #B87332 Bronz/Bakır Vurgulu) */}
      <div className="w-full bg-[#B87332] py-6 px-6 shadow-xl relative z-20">
        <div className="max-w-[1400px] mx-auto">
          
          {activeTab === "filter" ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              
              {/* Malzeme Seçimi */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-white">
                  {isTr ? "Malzemeler" : "Materials"}
                </label>
                <div className="relative">
                  <select 
                    value={selectedMaterial} 
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    className="w-full bg-white text-gray-800 text-sm font-medium py-3 px-4 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3A3A3A]"
                  >
                    <option value="">- {isTr ? "Seçiniz" : "Select"} -</option>
                    <option value="marble">{isTr ? "Mermer" : "Marble"}</option>
                    <option value="granite">{isTr ? "Granit" : "Granite"}</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>

              {/* İşlem Türü */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-white">
                  {isTr ? "İşlem Türü" : "Type of processing"}
                </label>
                <div className="relative">
                  <select 
                    value={selectedProcessing} 
                    onChange={(e) => setSelectedProcessing(e.target.value)}
                    className="w-full bg-white text-gray-800 text-sm font-medium py-3 px-4 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3A3A3A]"
                  >
                    <option value="">- {isTr ? "Seçiniz" : "Select"} -</option>
                    <option value="cutting">{isTr ? "Kesim" : "Cutting"}</option>
                    <option value="polishing">{isTr ? "Cilalama" : "Polishing"}</option>
                    <option value="resining">{isTr ? "Reçineleme" : "Resining"}</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>

              {/* Malzeme Şekli */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-white">
                  {isTr ? "Malzeme Şekli" : "Material shape"}
                </label>
                <div className="relative">
                  <select 
                    value={selectedShape} 
                    onChange={(e) => setSelectedShape(e.target.value)}
                    className="w-full bg-white text-gray-800 text-sm font-medium py-3 px-4 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3A3A3A]"
                  >
                    <option value="">- {isTr ? "Seçiniz" : "Select"} -</option>
                    <option value="slab">{isTr ? "Plaka (Slab)" : "Slab"}</option>
                    <option value="tile">{isTr ? "Fayans (Tile)" : "Tile"}</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>

              {/* Uygula Butonu */}
              <div className="flex items-end h-full pt-5">
                <button 
                  onClick={() => {}}
                  className="w-full bg-[#3A3A3A] hover:bg-[#2A2A2A] text-white font-bold text-sm tracking-wider uppercase py-3 px-6 rounded-lg transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{isTr ? "Uygula" : "Apply"}</span>
                  <ArrowRight size={16} />
                </button>
              </div>

            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-4 items-center max-w-2xl mx-auto">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder={isTr ? "Makine adı veya kodu girin (örn: GS220)..." : "Enter machine name or code..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-gray-800 text-sm font-medium py-3.5 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A3A3A]"
                />
              </div>
              <button 
                className="w-full md:w-auto bg-[#3A3A3A] hover:bg-[#2A2A2A] text-white font-bold text-sm tracking-wider uppercase py-3.5 px-8 rounded-lg transition-all shadow-md cursor-pointer shrink-0"
              >
                {isTr ? "Ara" : "Search"}
              </button>
            </div>
          )}

        </div>
      </div>

      {/* 3. ÜRÜN LİSTELEME ALANI */}
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        
        {/* Sonuç Sayısı */}
        <div className="mb-10">
          <p className="text-gray-500 font-semibold text-lg">
            <span className="text-[#3A3A3A] font-extrabold text-2xl mr-2">{PRODUCTS_DATA.length}</span> 
            {isTr ? "ürün bulundu" : "products found"}
          </p>
        </div>

        {/* Ürün Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS_DATA.map((product) => (
            <Link 
              key={product.id}
                    href={`/products/${product.slug}`}
              className="bg-[#F3F1EC]/50 border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col"
            >
              {/* Ürün Görsel Alanı */}
              <div className="relative h-56 sm:h-64 md:h-72 w-full bg-white flex items-center justify-center p-6 overflow-hidden border-b border-gray-100">
                <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500 w-full h-full">
                  <Image 
                    src={product.image} 
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center"
                  />
                </div>
                {/* Kategori Etiketi */}
                <div className="absolute top-4 left-4 bg-[#3A3A3A] text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full z-10">
                  {product.category}
                </div>
              </div>

              {/* Ürün Bilgileri */}
              <div className="p-8 flex flex-col flex-1 justify-between bg-white">
                <div>
                  <span className="text-xs font-bold text-[#B87332] tracking-wider uppercase block mb-1">
                    {product.code}
                  </span>
                  <h3 className="text-[#3A3A3A] text-xl font-extrabold group-hover:text-[#B87332] transition-colors mb-3">
                    {product.name}
                  </h3>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#3A3A3A] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    {isTr ? "Ürünü İncele" : "View Product"} <ArrowRight size={16} className="text-[#B87332]" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>

    </div>
  );
}