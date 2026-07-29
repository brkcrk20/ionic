"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import type { ChangeEvent, Dispatch, SetStateAction, CSSProperties } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Check, Image as ImageIcon, Loader2, Minus, Plus, Upload, X, Globe, Sparkles } from "lucide-react";
import type { Category, Product, StyledPair, TextStyle, MultiLangString } from "@/lib/db";

type WizardStep = 1 | 2 | 3;
type Lang = "tr" | "en";

function catLabel(name: Category["name"], lang: Lang): string {
  if (typeof name === "string") return name;
  return (name as any)?.[lang] || (name as any)?.tr || "Kategori";
}

function getLeafCategories(categories: Category[]): Category[] {
  const parentIds = new Set(categories.map((c) => c.parentId).filter(Boolean) as string[]);
  return categories.filter((c) => !parentIds.has(c.id));
}

function categoryPathLabel(categories: Category[], categoryId: string, lang: Lang): string {
  const byId = new Map(categories.map((c) => [c.id, c]));
  const chain: string[] = [];
  let current = byId.get(categoryId);
  const seen = new Set<string>();
  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    chain.unshift(catLabel(current.name, lang));
    current = current.parentId ? byId.get(current.parentId) : undefined;
  }
  return chain.join(" > ");
}

interface CustomSection {
  id: string;
  title: { tr: string; en: string };
  enabled: boolean;
  open: boolean;
  blocks: { title: { tr: string; en: string }; text: { tr: string; en: string } }[];
}

const POSITRON_NAME_STYLE: TextStyle = {
  color: "#FFFFFF",
  fontSize: "48px",
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: "800",
  fontStyle: "normal",
  textDecoration: "none",
  textAlign: "left",
  lineHeight: "1",
  letterSpacing: "-0.02em",
};

const POSITRON_SUBTITLE_STYLE: TextStyle = {
  color: "#B87332",
  fontSize: "24px",
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: "700",
  fontStyle: "normal",
  textDecoration: "none",
  textAlign: "left",
  lineHeight: "1.2",
  letterSpacing: "0px",
};

const POSITRON_DESCRIPTION_STYLE: TextStyle = {
  color: "rgba(255,255,255,0.9)",
  fontSize: "16px",
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: "500",
  fontStyle: "normal",
  textDecoration: "none",
  textAlign: "left",
  lineHeight: "1.7",
  letterSpacing: "0px",
};

function parseMulti(val: unknown): { tr: string; en: string } {
  if (typeof val === "string") {
    // Eski sistemden kalma varsayılan otomatik başlıkları temizle
    if (val.startsWith("Teknik Detay") || val.startsWith("Konfigürasyon") || val.startsWith("Detay")) {
      return { tr: "", en: "" };
    }
    return { tr: val, en: "" };
  }
  if (val && typeof val === "object") {
    const obj = val as Record<string, unknown>;
    const trVal = typeof obj.tr === "string" ? obj.tr : "";
    const enVal = typeof obj.en === "string" ? obj.en : "";
    return {
      tr: trVal.startsWith("Teknik Detay") || trVal.startsWith("Konfigürasyon") ? "" : trVal,
      en: enVal.startsWith("Technical Detail") || enVal.startsWith("Configuration") ? "" : enVal,
    };
  }
  return { tr: "", en: "" };
}

function makeMultiPair(titleTr = "", titleEn = "", textTr = "", textEn = "") {
  return {
    title: { tr: titleTr, en: titleEn },
    text: { tr: textTr, en: textEn },
  };
}

function styleToCss(style?: TextStyle): CSSProperties | undefined {
  if (!style) return undefined;
  return {
    color: style.color,
    fontSize: style.fontSize,
    fontFamily: style.fontFamily,
    fontWeight: style.fontWeight,
    fontStyle: style.fontStyle,
    textDecoration: style.textDecoration,
    textAlign: style.textAlign,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
  };
}

function stripHtml(html: string) {
  return html
    .replace(/<\s*br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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

export default function ProductWizardForm({ product, categories: initialCategories }: { product: Product | null; categories: Category[] }) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [categories, setCategories] = useState<Category[]>(initialCategories || []);

  useEffect(() => {
    if (!initialCategories || initialCategories.length === 0) {
      fetch("/api/admin/categories")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.categories)) {
            setCategories(data.categories);
          }
        })
        .catch(console.error);
    }
  }, [initialCategories]);

  const initialListImage = product?.images?.[0] || "";
  const initialHero = product?.heroImage || "";
  
  const initialGallery = useMemo(() => {
    if (!product || !product.images) return [] as string[];
    return product.images.slice(1);
  }, [product]);

  const [step, setStep] = useState<WizardStep>(1);
  const [currentLang, setCurrentLang] = useState<Lang>("tr");
  const [loading, setLoading] = useState(false);
  const [uploadingListImage, setUploadingListImage] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState<{ tr: string; en: string }>(parseMulti(product?.name));
  const [subtitle, setSubtitle] = useState<{ tr: string; en: string }>(parseMulti(product?.subtitle));
  const [heroDescription, setHeroDescription] = useState<{ tr: string; en: string }>(parseMulti(product?.heroDescription));
  
  const subtitleInputRef = useRef<HTMLInputElement>(null);
  const descTextareaRef = useRef<HTMLTextAreaElement>(null);

  const [listImage, setListImage] = useState(initialListImage);
  const [heroImage, setHeroImage] = useState(initialHero);
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [active, setActive] = useState(product?.active ?? true);

  const selectableCategories = useMemo(() => {
    return getLeafCategories(categories || []);
  }, [categories]);

  const [customSections, setCustomSections] = useState<CustomSection[]>([
    {
      id: "desc",
      title: parseMulti(product?.descriptionSectionTitle),
      enabled: Boolean(product?.descriptionSectionTitle),
      open: true,
      blocks: product?.descriptionBlocks?.length
        ? product.descriptionBlocks.map((b) => ({ title: parseMulti(b.title), text: parseMulti(b.text) }))
        : [makeMultiPair("", "", "", "")],
    },
    {
      id: "configs",
      title: parseMulti(product?.configsSectionTitle),
      enabled: Boolean(product?.configsSectionTitle),
      open: true,
      blocks: product?.configBlocks?.length
        ? product.configBlocks.map((b) => ({ title: parseMulti(b.title), text: parseMulti(b.text) }))
        : [makeMultiPair("", "", "", "")],
    },
    {
      id: "versions",
      title: parseMulti(product?.versionsSectionTitle),
      enabled: Boolean(product?.versionsSectionTitle),
      open: true,
      blocks: product?.versionBlocks?.length
        ? product.versionBlocks.map((b) => ({ title: parseMulti(b.title), text: parseMulti(b.text) }))
        : [makeMultiPair("", "", "", "")],
    },
    {
      id: "features",
      title: parseMulti(product?.featuresSectionTitle),
      enabled: Boolean(product?.featuresSectionTitle),
      open: true,
      blocks: product?.featureBlocks?.length
        ? product.featureBlocks.map((b) => ({ title: parseMulti(b.title), text: parseMulti(b.text) }))
        : [makeMultiPair("", "", "", "")],
    },
  ]);

  const [galleryImages, setGalleryImages] = useState<string[]>(initialGallery);

  function addNewSection() {
    const newId = `section-${Date.now()}`;
    setCustomSections((prev) => [
      ...prev,
      {
        id: newId,
        title: { tr: "", en: "" },
        enabled: true,
        open: true,
        blocks: [makeMultiPair("", "", "", "")],
      },
    ]);
  }

  function removeSection(sectionId: string) {
    setCustomSections((prev) => prev.filter((sec) => sec.id !== sectionId));
  }

  async function handlePickListImage(file?: File | null) {
    if (!file) return;
    setUploadingListImage(true);
    setError("");
    try {
      const url = await uploadImage(file);
      setListImage(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Liste görseli yüklenemedi");
    } finally {
      setUploadingListImage(false);
    }
  }

  async function handlePickHero(file?: File | null) {
    if (!file) return;
    setUploadingHero(true);
    setError("");
    try {
      const url = await uploadImage(file);
      setHeroImage(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Görsel yüklenemedi");
    } finally {
      setUploadingHero(false);
    }
  }

  async function handlePickGallery(files?: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadingGallery(true);
    setError("");
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        urls.push(await uploadImage(file));
      }
      setGalleryImages((prev) => [...prev, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Görseller yüklenemedi");
    } finally {
      setUploadingGallery(false);
    }
  }

  function handleHighlightElement(
    refObject: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>,
    stateSetter: Dispatch<SetStateAction<{ tr: string; en: string }>>
  ) {
    const el = refObject.current;
    if (!el) {
      stateSetter((prev) => ({
        ...prev,
        [currentLang]: (prev[currentLang] || "") + '<span style="color: #B87332;">vurgu</span>',
      }));
      return;
    }

    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const val = el.value;

    let newVal = "";
    if (start !== end) {
      const selectedText = val.substring(start, end);
      newVal = val.substring(0, start) + `<span style="color: #B87332;">${selectedText}</span>` + val.substring(end);
    } else {
      newVal = val.substring(0, start) + '<span style="color: #B87332;"></span>' + val.substring(end);
    }

    stateSetter((prev) => ({
      ...prev,
      [currentLang]: newVal,
    }));
  }

  function handleHighlightBlock(secId: string, bIndex: number, field: "title" | "text", inputEl: HTMLInputElement | HTMLTextAreaElement | null) {
    setCustomSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== secId) return sec;
        return {
          ...sec,
          blocks: sec.blocks.map((b, i) => {
            if (i !== bIndex) return b;
            const currentFieldVal = b[field][currentLang] || "";
            let newVal = "";
            if (inputEl) {
              const start = inputEl.selectionStart ?? currentFieldVal.length;
              const end = inputEl.selectionEnd ?? currentFieldVal.length;
              if (start !== end) {
                const selected = currentFieldVal.substring(start, end);
                newVal = currentFieldVal.substring(0, start) + `<span style="color: #B87332;">${selected}</span>` + currentFieldVal.substring(end);
              } else {
                newVal = currentFieldVal.substring(0, start) + '<span style="color: #B87332;"></span>' + currentFieldVal.substring(end);
              }
            } else {
              newVal = currentFieldVal + '<span style="color: #B87332;">vurgu</span>';
            }

            return {
              ...b,
              [field]: {
                ...b[field],
                [currentLang]: newVal,
              },
            };
          }),
        };
      })
    );
  }

  function buildPayload() {
    const descSec = customSections[0];
    const confSec = customSections[1];
    const versSec = customSections[2];
    const featSec = customSections[3];

    const mapBlocks = (sec?: CustomSection) =>
      sec?.enabled
        ? sec.blocks
            .filter((item) => stripHtml(item.text.tr).length > 0 || stripHtml(item.text.en).length > 0 || stripHtml(item.title.tr).length > 0)
            .map((item) => ({
              title: item.title,
              text: item.text,
            }))
        : [];

    const filteredDescription = mapBlocks(descSec);
    const filteredConfigs = mapBlocks(confSec);
    const filteredVersions = mapBlocks(versSec);
    const filteredFeatures = mapBlocks(featSec);

    const images = [listImage, ...galleryImages.filter((img) => img !== listImage)].filter(Boolean);

    return {
      name,
      subtitle,
      heroDescription,
      heroImage,
      categoryId: categoryId || null,
      active,
      nameStyle: POSITRON_NAME_STYLE,
      subtitleStyle: POSITRON_SUBTITLE_STYLE,
      heroDescriptionStyle: POSITRON_DESCRIPTION_STYLE,
      descriptionBlocks: filteredDescription,
      descriptionParagraphs: filteredDescription.map((item) => item.text),
      configs: filteredConfigs.map((item) => ({ name: item.title, text: item.text })),
      configBlocks: filteredConfigs,
      configNote: { tr: "", en: "" },
      configNote2: { tr: "", en: "" },
      versions: filteredVersions.map((item) => ({ label: item.title, text: item.text })),
      versionBlocks: filteredVersions,
      features: filteredFeatures.map((item) => item.text.tr),
      featureBlocks: filteredFeatures,
      images,
      descriptionSectionTitle: descSec?.enabled ? descSec.title : { tr: "", en: "" },
      configsSectionTitle: confSec?.enabled ? confSec.title : { tr: "", en: "" },
      versionsSectionTitle: versSec?.enabled ? versSec.title : { tr: "", en: "" },
      featuresSectionTitle: featSec?.enabled ? featSec.title : { tr: "", en: "" },
    };
  }

  async function handleSubmit() {
    if (!name.tr.trim() && !name.en.trim()) {
      setError("En az bir dilde ürün ismi gerekli");
      return;
    }
    if (!listImage.trim()) {
      setError("Ürünler sayfasında görünecek liste/kapak görseli gerekli");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const payload = buildPayload();
      const res = await fetch(isEdit && product ? `/api/admin/products/${product.id}` : "/api/admin/products", {
        method: isEdit && product ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Kaydedilemedi");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kaydedilemedi");
    } finally {
      setLoading(false);
    }
  }

  const heroPreviewStyle = heroImage ? { backgroundImage: `url('${heroImage}')` } : undefined;
  const currentName = name[currentLang] || "";
  const currentSubtitle = subtitle[currentLang] || "";
  const currentHeroDesc = heroDescription[currentLang] || "";

  return (
    <div className="mx-auto w-full max-w-6xl pb-16 font-montserrat">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B87332]">Ürün Sayfası</p>
          <h1 className="mt-2 text-3xl font-extrabold text-[#1A1A1A]">{isEdit ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</h1>
          <p className="mt-2 text-sm text-gray-500">Kompakt ürün yönetim ve çoklu dil (TR/EN) ekranı.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setCurrentLang("tr")}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${currentLang === "tr" ? "bg-[#B87332] text-white" : "text-gray-600 hover:bg-gray-100"}`}
            >
              <Globe size={12} /> TR
            </button>
            <button
              type="button"
              onClick={() => setCurrentLang("en")}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${currentLang === "en" ? "bg-[#B87332] text-white" : "text-gray-600 hover:bg-gray-100"}`}
            >
              <Globe size={12} /> EN
            </button>
          </div>

          <Link href="/admin" className="rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:border-[#B87332] hover:text-[#B87332]">
            Geri dön
          </Link>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        {[1, 2, 3].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStep(s as WizardStep)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${step === s ? "bg-[#1A1A1A] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs">{s}</span>
            {s === 1 ? "Temel Bilgiler & Liste Görseli" : s === 2 ? "İçerik & Akordiyon" : "Hero & Galeri Görselleri"}
          </button>
        ))}
      </div>

      {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

      {step === 1 && (
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 gap-4">
              <div className="w-full sm:w-auto flex-1">
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-600">Kategori</label>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-[#B87332]">
                  <option value="">Kategorisiz</option>
                  {selectableCategories && selectableCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {categoryPathLabel(categories, category.id, currentLang)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-[#1A1A1A]">Ürün İsmi ({currentLang.toUpperCase()})</label>
              <input
                value={name[currentLang]}
                onChange={(e) => setName({ ...name, [currentLang]: e.target.value })}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 font-extrabold text-lg outline-none focus:border-[#B87332]"
                placeholder={currentLang === "tr" ? "Örn: POSITRON" : "Ex: POSITRON"}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-bold text-[#B87332]">Kısa Açıklama ({currentLang.toUpperCase()} - Turuncu Alan)</label>
                <button
                  type="button"
                  onClick={() => handleHighlightElement(subtitleInputRef, setSubtitle)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#B87332] hover:bg-[#9c6127] text-white px-3 py-1.5 text-xs font-bold shadow-sm transition"
                >
                  <Sparkles size={13} /> Turuncu Vurgu Ekle
                </button>
              </div>
              <input
                ref={subtitleInputRef}
                value={subtitle[currentLang]}
                onChange={(e) => setSubtitle({ ...subtitle, [currentLang]: e.target.value })}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#B87332]"
                placeholder={currentLang === "tr" ? "Plaka Kurutma ve Reçine Sertleştirme" : "Cyclic Oven for Slab Drying"}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-bold text-[#1A1A1A]">Ürün Tanımı ({currentLang.toUpperCase()} - Düz Metin)</label>
                <button
                  type="button"
                  onClick={() => handleHighlightElement(descTextareaRef, setHeroDescription)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#B87332] hover:bg-[#9c6127] text-white px-3 py-1.5 text-xs font-bold shadow-sm transition"
                >
                  <Sparkles size={13} /> Turuncu Vurgu Ekle
                </button>
              </div>
              <textarea
                ref={descTextareaRef}
                value={heroDescription[currentLang]}
                onChange={(e) => setHeroDescription({ ...heroDescription, [currentLang]: e.target.value })}
                rows={6}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#B87332]"
                placeholder={currentLang === "tr" ? "Ürün detay açıklamalarını buraya yazın..." : "Enter product description..."}
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
              <div>
                <p className="text-sm font-bold text-[#1A1A1A]">Yayında olsun</p>
                <p className="text-xs text-gray-500">Kapalıysa ürün sitede görünmez.</p>
              </div>
              <button type="button" onClick={() => setActive((v) => !v)} className={`rounded-full px-4 py-2 text-sm font-bold ${active ? "bg-green-600 text-white" : "bg-gray-300 text-gray-700"}`}>
                {active ? "Aktif" : "Pasif"}
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button type="button" onClick={() => setStep(2)} className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] px-5 py-3 text-sm font-bold text-white hover:bg-black">
                İleri <ChevronRight size={16} />
              </button>
              <span className="text-xs text-gray-400">Boş bırakılan alanlar diğer dilden kopyalanmaz, boş kalır.</span>
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm lg:p-6">
            <div className="flex items-center gap-2 text-sm font-bold text-[#1A1A1A]">
              <ImageIcon size={18} className="text-[#B87332]" /> Ürünler Sayfası Görseli (Liste / Kapak Resmi)
            </div>
            <p className="text-xs text-gray-500">Ürünler sayfasında ve kategori sayfalarında kart üzerinde görünecek görsel.</p>

            <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
              {listImage ? (
                <Image src={listImage} alt="Liste Görseli" fill className="object-contain p-4" />
              ) : (
                <ImageIcon size={36} className="text-gray-300" />
              )}
            </div>

            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:border-[#B87332] hover:text-[#B87332]">
              {uploadingListImage ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              Liste görseli yükle (WebP / PNG)
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePickListImage(e.target.files?.[0])} />
            </label>

            {listImage && (
              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-3 text-sm">
                <code className="flex-1 break-all text-xs text-gray-500">{listImage}</code>
                <button type="button" onClick={() => setListImage("")} className="rounded-full bg-white p-2 text-gray-500 hover:text-red-600">
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between pb-2 border-b border-gray-100 mb-4 gap-2">
            <div>
              <h2 className="text-lg font-extrabold text-[#1A1A1A]">Teknik Detaylar ({currentLang.toUpperCase()})</h2>
              <p className="text-xs text-gray-500">Açılır kapanır bölümler ekleyip çıkarabilirsiniz.</p>
            </div>
            <button
              type="button"
              onClick={addNewSection}
              className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] px-4 py-2 text-xs font-bold text-white hover:bg-black"
            >
              <Plus size={16} /> Yeni Teknik Detay Ekle
            </button>
          </div>

          {customSections.map((section, sIndex) => (
            <details key={section.id} open className="overflow-hidden rounded-3xl border border-gray-200 bg-[#F9F8F6]">
              <summary className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 select-none bg-gray-100/80 hover:bg-gray-100">
                <div className="flex items-center gap-3">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${section.enabled ? "bg-[#B87332]" : "bg-gray-400"}`}>
                    <Plus size={16} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#1A1A1A]">{section.title[currentLang] || <span className="text-gray-400 italic font-normal">Başlıksız Bölüm</span>}</p>
                    <p className="text-xs text-gray-500">{section.enabled ? "Aktif" : "Kapalı"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={section.enabled}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setCustomSections((prev) =>
                          prev.map((sec) => (sec.id === section.id ? { ...sec, enabled: checked } : sec))
                        );
                      }}
                    />
                    Kullan
                  </label>
                  {customSections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSection(section.id)}
                      className="rounded-full bg-white p-1.5 text-red-500 hover:bg-red-50 border border-gray-200"
                      title="Bölümü Sil"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </summary>

              {section.enabled && (
                <div className="border-t border-gray-200 bg-white px-5 py-5 space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">Teknik Detay Başlığı ({currentLang.toUpperCase()})</label>
                    <input
                      value={section.title[currentLang]}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomSections((prev) =>
                          prev.map((sec) =>
                            sec.id === section.id ? { ...sec, title: { ...sec.title, [currentLang]: val } } : sec
                          )
                        );
                      }}
                      placeholder="Boş bırakılabilir..."
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-[#1A1A1A] outline-none focus:border-[#B87332]"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-extrabold text-[#1A1A1A]">İçerik Blokları</h3>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomSections((prev) =>
                          prev.map((sec) =>
                            sec.id === section.id
                              ? { ...sec, blocks: [...sec.blocks, makeMultiPair("", "", "", "")] }
                              : sec
                          )
                        );
                      }}
                      className="rounded-full bg-[#1A1A1A] px-4 py-2 text-xs font-bold text-white hover:bg-black"
                    >
                      Blok Ekle
                    </button>
                  </div>

                  {section.blocks.map((block, bIndex) => (
                    <div key={bIndex} className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[#1A1A1A]">Satır {bIndex + 1}</p>
                        {section.blocks.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setCustomSections((prev) =>
                                prev.map((sec) =>
                                  sec.id === section.id
                                    ? { ...sec, blocks: sec.blocks.filter((_, i) => i !== bIndex) }
                                    : sec
                                )
                              );
                            }}
                            className="rounded-full p-1 text-gray-500 hover:text-red-600"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-semibold text-gray-600">Başlık</label>
                            <button
                              type="button"
                              onClick={(e) => {
                                const inputEl = (e.currentTarget.parentElement?.nextElementSibling as HTMLInputElement) || null;
                                handleHighlightBlock(section.id, bIndex, "title", inputEl);
                              }}
                              className="inline-flex items-center gap-1 rounded-lg bg-[#B87332] hover:bg-[#9c6127] text-white px-2.5 py-1 text-[11px] font-bold shadow-sm transition"
                            >
                              <Sparkles size={11} /> Turuncu Vurgu
                            </button>
                          </div>
                          <input
                            value={block.title[currentLang]}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCustomSections((prev) =>
                                prev.map((sec) =>
                                  sec.id === section.id
                                    ? {
                                        ...sec,
                                        blocks: sec.blocks.map((b, i) =>
                                          i === bIndex ? { ...b, title: { ...b.title, [currentLang]: val } } : b
                                        ),
                                      }
                                    : sec
                                )
                              );
                            }}
                            placeholder="Başlık..."
                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-[#1A1A1A] outline-none focus:border-[#B87332]"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-semibold text-gray-600">Açıklama / Değer (Düz Metin)</label>
                            <button
                              type="button"
                              onClick={(e) => {
                                const textareaEl = (e.currentTarget.parentElement?.nextElementSibling as HTMLTextAreaElement) || null;
                                handleHighlightBlock(section.id, bIndex, "text", textareaEl);
                              }}
                              className="inline-flex items-center gap-1 rounded-lg bg-[#B87332] hover:bg-[#9c6127] text-white px-2.5 py-1 text-[11px] font-bold shadow-sm transition"
                            >
                              <Sparkles size={11} /> Turuncu Vurgu
                            </button>
                          </div>
                          <textarea
                            rows={4}
                            value={block.text[currentLang]}
                            onChange={(e) => {
                              const textVal = e.target.value;
                              setCustomSections((prev) =>
                                prev.map((sec) =>
                                  sec.id === section.id
                                    ? {
                                        ...sec,
                                        blocks: sec.blocks.map((b, i) =>
                                          i === bIndex ? { ...b, text: { ...b.text, [currentLang]: textVal } } : b
                                        ),
                                      }
                                    : sec
                                )
                              );
                            }}
                            placeholder="Açıklama metni..."
                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 outline-none focus:border-[#B87332]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </details>
          ))}

          <div className="flex items-center justify-between gap-3 pt-2">
            <button type="button" onClick={() => setStep(1)} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 hover:border-[#B87332] hover:text-[#B87332]">
              <ChevronLeft size={16} /> Geri
            </button>
            <button type="button" onClick={() => setStep(3)} className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] px-5 py-3 text-sm font-bold text-white hover:bg-black">
              İleri <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-[#1A1A1A]">Ürün Detay Hero Resmi</h2>
              <p className="text-sm text-gray-500">Ürün detay sayfasının üst kısmında arka planda görünen büyük görsel.</p>

              <div className="overflow-hidden rounded-[1.3rem] border border-black/10 bg-[#3A3A3A]">
                <div
                  className="relative mx-auto flex min-h-[300px] w-full flex-col justify-end bg-[#3A3A3A] bg-no-repeat bg-bottom bg-[length:100%_auto] p-6"
                  style={heroPreviewStyle}
                >
                  <div className="absolute inset-0 pointer-events-none bg-black/30" />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-extrabold text-white">{currentName}</h3>
                    <p className="text-sm text-[#B87332]">{currentSubtitle}</p>
                  </div>
                </div>
              </div>

              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:border-[#B87332] hover:text-[#B87332]">
                {uploadingHero ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                Hero büyük görsel yükle
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePickHero(e.target.files?.[0])} />
              </label>

              {heroImage && (
                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-3 text-sm">
                  <code className="flex-1 break-all text-xs text-gray-500">{heroImage}</code>
                  <button type="button" onClick={() => setHeroImage("")} className="rounded-full bg-white p-2 text-gray-500 hover:text-red-600">
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-[#1A1A1A]">Alt Galeri Resimleri</h2>
              <p className="text-sm text-gray-500">Ürün sayfasının alt kısmındaki ek görseller.</p>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 hover:border-[#B87332] hover:text-[#B87332]">
                {uploadingGallery ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                Görsel(ler) yükle
                <input type="file" multiple accept="image/*" className="hidden" onChange={(e: ChangeEvent<HTMLInputElement>) => handlePickGallery(e.target.files)} />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                {galleryImages.map((src, index) => (
                  <div key={`${src}-${index}`} className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                    <div className="relative aspect-[4/3] bg-gray-100">
                      <Image src={src} alt={`Galeri ${index + 1}`} fill className="object-cover" />
                    </div>
                    <div className="flex items-center justify-between gap-2 p-3">
                      <span className="truncate text-xs text-gray-500">{src}</span>
                      <button type="button" onClick={() => setGalleryImages((prev) => prev.filter((_, i) => i !== index))} className="rounded-full p-2 text-gray-500 hover:text-red-600">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm h-fit">
            <h2 className="text-xl font-extrabold text-[#1A1A1A]">Önizleme özeti</h2>
            <div className="space-y-4 rounded-3xl border border-gray-200 bg-gray-50 p-4">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gray-100">
                {listImage ? <Image src={listImage} alt={currentName} fill className="object-contain p-2" /> : <ImageIcon size={42} className="absolute inset-0 m-auto text-gray-300" />}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#B87332]">
                  {categoryId
                    ? categoryPathLabel(categories, categoryId, currentLang) || "Kategorisiz"
                    : "Kategorisiz"}
                </p>
                <h3 className="mt-1 text-2xl font-extrabold text-[#1A1A1A]" style={styleToCss(POSITRON_NAME_STYLE)}>{currentName}</h3>
                <p className="mt-2 text-sm text-gray-600" style={styleToCss(POSITRON_SUBTITLE_STYLE)}>{currentSubtitle}</p>
                <p className="mt-3 text-sm text-gray-500" style={styleToCss(POSITRON_DESCRIPTION_STYLE)}>{currentHeroDesc}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
              <p className="font-semibold text-[#1A1A1A]">Kaydedilecek içerik</p>
              <p className="mt-2">Aktif teknik detay bölümü: {customSections.filter(s => s.enabled).length}</p>
              <p>Toplam galeri görseli: {galleryImages.length}</p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button type="button" onClick={() => setStep(2)} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 hover:border-[#B87332] hover:text-[#B87332]">
                <ChevronLeft size={16} /> Geri
              </button>
              <button type="button" disabled={loading} onClick={handleSubmit} className="inline-flex items-center gap-2 rounded-full bg-[#B87332] px-6 py-3 text-sm font-bold text-white hover:bg-[#9c6127] disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {isEdit ? "Güncelle" : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}