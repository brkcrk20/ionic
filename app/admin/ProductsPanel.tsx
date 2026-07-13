"use client";

import { useEffect, useMemo, useState } from "react";
import type { Category, Product } from "@/lib/db";
import { Pencil, Trash2, Plus, ImageOff, Package } from "lucide-react";
import ProductModal from "./ProductModal";

export default function ProductsPanel({ categories }: { categories: Category[] }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data.products ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const categoryName = (id: string | null) =>
    categories.find((c) => c.id === id)?.name ?? "—";

  const visibleProducts = useMemo(
    () =>
      categoryFilter ? products.filter((p) => p.categoryId === categoryFilter) : products,
    [products, categoryFilter]
  );

  function openNew() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setModalOpen(true);
  }

  async function handleDelete(product: Product) {
    if (!confirm(`"${product.name}" silinsin mi? Bu işlem geri alınamaz.`)) return;
    await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    await load();
  }

  async function toggleActive(product: Product) {
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !product.active }),
    });
    await load();
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Package size={16} className="text-gray-500" />
          <h2 className="text-sm font-medium text-gray-700">
            Ürünler {!loading && <span className="text-gray-400">({visibleProducts.length})</span>}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            onClick={openNew}
            className="flex items-center gap-1.5 bg-[#1A1A1A] text-white text-xs font-medium rounded-md px-3 py-1.5 hover:bg-black transition-colors"
          >
            <Plus size={14} /> Yeni Ürün
          </button>
        </div>
      </div>

      {loading ? (
        <p className="p-6 text-sm text-gray-400">Yükleniyor...</p>
      ) : visibleProducts.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-sm text-gray-400 mb-3">Henüz ürün eklenmedi.</p>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-1.5 bg-[#1A1A1A] text-white text-xs font-medium rounded-md px-3 py-1.5 hover:bg-black transition-colors"
          >
            <Plus size={14} /> İlk Ürünü Ekle
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                <th className="px-5 py-2.5 font-medium">Ürün</th>
                <th className="px-5 py-2.5 font-medium">Kategori</th>
                <th className="px-5 py-2.5 font-medium">Fiyat</th>
                <th className="px-5 py-2.5 font-medium">Stok</th>
                <th className="px-5 py-2.5 font-medium">Durum</th>
                <th className="px-5 py-2.5 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibleProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt=""
                          className="w-10 h-10 rounded-md object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-md border border-gray-200 flex items-center justify-center text-gray-300">
                          <ImageOff size={16} />
                        </div>
                      )}
                      <span className="font-medium text-[#1A1A1A]">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{categoryName(product.categoryId)}</td>
                  <td className="px-5 py-3 text-gray-600">
                    {product.price.toLocaleString("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    })}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{product.stock}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleActive(product)}
                      className={`text-xs font-medium px-2 py-1 rounded-full transition-colors ${
                        product.active
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {product.active ? "Yayında" : "Gizli"}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-1.5 text-gray-400 hover:text-[#1A1A1A] transition-colors"
                        aria-label="Düzenle"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                        aria-label="Sil"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <ProductModal
          categories={categories}
          product={editing}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            load();
          }}
        />
      )}
    </div>
  );
}
