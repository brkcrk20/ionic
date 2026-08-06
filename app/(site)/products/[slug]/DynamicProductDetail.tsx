"use client";

import { useState, useRef, useEffect } from "react";
import type { CSSProperties, MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { ChevronRight, Plus, Minus, X, ChevronLeft } from "lucide-react";
import type { Product, TextStyle, MultiLangString } from "@/lib/db";
import RichTextContent from "@/components/RichTextContent";

const styles = {
  sectionEyebrow: "text-2xl md:text-3xl font-extrabold tracking-tight text-[#B87332] mb-0",
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

function getLangText(val: MultiLangString | undefined, isTr: boolean): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return isTr ? (val.tr || val.en || "") : (val.en || val.tr || "");
}

export default function DynamicProductDetail({ product, category }: { product: Product; category: any | null }) {
  const { lang } = useLanguage();
  const isTr = lang === "TR";

  const categoryName = category ? getLangText(category.name, isTr) : null;

  const [openSections, setOpenSections] = useState<{ [key: number]: boolean }>({ 0: true });
  const toggleSection = (index: number) => setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));

  // Büyük önizleme (Lightbox) için seçilen görselin indeksi
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const hasMoved = useRef(false);
  
  const velocity = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  const stopMomentum = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    stopMomentum();
    isDragging.current = true;
    hasMoved.current = false;
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
    lastX.current = e.pageX;
    lastTime.current = performance.now();
  };

  const handleMouseLeave = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const applyMomentum = () => {
      if (Math.abs(velocity.current) > 0.1 && sliderRef.current) {
        sliderRef.current.scrollLeft -= velocity.current;
        velocity.current *= 0.95;
        animationFrameId.current = requestAnimationFrame(applyMomentum);
      } else {
        stopMomentum();
      }
    };
    applyMomentum();
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !sliderRef.current) return;
    e.preventDefault();

    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = x - startX.current;

    if (Math.abs(walk) > 5) {
      hasMoved.current = true;
    }

    const now = performance.now();
    const dt = now - lastTime.current;
    const dx = e.pageX - lastX.current;

    if (dt > 0) {
      velocity.current = (dx / dt) * 15;
    }

    lastX.current = e.pageX;
    lastTime.current = now;

    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const scrollGallery = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    stopMomentum();
    const scrollAmount = 400;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Klavye olayları (Sağ, Sol ve Esc tuşları)
  useEffect(() => {
    if (selectedImageIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setSelectedImageIndex((prev) => (prev !== null && prev < galleryImages.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowLeft") {
        setSelectedImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : galleryImages.length - 1));
      } else if (e.key === "Escape") {
        setSelectedImageIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex]);

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

  const heroImage = product.heroImage || product.images[1] || product.images[0] || "";
  const galleryImages = (product.images || []).filter((img, index) => index > 0 && img !== product.heroImage);

  const productName = getLangText(product.name, isTr);
  const productSubtitle = getLangText(product.subtitle, isTr);
  const productHeroDesc = getLangText(product.heroDescription, isTr);
  
  const descSectionTitle = getLangText(product.descriptionSectionTitle, isTr);
  const configsSectionTitle = getLangText(product.configsSectionTitle, isTr);
  const versionsSectionTitle = getLangText(product.versionsSectionTitle, isTr);
  const featuresSectionTitle = getLangText(product.featuresSectionTitle, isTr);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white font-montserrat text-[#3A3A3A]">
      <section
        className="relative flex min-h-screen w-full flex-col justify-start bg-[#3A3A3A] bg-no-repeat bg-bottom bg-[length:100%_auto] px-6 pb-20 pt-28 lg:pl-16 lg:pr-16 lg:pt-32"
        style={heroImage ? { backgroundImage: `url('${heroImage}')` } : undefined}
      >
        <div className="relative z-10 mx-auto w-full lg:ml-[-30px]">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-[8pt] uppercase tracking-widest text-white/70">
            <Link href="/" className="transition-colors hover:text-[#B87332]">{isTr ? "Anasayfa" : "Homepage"}</Link>
            <ChevronRight size={14} />
            <Link href="/products" className="transition-colors hover:text-[#B87332]">{isTr ? "Ürünler" : "Products"}</Link>
            <ChevronRight size={14} />
            <span className="font-bold text-[#B87332]">{productName}</span>
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-8 w-full max-w-5xl pl-0 lg:pl-12">
          <div className="flex max-w-3xl flex-col items-start gap-6">
            <div>
              {categoryName && <span className="mb-4 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white/70">{categoryName}</span>}
              <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-white md:text-[48px]" style={css(product.nameStyle)}>{productName}</h1>
              {productSubtitle && <RichTextContent value={productSubtitle} className="mb-4 text-xl font-bold text-[#B87332] md:text-2xl" style={css(product.subtitleStyle)} /> }
              {productHeroDesc && <RichTextContent value={productHeroDesc} className="text-base font-medium leading-relaxed text-white/90" style={css(product.heroDescriptionStyle)} /> }
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
                      {descSectionTitle && <h3 className="text-lg font-extrabold text-[#3A3A3A] md:text-xl">{descSectionTitle}</h3>}
                    </div>
                  </button>
                  {openSections[indexOf("description")] && (
                    <div className="border-t border-[#B87332]/20 px-6 pb-6 pt-2">
                      <div className={styles.bodyStack}>
                        {product.descriptionBlocks?.length
                          ? product.descriptionBlocks.map((p, i) => (
                              <div key={i} className="space-y-1">
                                {getLangText(p.title, isTr) && <RichTextContent value={getLangText(p.title, isTr)} className="font-extrabold text-[#B87332]" style={css(p.titleStyle)} />}
                                <RichTextContent value={getLangText(p.text, isTr)} className="whitespace-pre-wrap" style={css(p.textStyle)} />
                              </div>
                            ))
                          : product.descriptionParagraphs.map((p, i) => <p key={i}>{getLangText(p, isTr)}</p>)}
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
                      {configsSectionTitle && <h3 className="text-lg font-extrabold text-[#3A3A3A] md:text-xl">{configsSectionTitle}</h3>}
                    </div>
                  </button>
                  {openSections[indexOf("configs")] && (
                    <div className="border-t border-[#B87332]/20 px-6 pb-6 pt-2 space-y-4">
                      <div className={styles.bodyStack}>
                        {product.configBlocks?.length
                          ? product.configBlocks.map((cfg, i) => (
                              <div key={i} className="space-y-1">
                                <RichTextContent value={getLangText(cfg.title, isTr)} className="font-extrabold text-[#B87332]" style={css(cfg.titleStyle)} />
                                <RichTextContent value={getLangText(cfg.text, isTr)} className="whitespace-pre-wrap" style={css(cfg.textStyle)} />
                              </div>
                            ))
                          : product.configs.map((cfg, i) => (
                              <p key={i}>
                                <strong className="font-extrabold text-[#B87332]">{getLangText(cfg.name, isTr)}: </strong>
                                {getLangText(cfg.text, isTr)}
                              </p>
                            ))}
                      </div>
                      {product.configNote && <p className={styles.body} style={css(product.configNoteStyle)}>{getLangText(product.configNote, isTr)}</p>}
                      {product.configNote2 && <p className={styles.body} style={css(product.configNote2Style)}>{getLangText(product.configNote2, isTr)}</p>}
                    </div>
                  )}
                </div>
              )}

              {hasVersions && (
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-[#F3F1EC] shadow-sm">
                  <button onClick={() => toggleSection(indexOf("versions"))} className="flex w-full cursor-pointer items-center justify-between px-6 py-5 text-left transition-colors hover:bg-gray-200/50">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#B87332] text-white transition-transform duration-300">{openSections[indexOf("versions")] ? <Minus size={18} /> : <Plus size={18} />}</span>
                      {versionsSectionTitle && <h3 className="text-lg font-extrabold text-[#3A3A3A] md:text-xl">{versionsSectionTitle}</h3>}
                    </div>
                  </button>
                  {openSections[indexOf("versions")] && (
                    <div className="border-t border-[#B87332]/20 px-6 pb-6 pt-2 space-y-4">
                      <div className={styles.bodyStack}>
                        {product.versionBlocks?.length
                          ? product.versionBlocks.map((v, i) => (
                              <div key={i} className="space-y-1">
                                <RichTextContent value={getLangText(v.title, isTr)} className="font-extrabold text-[#B87332]" style={css(v.titleStyle)} />
                                <RichTextContent value={getLangText(v.text, isTr)} className="whitespace-pre-wrap" style={css(v.textStyle)} />
                              </div>
                            ))
                          : product.versions.map((v, i) => (
                              <p key={i}>
                                <strong className="font-extrabold text-[#B87332]">{getLangText(v.label, isTr)}: </strong>
                                {getLangText(v.text, isTr)}
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
                      {featuresSectionTitle && <h3 className="text-lg font-extrabold text-[#3A3A3A] md:text-xl">{featuresSectionTitle}</h3>}
                    </div>
                  </button>
                  {openSections[indexOf("features")] && (
                    <div className="border-t border-[#B87332]/20 px-6 pb-6 pt-2">
                      <div className={styles.bodyStack}>
                        {product.featureBlocks?.length
                          ? product.featureBlocks.map((f, i) => (
                              <div key={i} className="space-y-1">
                                {getLangText(f.title, isTr) && <RichTextContent value={getLangText(f.title, isTr)} className="font-extrabold text-[#B87332]" style={css(f.titleStyle)} />}
                                <RichTextContent value={getLangText(f.text, isTr)} className="whitespace-pre-wrap" style={css(f.textStyle)} />
                              </div>
                            ))
                          : product.features.map((f, i) => (
                              <p key={i}>
                                <strong className="font-extrabold text-[#B87332]">• </strong>
                                {getLangText(f, isTr)}
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

      {/* FOTOĞRAF GALERİSİ */}
      {galleryImages.length > 0 && (
        <section className="w-full bg-white px-6 py-20 lg:pl-16 lg:pr-16 border-t border-gray-100">
          <div className="mx-auto w-full max-w-5xl">
            
            <div className="mb-8 border-b border-gray-200 pb-6">
              <h2 className={styles.sectionEyebrow}>
                {isTr ? "Fotoğraflar & Videolar" : "Photos & Videos"}
              </h2>
            </div>

            <div
              ref={sliderRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              style={{ WebkitOverflowScrolling: "touch" }}
              className="flex gap-5 overflow-x-auto pb-4 pt-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing select-none [overflow-anchor:none]"
            >
              {galleryImages.map((src, index) => (
                <div
                  key={`${src}-${index}`}
                  onClick={() => {
                    if (!hasMoved.current) {
                      setSelectedImageIndex(index);
                    }
                  }}
                  className="relative aspect-[4/3] w-[300px] md:w-[380px] shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm transition-transform hover:scale-[1.02]"
                >
                  <Image src={src} alt={`${productName} ${index + 1}`} fill className="object-cover pointer-events-none" />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-6">
              <button
                onClick={() => scrollGallery("left")}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#B87332] bg-white text-[#B87332] shadow-sm transition-colors hover:bg-[#B87332] hover:text-white"
                aria-label="Önceki Görsel"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scrollGallery("right")}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#B87332] bg-white text-[#B87332] shadow-sm transition-colors hover:bg-[#B87332] hover:text-white"
                aria-label="Sonraki Görsel"
              >
                <ChevronRight size={20} />
              </button>
            </div>

          </div>
        </section>
      )}

      {/* BÜYÜK BOY ÖNİZLEME (LIGHTBOX) - KLAVYE VE OK DESTEKLİ */}
      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedImageIndex(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl bg-black shadow-2xl flex items-center justify-center p-12" onClick={(e) => e.stopPropagation()}>
            
            {/* Kapat Butonu */}
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-[#B87332]"
              aria-label="Kapat"
            >
              <X size={24} />
            </button>

            {/* Sol Ok */}
            {galleryImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : galleryImages.length - 1));
                }}
                className="absolute left-4 z-20 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-[#B87332]"
                aria-label="Önceki"
              >
                <ChevronLeft size={28} />
              </button>
            )}

            {/* Aktif Büyük Görsel */}
            <div className="relative h-[80vh] w-[80vw]">
              <Image 
                src={galleryImages[selectedImageIndex]} 
                alt="Önizleme" 
                fill 
                className="object-contain" 
              />
            </div>

            {/* Sağ Ok */}
            {galleryImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((prev) => (prev !== null && prev < galleryImages.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-4 z-20 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-[#B87332]"
                aria-label="Sonraki"
              >
                <ChevronRight size={28} />
              </button>
            )}

          </div>
        </div>
      )}
    </div>
  );
}