"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import type { NewsItem, MultiLangString } from "@/lib/db";

// ---------------------------------------------------------------------------
// SAYFA METİNLERİ (TR / EN)
// ---------------------------------------------------------------------------
const CONTENT = {
  tr: {
    home: "Anasayfa",
    breadcrumb: "Haberler & Projeler",
    title: "Haberler & Projeler",
    subtitle: "Sektörel gelişmeler, güncel projelerimiz ve ION Meccanica'dan en son haberler.",
    countSuffix: "içerik bulundu",
    empty: "Henüz yayınlanmış bir haber bulunmuyor.",
    noImage: "Görsel Yok",
    readMore: "Devamını Oku",
  },
  en: {
    home: "Homepage",
    breadcrumb: "News & Projects",
    title: "News & Projects",
    subtitle: "Industry developments, our latest projects and the most recent news from ION Meccanica.",
    countSuffix: "items found",
    empty: "No news has been published yet.",
    noImage: "No Image",
    readMore: "Read More",
  },
};

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

export default function NewsPageClient({ news }: { news: NewsItem[] }) {
  const { lang: siteLang } = useLanguage();
  const lang: "tr" | "en" = siteLang === "TR" ? "tr" : "en";
  const T = CONTENT[lang];

  return (
    <div className="w-full min-h-screen bg-white pt-16 xl:pt-22 font-montserrat">
      {/* 1. ÜST HERO ALANI */}
      <div className="w-full bg-[#3A3A3A] text-[#F3F1EC] py-16 px-6 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col items-center text-center">
          {/* Breadcrumb */}
          <div className="text-xs uppercase tracking-widest text-[#F3F1EC]/60 mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-[#B87332] transition-colors">
              {T.home}
            </Link>
            <span>/</span>
            <span className="text-[#B87332] font-bold">{T.breadcrumb}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-[#F3F1EC]">
            {T.title}
          </h1>
          <p className="text-lg md:text-xl text-[#F3F1EC]/80 font-medium max-w-3xl mx-auto">
            {T.subtitle}
          </p>
        </div>
      </div>

      {/* 2. HABER LİSTELEME ALANI */}
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="text-gray-500 font-semibold text-lg">
            <span className="text-[#3A3A3A] font-extrabold text-2xl mr-2">{news.length}</span>
            {T.countSuffix}
          </p>
        </div>

        {news.length === 0 ? (
          <div className="py-20 text-center text-gray-400">{T.empty}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => {
              const title = getLangText(item.title, lang);
              const excerpt = getLangText(item.excerpt, lang);

              return (
                <Link
                  key={item.id || item.slug}
                  href={`/news/${item.slug}`}
                  className="bg-[#F3F1EC]/50 border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    {/* Görsel Alanı */}
                    <div className="relative h-48 sm:h-56 md:h-60 w-full bg-white overflow-hidden border-b border-gray-100">
                      {item.coverImage ? (
                        <Image
                          src={item.coverImage}
                          alt={title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                          {T.noImage}
                        </div>
                      )}

                      {item.date && (
                        <div className="absolute top-4 left-4 bg-[#3A3A3A] text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full z-10 shadow-md">
                          {formatDate(item.date, lang)}
                        </div>
                      )}
                    </div>

                    {/* Metin Alanı */}
                    <div className="p-8">
                      <h3 className="text-[#3A3A3A] text-xl font-extrabold group-hover:text-[#B87332] transition-colors mb-3 leading-snug">
                        {title}
                      </h3>
                      {excerpt && (
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{excerpt}</p>
                      )}
                    </div>
                  </div>

                  {/* Alt İncele Butonu */}
                  <div className="px-8 pb-8 pt-2">
                    <div className="pt-4 border-t border-gray-200/60 flex items-center justify-between">
                      <span className="text-sm font-bold text-[#3A3A3A] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        {T.readMore} <ArrowRight size={16} className="text-[#B87332]" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
