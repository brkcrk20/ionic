"use client";

import { useMemo, useState } from "react";
import type { ChangeEvent, Dispatch, SetStateAction, CSSProperties } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Check, Image as ImageIcon, Loader2, Minus, Plus, Upload, X } from "lucide-react";
import type { Category, Product, ProductConfig, ProductVersion, StyledPair, TextStyle } from "@/lib/db";
import RichTextEditor from "@/components/RichTextEditor";

type WizardStep = 1 | 2 | 3;

interface CustomSection {
  id: string;
  title: string;
  enabled: boolean;
  open: boolean;
  blocks: StyledPair[];
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

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function makePair(title = "", text = ""): StyledPair {
  return { title, text };
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

export default function ProductWizardForm({ product, categories }: { product: Product | null; categories: Category[] }) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const initialHero = product?.heroImage || product?.images?.[0] || "";
  const initialGallery = useMemo(() => {
    if (!product) return [] as string[];
    if (product.heroImage) return product.images.filter((img) => img !== product.heroImage);
    return product.images.slice(1);
  }, [product]);

  const [step, setStep] = useState<WizardStep>(1);
  const [loading, setLoading] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(product?.name ?? "");
  const [subtitleHtml, setSubtitleHtml] = useState(product?.subtitle ?? "");
  const [heroDescriptionHtml, setHeroDescriptionHtml] = useState(product?.heroDescription ?? "");
  const nameStyle = POSITRON_NAME_STYLE;
  const subtitleStyle = POSITRON_SUBTITLE_STYLE;
  const heroDescriptionStyle = POSITRON_DESCRIPTION_STYLE;
  const [heroImage, setHeroImage] = useState(initialHero);
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [active, setActive] = useState(product?.active ?? true);

  // Tüm başlıklar Teknik Detay 1, 2, 3, 4 olarak başlatıldı ve tamamen sınırsız eklenebilir hale getirildi
  const [customSections, setCustomSections] = useState<CustomSection[]>([
    {
      id: "desc",
      title: product?.descriptionSectionTitle || "Teknik Detay 1",
      enabled: (product?.descriptionBlocks?.length ?? 0) > 0 || (product?.descriptionParagraphs?.length ?? 0) > 0 || true,
      open: true,
      blocks: product?.descriptionBlocks?.length
        ? clone(product.descriptionBlocks)
        : product?.descriptionParagraphs?.length
        ? product.descriptionParagraphs.map((text, index) => makePair(`Detay ${index + 1}`, text))
        : [makePair("Detay 1", "")],
    },
    {
      id: "configs",
      title: product?.configsSectionTitle || "Teknik Detay 2",
      enabled: (product?.configBlocks?.length ?? 0) > 0 || (product?.configs?.length ?? 0) > 0 || Boolean(product?.configNote),
      open: true,
      blocks: product?.configBlocks?.length
        ? clone(product.configBlocks)
        : product?.configs?.length
        ? product.configs.map((item) => makePair(item.name, item.text))
        : [makePair("", "")],
    },
    {
      id: "versions",
      title: product?.versionsSectionTitle || "Teknik Detay 3",
      enabled: (product?.versionBlocks?.length ?? 0) > 0 || (product?.versions?.length ?? 0) > 0,
      open: true,
      blocks: product?.versionBlocks?.length
        ? clone(product.versionBlocks)
        : product?.versions?.length
        ? product.versions.map((item) => makePair(item.label, item.text))
        : [makePair("", "")],
    },
    {
      id: "features",
      title: product?.featuresSectionTitle || "Teknik Detay 4",
      enabled: (product?.featureBlocks?.length ?? 0) > 0 || (product?.features?.length ?? 0) > 0,
      open: true,
      blocks: product?.featureBlocks?.length
        ? clone(product.featureBlocks)
        : product?.features?.length
        ? product.features.map((text) => makePair("", text))
        : [makePair("", "")],
    },
  ]);

  const [galleryImages, setGalleryImages] = useState<string[]>(initialGallery);

  // Sınırsız yeni "Teknik Detay X" bölümü ekleme fonksiyonu
  function addNewSection() {
    const newId = `section-${Date.now()}`;
    setCustomSections((prev) => [
      ...prev,
      {
        id: newId,
        title: `Teknik Detay ${prev.length + 1}`,
        enabled: true,
        open: true,
        blocks: [makePair("", "")],
      },
    ]);
  }

  // Bölümü tamamen silme
  function removeSection(sectionId: string) {
    setCustomSections((prev) => prev.filter((sec) => sec.id !== sectionId));
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

  function buildPayload() {
    const descSec = customSections[0];
    const confSec = customSections[1];
    const versSec = customSections[2];
    const featSec = customSections[3];

    const filteredDescription = descSec?.enabled
      ? descSec.blocks.filter((item) => stripHtml(item.title).length > 0 || stripHtml(item.text).length > 0)
      : [];
    const filteredConfigs = confSec?.enabled ? confSec.blocks.filter((item) => stripHtml(item.title).length > 0 || stripHtml(item.text).length > 0) : [];
    const filteredVersions = versSec?.enabled ? versSec.blocks.filter((item) => stripHtml(item.title).length > 0 || stripHtml(item.text).length > 0) : [];
    const filteredFeatures = featSec?.enabled ? featSec.blocks.filter((item) => stripHtml(item.title).length > 0 || stripHtml(item.text).length > 0) : [];

    const images = [heroImage, ...galleryImages].filter(Boolean);

    return {
      name,
      subtitle: subtitleHtml,
      heroDescription: heroDescriptionHtml,
      heroImage,
      categoryId: categoryId || null,
      active,
      nameStyle: POSITRON_NAME_STYLE,
      subtitleStyle: POSITRON_SUBTITLE_STYLE,
      heroDescriptionStyle: POSITRON_DESCRIPTION_STYLE,
      descriptionBlocks: filteredDescription,
      descriptionParagraphs: filteredDescription.map((item) => stripHtml(item.text)),
      configs: filteredConfigs.map((item) => ({ name: stripHtml(item.title), text: item.text })) as ProductConfig[],
      configBlocks: filteredConfigs,
      configNote: "",
      configNote2: "",
      versions: filteredVersions.map((item) => ({ label: stripHtml(item.title), text: item.text })) as ProductVersion[],
      versionBlocks: filteredVersions,
      features: filteredFeatures.map((item) => stripHtml(item.text)),
      featureBlocks: filteredFeatures,
      images,
      descriptionSectionTitle: descSec?.enabled ? descSec.title : "",
      configsSectionTitle: confSec?.enabled ? confSec.title : "",
      versionsSectionTitle: versSec?.enabled ? versSec.title : "",
      featuresSectionTitle: featSec?.enabled ? featSec.title : "",
    };
  }

  async function handleSubmit() {
    if (!name.trim()) {
      setError("Ürün ismi gerekli");
      return;
    }
    if (!heroImage.trim()) {
      setError("İlk büyük resim gerekli");
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

  return (
    <div className="mx-auto w-full max-w-6xl pb-16">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B87332]">Ürün Sayfası</p>
          <h1 className="mt-2 text-3xl font-extrabold text-[#1A1A1A]">{isEdit ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</h1>
          <p className="mt-2 text-sm text-gray-500">Kutucuk değil, adım adım ilerleyen ürün oluşturma ekranı.</p>
        </div>
        <Link href="/admin" className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:border-[#B87332] hover:text-[#B87332]">
          Geri dön
        </Link>
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
            {s === 1 ? "Temel Bilgiler" : s === 2 ? "İçerik & Akordiyon" : "Görseller"}
          </button>
        ))}
      </div>

      {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

      {step === 1 && (
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <label className="mb-2 block text-sm font-bold text-[#1A1A1A]">Ürün ismi</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-[#B87332]"
                placeholder="Örn: POSITRON 60"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#1A1A1A]">Kısa açıklama</label>
              <input
                value={subtitleHtml}
                onChange={(e) => setSubtitleHtml(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-[#B87332]"
                placeholder="Ürünün kısa açıklaması"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#1A1A1A]">Ürün tanımı</label>
              <textarea
                value={heroDescriptionHtml}
                onChange={(e) => setHeroDescriptionHtml(e.target.value)}
                rows={7}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-[#B87332]"
                placeholder="Ürünün giriş metnini buraya yazın..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#1A1A1A]">Kategori</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-[#B87332]">
                <option value="">Kategorisiz</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
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
              <p className="text-xs text-gray-500">Bu adımda sadece temel bilgiler var.</p>
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm lg:p-6">
            <div className="flex items-center gap-2 text-sm font-bold text-[#1A1A1A]">
              <ImageIcon size={18} className="text-[#B87332]" /> İlk büyük resim
            </div>

            <div className="rounded-[2rem] border border-[#1A1A1A]/10 bg-[#1A1A1A] p-3 shadow-2xl">
              <div className="rounded-[1.4rem] bg-[#EDEDED] p-3">
                <div className="mb-3 flex items-center justify-between px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6A6A6A]">
                  <span>Ürün önizleme ekranı</span>
                  <span>{heroImage ? "Görsel bağlı" : "Görsel bekleniyor"}</span>
                </div>

                <div className="overflow-hidden rounded-[1.3rem] border border-black/10 bg-[#3A3A3A]">
                  <div
                    className="relative mx-auto flex min-h-[610px] w-full flex-col justify-start bg-[#3A3A3A] bg-no-repeat bg-bottom bg-[length:100%_auto] px-5 pb-16 pt-24"
                    style={heroPreviewStyle}
                  >
                    <div className="absolute inset-0 pointer-events-none bg-black/30" />

                    <div className="relative z-10 mx-auto w-full">
                      <div className="mb-4 flex flex-wrap items-center gap-2 text-[8pt] uppercase tracking-widest text-white/70">
                        <span>Anasayfa</span>
                        <ChevronRight size={14} />
                        <span>Ürünler</span>
                        <ChevronRight size={14} />
                        <span className="font-bold text-[#B87332]">{name || "Ürün"}</span>
                      </div>
                    </div>

                    <div className="relative z-10 mx-auto mt-6 w-full max-w-5xl pl-0">
                      <div className="flex max-w-3xl flex-col items-start gap-4">
                        <div>
                          <h2 className="mb-2 text-4xl font-extrabold tracking-tight text-white md:text-[48px]" style={styleToCss(nameStyle)}>{name || "Ürün adı"}</h2>
                          <p className="mb-4 text-xl font-bold text-[#B87332] md:text-2xl" style={styleToCss(subtitleStyle)}>{subtitleHtml || "Kısa açıklama"}</p>
                          <p className="text-base font-medium leading-relaxed text-white/90" style={styleToCss(heroDescriptionStyle)}>{heroDescriptionHtml || "Ürün tanımı"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:border-[#B87332] hover:text-[#B87332]">
              {uploadingHero ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              Büyük görsel yükle
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
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          {/* Üst kısımda yeni teknik detay ekleme butonu */}
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-4">
            <div>
              <h2 className="text-lg font-extrabold text-[#1A1A1A]">Teknik Detaylar</h2>
              <p className="text-xs text-gray-500">İstediğiniz kadar teknik detay ekleyip silebilirsiniz.</p>
            </div>
            <button
              type="button"
              onClick={addNewSection}
              className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] px-4 py-2 text-xs font-bold text-white hover:bg-black"
            >
              <Plus size={16} /> Yeni Teknik Detay Ekle
            </button>
          </div>

          {/* Sınırsız dinamik teknik detay bölümleri listesi */}
          {customSections.map((section, sIndex) => (
            <div key={section.id} className="overflow-hidden rounded-3xl border border-gray-200 bg-[#F9F8F6] relative">
              <div className="flex w-full items-center justify-between gap-4 px-5 py-4">
                <button
                  type="button"
                  onClick={() => {
                    setCustomSections((prev) =>
                      prev.map((sec) => (sec.id === section.id ? { ...sec, open: !sec.open } : sec))
                    );
                  }}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${section.enabled ? "bg-[#B87332]" : "bg-gray-400"}`}>
                    {section.open ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#1A1A1A]">{section.title || `Teknik Detay ${sIndex + 1}`}</p>
                    <p className="text-xs text-gray-500">{section.enabled ? "Aktif" : "Kapalı"}</p>
                  </div>
                </button>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-600">
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
              </div>

              {section.enabled && section.open && (
                <div className="border-t border-gray-200 bg-white px-5 py-5">
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">Teknik detay başlığı</label>
                      <input
                        value={section.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomSections((prev) =>
                            prev.map((sec) => (sec.id === section.id ? { ...sec, title: val } : sec))
                          );
                        }}
                        placeholder="Örn: Teknik Detay 1"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-[#1A1A1A] outline-none focus:border-[#B87332]"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base font-extrabold text-[#1A1A1A]">İçerik Blokları</h3>
                      <button
                        type="button"
                        onClick={() => {
                          setCustomSections((prev) =>
                            prev.map((sec) =>
                              sec.id === section.id
                                ? { ...sec, blocks: [...sec.blocks, makePair("", "")] }
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
                          <p className="text-sm font-bold text-[#1A1A1A]">Satır {bIndex + 1}</p>
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
                              className="rounded-full p-2 text-gray-500 hover:text-red-600"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>

                        <div className="space-y-3">
                          <input
                            value={block.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCustomSections((prev) =>
                                prev.map((sec) =>
                                  sec.id === section.id
                                    ? {
                                        ...sec,
                                        blocks: sec.blocks.map((b, i) => (i === bIndex ? { ...b, title: val } : b)),
                                      }
                                    : sec
                                )
                              );
                            }}
                            placeholder="Başlık..."
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#1A1A1A] outline-none focus:border-[#B87332]"
                          />
                          <RichTextEditor
                            value={block.text}
                            onChange={(text) => {
                              setCustomSections((prev) =>
                                prev.map((sec) =>
                                  sec.id === section.id
                                    ? {
                                        ...sec,
                                        blocks: sec.blocks.map((b, i) => (i === bIndex ? { ...b, text } : b)),
                                      }
                                    : sec
                                )
                              );
                            }}
                            minHeight={170}
                            placeholder="Açıklama metni..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-[#1A1A1A]">Alt resimler</h2>
            <p className="text-sm text-gray-500">Ürün sayfasının en altındaki örnek görseller burada tutulur.</p>
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

          <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-[#1A1A1A]">Önizleme özeti</h2>
            <div className="space-y-4 rounded-3xl border border-gray-200 bg-gray-50 p-4">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gray-100">
                {heroImage ? <Image src={heroImage} alt={name || "Ürün"} fill className="object-cover" /> : <ImageIcon size={42} className="absolute inset-0 m-auto text-gray-300" />}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#B87332]">{categoryId ? categories.find((c) => c.id === categoryId)?.name ?? "Kategorisiz" : "Kategorisiz"}</p>
                <h3 className="mt-1 text-2xl font-extrabold text-[#1A1A1A]" style={styleToCss(nameStyle)}>{name || "Ürün adı"}</h3>
                <p className="mt-2 text-sm text-gray-600" style={styleToCss(subtitleStyle)}>{subtitleHtml || "Kısa açıklama"}</p>
                <p className="mt-3 text-sm text-gray-500" style={styleToCss(heroDescriptionStyle)}>{heroDescriptionHtml || "Ürün tanımı"}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
              <p className="font-semibold text-[#1A1A1A]">Kaydedilecek içerik</p>
              <p className="mt-2">Toplam aktif teknik detay bölümü: {customSections.filter(s => s.enabled).length}</p>
              <p>Hero görsel + galeri toplamı: {1 + galleryImages.length}</p>
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