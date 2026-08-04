"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { useLanguage } from "@/lib/i18n";

// ---------------------------------------------------------------------------
// SAYFA İÇERİĞİ
// ---------------------------------------------------------------------------
// Tüm başlık/metin alanlarını buradan TR ve EN olarak güncelleyebilirsin.
// Görseller için ImagePlaceholder kullanılan yerlere, gerçek görsel
// geldiğinde <Image src="..." fill /> koymak yeterli.
//
// NOT: Eyebrow etiketlerinde CSS "uppercase" class'ı KULLANILMIYOR.
// Türkçe küçük "i" harfi CSS text-transform:uppercase ile "I" olarak
// büyütülüyor (doğrusu "İ" olmalı). Bu yüzden metinler zaten istenen
// büyük/küçük harfle burada yazılıyor, tarayıcıya harf dönüştürme
// yaptırılmıyor.
// ---------------------------------------------------------------------------

const CONTENT = {
  hero: {
    tr: {
      eyebrow: "HİZMETLER",
      title: "Hizmetler",
      tagline: "Bir makine, yalnızca standart bir bileşen sınırlar arasında yolculuk ettiği için atıl kalmamalıdır.",
    },
    en: {
      eyebrow: "SERVICES",
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
    },
  },
  contactCta: {
    tr: "Daha fazla bilgi için bizimle iletişime geçin",
    en: "Contact us for more information",
  },
};

// ---------------------------------------------------------------------------
// Metin solda, görsel sağda (ya da tersi): hizmet bölümleri için ortak satır.
// ---------------------------------------------------------------------------
function ServiceRow({
  title,
  subtitle,
  text,
  listIntro,
  items,
  imageLabel,
  ctaLabel,
  imageLeft = false,
}: {
  title: string;
  subtitle?: string;
  text: string[];
  listIntro?: string;
  items?: string[];
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

          {listIntro && (
            <p className="text-sm md:text-base text-gray-600 leading-relaxed mt-4 mb-3">{listIntro}</p>
          )}

          {items && items.length > 0 && (
            <ul className="space-y-2 mb-5">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700 text-sm md:text-base leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#B87332] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#3A3A3A] hover:text-[#B87332] transition-colors mt-2 group"
          >
            {ctaLabel}
            <ArrowRight size={16} className="text-[#B87332] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div
          className={`relative w-full h-[280px] md:h-[380px] rounded-2xl overflow-hidden order-1 ${
            imageLeft ? "md:order-1" : "md:order-2"
          }`}
        >
          <ImagePlaceholder label={imageLabel} />
        </div>
      </div>
    </div>
  );
}

export default function ServicePage() {
  const { lang } = useLanguage();
  const isTr = lang === "TR";
  const L = isTr ? "tr" : "en";

  return (
    <div className="w-full bg-white font-montserrat pt-16 xl:pt-22">
      {/* 1. ÜST BAŞLIK ALANI (hero video yok) */}
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

      {/* 2. UZAKTAN DESTEK (Remote Assistance) */}
      <ServiceRow
        title={CONTENT.remoteAssistance[L].title}
        subtitle={CONTENT.remoteAssistance[L].subtitle}
        text={CONTENT.remoteAssistance[L].text}
        imageLabel={CONTENT.remoteAssistance[L].imageLabel}
        ctaLabel={CONTENT.contactCta[L]}
      />

      {/* 3. YEDEK PARÇA VE KOMPONENT BULUNABİLİRLİĞİ (Spare Parts) */}
      <ServiceRow
        title={CONTENT.spareParts[L].title}
        subtitle={CONTENT.spareParts[L].subtitle}
        text={CONTENT.spareParts[L].text}
        listIntro={CONTENT.spareParts[L].listIntro}
        items={CONTENT.spareParts[L].items}
        imageLabel={CONTENT.spareParts[L].imageLabel}
        ctaLabel={CONTENT.contactCta[L]}
        imageLeft
      />
    </div>
  );
}
