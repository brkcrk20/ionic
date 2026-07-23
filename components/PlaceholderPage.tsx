"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface PlaceholderPageProps {
  titleTR: string;
  titleEN: string;
}

// Henüz içeriği yazılmamış sayfalar için ortak, markaya uygun geçici görünüm.
// Dil, sitenin geneliyle aynı LanguageProvider'dan gelir; navbar'dan dil
// değiştirildiğinde bu sayfanın başlığı da otomatik güncellenir.
export default function PlaceholderPage({ titleTR, titleEN }: PlaceholderPageProps) {
  const { lang, t } = useLanguage();
  const title = lang === "TR" ? titleTR : titleEN;

  return (
    <div className="w-full min-h-screen bg-[#F3F1EC] pt-32 pb-24 px-6 flex items-center justify-center">
      <div className="max-w-2xl w-full text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-10 md:p-16">
        <span className="inline-block text-[#B87332] text-xs font-bold uppercase tracking-widest mb-4">
          ION MECCANICA
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#3A3A3A] mb-6 font-montserrat">
          {title}
        </h1>
        <p className="text-gray-500 text-base md:text-lg mb-10">{t.pages.comingSoon}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#3A3A3A] hover:bg-[#B87332] text-white font-bold text-sm uppercase tracking-wider px-6 py-3 rounded-full transition-colors"
        >
          <ArrowLeft size={16} />
          {t.pages.backToHome}
        </Link>
      </div>
    </div>
  );
}
