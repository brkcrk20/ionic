"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

// ---------------------------------------------------------------------------
// SAYFA İÇERİĞİ
// ---------------------------------------------------------------------------
const CONTENT = {
  hero: {
    tr: {
      breadcrumb: "HİZMETLER",
      title: "Hizmetler",
      tagline: "Bir makine, yalnızca standart bir bileşen sınırlar arasında yolculuk ettiği için atıl kalmamalıdır.",
    },
    en: {
      breadcrumb: "SERVICES",
      title: "Services",
      tagline: "A machine should not remain idle simply because a standard component is travelling across borders.",
    },
  },
  remoteAssistance: {
    tr: {
      title: "Uzaktan Destek",
      subtitle: "Hızlı teşhis. Net yönlendirme. Minimum duruş süresi.",
      text: [
        "Müşterinin onayı ile ION Meccanica teknisyenleri makineye uzaktan bağlanarak alarmları, PLC ve HMI durumunu, çalışma parametrelerini ve mevcut teşhis verilerini inceleyebilir.",
        "Ekibimiz sorunun olası nedenini belirler ve müşterinin teknik personeline adım adım, net yönlendirme sağlar. Gerekli müdahale yerinde gerçekleştirilebildiğinde, müşterinin bunu güvenli bir şekilde tamamlamasına ve üretimi mümkün olan en kısa sürede yeniden başlatmasına yardımcı oluruz.",
        "Uzaktan teşhis ve teknik danışmanlık desteği, makinenin tüm hizmet ömrü boyunca ek bir ücret talep edilmeksizin sağlanır.",
        "Yedek parçalar, yerinde müdahaleler, yazılım değişiklikleri ve ek mühendislik çalışmaları ayrıca fiyatlandırılır.",
      ],
      imageLabel: "Uzaktan Destek Görseli",
      imageSrc: "/Programmer.webp",
    },
    en: {
      title: "Remote Assistance",
      subtitle: "Fast diagnosis. Clear guidance. Minimum downtime.",
      text: [
        "With the customer's authorisation, ION Meccanica technicians can connect remotely to the machine and examine alarms, PLC and HMI status, operating parameters and available diagnostic data.",
        "Our team identifies the probable cause of the problem and provides clear, step-by-step guidance to the customer's technical personnel. Whenever the required intervention can be carried out locally, we help the customer complete it safely and restore production as quickly as possible.",
        "Remote diagnosis and technical advisory support are provided at no additional charge throughout the machine's service life.",
        "Spare parts, on-site interventions, software modifications and additional engineering work are quoted separately.",
      ],
      imageLabel: "Remote Assistance Image",
      imageSrc: "/Programmer.webp",
    },
  },
  spareParts: {
    tr: {
      title: "Yedek Parça ve Komponent Bulunabilirliği",
      subtitle: "Güvenilirlik için tasarlandı. Bulunabilirlik için mühendislik.",
      text: [
        "ION Meccanica makineleri; yüksek kalite, performans ve operasyonel güvenilirlik standartlarını karşılamak üzere seçilmiş endüstriyel bileşenler kullanılarak üretilir.",
        "Ancak yalnızca kalite yeterli değildir. Bir üretim tesisi büyük endüstriyel merkezlerden uzakta bulunabilir; bu durumda standart bir yedek bileşenin günlerce beklenmesi gereksiz üretim kayıplarına yol açabilir.",
        "Bu nedenle, teknik ve güvenlik açısından mümkün olan her durumda ION Meccanica; güçlü uluslararası dağıtım ağına ve geniş pazar bulunabilirliğine sahip köklü üreticilerin bileşenlerini tercih eder. Güvenilir bir endüstriyel alternatif mevcut olduğunda, gereksiz yere özel veya tedariki zor bileşenlerden kaçınırız.",
        "Bu tasarım felsefesi, müşterilerin birçok standart yedek parçayı yerel veya bölgesel olarak temin edebilmesini sağlayarak teslimat sürelerini kısaltır ve tesisin daha kısa sürede yeniden faaliyete geçmesine yardımcı olur.",
      ],
      listIntro: "Makineye özgü bileşenler için ION Meccanica şunları sağlar:",
      items: [
        "Doğru parça tanımlama ve teknik doğrulama",
        "Önerilen yedek parça özellikleri",
        "Orijinal veya onaylı yedek parça temini",
        "Montaj ve ayar rehberliği",
        "Değişim ve yeniden devreye alma sırasında uzaktan destek",
      ],
      imageLabel: "Yedek Parça Görseli",
      imageSrc: "/IMG_1990.webp",
    },
    en: {
      title: "Spare Parts and Component Availability",
      subtitle: "Designed for reliability. Engineered for availability.",
      text: [
        "ION Meccanica machines are manufactured using industrial components selected to meet demanding standards of quality, performance and operational reliability.",
        "However, quality alone is not sufficient. A production plant may be located far from major industrial centres, where waiting several days for a standard replacement component could result in unnecessary production losses.",
        "For this reason, wherever technically and safely possible, ION Meccanica selects components from established manufacturers with strong international distribution and broad market availability. We avoid unnecessarily proprietary or difficult-to-source components when a reliable industrial alternative is available.",
        "This design philosophy enables customers to obtain many standard replacement parts locally or regionally, reducing delivery times and helping the plant return to operation sooner.",
      ],
      listIntro: "For machine-specific components, ION Meccanica provides:",
      items: [
        "Correct part identification and technical verification",
        "Recommended replacement specifications",
        "Supply of original or approved replacement parts",
        "Installation and adjustment guidance",
        "Remote support during replacement and recommissioning",
      ],
      imageLabel: "Spare Parts Image",
      imageSrc: "/IMG_1990.webp",
    },
  },
  contactCta: {
    tr: "Daha fazla bilgi için bizimle iletişime geçin",
    en: "Contact us for more information",
  },
};

// ---------------------------------------------------------------------------
// Hizmet Satırı Bileşeni
// ---------------------------------------------------------------------------
function ServiceRow({
  title,
  subtitle,
  text,
  listIntro,
  items,
  imageSrc,
  imageAlt,
  ctaLabel,
  imageLeft = false,
  imageContainerClassName = "w-full max-w-[560px]",
}: {
  title: string;
  subtitle?: string;
  text: string[];
  listIntro?: string;
  items?: string[];
  imageSrc: string;
  imageAlt: string;
  ctaLabel: string;
  imageLeft?: boolean;
  imageContainerClassName?: string;
}) {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20">
      {/* items-start ile başlık ve resmin üst hizaları birebir eşitlendi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
        {/* Metin Kolonu */}
        <div className={`text-left order-2 ${imageLeft ? "md:order-2" : "md:order-1"}`}>
          <h2 className="text-xl md:text-2xl font-extrabold text-[#3A3A3A] tracking-tight mb-2">{title}</h2>
          {subtitle && (
            <p className="text-sm md:text-base font-bold text-[#B87332] tracking-wide mb-5">{subtitle}</p>
          )}

          <div className="space-y-4 mb-4">
            {text.map((p, i) => (
              <p key={i} className="text-sm md:text-base text-gray-600 leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          {/* Mini Başlık Biçimi */}
          {listIntro && (
            <p className="text-sm md:text-base font-bold text-[#3A3A3A] leading-relaxed mt-5 mb-2">
              {listIntro}
            </p>
          )}

          {/* Araları Sıkılaştırılmış Liste */}
          {items && items.length > 0 && (
            <ul className="space-y-1.5 mb-6">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700 text-sm md:text-base leading-snug">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#B87332] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#3A3A3A] hover:text-[#B87332] transition-colors mt-1 group"
          >
            {ctaLabel}
            <ArrowRight size={16} className="text-[#B87332] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Görsel Kolonu (Hakkımızda sayfasıyla birebir aynı ölçü: max-w-[560px] aspect-square) */}
        <div className={`flex justify-center order-1 ${imageLeft ? "md:order-1" : "md:order-2"}`}>
          <div
            className={`relative w-full aspect-square mx-auto rounded-2xl overflow-hidden shadow-md bg-gray-100 ${imageContainerClassName}`}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 560px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicePage() {
  const languageContext = useLanguage() as any;
  const activeLang = languageContext?.lang || languageContext?.locale || languageContext?.language || "tr";
  const isTr = activeLang.toLowerCase() === "tr";
  const L = isTr ? "tr" : "en";

  return (
    <div className="w-full min-h-screen bg-white font-montserrat pt-16 xl:pt-22">
      {/* 1. ÜST HERO ALANI (Products & Plants Yapısıyla Birebir Birebir Aynı) */}
      <div className="w-full bg-[#3A3A3A] text-[#F3F1EC] py-16 px-6 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col items-center text-center">
          
          <div className="text-xs uppercase tracking-widest text-[#F3F1EC]/60 mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-[#B87332] transition-colors">
              {isTr ? "Anasayfa" : "Homepage"}
            </Link>
            <span>/</span>
            <span className="text-[#B87332] font-bold">
              {CONTENT.hero[L].breadcrumb}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-[#F3F1EC]">
            {CONTENT.hero[L].title}
          </h1>
          <p className="text-lg md:text-xl text-[#F3F1EC]/80 font-medium mb-8 max-w-3xl mx-auto">
            {CONTENT.hero[L].tagline}
          </p>

        </div>
      </div>

      {/* 2. UZAKTAN DESTEK (Remote Assistance) */}
      <ServiceRow
        title={CONTENT.remoteAssistance[L].title}
        subtitle={CONTENT.remoteAssistance[L].subtitle}
        text={CONTENT.remoteAssistance[L].text}
        imageSrc={CONTENT.remoteAssistance[L].imageSrc}
        imageAlt={CONTENT.remoteAssistance[L].imageLabel}
        ctaLabel={CONTENT.contactCta[L]}
      />

      {/* 3. YEDEK PARÇA VE KOMPONENT BULUNABİLİRLİĞİ (Spare Parts) */}
      <ServiceRow
        title={CONTENT.spareParts[L].title}
        subtitle={CONTENT.spareParts[L].subtitle}
        text={CONTENT.spareParts[L].text}
        listIntro={CONTENT.spareParts[L].listIntro}
        items={CONTENT.spareParts[L].items}
        imageSrc={CONTENT.spareParts[L].imageSrc}
        imageAlt={CONTENT.spareParts[L].imageLabel}
        ctaLabel={CONTENT.contactCta[L]}
        imageLeft
      />
    </div>
  );
}