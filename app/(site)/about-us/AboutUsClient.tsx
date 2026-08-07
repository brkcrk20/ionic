"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

// ---------------------------------------------------------------------------
// SAYFA İÇERİĞİ — HAKKIMIZDA (tüm alt başlıklar tek sayfada birleştirildi)
// Sırasıyla: Şirket, Mühendislik & Teknoloji, Ar-Ge ve Doğal Taş Uzmanlığı,
// Üretim & Kalite. Her bölümde görsel/metin yönü değişiyor (zig-zag).
// ---------------------------------------------------------------------------

const CONTENT = {
  hero: {
    tr: {
      breadcrumb: "HAKKIMIZDA",
      title: "ION Meccanica Hakkında",
      tagline:
        "Mermer, granit ve diğer doğal taşlar için makine, otomasyon ve entegre üretim hatları.",
    },
    en: {
      breadcrumb: "ABOUT US",
      title: "About ION Meccanica",
      tagline:
        "Machinery, automation systems and integrated production lines for marble, granite and other natural stone materials.",
    },
  },
  sections: [
    {
      id: "company",
      image: "/yerleske.webp",
      tr: {
        title: "Şirket",
        subtitle: "Doğal taş işleme mühendisliğinde bütünleşik yaklaşım.",
        text: [
          "ION Meccanica; mermer, granit ve diğer doğal taşlar için plaka işleme makineleri, otomasyon sistemleri ve entegre üretim hatları tasarlar ve üretir. Çözümlerimiz; reçine (epoksi) uygulama, kurutma, kürleme, elleçleme ve üretim hattı otomasyonu dahil olmak üzere plaka işlemenin temel aşamalarını kapsar.",
          "Şirketimiz, taş işleme operasyonlarına dair bilgi birikimini; makine mühendisliği, termal proses teknolojisi, endüstriyel otomasyon ve üretim kabiliyetiyle birleştirir. Bu bütünleşik yaklaşım, malzemeye, gerekli üretim kapasitesine ve mevcut fabrika yerleşimine uygun bireysel makinelerin yanı sıra komple mermer ve granit işleme hatları geliştirmemizi sağlar.",
          "Amacımız; taş üreticilerine ürün kalitesini, proses kontrolünü ve üretim sürekliliğini artıran güvenilir, bakımı kolay ve verimli makineler sunmaktır. Pratik mühendislik, şeffaf iletişim ve hızlı teknik destek yoluyla uzun vadeli müşteri ilişkileri kurmayı hedefliyoruz.",
        ],
      },
      en: {
        title: "Company",
        subtitle: "An integrated approach to natural-stone processing engineering.",
        text: [
          "ION Meccanica designs and manufactures natural-stone processing machinery, automation systems and integrated production lines for marble, granite and other stone materials. Our solutions cover key stages of slab processing, including resin treatment, drying, curing, handling and production-line automation.",
          "Our company combines knowledge of stone-processing operations with mechanical engineering, thermal-process technology, industrial automation and manufacturing capability. This integrated approach allows us to develop individual machines as well as complete marble and granite processing lines adapted to the material, required production capacity and available factory layout.",
          "Our purpose is to provide stone producers with reliable, maintainable and efficient machinery that improves product quality, process control and production continuity. We aim to build long-term customer relationships through practical engineering, transparent communication and responsive technical support.",
        ],
      },
    },
    {
      id: "engineering-technology",
      image: "/laser.webp",
      tr: {
        title: "Mühendislik & Teknoloji",
        subtitle: "Doğal taş makinelerinde ölçülebilir operasyonel değer.",
        text: [
          "Her ION Meccanica projesi, müşterinin malzemesi, üretim hedefleri, proses gereksinimleri ve fabrika koşullarının detaylı bir değerlendirmesiyle başlar. Mühendislik kabiliyetlerimiz arasında mekanik ve yapısal tasarım, termal proses mühendisliği, elektrik otomasyonu, PLC ve HMI programlama, makine güvenliği, hat entegrasyonu ve uzaktan teşhis yer alır.",
          "Endüstri 4.0 teknolojilerini, doğal taş makinelerinde ölçülebilir operasyonel değer sağladığı durumlarda uyguluyoruz. Makine ve proje gereksinimlerine bağlı olarak çözümler; üretim verisi toplama, reçete yönetimi, alarm ve olay kayıtları, proses izleme, uzaktan teknik destek, plaka veya parti izlenebilirliği ile fabrika yönetim, MES veya ERP sistemleriyle iletişimi içerebilir.",
          "Teknoloji, bir makineyi daha karmaşık göstermek için eklenmez. Üretim görünürlüğünü, tekrarlanabilirliği, kullanım kolaylığını, bakım planlamasını ve teknik müdahale gerektiğinde tepki süresini iyileştirmek için kullanılır.",
        ],
      },
      en: {
        title: "Engineering & Technology",
        subtitle: "Measurable operational value for natural-stone machinery.",
        text: [
          "Every ION Meccanica project begins with a detailed evaluation of the customer's material, production targets, process requirements and factory conditions. Our engineering capabilities include mechanical and structural design, thermal-process engineering, electrical automation, PLC and HMI programming, machine safety, line integration and remote diagnostics.",
          "We apply Industry 4.0 technologies for natural-stone machinery where they provide measurable operational value. Depending on the machine and project requirements, solutions may include production-data collection, recipe management, alarm and event records, process monitoring, remote technical assistance, slab or batch traceability and communication with factory-management, MES or ERP systems.",
          "Technology is not added simply to make a machine appear more complex. It is used to improve production visibility, repeatability, ease of operation, maintenance planning and response time when technical intervention is required.",
        ],
      },
    },
    {
      id: "research-development",
      image: "/arge.webp",
      tr: {
        title: "Ar-Ge ve Doğal Taş Uzmanlığı",
        subtitle: "Malzemeyi anlamak, doğru mühendisliğin temelidir.",
        text: [
          "ION Meccanica'nın ürün geliştirme yaklaşımı, mermer ve doğal taş işlemeye dair birebir bilgi birikimine dayanır. Malzemeyi anlamak esastır; çünkü mermer, granit ve diğer doğal taşlar elleçleme, kurutma, reçine uygulama, kürleme ve yüzey işleme sırasında farklı davranışlar gösterir.",
          "Bu deneyim, mühendislerimizin yeni bir makine tasarımının ardındaki pratik sorunları belirlemesine yardımcı olur: plaka ölçü ve dayanım farklılıkları, reçine uygulama gereksinimleri, elleçleme riskleri, üretim darboğazları, enerji tüketimi, operatör erişimi ve çalışan bir fabrika içindeki bakım koşulları.",
          "Bu nedenle araştırma ve geliştirme çalışmalarımız her zaman gerçek bir üretim ihtiyacından yola çıkar. Yeni doğal taş işleme makineleri geliştirmek, mevcut sistemleri iyileştirmek ve özelleştirilmiş hat konfigürasyonları oluşturmak için proses bilgisini, mühendislik analizini, üretim deneyimini ve müşteri geri bildirimlerini bir araya getiriyoruz. Amacımız yenilik yapmak için yenilik değil; daha iyi proses kontrolü, verimlilik, güvenilirlik ve yaşam döngüsü değeri sunan makinelerdir.",
        ],
      },
      en: {
        title: "Research, Development & Stone Expertise",
        subtitle: "Understanding the material is the foundation of sound engineering.",
        text: [
          "ION Meccanica's product-development approach is rooted in first-hand knowledge of marble and natural-stone processing. Understanding the material is essential because marble, granite and other natural stones behave differently during handling, drying, resin application, curing and finishing.",
          "This experience helps our engineers identify the practical issues behind a new machine design: variations in slab dimensions and strength, resin-treatment requirements, handling risks, production bottlenecks, energy consumption, operator access and maintenance conditions inside an operating factory.",
          "Our research and development work therefore begins with a real production need. We combine process knowledge, engineering analysis, manufacturing experience and customer feedback to develop new stone-processing machines, improve existing systems and create customised line configurations. The objective is not innovation for its own sake, but machinery that delivers better process control, productivity, reliability and lifecycle value.",
        ],
      },
    },
    {
      id: "manufacturing-quality",
      image: "/Soraluce.webp",
      tr: {
        title: "Üretim & Kalite",
        subtitle: "Talepkar endüstriyel ortamlar için tasarım ve imalat.",
        text: [
          "ION Meccanica, ilk konsept ve mühendislikten fabrikasyona, işlemeye, mekanik ve elektrik montajına, otomasyona, teste, kuruluma ve devreye almaya kadar makine geliştirme sürecinin tamamını yönetir.",
          "Makinelerimiz talepkar endüstriyel ortamlar için tasarlanır ve yapısal dayanıklılık, proses güvenilirliği, operatör güvenliği ve bakım kolaylığına özen gösterilerek üretilir. Bileşenler yalnızca teknik kalite ve performanslarına göre değil, uzun vadeli bulunabilirlikleri ve uluslararası servis uygunluklarına göre de seçilir.",
          "Teknik olarak uygun olan her yerde, geniş uluslararası veya bölgesel tedarik ağları üzerinden temin edilebilen köklü endüstriyel bileşenleri kullanıyoruz. Bu yaklaşım, müşterilerin standart yedek parçaları daha hızlı temin etmesini sağlar ve gereksiz üretim duruşlarını azaltır.",
          "Kontrollü mühendislik, üretim ve test süreçleri sayesinde; mermer ve granit fabrikaları için uzun bir çalışma ömrü boyunca çalıştırılabilen, bakımı yapılabilen ve desteklenebilen güvenilir makineler sunmayı hedefliyoruz.",
        ],
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
      },
    },
  ],
  contactCta: {
    tr: "Daha fazla bilgi için bizimle iletişime geçin",
    en: "Contact us for more information",
  },
};

// ---------------------------------------------------------------------------
// Tek bir bölüm satırı: imageLeft'e göre görsel solda/sağda yer değiştirir.
// ---------------------------------------------------------------------------
function AboutRow({
  id,
  title,
  subtitle,
  text,
  image,
  ctaLabel,
  imageLeft,
  tinted,
}: {
  id: string;
  title: string;
  subtitle?: string;
  text: string[];
  image: string;
  ctaLabel: string;
  imageLeft: boolean;
  tinted: boolean;
}) {
  return (
    <div
      id={id}
      className={`w-full scroll-mt-24 xl:scroll-mt-28 ${tinted ? "bg-[#F8F6F1]" : "bg-[#F3F1EC]"}`}
    >
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
            <Image src={image} alt={title} fill className="object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AboutUsPage() {
  const languageContext = useLanguage() as any;
  const activeLang = languageContext?.lang || languageContext?.locale || languageContext?.language || "tr";
  const isTr = activeLang.toLowerCase() === "tr";
  const L = isTr ? "tr" : "en";

  return (
    <div className="w-full min-h-screen bg-[#F3F1EC] font-montserrat pt-16 xl:pt-22">
      {/* 1. ÜST HERO ALANI (Products, Plants ve Services İle Birebir Aynı Tasarım) */}
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
          <p className="text-lg md:text-xl text-[#F3F1EC]/80 font-medium max-w-3xl mx-auto">
            {CONTENT.hero[L].tagline}
          </p>

        </div>
      </div>

      {/* 2. ALT BAŞLIKLAR — görsel/metin yönü her bölümde değişir (zig-zag) */}
      {CONTENT.sections.map((section, i) => (
        <AboutRow
          key={section.id}
          id={section.id}
          title={section[L].title}
          subtitle={section[L].subtitle}
          text={section[L].text}
          image={section.image}
          ctaLabel={CONTENT.contactCta[L]}
          imageLeft={i % 2 === 1}
          tinted={i % 2 === 1}
        />
      ))}
    </div>
  );
}