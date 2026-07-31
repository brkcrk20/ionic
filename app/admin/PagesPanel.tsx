"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Folder, Eye, EyeOff, Pencil, ExternalLink } from "lucide-react";
import type { SitePage } from "@/lib/db";
import { getGroupedSlots } from "@/lib/pageSlots";

export default function PagesPanel() {
  const [pages, setPages] = useState<SitePage[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/pages");
    const data = await res.json();
    setPages(data.pages ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const grouped = getGroupedSlots();

  function findPage(key: string): SitePage | undefined {
    return pages.find((p) => p.key === key);
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center gap-2">
        <FileText size={18} className="text-[#B87332]" />
        <h2 className="text-sm font-medium text-gray-700">Sayfalar</h2>
      </div>

      <p className="mb-6 text-xs text-gray-400">
        Şirketin kurumsal sayfalarının (Hakkımızda, Yetkinlikler, Otomasyon & Kontrol, Kariyer, İletişim vb.) metinlerini,
        görsellerini ve SEO bilgilerini buradan, koda dokunmadan yönetebilirsiniz. Bir sayfa yayınlanana kadar sitede
        önceki "yakında" ekranı görünmeye devam eder.
      </p>

      {loading ? (
        <p className="py-10 text-center text-sm text-gray-400">Yükleniyor...</p>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ group, slots }) => (
            <div key={group}>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                <Folder size={14} /> {group}
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {slots.map((slot) => {
                  const page = findPage(slot.key);
                  const published = page?.published ?? false;
                  return (
                    <div
                      key={slot.key}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#3A3A3A]">{slot.labelTr}</p>
                        <p className="truncate text-xs text-gray-400">{slot.path}</p>
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-1.5">
                        <span
                          title={published ? "Yayında" : "Yayında değil"}
                          className={`rounded-full p-1.5 ${published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}
                        >
                          {published ? <Eye size={13} /> : <EyeOff size={13} />}
                        </span>
                        <Link
                          href={slot.path}
                          target="_blank"
                          className="rounded-full border border-gray-100 bg-white p-1.5 text-gray-500 hover:text-[#B87332]"
                          title="Sitede Görüntüle"
                        >
                          <ExternalLink size={13} />
                        </Link>
                        <Link
                          href={`/admin/pages/${slot.key}/edit`}
                          className="rounded-full bg-[#1A1A1A] p-1.5 text-white hover:bg-black"
                          title="Düzenle"
                        >
                          <Pencil size={13} />
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
