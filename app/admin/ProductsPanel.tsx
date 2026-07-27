"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Trash2, Package, ImageOff, Eye, EyeOff } from "lucide-react";
import type { Category, Product } from "@/lib/db";

export default function ProductsPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [productsRes, categoriesRes] = await Promise.all([
      fetch("/api/admin/products"),
      fetch("/api/admin/categories"),
    ]);
    const productsData = await productsRes.json();
    const categoriesData = await categoriesRes.json();
    setProducts(productsData.products ?? []);
    setCategories(categoriesData.categories ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDeleteProduct(product: Product) {
    if (!confirm(`"${product.name}" ürünü kalıcı olarak silinsin mi?`)) return;
    const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    }
  }

  async function toggleActive(product: Product) {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !product.active }),
    });
    if (res.ok) {
      const data = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === product.id ? data.product : p)));
    }
  }

  function categoryName(id: string | null) {
    if (!id) return "Kategorisiz";
    return categories.find((c) => c.id === id)?.name ?? "Kategorisiz";
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package size={18} className="text-[#B87332]" />
          <h2 className="text-sm font-medium text-gray-700">
            Ürünler {!loading && <span className="text-gray-400">({products.length})</span>}
          </h2>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 rounded-md bg-[#1A1A1A] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black"
        >
          <Plus size={16} /> Yeni Ürün Ekle
        </Link>
      </div>

      <p className="mb-6 text-xs text-gray-400">
        Buradan eklenen ürünler, sitedeki <strong>/products</strong> listesinde ve kendi <strong>/products/[slug]</strong> sayfasında otomatik olarak görünür. "positron" örnek ürünü sabittir ve buradan yönetilmez.
      </p>

      {loading ? (
        <p className="py-10 text-center text-sm text-gray-400">Yükleniyor...</p>
      ) : products.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
          <Package size={28} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm text-gray-400">Henüz ürün eklenmedi.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="absolute right-3 top-3 z-20 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => toggleActive(product)}
                  className={`rounded-full p-2 shadow-md ${product.active ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"}`}
                  title={product.active ? "Yayından Kaldır (Gizle)" : "Yayına Al"}
                >
                  {product.active ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="rounded-full border border-gray-100 bg-white p-2 text-gray-700 shadow-md hover:text-[#B87332]"
                  title="Düzenle"
                >
                  <Pencil size={14} />
                </Link>
                <button
                  onClick={() => handleDeleteProduct(product)}
                  className="rounded-full bg-red-600 p-2 text-white shadow-md hover:bg-red-700"
                  title="Sil"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="relative flex h-44 w-full items-center justify-center overflow-hidden border-b border-gray-100 bg-gray-50">
                {product.images[0] ? (
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover object-center" />
                ) : (
                  <ImageOff size={28} className="text-gray-300" />
                )}
                <div className={`absolute left-3 top-3 ${product.active ? "bg-[#3A3A3A]" : "bg-gray-500"} z-10 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white`}>
                  {categoryName(product.categoryId)}
                </div>
                {!product.active && <span className="absolute bottom-3 left-3 rounded bg-gray-700 px-2 py-0.5 text-[10px] text-white">Gizli</span>}
              </div>

              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#B87332]">/products/{product.slug}</span>
                  <h3 className="mb-1 text-base font-extrabold text-[#3A3A3A]">{product.name}</h3>
                  {product.subtitle && <p className="line-clamp-2 text-xs text-gray-500">{product.subtitle}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
