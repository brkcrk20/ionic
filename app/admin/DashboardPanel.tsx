"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, FolderTree, Eye, EyeOff, ImageIcon, ArrowRight, Plus, ImageOff } from "lucide-react";
import type { Category, Product, MultiLangString } from "@/lib/db";

function getLangText(val: MultiLangString | undefined, lang: "tr" | "en" = "tr"): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return lang === "tr" ? (val.tr || val.en || "") : (val.en || val.tr || "");
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "az önce";
  if (minutes < 60) return `${minutes} dakika önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} gün önce`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} ay önce`;
  return `${Math.floor(months / 12)} yıl önce`;
}

type Props = {
  onNavigate?: (tab: "products" | "media") => void;
};

export default function DashboardPanel({ onNavigate }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mediaCount, setMediaCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [productsRes, categoriesRes, mediaRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
        fetch("/api/admin/media"),
      ]);
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      const mediaData = await mediaRes.json().catch(() => ({ files: [] }));
      setProducts(productsData.products ?? []);
      setCategories(categoriesData.categories ?? []);
      setMediaCount(Array.isArray(mediaData.files) ? mediaData.files.length : null);
      setLoading(false);
    }
    load();
  }, []);

  const activeCount = products.filter((p) => p.active).length;
  const hiddenCount = products.length - activeCount;

  const recentProducts = [...products]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 5);

  function categoryName(id: string | null) {
    if (!id) return "Kategorisiz";
    const cat = categories.find((c) => c.id === id);
    return cat ? getLangText(cat.name) : "Kategorisiz";
  }

  const stats = [
    { label: "Toplam Ürün", value: products.length, icon: Package, color: "text-[#B87332] bg-[#B87332]/10" },
    { label: "Toplam Kategori", value: categories.length, icon: FolderTree, color: "text-blue-600 bg-blue-50" },
    { label: "Yayında", value: activeCount, icon: Eye, color: "text-green-600 bg-green-50" },
    { label: "Gizli", value: hiddenCount, icon: EyeOff, color: "text-gray-500 bg-gray-100" },
  ];

  return (
    <div className="w-full flex flex-col gap-8">
      <div>
        <h2 className="text-sm font-medium text-gray-700 mb-4">Genel Bakış</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-5 flex items-center gap-4">
              <div className={`rounded-lg p-3 ${s.color}`}>
                <s.icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#1A1A1A]">{loading ? "—" : s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
          <button
            onClick={() => onNavigate?.("media")}
            className="rounded-xl border border-gray-200 bg-white p-5 flex items-center gap-4 text-left hover:border-gray-300 transition-colors cursor-pointer"
          >
            <div className="rounded-lg p-3 text-purple-600 bg-purple-50">
              <ImageIcon size={20} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#1A1A1A]">{loading || mediaCount === null ? "—" : mediaCount}</p>
              <p className="text-xs text-gray-500">Görsel — Medya Kütüphanesi</p>
            </div>
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-gray-700">Son Eklenen Ürünler</h2>
          <button
            onClick={() => onNavigate?.("products")}
            className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-[#1A1A1A] transition-colors cursor-pointer"
          >
            Tümünü Gör <ArrowRight size={12} />
          </button>
        </div>

        {loading ? (
          <p className="py-10 text-center text-sm text-gray-400">Yükleniyor...</p>
        ) : recentProducts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center">
            <Package size={24} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm text-gray-400 mb-3">Henüz ürün eklenmedi.</p>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#1A1A1A] px-3 py-1.5 text-xs font-medium text-white hover:bg-black"
            >
              <Plus size={14} /> Yeni Ürün Ekle
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
            {recentProducts.map((p) => (
              <Link
                key={p.id}
                href={`/admin/products/${p.id}/edit`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50 flex items-center justify-center">
                  {p.images[0] ? (
                    <Image src={p.images[0]} alt={getLangText(p.name)} fill className="object-contain p-1" />
                  ) : (
                    <ImageOff size={16} className="text-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1A1A1A] truncate">{getLangText(p.name)}</p>
                  <p className="text-xs text-gray-400">{categoryName(p.categoryId)}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${p.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {p.active ? "Yayında" : "Gizli"}
                  </span>
                  <span className="text-[11px] text-gray-400">{timeAgo(p.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
