"use client";

import Link from "next/link";
import Image from "next/image"; // <--- Hatanın çözümü için bu import eklendi
import { ArrowRight } from "lucide-react";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { useLanguage } from "@/lib/i18n";

// ---------------------------------------------------------------------------
// SAYFA İÇERİĞİ — ŞİRKET (About Us / Company)
// ---------------------------------------------------------------------------

const CONTENT = {
  hero: {
    tr: {
      eyebrow: "HAKKIMIZDA",
      title: "ION Meccanica Hakkında",
      tagline:
        "Mermer, granit ve diğer doğal taşlar için makine, otomasyon ve entegre üretim hatları.",
    },
    en: {
      eyebrow: "ABOUT US",
      title: "About ION Meccanica",
      tagline:
        "Machinery, automation systems and integrated production lines for marble, granite and other natural stone materials.",
    },
  },
  company: {
    tr: {
      title: "Şirket",
      subtitle: "Doğal taş işleme mühendisliğinde bütünleşik yaklaşım.",
      text: [
        "ION Meccanica; mermer, granit ve diğer doğal taşlar için plaka işleme makineleri, otomasyon sistemleri ve entegre üretim hatları tasarlar ve üretir. Çözümlerimiz; reçine (epoksi) uygulama, kurutma, kürleme, elleçleme ve üretim hattı otomasyonu dahil olmak üzere plaka işlemenin temel aşamalarını kapsar.",
        "Şirketimiz, taş işleme operasyonlarına dair bilgi birikimini; makine mühendisliği, termal proses teknolojisi, endüstriyel otomasyon ve üretim kabiliyetiyle birleştirir. Bu bütünleşik yaklaşım, malzemeye, gerekli üretim kapasitesine ve mevcut fabrika yerleşimine uygun bireysel makinelerin yanı sıra komple mermer ve granit işleme hatları geliştirmemizi sağlar.",
        "Amacımız; taş üreticilerine ürün kalitesini, proses kontrolünü ve üretim sürekliliğini artıran güvenilir, bakımı kolay ve verimli makineler sunmaktır. Pratik mühendislik, şeffaf iletişim ve hızlı teknik destek yoluyla uzun vadeli müşteri ilişkileri kurmayı hedefliyoruz.",
      ],
      imageLabel: "Şirket Görseli",
    },
    en: {
      title: "Company",
      subtitle: "An integrated approach to natural-stone processing engineering.",
      text: [
        "ION Meccanica designs and manufactures natural-stone processing machinery, automation systems and integrated production lines for marble, granite and other stone materials. Our solutions cover key stages of slab processing, including resin treatment, drying, curing, handling and production-line automation.",
        "Our company combines knowledge of stone-processing operations with mechanical engineering, thermal-process technology, industrial automation and manufacturing capability. This integrated approach allows us to develop individual machines as well as complete marble and granite processing lines adapted to the material, required production capacity and available factory layout.",
        "Our purpose is to provide stone producers with reliable, maintainable and efficient machinery that improves product quality, process control and production continuity. We aim to build long-term customer relationships through practical engineering, transparent communication and responsive technical support.",
      ],
      imageLabel: "Company Image",
    },
  },
  contactCta: {
    tr: "Daha fazla bilgi için bizimle iletişime geçin",
    en: "Contact us for more information",
  },
};

// ---------------------------------------------------------------------------
// Metin solda, görsel sağda: kurumsal bölümler için ortak satır.
// ---------------------------------------------------------------------------
function AboutRow({
  title,
  subtitle,
  text,
  imageLabel,
  ctaLabel,
  imageLeft = false,
}: {
  title: string;
  subtitle?: string;
  text: string[];
  imageLabel: string;
  ctaLabel: string;
  imageLeft?: boolean;
}) {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className={`text-left order-2 ${imageLeft ? "md:order-2" : "md:order-1"}`}>
          <h2 className="text-xl md:text-2xl font-extrabold text-[#3A3A3A] tracking-tight mb-2">{title}</h2>
          {subtitle && (
            <p className="text-sm md:text-base font-bold text-[#B87332] tracking-wide mb-5">{subtitle}</p>
          )}

          <div className="space-y-4 mb-1">
            {text.map((p, i) => (
              <p key={i} className="text-sm md:text-base text-gray-600 leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#3A3A3A] hover:text-[#B87332] transition-colors mt-2 group"
          >
            {ctaLabel}
            <ArrowRight size={16} className="text-[#B87332] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div
          className={`relative w-full max-w-[560px] aspect-square mx-auto rounded-2xl overflow-hidden order-1 ${
            imageLeft ? "md:order-1" : "md:order-2"
          }`}
        >
          {/* Gerçek resim gösterimi için Next.js Image bileşeni */}
          <Image
            src="/yerleske.png" // Kendi görsel yolunuzu girin
            alt={title}
            fill
            className="object-cover"/>
        </div>
      </div>
    </div>
  );
}

export default function AboutUsPage() {
  const { lang } = useLanguage();
  const isTr = lang === "TR";
  const L = isTr ? "tr" : "en";

  return (
    <div className="w-full bg-white font-montserrat pt-16 xl:pt-22">
      {/* 1. ÜST BAŞLIK ALANI */}
      <div className="w-full bg-[#3A3A3A] text-[#F3F1EC] py-20 md:py-28 px-6 relative overflow-hidden">
        <div className="max-w-[1000px] mx-auto relative z-10 flex flex-col items-center text-center">
          <span className="block text-xs font-bold tracking-[0.15em] text-[#B87332] mb-4">
            {CONTENT.hero[L].eyebrow}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-5 text-[#F3F1EC]">
            {CONTENT.hero[L].title}
          </h1>
          <p className="text-lg md:text-xl text-[#F3F1EC]/80 font-medium max-w-2xl mx-auto">
            {CONTENT.hero[L].tagline}
          </p>
        </div>
      </div>

      {/* 2. ŞİRKET (Company) */}
      <AboutRow
        title={CONTENT.company[L].title}
        subtitle={CONTENT.company[L].subtitle}
        text={CONTENT.company[L].text}
        imageLabel={CONTENT.company[L].imageLabel}
        ctaLabel={CONTENT.contactCta[L]}
      />
    </div>
  );
}