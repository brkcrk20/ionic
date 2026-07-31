"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/i18n";
import RichTextContent from "@/components/RichTextContent";
import type { SitePage, MultiLangString } from "@/lib/db";

function getLangText(val: MultiLangString | undefined, lang: "tr" | "en"): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return lang === "tr" ? (val.tr || val.en || "") : (val.en || val.tr || "");
}

export default function SitePageContent({ page }: { page: SitePage }) {
  const { lang: siteLang } = useLanguage();
  const lang: "tr" | "en" = siteLang === "TR" ? "tr" : "en";

  const title = getLangText(page.title, lang);
  const description = getLangText(page.description, lang);

  return (
    <div className="w-full min-h-screen bg-[#F3F1EC] pb-24">
      {/* Hero */}
      <div className="relative flex min-h-[42vh] w-full items-end overflow-hidden bg-[#1A1A1A] pt-32">
        {page.heroImage && (
          <>
            <Image src={page.heroImage} alt={title} fill className="object-cover opacity-60" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/40 to-transparent" />
          </>
        )}
        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-12">
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-[#B87332]">ION MECCANICA</span>
          <h1 className="font-montserrat text-3xl font-extrabold text-white md:text-5xl">{title}</h1>
          {description && <p className="mt-4 max-w-2xl text-base text-white/85 md:text-lg">{description}</p>}
        </div>
      </div>

      {/* Kapak görseli */}
      {page.coverImage && (
        <div className="mx-auto -mt-10 max-w-5xl px-6">
          <div className="relative h-56 w-full overflow-hidden rounded-2xl shadow-lg md:h-80">
            <Image src={page.coverImage} alt={title} fill className="object-cover" />
          </div>
        </div>
      )}

      {/* İçerik blokları */}
      {page.contentBlocks.length > 0 && (
        <div className="mx-auto mt-12 max-w-4xl space-y-10 px-6">
          {page.contentBlocks.map((block, index) => {
            const blockTitle = getLangText(block.title, lang);
            const blockText = getLangText(block.text, lang);
            if (!blockTitle && !blockText) return null;
            return (
              <div key={index} className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                {blockTitle && <h2 className="mb-3 font-montserrat text-xl font-extrabold text-[#3A3A3A] md:text-2xl">{blockTitle}</h2>}
                {blockText && <RichTextContent value={blockText} className="prose max-w-none text-gray-600" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
