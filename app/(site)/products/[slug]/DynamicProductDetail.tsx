"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { ChevronRight, Plus, Minus } from "lucide-react";
import type { Product, TextStyle } from "@/lib/db";
import RichTextContent from "@/components/RichTextContent";

const styles = {
  sectionEyebrow: "text-2xl md:text-3xl font-extrabold tracking-tight text-[#B87332] mb-5",
  body: "text-sm text-[#3A3A3A] leading-relaxed font-semibold",
  bodyStack: "space-y-3 text-sm text-[#3A3A3A] leading-relaxed font-semibold",
};

function css(style?: TextStyle): CSSProperties | undefined {
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

export default function DynamicProductDetail({ product, categoryName }: { product: Product; categoryName: string | null }) {
  const { lang } = useLanguage();
  const isTr = lang === "TR";

  const [openSections, setOpenSections] = useState<{ [key: number]: boolean }>({ 0: true });
  const toggleSection = (index: number) => setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));

  const hasDescription = (product.descriptionBlocks?.length ?? 0) > 0 || product.descriptionParagraphs.length > 0;
  const hasConfigs = (product.configBlocks?.length ?? 0) > 0 || product.configs.length > 0 || Boolean(product.configNote) || Boolean(product.configNote2);
  const hasVersions = (product.versionBlocks?.length ?? 0) > 0 || product.versions.length > 0;
  const hasFeatures = (product.featureBlocks?.length ?? 0) > 0 || product.features.length > 0;

  const sections: { key: string }[] = [];
  if (hasDescription) sections.push({ key: "description" });
  if (hasConfigs) sections.push({ key: "configs" });
  if (hasVersions) sections.push({ key: "versions" });
  if (hasFeatures) sections.push({ key: "features" });
  const indexOf = (key: string) => sections.findIndex((s) => s.key === key);

  const heroImage = product.heroImage || product.images[0] || "";
  const galleryImages = product.heroImage ? product.images.filter((img) => img !== product.heroImage) : product.images.slice(1);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white font-montserrat text-[#3A3A3A]">
      <section
        className="relative flex min-h-screen w-full flex-col justify-start bg-[#3A3A3A] bg-no-repeat bg-bottom bg-[length:100%_auto] px-6 pb-20 pt-28 lg:pl-16 lg:pr-16 lg:pt-32"
        style={heroImage ? { backgroundImage: `url('${heroImage}')` } : undefined}
      >
        <div className="absolute inset-0 pointer-events-none bg-black/30" />

        <div className="relative z-10 mx-auto w-full lg:ml-[-30px]">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-[8pt] uppercase tracking-widest text-white/70">
            <Link href="/" className="transition-colors hover:text-[#B87332]">{isTr ? "Anasayfa" : "Homepage"}</Link>
            <ChevronRight size={14} />
            <Link href="/products" className="transition-colors hover:text-[#B87332]">{isTr ? "Ürünler" : "Products"}</Link>
            <ChevronRight size={14} />
            <span className="font-bold text-[#B87332]">{product.name}</span>
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-8 w-full max-w-5xl pl-0 lg:pl-12">
          <div className="flex max-w-3xl flex-col items-start gap-6">
            <div>
              {categoryName && <span className="mb-4 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white/70">{categoryName}</span>}
              <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-white md:text-[48px]" style={css(product.nameStyle)}>{product.name}</h1>
              {product.subtitle && <RichTextContent value={product.subtitle} className="mb-4 text-xl font-bold text-[#B87332] md:text-2xl" style={css(product.subtitleStyle)} /> }
              {product.heroDescription && <RichTextContent value={product.heroDescription} className="text-base font-medium leading-relaxed text-white/90" style={css(product.heroDescriptionStyle)} /> }
            </div>
          </div>
        </div>
      </section>

      {sections.length > 0 && (
        <section className="flex w-full flex-col justify-start bg-[#F3F1EC] px-6 py-20 lg:pl-16 lg:pr-16">
          <div className="relative z-10 mx-auto w-full max-w-5xl">
            <h2 className={styles.sectionEyebrow}>{isTr ? "Açıklama & Teknik Detaylar" : "Description & Technical Details"}</h2>

            <div className="space-y-4">
              {hasDescription && (
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-[#F3F1EC] shadow-sm">
                  <button onClick={() => toggleSection(indexOf("description"))} className="flex w-full cursor-pointer items-center justify-between px-6 py-5 text-left transition-colors hover:bg-gray-200/50">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#B87332] text-white transition-transform duration-300">{openSections[indexOf("description")] ? <Minus size={18} /> : <Plus size={18} />}</span>
                      <h3 className="text-lg font-extrabold text-[#3A3A3A] md:text-xl">{product.descriptionSectionTitle || (isTr ? "Açıklama & Sistem Mimarisi" : "Description & System Architecture")}</h3>
                    </div>
                  </button>
                  {openSections[indexOf("description")] && (
                    <div className="border-t border-[#B87332]/20 px-6 pb-6 pt-2">
                      <div className={styles.bodyStack}>
                        {product.descriptionBlocks?.length
                          ? product.descriptionBlocks.map((p, i) => (
                              <div key={i} className="space-y-1">
                                {p.title && <RichTextContent value={p.title} className="font-extrabold text-[#B87332]" style={css(p.titleStyle)} />}
                                <RichTextContent value={p.text} className="whitespace-pre-wrap" style={css(p.textStyle)} />
                              </div>
                            ))
                          : product.descriptionParagraphs.map((p, i) => <p key={i}>{p}</p>)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {hasConfigs && (
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-[#F3F1EC] shadow-sm">
                  <button onClick={() => toggleSection(indexOf("configs"))} className="flex w-full cursor-pointer items-center justify-between px-6 py-5 text-left transition-colors hover:bg-gray-200/50">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#B87332] text-white transition-transform duration-300">{openSections[indexOf("configs")] ? <Minus size={18} /> : <Plus size={18} />}</span>
                      <h3 className="text-lg font-extrabold text-[#3A3A3A] md:text-xl">{product.configsSectionTitle || (isTr ? "Mevcut Konfigürasyonlar" : "Available Configurations")}</h3>
                    </div>
                  </button>
                  {openSections[indexOf("configs")] && (
                    <div className="border-t border-[#B87332]/20 px-6 pb-6 pt-2 space-y-4">
                      <div className={styles.bodyStack}>
                        {product.configBlocks?.length
                          ? product.configBlocks.map((cfg, i) => (
                              <div key={i} className="space-y-1">
                                <RichTextContent value={cfg.title || `${isTr ? "Konfigürasyon" : "Configuration"} ${i + 1}`} className="font-extrabold text-[#B87332]" style={css(cfg.titleStyle)} />
                                <RichTextContent value={cfg.text} className="whitespace-pre-wrap" style={css(cfg.textStyle)} />
                              </div>
                            ))
                          : product.configs.map((cfg, i) => (
                              <p key={i}>
                                <strong className="font-extrabold text-[#B87332]">{cfg.name}: </strong>
                                {cfg.text}
                              </p>
                            ))}
                      </div>
                      {product.configNote && <p className={styles.body} style={css(product.configNoteStyle)}>{product.configNote}</p>}
                      {product.configNote2 && <p className={styles.body} style={css(product.configNote2Style)}>{product.configNote2}</p>}
                    </div>
                  )}
                </div>
              )}

              {hasVersions && (
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-[#F3F1EC] shadow-sm">
                  <button onClick={() => toggleSection(indexOf("versions"))} className="flex w-full cursor-pointer items-center justify-between px-6 py-5 text-left transition-colors hover:bg-gray-200/50">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#B87332] text-white transition-transform duration-300">{openSections[indexOf("versions")] ? <Minus size={18} /> : <Plus size={18} />}</span>
                      <h3 className="text-lg font-extrabold text-[#3A3A3A] md:text-xl">{isTr ? "Mevcut Versiyonlar & Opsiyonlar" : "Available Versions & Options"}</h3>
                    </div>
                  </button>
                  {openSections[indexOf("versions")] && (
                    <div className="border-t border-[#B87332]/20 px-6 pb-6 pt-2 space-y-4">
                      <div className={styles.bodyStack}>
                        {product.versionBlocks?.length
                          ? product.versionBlocks.map((v, i) => (
                              <div key={i} className="space-y-1">
                                <RichTextContent value={v.title || `${isTr ? "Versiyon" : "Version"} ${i + 1}`} className="font-extrabold text-[#B87332]" style={css(v.titleStyle)} />
                                <RichTextContent value={v.text} className="whitespace-pre-wrap" style={css(v.textStyle)} />
                              </div>
                            ))
                          : product.versions.map((v, i) => (
                              <p key={i}>
                                <strong className="font-extrabold text-[#B87332]">{v.label}: </strong>
                                {v.text}
                              </p>
                            ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {hasFeatures && (
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-[#F3F1EC] shadow-sm">
                  <button onClick={() => toggleSection(indexOf("features"))} className="flex w-full cursor-pointer items-center justify-between px-6 py-5 text-left transition-colors hover:bg-gray-200/50">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#B87332] text-white transition-transform duration-300">{openSections[indexOf("features")] ? <Minus size={18} /> : <Plus size={18} />}</span>
                      <h3 className="text-lg font-extrabold text-[#3A3A3A] md:text-xl">{isTr ? "Temel Özellikler" : "Main Features"}</h3>
                    </div>
                  </button>
                  {openSections[indexOf("features")] && (
                    <div className="border-t border-[#B87332]/20 px-6 pb-6 pt-2">
                      <div className={styles.bodyStack}>
                        {product.featureBlocks?.length
                          ? product.featureBlocks.map((f, i) => (
                              <div key={i} className="space-y-1">
                                {f.title && <RichTextContent value={f.title} className="font-extrabold text-[#B87332]" style={css(f.titleStyle)} />}
                                <RichTextContent value={f.text} className="whitespace-pre-wrap" style={css(f.textStyle)} />
                              </div>
                            ))
                          : product.features.map((f, i) => (
                              <p key={i}>
                                <strong className="font-extrabold text-[#B87332]">• </strong>
                                {f}
                              </p>
                            ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {galleryImages.length > 0 && (
        <section className="w-full bg-white px-6 py-20 lg:pl-16 lg:pr-16">
          <div className="mx-auto w-full max-w-5xl">
            <h2 className={styles.sectionEyebrow}>{isTr ? "Örnek Görseller" : "Sample Images"}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((src, index) => (
                <div key={`${src}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm">
                  <Image src={src} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}