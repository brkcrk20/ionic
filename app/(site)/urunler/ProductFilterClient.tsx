"use client";

import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";

type Specs = { label: string; value: string; unit?: string };

type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  images?: string[];
  active: boolean;
  categoryId?: string;
  specs?: Specs[];
};

type Category = {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
};

export default function ProductFilterClient({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const [appliedCategory, setAppliedCategory] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const handleFilter = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAppliedCategory(selectedCategory);
    setAppliedSearch(searchQuery);
  };

  // Kategori Ağacı Mantığı: Seçilen kategori ana kategori ise, alt kategorilerinin de ID'lerini bulur.
  const getSubCategoryIds = (catId: string): string[] => {
    const ids = [catId];
    const children = categories.filter((c) => c.parentId === catId);
    children.forEach((child) => {
      ids.push(...getSubCategoryIds(child.id));
    });
    return ids;
  };

  const filteredProducts = initialProducts
    .filter((product) => product.active)
    .filter((product) => {
      // 1. Kategori Filtresi (Alt kategorileri de kapsar)
      if (appliedCategory) {
        const validCategoryIds = getSubCategoryIds(appliedCategory);
        if (!product.categoryId || !validCategoryIds.includes(product.categoryId)) {
          return false;
        }
      }

        // 2. Arama Filtresi
        if (appliedSearch) {
          // toLowerCase yerine toLocaleLowerCase kullanıyoruz
          const query = appliedSearch.toLocaleLowerCase("tr-TR");
          const matchName = product.name.toLocaleLowerCase("tr-TR").includes(query);
          const matchDesc = product.description?.toLocaleLowerCase("tr-TR").includes(query);
          if (!matchName && !matchDesc) return false;
        }

      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "name") {
        return a.name.localeCompare(b.name, "tr-TR");
      }
      return 0;
    });

  return (
    <div className="w-full pt-22 bg-[#F3F1EC] min-h-screen">
      {/* 1. HERO BANNER */}
      <section className="relative bg-[#2A2A2A] text-white py-20 px-6 md:px-12 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-xs text-gray-400 mb-4 uppercase tracking-widest">
            <a href="/" className="hover:text-[#B87333] transition-colors">
              Anasayfa
            </a>{" "}
            &gt; <span className="text-white font-semibold">Ürünler</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-ion uppercase tracking-tight text-[#F3F1EC] mb-4">
            Ürünlerimiz
          </h1>
          <p className="text-sm md:text-base text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
            Yüksek performanslı ve yenilikçi çözümlerimizi inceleyin. İhtiyacınıza uygun ürünü bulmak için kategorileri kullanabilirsiniz.
          </p>
        </div>
      </section>

      {/* 2. FİLTRELEME BARI */}
      <section className="bg-[#3A3A3A] text-white py-6 px-6 md:px-12 shadow-md">
        <form
          onSubmit={handleFilter}
          className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full lg:w-3/4">
            {/* Kategori Seçimi */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-300 uppercase tracking-wider">
                Kategori
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#2A2A2A] border border-gray-600 rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#B87333] transition-colors cursor-pointer"
              >
                <option value="">- Tüm Kategoriler -</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.parentId ? `-- ${cat.name}` : cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Arama Kutusu */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-300 uppercase tracking-wider">
                Arama
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ürün adı veya kod yazın..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#2A2A2A] border border-gray-600 rounded-sm pl-3 pr-9 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#B87333] transition-colors"
                />
                <Search size={16} className="absolute right-3 top-2.5 text-gray-400" />
              </div>
            </div>

            {/* Sıralama */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-300 uppercase tracking-wider">
                Sıralama
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full bg-[#2A2A2A] border border-gray-600 rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#B87333] transition-colors cursor-pointer"
              >
                <option value="newest">En Yeniler</option>
                <option value="name">A'dan Z'ye</option>
              </select>
            </div>
          </div>

          {/* Filtrele Butonu */}
          <div className="w-full lg:w-auto flex justify-end">
            <button
              type="submit"
              className="w-full lg:w-auto bg-[#B87333] hover:bg-[#a3652c] text-white px-8 py-2.5 rounded-sm font-bold text-sm flex items-center justify-center gap-2 transition-colors uppercase tracking-wider cursor-pointer"
            >
              Filtrele <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </section>

      {/* 3. ÜRÜN LİSTESİ */}
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-12">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-8">
          Toplam <span className="text-[#3A3A3A] text-sm">{filteredProducts.length}</span> ürün listeleniyor
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-sm p-12 text-center text-gray-500">
            Arama kriterlerinize uygun ürün bulunamadı.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <a
                key={product.id}
                href={`/urunler/${product.slug}`}
                className="group bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-xl transition-all duration-300 block flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 bg-[#F8F8F8] overflow-hidden p-6 flex items-center justify-center border-b border-gray-100">
                    <img
                      src={product.images?.[0] || "/resim1.jpg"}
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-base text-[#3A3A3A] truncate group-hover:text-[#B87333] transition-colors uppercase">
                      {product.name}
                    </h3>

                    {product.description && (
                      <p className="text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    )}

                    {product.specs && product.specs.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-400 font-mono truncate">
                        {product.specs
                          .slice(0, 2)
                          .map((s) => `${s.label}: ${s.value}${s.unit ? ` ${s.unit}` : ""}`)
                          .join(" · ")}
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 flex items-center gap-1 text-xs font-bold text-[#B87333] group-hover:translate-x-1 transition-transform uppercase tracking-wider">
                  Detayları İncele <ArrowRight size={14} />
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}