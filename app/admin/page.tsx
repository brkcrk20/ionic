"use client";

import { useState } from "react";
import ProductsPanel from "./ProductsPanel";
import SettingsPanel from "./SettingsPanel";
import { Package, Settings, LogOut } from "lucide-react";
import Link from "next/link";

type Tab = "products" | "settings";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("products");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-montserrat">
      {/* Üst Navbar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-extrabold text-[#1A1A1A]">Ion Meccanica — Yönetim Paneli</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/products"
            target="_blank"
            className="text-xs font-medium text-gray-600 hover:text-[#1A1A1A] transition-colors"
          >
            Siteyi Görüntüle ↗
          </Link>
          <Link
            href="/admin/login"
            className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            <LogOut size={14} /> Çıkış
          </Link>
        </div>
      </header>

      {/* Sekmeler */}
      <div className="max-w-7xl w-full mx-auto px-6 pt-6">
        <div className="flex gap-2 border-b border-gray-200 pb-3">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer ${
              activeTab === "products"
                ? "bg-[#1A1A1A] text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <Package size={16} /> Ürünler
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer ${
              activeTab === "settings"
                ? "bg-[#1A1A1A] text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <Settings size={16} /> Site Ayarları
          </button>
        </div>
      </div>

      {/* İçerik Alanı */}
      <main className="max-w-7xl w-full mx-auto px-6 py-6 flex-1">
        {activeTab === "products" && <ProductsPanel />}
        {activeTab === "settings" && <SettingsPanel />}
      </main>
    </div>
  );
}