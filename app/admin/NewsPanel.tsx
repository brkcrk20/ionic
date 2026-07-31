"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Trash2, Newspaper, ImageOff, Eye, EyeOff } from "lucide-react";
import type { NewsItem, MultiLangString } from "@/lib/db";

function getLangText(val: MultiLangString | undefined, lang: "tr" | "en" = "tr"): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return lang === "tr" ? (val.tr || val.en || "") : (val.en || val.tr || "");
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

export default function NewsPanel() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/news");
    const data = await res.json();
    setNews(data.news ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(item: NewsItem) {
    const title = getLangText(item.title);
    if (!confirm(`"${title}" haberi kalıcı olarak silinsin mi?`)) return;
    const res = await fetch(`/api/admin/news/${item.id}`, { method: "DELETE" });
    if (res.ok) {
      setNews((prev) => prev.filter((n) => n.id !== item.id));
    }
  }

  async function toggleActive(item: NewsItem) {
    const res = await fetch(`/api/admin/news/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !item.active }),
    });
    if (res.ok) {
      const data = await res.json();
      setNews((prev) => prev.map((n) => (n.id === item.id ? data.news : n)));
    }
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper size={18} className="text-[#B87332]" />
          <h2 className="text-sm font-medium text-gray-700">
            Haberler {!loading && <span className="text-gray-400">({news.length})</span>}
          </h2>
        </div>
        <Link
          href="/admin/news/new"
          className="flex items-center gap-1.5 rounded-md bg-[#1A1A1A] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black"
        >
          <Plus size={16} /> Yeni Haber Ekle
        </Link>
      </div>

      <p className="mb-6 text-xs text-gray-400">
        Buradan eklenen haber/duyurular, sitedeki <strong>/news</strong> listesinde ve kendi <strong>/news/[slug]</strong> sayfasında otomatik olarak görünür.
      </p>

      {loading ? (
        <p className="py-10 text-center text-sm text-gray-400">Yükleniyor...</p>
      ) : news.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
          <Newspaper size={28} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm text-gray-400">Henüz haber eklenmedi.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => {
            const title = getLangText(item.title);
            const excerpt = getLangText(item.excerpt);

            return (
              <div key={item.id} className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="absolute right-3 top-3 z-20 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => toggleActive(item)}
                    className={`rounded-full p-2 shadow-md ${item.active ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"}`}
                    title={item.active ? "Yayından Kaldır (Gizle)" : "Yayına Al"}
                  >
                    {item.active ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <Link
                    href={`/admin/news/${item.id}/edit`}
                    className="rounded-full border border-gray-100 bg-white p-2 text-gray-700 shadow-md hover:text-[#B87332]"
                    title="Düzenle"
                  >
                    <Pencil size={14} />
                  </Link>
                  <button
                    onClick={() => handleDelete(item)}
                    className="rounded-full bg-red-600 p-2 text-white shadow-md hover:bg-red-700"
                    title="Sil"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="relative flex h-40 w-full items-center justify-center overflow-hidden border-b border-gray-100 bg-gray-50">
                  {item.coverImage ? (
                    <Image src={item.coverImage} alt={title} fill className="object-cover" />
                  ) : (
                    <ImageOff size={28} className="text-gray-300" />
                  )}
                  {!item.active && <span className="absolute bottom-3 left-3 rounded bg-gray-700 px-2 py-0.5 text-[10px] text-white">Gizli</span>}
                </div>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#B87332]">
                      {formatDate(item.date)} · /news/{item.slug}
                    </span>
                    <h3 className="mb-1 text-base font-extrabold text-[#3A3A3A]">{title}</h3>
                    {excerpt && <p className="line-clamp-2 text-xs text-gray-500">{excerpt}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
