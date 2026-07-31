"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Upload, Loader2, X, Save, Image as ImageIcon, Plus, Trash2, ExternalLink } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";
import type { SitePage, StyledPair } from "@/lib/db";
import type { PageSlot } from "@/lib/pageSlots";

type Lang = "tr" | "en";
type LangPair = { tr: string; en: string };

function toLangPair(val: SitePage["title"] | undefined): LangPair {
  if (!val) return { tr: "", en: "" };
  if (typeof val === "string") return { tr: val, en: "" };
  return { tr: val.tr || "", en: val.en || "" };
}

type BlockDraft = { id: string; title: LangPair; text: LangPair };

function blocksToDraft(blocks: StyledPair[] | undefined): BlockDraft[] {
  if (!blocks || blocks.length === 0) return [];
  return blocks.map((b, i) => ({
    id: `blk-${i}-${Math.random().toString(36).slice(2, 7)}`,
    title: toLangPair(b.title),
    text: toLangPair(b.text),
  }));
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

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-[#1A1A1A]">{label}</label>
      {value ? (
        <div className="relative mb-2 h-36 w-full overflow-hidden rounded-md border border-gray-200 bg-gray-50">
          <Image src={value} alt={label} fill className="object-cover" />
          <button type="button" onClick={() => onChange("")} className="absolute right-2 top-2 rounded-full bg-white p-1 text-gray-700 shadow">
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
        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
      </label>
    </div>
  );
}

export default function PageForm({ page, slot }: { page: SitePage | null; slot: PageSlot }) {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("tr");

  const [title, setTitle] = useState(toLangPair(page?.title));
  const [description, setDescription] = useState(toLangPair(page?.description));
  const [heroImage, setHeroImage] = useState(page?.heroImage ?? "");
  const [coverImage, setCoverImage] = useState(page?.coverImage ?? "");
  const [blocks, setBlocks] = useState<BlockDraft[]>(blocksToDraft(page?.contentBlocks));
  const [published, setPublished] = useState(page?.published ?? false);
  const [seoTitle, setSeoTitle] = useState(page?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(page?.seoDescription ?? "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addBlock() {
    setBlocks((prev) => [...prev, { id: `blk-new-${Math.random().toString(36).slice(2, 7)}`, title: { tr: "", en: "" }, text: { tr: "", en: "" } }]);
  }

  function removeBlock(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }

  function updateBlockTitle(id: string, value: string) {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, title: { ...b.title, [lang]: value } } : b)));
  }

  function updateBlockText(id: string, value: string) {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, text: { ...b.text, [lang]: value } } : b)));
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
      description,
      heroImage: heroImage || null,
      coverImage: coverImage || null,
      contentBlocks: blocks.map((b) => ({ title: b.title, text: b.text })),
      published,
      seoTitle,
      seoDescription,
    };

    try {
      const res = await fetch(`/api/admin/pages/${slot.key}`, {
        method: "PUT",
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
          <div>
            <h1 className="text-xl font-extrabold text-[#1A1A1A]">{slot.labelTr}</h1>
            <Link href={slot.path} target="_blank" className="mt-1 inline-flex items-center gap-1 text-xs text-gray-400 hover:text-[#B87332]">
              {slot.path} <ExternalLink size={11} />
            </Link>
          </div>
          <div className="flex overflow-hidden rounded-md border border-gray-200">
            <button onClick={() => setLang("tr")} className={`px-4 py-1.5 text-xs font-bold uppercase ${lang === "tr" ? "bg-[#1A1A1A] text-white" : "bg-white text-gray-600"}`}>
              TR
            </button>
            <button onClick={() => setLang("en")} className={`px-4 py-1.5 text-xs font-bold uppercase ${lang === "en" ? "bg-[#1A1A1A] text-white" : "bg-white text-gray-600"}`}>
              EN
            </button>
          </div>
        </div>

        {error && <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}

        <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4" />
            Bu sayfa sitede yayınlansın (kapalıyken "yakında" ekranı görünür)
          </label>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-[#1A1A1A]">Başlık ({lang.toUpperCase()})</label>
            <input
              type="text"
              value={lang === "tr" ? title.tr : title.en}
              onChange={(e) => setTitle((prev) => ({ ...prev, [lang]: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#B87332]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-[#1A1A1A]">Açıklama ({lang.toUpperCase()})</label>
            <textarea
              value={lang === "tr" ? description.tr : description.en}
              onChange={(e) => setDescription((prev) => ({ ...prev, [lang]: e.target.value }))}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#B87332]"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <ImageField label="Hero Görseli" value={heroImage} onChange={setHeroImage} />
            <ImageField label="Sayfa Kapak Görseli" value={coverImage} onChange={setCoverImage} />
          </div>

          <div className="border-t border-gray-100 pt-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-[#1A1A1A]">İçerik Blokları</p>
              <button
                onClick={addBlock}
                type="button"
                className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                <Plus size={14} /> Blok Ekle
              </button>
            </div>

            {blocks.length === 0 ? (
              <p className="rounded-md border border-dashed border-gray-300 py-6 text-center text-xs text-gray-400">
                Henüz içerik bloğu yok. Sayfaya alt başlık + metin içeren bölümler eklemek için "Blok Ekle"ye tıklayın.
              </p>
            ) : (
              <div className="space-y-4">
                {blocks.map((block, index) => (
                  <div key={block.id} className="rounded-lg border border-gray-200 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Blok {index + 1}</span>
                      <button onClick={() => removeBlock(block.id)} type="button" className="text-red-500 hover:text-red-700">
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={lang === "tr" ? block.title.tr : block.title.en}
                      onChange={(e) => updateBlockTitle(block.id, e.target.value)}
                      placeholder={`Alt başlık (${lang.toUpperCase()})`}
                      className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#B87332]"
                    />
                    <RichTextEditor
                      value={lang === "tr" ? block.text.tr : block.text.en}
                      onChange={(val) => updateBlockText(block.id, val)}
                      minHeight={140}
                      placeholder={`Metin (${lang.toUpperCase()})`}
                    />
                  </div>
                ))}
              </div>
            )}
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
            Değişiklikleri Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
