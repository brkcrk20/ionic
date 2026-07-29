"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { Search, Filter, ChevronDown, ArrowRight } from "lucide-react";
import type { Category } from "@/lib/db";

function getLangText(val: any, lang: "tr" | "en" = "tr"): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return lang === "tr" ? (val.tr || val.en || "") : (val.en || val.tr || "");
}

// Bir kategorinin kendisi dahil tüm alt/torun kategori id'lerini (sınırsız derinlik) döndürür
function getDescendantAndSelfIds(categories: Category[], rootId: string): Set<string> {
  const result = new Set<string>([rootId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const c of categories) {
      if (c.parentId && result.has(c.parentId) && !result.has(c.id)) {
        result.add(c.id);
        changed = true;
      }
    }
  }
  return result;
}

// Kategori seçim listesi için ağacı derinlik bilgisiyle düz bir listeye çevirir (öbek/nested optgroup desteklenmediği için)
function flattenCategoryOptions(
  categories: Category[],
  parentId: string | null = null,
  depth = 0
): { cat: Category; depth: number }[] {
  const result: { cat: Category; depth: number }[] = [];
  for (const c of categories.filter((x) => x.parentId === parentId)) {
    result.push({ cat: c, depth });
    result.push(...flattenCategoryOptions(categories, c.id, depth + 1));
  }
  return result;
}

export default function ProductsPageClient({ 
  dbProducts, 
  categories = [], 
  initialCategory = "" 
}: { 
  dbProducts: any[]; 
  categories?: Category[]; 
  initialCategory?: string; 
}) {
  const { lang } = useLanguage();
  const isTr = lang === "TR";

  const [activeTab, setActiveTab] = useState<"filter" | "search">("filter");
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");

  const seen = new Set<string>();
  const PRODUCTS_DATA = dbProducts.filter((product) => {
    if (seen.has(product.slug)) return false;
    seen.add(product.slug);
    return true;
  });

  // Kategori Filtreleme Mantığı (Hiyerarşik: herhangi bir seviyedeki kategori seçilirse, altındaki tüm alt/torun kategorilerin ürünleri de gelir)
  const filteredProducts = PRODUCTS_DATA.filter((product) => {
    if (!selectedCategorySlug || selectedCategorySlug === "all") {
      return true;
    }

    // Seçilen slug'a ait kategoriyi bul
    const targetCategory = categories.find((c) => c.slug === selectedCategorySlug);
    if (!targetCategory) return product.categorySlug === selectedCategorySlug;

    // Seçilen kategorinin kendisi ve altındaki tüm seviyelerin id'lerini al
    const allowedIds = getDescendantAndSelfIds(categories, targetCategory.id);

    return (
      allowedIds.has(product.categoryId) ||
      product.categorySlug === selectedCategorySlug
    );
  }).filter((product) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return product.name.toLowerCase().includes(query) || product.code.toLowerCase().includes(query);
  });

  return (
    <div className="w-full min-h-screen bg-white pt-16 xl:pt-22 font-montserrat">
      
      {/* 1. ÜST HERO ALANI */}
      <div className="w-full bg-[#3A3A3A] text-[#F3F1EC] py-16 px-6 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col items-center text-center">
          
          <div className="text-xs uppercase tracking-widest text-[#F3F1EC]/60 mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-[#B87332] transition-colors">
              {isTr ? "Anasayfa" : "Homepage"}
            </Link>
            <span>/</span>
            <span className="text-[#B87332] font-bold">
              {isTr ? "Ürünler" : "Products"}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-[#F3F1EC]">
            {isTr ? "Ürünler" : "Products"}
          </h1>
          <p className="text-lg md:text-xl text-[#F3F1EC]/80 font-medium mb-8">
            {isTr 
              ? "Doğal taş ve alternatif malzemelerin işlenmesi için ileri düzey sistemler." 
              : "Natural stone and alternative materials processing."}
          </p>

          <div className="flex items-center gap-8 border-b border-white/10 pb-4 mb-8 text-sm md:text-base font-bold tracking-wider uppercase">
            <button
              onClick={() => setActiveTab("filter")}
              className={`cursor-pointer pb-1 transition-all flex items-center gap-2 ${
                activeTab === "filter" ? "text-[#B87332] border-b-2 border-[#B87332]" : "text-[#F3F1EC]/60 hover:text-[#F3F1EC]"
              }`}
            >
              <Filter size={18} />
              {isTr ? "Ürünlere Göre Filtrele" : "Filter by products"}
            </button>
            <button
              onClick={() => setActiveTab("search")}
              className={`cursor-pointer pb-1 transition-all flex items-center gap-2 ${
                activeTab === "search" ? "text-[#B87332] border-b-2 border-[#B87332]" : "text-[#F3F1EC]/60 hover:text-[#F3F1EC]"
              }`}
            >
              <Search size={18} />
              {isTr ? "Makine Adı veya Kodu ile Ara" : "Search by machine name or code"}
            </button>
          </div>

        </div>
      </div>

      {/* 2. ARAMA / FİLTRE ŞERİDİ */}
      <div className="w-full bg-[#B87332] py-6 px-6 shadow-xl relative z-20">
        <div className="max-w-[1400px] mx-auto">
          {activeTab === "search" ? (
            <div className="flex flex-col md:flex-row gap-4 items-center max-w-2xl mx-auto">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder={isTr ? "Makine adı veya kodu girin (örn: POSITRON)..." : "Enter machine name or code..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-gray-800 text-sm font-medium py-3.5 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A3A3A]"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <div className="relative w-full md:max-w-sm">
                <select
                  value={selectedCategorySlug || "all"}
                  onChange={(e) => setSelectedCategorySlug(e.target.value === "all" ? "" : e.target.value)}
                  className="w-full appearance-none bg-white text-gray-800 text-sm font-semibold py-3.5 pl-5 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A3A3A] cursor-pointer"
                >
                  <option value="all">{isTr ? "Tüm Kategoriler" : "All Categories"}</option>
                  {flattenCategoryOptions(categories).map(({ cat, depth }) => (
                    <option key={cat.id} value={cat.slug}>
                      {"— ".repeat(depth)}
                      {getLangText(cat.name, isTr ? "tr" : "en")}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>

              {selectedCategorySlug && selectedCategorySlug !== "all" && (
                <button 
                  onClick={() => setSelectedCategorySlug("")}
                  className="shrink-0 text-white text-xs font-semibold underline hover:text-gray-200 cursor-pointer"
                >
                  {isTr ? "Filtreyi Temizle" : "Clear Filter"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. ÜRÜN LİSTELEME */}
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="text-gray-500 font-semibold text-lg">
            <span className="text-[#3A3A3A] font-extrabold text-2xl mr-2">{filteredProducts.length}</span> 
            {isTr ? "ürün bulundu" : "products found"}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            {isTr ? "Bu kriterlere uygun ürün bulunamadı." : "No products found matching these criteria."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Link 
                key={product.id}
                href={`/products/${product.slug}`}
                className="bg-[#F3F1EC]/50 border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col"
              >
                <div className="relative h-40 sm:h-48 md:h-52 w-full bg-white flex items-center justify-center p-6 overflow-hidden border-b border-gray-100">
                  <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500 w-full h-full">
                    <Image 
                      src={product.image} 
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="absolute top-4 left-4 bg-[#3A3A3A] text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full z-10">
                    {product.category}
                  </div>
                </div>

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
        )}
      </div>

    </div>
  );
}