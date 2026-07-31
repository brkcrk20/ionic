"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageOff, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
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

export default function NewsListClient({ news }: { news: NewsItem[] }) {
  const { lang: siteLang, t } = useLanguage();
  const lang: "tr" | "en" = siteLang === "TR" ? "tr" : "en";

  return (
    <div className="w-full min-h-screen bg-[#F3F1EC] px-6 pb-24 pt-32">
      <div className="mx-auto max-w-6xl">
        <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-[#B87332]">ION MECCANICA</span>
        <h1 className="mb-4 font-montserrat text-3xl font-extrabold text-[#3A3A3A] md:text-5xl">
          {siteLang === "TR" ? "Haberler" : "News"}
        </h1>

        {news.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-white/50 py-20 text-center">
            <p className="text-gray-400">{t.pages.comingSoon}</p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => {
              const title = getLangText(item.title, lang);
              const excerpt = getLangText(item.excerpt, lang);
              return (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-gray-50">
                    {item.coverImage ? (
                      <Image
                        src={item.coverImage}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-300">
                        <ImageOff size={28} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="mb-2 text-xs font-bold uppercase tracking-wider text-[#B87332]">{formatDate(item.date, lang)}</span>
                    <h2 className="mb-2 font-montserrat text-lg font-extrabold text-[#3A3A3A]">{title}</h2>
                    {excerpt && <p className="mb-4 line-clamp-3 flex-1 text-sm text-gray-500">{excerpt}</p>}
                    <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#3A3A3A] group-hover:text-[#B87332]">
                      {lang === "tr" ? "Devamını Oku" : "Read More"} <ArrowRight size={14} />
                    </span>
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
