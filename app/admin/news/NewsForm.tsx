"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Upload, Loader2, X, Save, Image as ImageIcon } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";
import type { NewsItem } from "@/lib/db";

type Lang = "tr" | "en";

function toLangPair(val: NewsItem["title"] | undefined): { tr: string; en: string } {
  if (!val) return { tr: "", en: "" };
  if (typeof val === "string") return { tr: val, en: "" };
  return { tr: val.tr || "", en: val.en || "" };
}

function toDateInputValue(iso: string | undefined) {
  if (!iso) return new Date().toISOString().slice(0, 10);
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Görsel yüklenemedi");
  }
  const data = await res.json();
  return data.url as string;
}

export default function NewsForm({ news }: { news: NewsItem | null }) {
  const router = useRouter();
  const isEdit = Boolean(news);
  const [lang, setLang] = useState<Lang>("tr");

  const [title, setTitle] = useState(toLangPair(news?.title));
  const [excerpt, setExcerpt] = useState(toLangPair(news?.excerpt));
  const [content, setContent] = useState(toLangPair(news?.content));
  const [coverImage, setCoverImage] = useState<string>(news?.coverImage ?? "");
  const [date, setDate] = useState(toDateInputValue(news?.date));
  const [active, setActive] = useState(news?.active ?? true);
  const [seoTitle, setSeoTitle] = useState(news?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(news?.seoDescription ?? "");

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCoverUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadImage(file);
      setCoverImage(url);
    } catch (err: any) {
      setError(err.message || "Görsel yüklenemedi");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit() {
    if (!title.tr.trim() && !title.en.trim()) {
      setError("Türkçe veya İngilizce başlıktan en az biri gerekli");
      return;
    }
    setSaving(true);
    setError(null);

    const payload = {
      title,
      excerpt,
      content,
      coverImage: coverImage || null,
      date: new Date(date).toISOString(),
      active,
      seoTitle,
      seoDescription,
    };

    try {
      const res = await fetch(isEdit ? `/api/admin/news/${news!.id}` : "/api/admin/news", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Kaydedilemedi");
      }
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Kaydedilemedi");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F6F4] pb-24">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <Link href="/admin" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#1A1A1A]">
          <ChevronLeft size={16} /> Yönetim Paneline Dön
        </Link>

        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-[#1A1A1A]">{isEdit ? "Haberi Düzenle" : "Yeni Haber Ekle"}</h1>
          <div className="flex overflow-hidden rounded-md border border-gray-200">
            <button
              onClick={() => setLang("tr")}
              className={`px-4 py-1.5 text-xs font-bold uppercase ${lang === "tr" ? "bg-[#1A1A1A] text-white" : "bg-white text-gray-600"}`}
            >
              TR
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-4 py-1.5 text-xs font-bold uppercase ${lang === "en" ? "bg-[#1A1A1A] text-white" : "bg-white text-gray-600"}`}
            >
              EN
            </button>
          </div>
        </div>

        {error && <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}

        <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-[#1A1A1A]">Başlık ({lang.toUpperCase()})</label>
            <input
              type="text"
              value={lang === "tr" ? title.tr : title.en}
              onChange={(e) => setTitle((prev) => ({ ...prev, [lang]: e.target.value }))}
              placeholder={lang === "tr" ? "Örn. Yeni CNC Köprü Kesim Geliştirmesi" : "e.g. New CNC Bridge Saw Development"}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#B87332]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-[#1A1A1A]">Kısa Özet ({lang.toUpperCase()})</label>
            <textarea
              value={lang === "tr" ? excerpt.tr : excerpt.en}
              onChange={(e) => setExcerpt((prev) => ({ ...prev, [lang]: e.target.value }))}
              rows={2}
              placeholder="Haber listesinde ve SEO'da kullanılacak kısa özet"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#B87332]"
            />
          </div>

          <RichTextEditor
            label={`Haber İçeriği (${lang.toUpperCase()})`}
            value={lang === "tr" ? content.tr : content.en}
            onChange={(val) => setContent((prev) => ({ ...prev, [lang]: val }))}
            placeholder="Haberin tam metnini buraya yazın..."
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#1A1A1A]">Kapak Görseli</label>
              {coverImage ? (
                <div className="relative mb-2 h-36 w-full overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                  <Image src={coverImage} alt="Kapak" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setCoverImage("")}
                    className="absolute right-2 top-2 rounded-full bg-white p-1 text-gray-700 shadow"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="mb-2 flex h-36 w-full items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 text-gray-300">
                  <ImageIcon size={28} />
                </div>
              )}
              <label className="flex w-fit cursor-pointer items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                Görsel Yükle
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} disabled={uploading} />
              </label>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#1A1A1A]">Yayın Tarihi</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#B87332]"
              />

              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4" />
                Sitede Yayınlansın
              </label>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">SEO (opsiyonel — boş bırakılırsa otomatik üretilir)</p>
            <div className="space-y-3">
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="SEO başlığı"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#B87332]"
              />
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={2}
                placeholder="SEO açıklaması"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#B87332]"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Link href="/admin" className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            İptal
          </Link>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 rounded-md bg-[#1A1A1A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-60"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isEdit ? "Değişiklikleri Kaydet" : "Haberi Ekle"}
          </button>
        </div>
      </div>
    </div>
  );
}
