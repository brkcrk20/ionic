"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { useLanguage } from "@/lib/i18n";

// ---------------------------------------------------------------------------
// SAYFA İÇERİĞİ — AR-GE VE DOĞAL TAŞ UZMANLIĞI
// (Research, Development & Stone Expertise)
// ---------------------------------------------------------------------------

const CONTENT = {
  hero: {
    tr: {
      eyebrow: "AR-GE VE DOĞAL TAŞ UZMANLIĞI",
      title: "Ar-Ge ve Doğal Taş Uzmanlığı",
      tagline:
        "Mermer ve doğal taş işlemede birebir bilgi birikimine dayanan ürün geliştirme yaklaşımı.",
    },
    en: {
      eyebrow: "RESEARCH, DEVELOPMENT & STONE EXPERTISE",
      title: "Research, Development & Stone Expertise",
      tagline:
        "A product-development approach rooted in first-hand knowledge of marble and natural-stone processing.",
    },
  },
  rd: {
    tr: {
      title: "Ar-Ge ve Doğal Taş Uzmanlığı",
      subtitle: "Malzemeyi anlamak, doğru mühendisliğin temelidir.",
      text: [
        "ION Meccanica'nın ürün geliştirme yaklaşımı, mermer ve doğal taş işlemeye dair birebir bilgi birikimine dayanır. Malzemeyi anlamak esastır; çünkü mermer, granit ve diğer doğal taşlar elleçleme, kurutma, reçine uygulama, kürleme ve yüzey işleme sırasında farklı davranışlar gösterir.",
        "Bu deneyim, mühendislerimizin yeni bir makine tasarımının ardındaki pratik sorunları belirlemesine yardımcı olur: plaka ölçü ve dayanım farklılıkları, reçine uygulama gereksinimleri, elleçleme riskleri, üretim darboğazları, enerji tüketimi, operatör erişimi ve çalışan bir fabrika içindeki bakım koşulları.",
        "Bu nedenle araştırma ve geliştirme çalışmalarımız her zaman gerçek bir üretim ihtiyacından yola çıkar. Yeni doğal taş işleme makineleri geliştirmek, mevcut sistemleri iyileştirmek ve özelleştirilmiş hat konfigürasyonları oluşturmak için proses bilgisini, mühendislik analizini, üretim deneyimini ve müşteri geri bildirimlerini bir araya getiriyoruz. Amacımız yenilik yapmak için yenilik değil; daha iyi proses kontrolü, verimlilik, güvenilirlik ve yaşam döngüsü değeri sunan makinelerdir.",
      ],
      imageLabel: "Ar-Ge Görseli",
    },
    en: {
      title: "Research, Development & Stone Expertise",
      subtitle: "Understanding the material is the foundation of sound engineering.",
      text: [
        "ION Meccanica's product-development approach is rooted in first-hand knowledge of marble and natural-stone processing. Understanding the material is essential because marble, granite and other natural stones behave differently during handling, drying, resin application, curing and finishing.",
        "This experience helps our engineers identify the practical issues behind a new machine design: variations in slab dimensions and strength, resin-treatment requirements, handling risks, production bottlenecks, energy consumption, operator access and maintenance conditions inside an operating factory.",
        "Our research and development work therefore begins with a real production need. We combine process knowledge, engineering analysis, manufacturing experience and customer feedback to develop new stone-processing machines, improve existing systems and create customised line configurations. The objective is not innovation for its own sake, but machinery that delivers better process control, productivity, reliability and lifecycle value.",
      ],
      imageLabel: "R&D Image",
    },
  },
  contactCta: {
    tr: "Daha fazla bilgi için bizimle iletişime geçin",
    en: "Contact us for more information",
  },
};

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
          <Image
                      src="/arge.webp" // Kendi görsel yolunuzu girin
                      alt={title}
                      fill
                      className="object-cover"/>
        </div>
      </div>
    </div>
  );
}

export default function ResearchDevelopmentPage() {
  const { lang } = useLanguage();
  const isTr = lang === "TR";
  const L = isTr ? "tr" : "en";

  return (
    <div className="w-full bg-white font-montserrat pt-16 xl:pt-22">
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

      <AboutRow
        title={CONTENT.rd[L].title}
        subtitle={CONTENT.rd[L].subtitle}
        text={CONTENT.rd[L].text}
        imageLabel={CONTENT.rd[L].imageLabel}
        ctaLabel={CONTENT.contactCta[L]}
      />
    </div>
  );
}
