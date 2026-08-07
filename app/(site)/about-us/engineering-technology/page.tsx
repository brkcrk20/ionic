"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { useLanguage } from "@/lib/i18n";

// ---------------------------------------------------------------------------
// SAYFA İÇERİĞİ — MÜHENDİSLİK & TEKNOLOJİ (Engineering & Technology)
// ---------------------------------------------------------------------------

const CONTENT = {
  hero: {
    tr: {
      eyebrow: "MÜHENDİSLİK & TEKNOLOJİ",
      title: "Mühendislik & Teknoloji",
      tagline:
        "Malzemeye, üretim hedeflerine ve fabrika koşullarına göre şekillenen mühendislik yaklaşımı.",
    },
    en: {
      eyebrow: "ENGINEERING & TECHNOLOGY",
      title: "Engineering & Technology",
      tagline:
        "An engineering approach shaped by the material, production targets and factory conditions.",
    },
  },
  engineering: {
    tr: {
      title: "Mühendislik & Teknoloji",
      subtitle: "Doğal taş makinelerinde ölçülebilir operasyonel değer.",
      text: [
        "Her ION Meccanica projesi, müşterinin malzemesi, üretim hedefleri, proses gereksinimleri ve fabrika koşullarının detaylı bir değerlendirmesiyle başlar. Mühendislik kabiliyetlerimiz arasında mekanik ve yapısal tasarım, termal proses mühendisliği, elektrik otomasyonu, PLC ve HMI programlama, makine güvenliği, hat entegrasyonu ve uzaktan teşhis yer alır.",
        "Endüstri 4.0 teknolojilerini, doğal taş makinelerinde ölçülebilir operasyonel değer sağladığı durumlarda uyguluyoruz. Makine ve proje gereksinimlerine bağlı olarak çözümler; üretim verisi toplama, reçete yönetimi, alarm ve olay kayıtları, proses izleme, uzaktan teknik destek, plaka veya parti izlenebilirliği ile fabrika yönetim, MES veya ERP sistemleriyle iletişimi içerebilir.",
        "Teknoloji, bir makineyi daha karmaşık göstermek için eklenmez. Üretim görünürlüğünü, tekrarlanabilirliği, kullanım kolaylığını, bakım planlamasını ve teknik müdahale gerektiğinde tepki süresini iyileştirmek için kullanılır.",
      ],
      imageLabel: "Mühendislik & Teknoloji Görseli",
    },
    en: {
      title: "Engineering & Technology",
      subtitle: "Measurable operational value for natural-stone machinery.",
      text: [
        "Every ION Meccanica project begins with a detailed evaluation of the customer's material, production targets, process requirements and factory conditions. Our engineering capabilities include mechanical and structural design, thermal-process engineering, electrical automation, PLC and HMI programming, machine safety, line integration and remote diagnostics.",
        "We apply Industry 4.0 technologies for natural-stone machinery where they provide measurable operational value. Depending on the machine and project requirements, solutions may include production-data collection, recipe management, alarm and event records, process monitoring, remote technical assistance, slab or batch traceability and communication with factory-management, MES or ERP systems.",
        "Technology is not added simply to make a machine appear more complex. It is used to improve production visibility, repeatability, ease of operation, maintenance planning and response time when technical intervention is required.",
      ],
      imageLabel: "Engineering & Technology Image",
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
            src="/laser.webp" // Kendi görsel yolunuzu girin
            alt={title}
            fill
            className="object-cover"/>
        </div>
      </div>
    </div>
  );
}

export default function EngineeringTechnologyPage() {
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
        title={CONTENT.engineering[L].title}
        subtitle={CONTENT.engineering[L].subtitle}
        text={CONTENT.engineering[L].text}
        imageLabel={CONTENT.engineering[L].imageLabel}
        ctaLabel={CONTENT.contactCta[L]}
      />
    </div>
  );
}
