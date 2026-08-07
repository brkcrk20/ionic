"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import RichTextContent from "@/components/RichTextContent";
import type { NewsItem, MultiLangString } from "@/lib/db";

function getLangText(val: MultiLangString | undefined, lang: "tr" | "en"): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return lang === "tr" ? (val.tr || val.en || "") : (val.en || val.tr || "");
}

function formatDate(iso: string, lang: "tr" | "en") {
  try {
    return new Date(iso).toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function NewsDetailClient({ news }: { news: NewsItem }) {
  const { lang: siteLang } = useLanguage();
  const lang: "tr" | "en" = siteLang === "TR" ? "tr" : "en";

  const title = getLangText(news.title, lang);
  const excerpt = getLangText(news.excerpt, lang);
  const content = getLangText(news.content, lang);

  return (
    <div className="w-full bg-[#F3F1EC] font-montserrat pt-16 xl:pt-22 pb-24">
      {/* 1. ÜST HERO ALANI */}
      <div className="w-full bg-[#3A3A3A] text-[#F3F1EC] py-16 px-6 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col items-center text-center">
          
          {/* Breadcrumb */}
          <div className="text-xs uppercase tracking-widest text-[#F3F1EC]/60 mb-4 flex items-center gap-2 flex-wrap justify-center">
            <Link href="/" className="hover:text-[#B87332] transition-colors">
              {lang === "tr" ? "Anasayfa" : "Homepage"}
            </Link>
            <span>/</span>
            <Link href="/news" className="hover:text-[#B87332] transition-colors">
              {lang === "tr" ? "Haberler & Projeler" : "News & Projects"}
            </Link>
            <span>/</span>
            <span className="text-[#B87332] font-bold truncate max-w-[200px] md:max-w-[400px]">
              {title}
            </span>
          </div>

          {/* Ana Başlık */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F3F1EC] max-w-4xl mx-auto leading-tight">
            {title}
          </h1>

        </div>
      </div>

      {/* 2. İÇERİK ALANI & GÖRSEL */}
      <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Metin Kolonu */}
          <div className="text-left order-2 md:order-1">
            
            {/* Tarih Etiketi */}
            {news.date && (
              <span className="block text-xs font-bold tracking-[0.15em] text-[#B87332] uppercase mb-3">
                {formatDate(news.date, lang)}
              </span>
            )}

            {/* Turuncu Özet Metin */}
            {excerpt && (
              <p className="text-base md:text-lg font-bold text-[#B87332] tracking-wide mb-6 leading-relaxed">
                {excerpt}
              </p>
            )}
            
            {/* Haber Metni */}
            <RichTextContent 
              value={content} 
              className="prose max-w-none text-gray-600 text-sm md:text-base leading-relaxed space-y-4" 
            />
          </div>

          {/* Görsel Kolonu (560x560 px Kare) */}
          {news.coverImage && (
            <div className="flex justify-center order-1 md:order-2">
              <div className="relative w-full max-w-[560px] aspect-square mx-auto rounded-2xl overflow-hidden shadow-md bg-gray-100">
                <Image
                  src={news.coverImage?.startsWith("/") ? news.coverImage : `/${news.coverImage}`}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, 560px"
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}