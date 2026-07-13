"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ExternalLink, Package, Grid, Image as ImageIcon, Settings } from "lucide-react";
import type { Category } from "@/lib/db";
import ProductsPanel from "./ProductsPanel";
import CategoriesPanel from "./CategoriesPanel";
import SliderPanel from "./SliderPanel";
import SettingsPanel from "./SettingsPanel";

type Tab = "products" | "categories" | "slider" | "settings";

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("products");
  const [categories, setCategories] = useState<Category[]>([]);

  async function loadData() {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data.categories ?? []);
    } catch (e) {
      console.error("Kategori yüklenemedi", e);
    }
  }

  useEffect(() => { loadData(); }, [tab]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const menu = [
    { id: "products", name: "Ürünler", icon: Package },
    { id: "categories", name: "Kategoriler", icon: Grid },
    { id: "slider", name: "Slider", icon: ImageIcon },
    { id: "settings", name: "Ayarlar", icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <h1 className="font-serif italic text-xl mb-8">Yönetim</h1>
        <nav className="flex flex-col gap-2 flex-1">
          {menu.map((item) => (
            <button key={item.id} onClick={() => setTab(item.id as Tab)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === item.id ? "bg-gray-100 text-black" : "text-gray-600 hover:bg-gray-50"}`}>
              <item.icon size={18} /> {item.name}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"><LogOut size={18} /> Çıkış Yap</button>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold capitalize">{tab} Yönetimi</h2>
          <a href="/" target="_blank" className="text-xs text-gray-500 hover:text-black flex items-center gap-1">Siteyi Gör <ExternalLink size={13} /></a>
        </header>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[500px]">
          {tab === "products" && <ProductsPanel categories={categories} />}
          {tab === "categories" && <CategoriesPanel />}
          {tab === "slider" && <SliderPanel />}
          {tab === "settings" && <SettingsPanel />}
        </div>
      </main>
    </div>
  );
}