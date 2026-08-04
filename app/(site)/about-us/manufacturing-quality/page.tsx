"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { useLanguage } from "@/lib/i18n";

// ---------------------------------------------------------------------------
// SAYFA İÇERİĞİ — ÜRETİM & KALİTE (Manufacturing & Quality)
// ---------------------------------------------------------------------------

const CONTENT = {
  hero: {
    tr: {
      eyebrow: "ÜRETİM & KALİTE",
      title: "Üretim & Kalite",
      tagline:
        "Kavramdan devreye almaya, uçtan uca kontrollü mühendislik ve üretim süreci.",
    },
    en: {
      eyebrow: "MANUFACTURING & QUALITY",
      title: "Manufacturing & Quality",
      tagline:
        "A controlled, end-to-end process from concept and engineering to fabrication and commissioning.",
    },
  },
  manufacturing: {
    tr: {
      title: "Üretim & Kalite",
      subtitle: "Talepkar endüstriyel ortamlar için tasarım ve imalat.",
      text: [
        "ION Meccanica, ilk konsept ve mühendislikten fabrikasyona, işlemeye, mekanik ve elektrik montajına, otomasyona, teste, kuruluma ve devreye almaya kadar makine geliştirme sürecinin tamamını yönetir.",
        "Makinelerimiz talepkar endüstriyel ortamlar için tasarlanır ve yapısal dayanıklılık, proses güvenilirliği, operatör güvenliği ve bakım kolaylığına özen gösterilerek üretilir. Bileşenler yalnızca teknik kalite ve performanslarına göre değil, uzun vadeli bulunabilirlikleri ve uluslararası servis uygunluklarına göre de seçilir.",
        "Teknik olarak uygun olan her yerde, geniş uluslararası veya bölgesel tedarik ağları üzerinden temin edilebilen köklü endüstriyel bileşenleri kullanıyoruz. Bu yaklaşım, müşterilerin standart yedek parçaları daha hızlı temin etmesini sağlar ve gereksiz üretim duruşlarını azaltır.",
        "Kontrollü mühendislik, üretim ve test süreçleri sayesinde; mermer ve granit fabrikaları için uzun bir çalışma ömrü boyunca çalıştırılabilen, bakımı yapılabilen ve desteklenebilen güvenilir makineler sunmayı hedefliyoruz.",
      ],
      imageLabel: "Üretim & Kalite Görseli",
    },
    en: {
      title: "Manufacturing & Quality",
      subtitle: "Engineering and manufacturing for demanding industrial environments.",
      text: [
        "ION Meccanica manages the complete machine-development process, from initial concept and engineering to fabrication, machining, mechanical and electrical assembly, automation, testing, installation and commissioning.",
        "Our machines are designed for demanding industrial environments and manufactured with attention to structural strength, process reliability, operator safety and ease of maintenance. Components are selected not only for their technical quality and performance, but also for their long-term availability and suitability for international service.",
        "Wherever technically appropriate, we use established industrial components that can be sourced through broad international or regional supply networks. This helps customers obtain standard replacement parts more quickly and reduces avoidable production downtime.",
        "Through controlled engineering, manufacturing and testing processes, we aim to deliver reliable machinery for marble and granite factories that can be operated, maintained and supported throughout a long working life.",
      ],
      imageLabel: "Manufacturing & Quality Image",
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
                  {/* Gerçek resim gösterimi için Next.js Image bileşeni */}
                  <Image
                    src="/Soraluce.png" // Kendi görsel yolunuzu girin
                    alt={title}
                    fill
                    className="object-cover"/>
                </div>
      </div>
    </div>
  );
}

export default function ManufacturingQualityPage() {
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
        title={CONTENT.manufacturing[L].title}
        subtitle={CONTENT.manufacturing[L].subtitle}
        text={CONTENT.manufacturing[L].text}
        imageLabel={CONTENT.manufacturing[L].imageLabel}
        ctaLabel={CONTENT.contactCta[L]}
      />
    </div>
  );
}
