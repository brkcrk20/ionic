"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/db";
import { ChevronRight, Plus, Minus } from "lucide-react";

const styles = {
  sectionEyebrow: "text-2xl md:text-3xl font-extrabold tracking-tight text-[#B87332] mb-5",
  bodyStack: "space-y-3 text-sm text-[#3A3A3A] leading-relaxed font-semibold",
};

export default function ProductDetailView({
  product,
  categoryName,
}: {
  product: Product;
  categoryName: string | null;
}) {
  const [openSections, setOpenSections] = useState<{ [key: number]: boolean }>({ 0: true });

  const toggleSection = (index: number) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const heroImage = product.images[0] ?? null;
  const descriptionParagraphs = product.description
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  const hasDescription = descriptionParagraphs.length > 0;
  const hasSpecs = product.specs.length > 0;
  const hasConfigurations = product.configurations.length > 0;
  const hasGallery = product.gallery.length > 0;

  // Akordiyon sırası: sadece dolu olan bölümler gösterilir, index'ler dinamik atanır.
  let sectionIndex = 0;
  const descriptionIndex = hasDescription ? sectionIndex++ : -1;
  const configIndex = hasConfigurations ? sectionIndex++ : -1;
  const specsIndex = hasSpecs ? sectionIndex++ : -1;

  return (
    <div className="w-full min-h-screen bg-white relative font-montserrat text-[#3A3A3A] overflow-x-hidden">
      {/* HERO */}
      <section
        className="w-full min-h-[60vh] relative flex flex-col justify-start px-6 lg:pl-16 lg:pr-16 pt-28 lg:pt-32 pb-20 bg-[#3A3A3A] bg-no-repeat bg-bottom bg-cover"
        style={heroImage ? { backgroundImage: `url('${heroImage}')` } : undefined}
      >
        {!heroImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#3A3A3A] to-[#1f1f1f]" />
        )}
        <div className="absolute inset-0 bg-black/40" />

        <div className="w-full lg:ml-[-30px] mx-auto relative z-10 -mt-6">
          <div className="text-[8pt] uppercase tracking-widest text-white/70 mb-4 flex flex-wrap items-center gap-2">
            <Link href="/" className="hover:text-[#B87332] transition-colors">
              Anasayfa
            </Link>
            <ChevronRight size={14} />
            <Link href="/products" className="hover:text-[#B87332] transition-colors">
              Ürünler
            </Link>
            <ChevronRight size={14} />
            <span className="text-[#B87332] font-bold">{product.name}</span>
          </div>
        </div>

        <div className="w-full max-w-5xl mx-auto relative z-10 mt-8 pl-0 lg:pl-12">
          <div className="max-w-3xl flex flex-col items-start gap-6">
            <div>
              {categoryName && (
                <p className="text-sm font-bold uppercase tracking-widest text-[#B87332] mb-2">
                  {categoryName}
                </p>
              )}
              <h1 className="text-4xl md:text-[48px] font-extrabold tracking-tight text-white mb-2">
                {product.name}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* AÇIKLAMA / KONFIGÜRASYON / TEKNİK ÖZELLİKLER (opsiyonel akordiyon bölümleri) */}
      {(hasDescription || hasConfigurations || hasSpecs) && (
        <section className="w-full bg-[#F3F1EC] flex flex-col justify-start px-6 lg:pl-16 lg:pr-16 py-20">
          <div className="w-full max-w-5xl mx-auto relative z-10">
            <h2 className={styles.sectionEyebrow}>Açıklama & Teknik Detaylar</h2>

            <div className="space-y-4">
              {hasDescription && (
                <div className="bg-[#F3F1EC] rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300">
                  <button
                    onClick={() => toggleSection(descriptionIndex)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer hover:bg-gray-200/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#B87332] text-white flex items-center justify-center shrink-0 transition-transform duration-300">
                        {openSections[descriptionIndex] ? <Minus size={18} /> : <Plus size={18} />}
                      </span>
                      <h3 className="text-lg md:text-xl font-extrabold text-[#3A3A3A]">Açıklama</h3>
                    </div>
                  </button>
                  {openSections[descriptionIndex] && (
                    <div className="px-6 pb-6 pt-2 border-t border-[#B87332]/20">
                      <div className={styles.bodyStack}>
                        {descriptionParagraphs.map((p, i) => (
                          <p key={i}>{p}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {hasConfigurations && (
                <div className="bg-[#F3F1EC] rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300">
                  <button
                    onClick={() => toggleSection(configIndex)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer hover:bg-gray-200/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#B87332] text-white flex items-center justify-center shrink-0 transition-transform duration-300">
                        {openSections[configIndex] ? <Minus size={18} /> : <Plus size={18} />}
                      </span>
                      <h3 className="text-lg md:text-xl font-extrabold text-[#3A3A3A]">
                        Mevcut Konfigürasyonlar
                      </h3>
                    </div>
                  </button>
                  {openSections[configIndex] && (
                    <div className="px-6 pb-6 pt-2 border-t border-[#B87332]/20 space-y-4">
                      <div className={styles.bodyStack}>
                        {product.configurations.map((cfg, i) => (
                          <p key={i}>
                            <strong className="text-[#B87332] font-extrabold">{cfg.title}: </strong>
                            {cfg.description}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {hasSpecs && (
                <div className="bg-[#F3F1EC] rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300">
                  <button
                    onClick={() => toggleSection(specsIndex)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer hover:bg-gray-200/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#B87332] text-white flex items-center justify-center shrink-0 transition-transform duration-300">
                        {openSections[specsIndex] ? <Minus size={18} /> : <Plus size={18} />}
                      </span>
                      <h3 className="text-lg md:text-xl font-extrabold text-[#3A3A3A]">
                        Teknik Özellikler
                      </h3>
                    </div>
                  </button>
                  {openSections[specsIndex] && (
                    <div className="px-6 pb-6 pt-2 border-t border-[#B87332]/20">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                        {product.specs.map((s, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between border-b border-[#B87332]/10 py-1.5 text-sm"
                          >
                            <span className="font-bold text-[#3A3A3A]">{s.label}</span>
                            <span className="text-[#3A3A3A]/80 font-semibold">
                              {s.value}
                              {s.unit ? ` ${s.unit}` : ""}
                            </span>
                          </div>
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

      {/* ALT TARAFTAKİ FOTOĞRAFLAR (opsiyonel galeri) */}
      {hasGallery && (
        <section className="w-full bg-[#F3F1EC] flex flex-col justify-center px-6 lg:pl-20 lg:pr-16 py-20">
          <div className="w-full max-w-[1500px] mx-auto relative z-10 flex flex-col gap-6">
            <h2 className={styles.sectionEyebrow}>Fotoğraflar</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.gallery.map((photo, index) => (
                <div
                  key={index}
                  className="relative w-full h-[280px] md:h-[320px] bg-black/80 border-2 border-[#B87332] rounded-3xl shadow-[0_0_30px_rgba(184,115,50,0.2)] overflow-hidden group"
                >
                  <img
                    src={photo}
                    alt={`${product.name} fotoğraf ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hiçbir opsiyonel içerik girilmediyse en azından bir görsel gösterilsin */}
      {!hasDescription && !hasConfigurations && !hasSpecs && !hasGallery && product.images.length > 0 && (
        <section className="w-full bg-[#F3F1EC] px-6 lg:pl-16 lg:pr-16 py-20">
          <div className="w-full max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-4">
            {product.images.map((img, i) => (
              <div key={i} className="relative h-56 rounded-xl overflow-hidden border border-gray-200 bg-white">
                <img src={img} alt={product.name} className="w-full h-full object-contain p-4" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="w-full bg-[#F3F1EC] flex flex-col justify-between py-16 px-6 lg:px-20 text-[#3A3A3A]">
        <div className="max-w-[1500px] w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="flex flex-col gap-8 justify-center">
            <Image
              src="/logo-2.svg"
              alt="ION MECCANICA"
              width={200}
              height={70}
              className="object-contain w-36 h-auto sm:w-[200px]"
            />
          </div>

          <div className="flex flex-col gap-6 justify-center">
            <div>
              <h4 className="font-extrabold text-base mb-2">ION MECCANICA</h4>
              <p className="text-sm text-gray-600 mt-2 font-semibold">+90 (258) 814 57 47</p>
              <p className="text-sm text-gray-600 font-semibold">info@ionmeccanica.com</p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 justify-center">
            <h4 className="font-extrabold text-base mb-2">Links</h4>
            <Link href="/projeler" className="text-sm font-medium text-gray-600 hover:text-[#B87332] transition-colors">
              News &amp; Projects
            </Link>
            <Link href="/iletisim" className="text-sm font-medium text-gray-600 hover:text-[#B87332] transition-colors">
              Contacts &amp; Sales Network
            </Link>
            <Link href="/portal" className="text-sm font-medium text-gray-600 hover:text-[#B87332] transition-colors">
              Customer Portal Login
            </Link>
          </div>

          <div className="flex items-start gap-4 justify-start lg:justify-end pt-4">
            <div className="w-20 h-20 border border-gray-300 rounded-lg flex items-center justify-center text-xs text-center text-gray-500 font-bold bg-white/50 shadow-xs">
              ISO 9001
            </div>
            <div className="w-20 h-20 border border-gray-300 rounded-lg flex items-center justify-center text-xs text-center text-gray-500 font-bold bg-white/50 shadow-xs">
              CE CERT
            </div>
          </div>
        </div>

        <div className="max-w-[1500px] w-full mx-auto border-t border-gray-300/80 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-gray-500">
          <p>© {new Date().getFullYear()} ION MECCANICA. All rights reserved.</p>
          <p>Engineering • Reliability • Commitment</p>
        </div>
      </footer>
    </div>
  );
}
