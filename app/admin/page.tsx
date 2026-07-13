"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/db";
import { LogOut, ExternalLink } from "lucide-react";
import ProductsPanel from "./ProductsPanel";
import CategoriesPanel from "./CategoriesPanel";

type Tab = "products" | "categories";

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("products");
  const [categories, setCategories] = useState<Category[]>([]);

  async function loadCategories() {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data.categories ?? []);
  }

  useEffect(() => {
    loadCategories();
  }, [tab]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif italic text-xl text-[#1A1A1A]">Yönetim Paneli</h1>
            <p className="text-xs text-gray-400">Ürünleri ve kategorileri yönetin</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#1A1A1A] transition-colors"
            >
              Siteyi Görüntüle <ExternalLink size={13} />
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-medium border border-gray-300 rounded-md px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <LogOut size={13} /> Çıkış Yap
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-5 flex gap-1">
          <button
            onClick={() => setTab("products")}
            className={`text-sm font-medium px-4 py-2.5 border-b-2 transition-colors ${
              tab === "products"
                ? "border-[#1A1A1A] text-[#1A1A1A]"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Ürünler
          </button>
          <button
            onClick={() => setTab("categories")}
            className={`text-sm font-medium px-4 py-2.5 border-b-2 transition-colors ${
              tab === "categories"
                ? "border-[#1A1A1A] text-[#1A1A1A]"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Kategoriler
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-6">
        {tab === "products" ? (
          <ProductsPanel categories={categories} />
        ) : (
          <CategoriesPanel />
        )}
      </main>
    </div>
  );
}
