"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Category, Product } from "@/lib/db";
import { Search, Filter, ChevronDown, ArrowRight, ImageOff } from "lucide-react";

export default function ProductsListClient({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [activeTab, setActiveTab] = useState<"filter" | "search">("filter");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedCategory, setAppliedCategory] = useState("");

  const categoryName = (id: string | null) => categories.find((c) => c.id === id)?.name ?? "";

  const visibleProducts = useMemo(() => {
    if (activeTab === "search" && searchQuery.trim()) {
      const q = searchQuery.trim().toLocaleLowerCase("tr-TR");
      return products.filter((p) => p.name.toLocaleLowerCase("tr-TR").includes(q));
    }
    if (activeTab === "filter" && appliedCategory) {
      return products.filter((p) => p.categoryId === appliedCategory);
    }
    return products;
  }, [products, activeTab, searchQuery, appliedCategory]);

  return (
    <div className="w-full min-h-screen bg-white pt-16 xl:pt-22 font-montserrat">
      {/* ÜST HERO & FİLTRELEME ALANI */}
      <div className="w-full bg-[#3A3A3A] text-[#F3F1EC] py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="text-xs uppercase tracking-widest text-[#F3F1EC]/60 mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-[#B87332] transition-colors">
              Anasayfa
            </Link>
            <span>/</span>
            <span className="text-[#B87332] font-bold">Ürünler</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-[#F3F1EC]">
            Ürünler
          </h1>
          <p className="text-lg md:text-xl text-[#F3F1EC]/80 font-medium mb-8">
            Doğal taş ve alternatif malzemelerin işlenmesi için ileri düzey sistemler.
          </p>

          <div className="flex items-center gap-8 border-b border-white/10 pb-4 mb-8 text-sm md:text-base font-bold tracking-wider uppercase">
            <button
              onClick={() => setActiveTab("filter")}
              className={`cursor-pointer pb-1 transition-all flex items-center gap-2 ${
                activeTab === "filter" ? "text-[#B87332] border-b-2 border-[#B87332]" : "text-[#F3F1EC]/60 hover:text-[#F3F1EC]"
              }`}
            >
              <Filter size={18} />
              Kategoriye Göre Filtrele
            </button>
            <button
              onClick={() => setActiveTab("search")}
              className={`cursor-pointer pb-1 transition-all flex items-center gap-2 ${
                activeTab === "search" ? "text-[#B87332] border-b-2 border-[#B87332]" : "text-[#F3F1EC]/60 hover:text-[#F3F1EC]"
              }`}
            >
              <Search size={18} />
              Ürün Adı ile Ara
            </button>
          </div>
        </div>
      </div>

      {/* FİLTRE / ARAMA ÇUBUĞU */}
      <div className="w-full bg-[#B87332] py-6 px-6 shadow-xl relative z-20">
        <div className="max-w-[1400px] mx-auto">
          {activeTab === "filter" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white">Kategori</label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-white text-gray-800 text-sm font-medium py-3 px-4 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3A3A3A]"
                  >
                    <option value="">- Tüm Kategoriler -</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.parentId ? "— " : ""}
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>

              <button
                onClick={() => setAppliedCategory(selectedCategory)}
                className="w-full bg-[#3A3A3A] hover:bg-[#2A2A2A] text-white font-bold text-sm tracking-wider uppercase py-3 px-6 rounded-lg transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Uygula</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-4 items-center max-w-2xl mx-auto">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Ürün adı girin..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-gray-800 text-sm font-medium py-3.5 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A3A3A]"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ÜRÜN LİSTELEME ALANI */}
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="text-gray-500 font-semibold text-lg">
            <span className="text-[#3A3A3A] font-extrabold text-2xl mr-2">{visibleProducts.length}</span>
            ürün bulundu
          </p>
        </div>

        {visibleProducts.length === 0 ? (
          <p className="text-center text-gray-400 py-16">Bu kritere uygun ürün bulunamadı.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="bg-[#F3F1EC]/50 border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col"
              >
                <div className="relative h-56 sm:h-64 md:h-72 w-full bg-white flex items-center justify-center p-6 overflow-hidden border-b border-gray-100">
                  {product.images[0] ? (
                    <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500 w-full h-full">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center"
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-300">
                      <ImageOff size={40} />
                    </div>
                  )}
                  {categoryName(product.categoryId) && (
                    <div className="absolute top-4 left-4 bg-[#3A3A3A] text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full z-10">
                      {categoryName(product.categoryId)}
                    </div>
                  )}
                </div>

                <div className="p-8 flex flex-col flex-1 justify-between bg-white">
                  <div>
                    <h3 className="text-[#3A3A3A] text-xl font-extrabold group-hover:text-[#B87332] transition-colors mb-3">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-4">
                    <span className="text-sm font-bold text-[#3A3A3A] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Ürünü İncele <ArrowRight size={16} className="text-[#B87332]" />
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
