"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
    <div className="w-full min-h-screen bg-[#F3F1EC] pb-24">
      <div className="relative flex min-h-[38vh] w-full items-end overflow-hidden bg-[#1A1A1A] pt-32">
        {news.coverImage && (
          <>
            <Image src={news.coverImage} alt={title} fill className="object-cover opacity-60" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/40 to-transparent" />
          </>
        )}
        <div className="relative z-10 mx-auto w-full max-w-3xl px-6 pb-12">
          <Link href="/news" className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/70 hover:text-white">
            <ArrowLeft size={14} /> {lang === "tr" ? "Tüm Haberler" : "All News"}
          </Link>
          <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-[#B87332]">{formatDate(news.date, lang)}</span>
          <h1 className="font-montserrat text-3xl font-extrabold text-white md:text-4xl">{title}</h1>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-3xl px-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm md:p-10">
          {excerpt && <p className="mb-6 text-lg font-medium text-gray-600">{excerpt}</p>}
          <RichTextContent value={content} className="prose max-w-none text-gray-700" />
        </div>
      </div>
    </div>
  );
}
