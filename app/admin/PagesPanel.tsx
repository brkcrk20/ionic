"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Folder, Eye, EyeOff, Pencil, ExternalLink, Loader2 } from "lucide-react";
import type { SitePage } from "@/lib/db";
import { getGroupedSlots } from "@/lib/pageSlots";

export default function PagesPanel() {
  const [pages, setPages] = useState<SitePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingKey, setTogglingKey] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pages");
      const data = await res.json();
      setPages(data.pages ?? []);
    } catch (err) {
      console.error("Sayfalar yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const grouped = getGroupedSlots();

  function findPage(key: string): SitePage | undefined {
    return pages.find((p) => p.key === key);
  }

  // Anlık Gizle / Yayınla (Publish/Unpublish Toggle)
  async function togglePublish(key: string, currentStatus: boolean) {
    setTogglingKey(key);
    try {
      const res = await fetch(`/api/admin/pages/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        // State'i anlık güncelle
        setPages((prev) => {
          const exists = prev.some((p) => p.key === key);
          if (exists) {
            return prev.map((p) => (p.key === key ? { ...p, published: !currentStatus } : p));
          }
          return [...prev, data.page];
        });
      }
    } catch (err) {
      console.error("Yayın durumu değiştirilemedi:", err);
    } finally {
      setTogglingKey(null);
    }
  }

  return (
    <div className="w-full font-montserrat">
      <div className="mb-2 flex items-center gap-2">
        <FileText size={18} className="text-[#B87332]" />
        <h2 className="text-sm font-bold text-[#3A3A3A]">Sayfalar</h2>
      </div>

      <p className="mb-6 text-xs text-gray-500 leading-relaxed">
        Şirketin kurumsal sayfalarının metinlerini, görsellerini ve SEO bilgilerini koda dokunmadan yönetebilirsiniz.
        <br />
        Göz ikonuna tıklayarak sayfayı anında <strong>Yayına Alabilir</strong> veya <strong>Gizleyebilirsiniz</strong>. Gizlenen bir sayfaya
        gidildiğinde ziyaretçilere &quot;Yakında&quot; ekranı gösterilir.
      </p>

      {loading ? (
        <div className="py-20 flex justify-center items-center gap-2 text-sm text-gray-400">
          <Loader2 size={18} className="animate-spin text-[#B87332]" />
          Sayfalar Yükleniyor...
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ group, slots }) => (
            <div key={group} className="border-b border-gray-100 pb-6 last:border-0">
              <div className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#B87332]">
                <Folder size={14} /> {group}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {slots.map((slot) => {
                  const page = findPage(slot.key);
                  // Veritabanında henüz kaydı yoksa varsayılan olarak Yayında (true) kabul edilir
                  const published = page ? page.published : true;
                  const isToggling = togglingKey === slot.key;

                  return (
                    <div
                      key={slot.key}
                      className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3.5 shadow-sm hover:border-gray-300 transition-all"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-extrabold text-[#3A3A3A]">{slot.labelTr}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                            {published ? "Yayında" : "Gizli"}
                          </span>
                        </div>
                        <p className="truncate text-xs text-gray-400 mt-0.5">{slot.path}</p>
                      </div>

                      <div className="flex flex-shrink-0 items-center gap-2">
                        {/* Gizle / Yayınla Butonu */}
                        <button
                          type="button"
                          onClick={() => togglePublish(slot.key, published)}
                          disabled={isToggling}
                          title={published ? "Sayfayı Gizle (Yakında Ekranı Göster)" : "Sayfayı Sitede Yayınla"}
                          className={`rounded-lg p-2 transition-colors ${
                            published
                              ? "bg-green-50 text-green-700 hover:bg-green-100"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {isToggling ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : published ? (
                            <Eye size={14} />
                          ) : (
                            <EyeOff size={14} />
                          )}
                        </button>

                        {/* Sitede Görüntüle */}
                        <Link
                          href={slot.path}
                          target="_blank"
                          className="rounded-lg border border-gray-200 bg-white p-2 text-gray-600 hover:text-[#B87332] hover:border-[#B87332] transition-colors"
                          title="Sitede Gör"
                        >
                          <ExternalLink size={14} />
                        </Link>

                        {/* Düzenle Formu */}
                        <Link
                          href={`/admin/pages/${slot.key}/edit`}
                          className="rounded-lg bg-[#3A3A3A] p-2 text-white hover:bg-[#B87332] transition-colors"
                          title="İçeriği Düzenle"
                        >
                          <Pencil size={14} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}