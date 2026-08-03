"use client";

import { ChevronDown } from "lucide-react";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { useLanguage } from "@/lib/i18n";
import InteractiveDiagram from "./InteractiveDiagram";

// ---------------------------------------------------------------------------
// SAYFA İÇERİĞİ
// ---------------------------------------------------------------------------
// Tüm başlık/metin alanlarını buradan TR ve EN olarak güncelleyebilirsin.
// Görseller için ImagePlaceholder kullanılan yerlere, gerçek görsel
// geldiğinde <Image src="..." fill /> koymak yeterli (public/uploads/...
// içine görseli ekleyip yolunu vermen yeterli).
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
      subtitle: "Bağlantılı Taş Fabrikası",
      tagline: "Ham levhadan bitmiş yüzeye, tek bir bağlantılı akış.",
    },
    en: {
      subtitle: "The Connected Stone Factory",
      tagline: "From raw slab to finished surface, one connected flow.",
    },
  },
  intro: {
    tr: {
      eyebrow: "ION ONEFLOW",
      title: "ION ONEFLOW Nedir?",
      text: [
        "ION ONEFLOW; levha depolama, malzeme taşıma, reçine işleme, kontrollü kürleme, parlatma ve bitmiş ürün yönetimini tek bir koordineli fabrika mimarisi içinde birbirine bağlayan entegre bir üretim konseptidir.",
        "Amaç yalnızca tek tek makineleri otomatikleştirmek değildir. Amaç; üretim emirlerinin, levhaların, ekipmanların ve süreç verilerinin sürekli ve izlenebilir bir iş akışı içinde birlikte hareket ettiği bir fabrika yaratmaktır.",
      ],
      imageLabel: "Fabrika Görseli",
    },
    en: {
      eyebrow: "ION ONEFLOW",
      title: "What is ION ONEFLOW?",
      text: [
        "ION ONEFLOW is an integrated production concept connecting slab storage, material handling, resin treatment, controlled curing, polishing and finished-product management within one coordinated factory architecture.",
        "The objective is not simply to automate individual machines. It is to create a factory in which production orders, slabs, equipment and process data move together through a continuous and traceable workflow.",
      ],
      imageLabel: "Factory Image",
    },
  },
  diagramHeading: {
    tr: { eyebrow: "Nasıl Çalışır", title: "Beş ONEFLOW Bileşenini İnceleyin" },
    en: { eyebrow: "How It Works", title: "Explore the Five ONEFLOW Pillars" },
  },
  oneFactory: {
    tr: {
      title: "Tek Fabrika. Tek Üretim Akışı.",
      text: [
        "Geleneksel taş işleme fabrikalarında üretim genellikle ayrı bölümlere bölünmüştür. Levhalar, işlemler arasında tekrar tekrar yüklenir, boşaltılır, transfer edilir ve depolanır.",
        "En önemli kesintilerden biri reçine işleme ile parlatma arasında meydana gelir. Reçine uygulaması ve ilk kürlemenin ardından levhalar normalde hattan çıkarılır ve epoksi yeterli sertliğe ulaşana kadar depolanır. Bu durum; taşıma işlemlerini, teslim süresini, süreç içi stoku ve gereken alan ihtiyacını artırır.",
        "ION ONEFLOW, reçine işlemeyi genişletilmiş ve kontrollü bir termal kürleme süreciyle doğrudan parlatmaya bağlar.",
      ],
      imageLabel: "Üretim Hattı Görseli",
    },
    en: {
      title: "One Factory. One Production Flow.",
      text: [
        "In conventional stone-processing factories, production is often divided into separate departments. Slabs are repeatedly loaded, unloaded, transferred and stored between operations.",
        "One of the most significant interruptions occurs between resin treatment and polishing. After resin application and initial curing, slabs are normally removed from the line and stored until the epoxy reaches sufficient hardness. This increases handling, lead time, work in progress and floor-space requirements.",
        "ION ONEFLOW connects resin treatment directly with polishing through an extended and controlled thermal-curing process.",
      ],
      imageLabel: "Production Line Image",
    },
  },
  fiveTower: {
    tr: {
      title: "Beş Kuleli Kürleme Konsepti",
      text: [
        "ONEFLOW mimarisinin merkezinde, reçine işleme ile parlatma arasına konumlandırılmış ek bir polimerizasyon kulesi bulunur.",
        "Referans beş kuleli konfigürasyonda bu ek kürleme kapasitesi, levhaların kontrollü bir termal ortamda kalma süresini uzatır. Kontrollü sıcaklık ve hava akışı koşulları altında polimerizasyon gelişirken reçine, çatlaklara, gözeneklere ve boşluklara nüfuz etmeye devam edebilir. Hat kapasitesine ve süreç ayarlarına bağlı olarak sistem, parlatmadan önce yaklaşık 320 dakikalık kontrollü bekleme süresi sağlayabilir. Bu sayede reçine işleme ve parlatma, ara kürleme deposu olmaksızın tek bir kesintisiz üretim süreci olarak tamamlanabilir.",
        "ION ONEFLOW, bu aşamalar arasında geçişi sağlamak için hızlı UV aktivasyonuna dayanmaz. Mimarisi, parlatmadan önce kademeli epoksi polimerizasyonu için gereken kontrollü süreyi ve termal koşulları sağlar.",
      ],
      imageLabel: "Kürleme Kulesi Görseli",
    },
    en: {
      title: "The Five-Tower Curing Concept",
      text: [
        "At the centre of the ONEFLOW architecture is an additional polymerisation tower positioned between resin treatment and polishing.",
        "In the reference five-tower configuration, this additional curing capacity extends the time slabs remain within a regulated thermal environment. The resin can continue penetrating fissures, pores and cavities while polymerisation develops under controlled temperature and airflow conditions. Depending on line capacity and process settings, the system can provide approximately 320 minutes of controlled residence time before polishing. This makes it possible to complete resin treatment and polishing as one continuous production process without intermediate curing storage.",
        "ION ONEFLOW does not rely on rapid UV activation to bridge these stages. Its architecture provides the controlled time and thermal conditions required for progressive epoxy polymerisation before polishing.",
      ],
      imageLabel: "Curing Tower Image",
    },
  },
  thermalProcessing: {
    tr: {
      title: "Kontrollü Termal İşleme",
      intro:
        "ION kürleme kuleleri, levha tepsilerinin yakınına yerleştirilmiş difüzörler aracılığıyla dağıtılan ısıtılmış hava ile yakın bağlantılı bir hava akışı kullanır. Hava akışı kılavuzları, sirkülasyonu etkin işlem alanı içinde tutarken yalıtımlı yapı gereksiz ısı kaybını azaltır. Bu durum şunları destekler:",
      items: [
        "levhalarda homojen sıcaklık",
        "tepsi seviyeleri arasında tutarlı işlem",
        "kontrollü nem giderimi",
        "ısıtma gücünün verimli kullanımı",
        "parlatmadan önce kararlı kürleme",
      ],
      imageLabel: "Termal İşleme Görseli",
    },
    en: {
      title: "Controlled Thermal Processing",
      intro:
        "ION curing towers use close-coupled airflow, with heated air distributed through diffusers positioned near the slab trays. Airflow guides retain circulation within the effective treatment area, while insulated construction reduces unnecessary thermal loss. This supports:",
      items: [
        "uniform slab temperatures",
        "consistent treatment across tray levels",
        "controlled moisture removal",
        "efficient use of heating power",
        "stable curing before polishing",
      ],
      imageLabel: "Thermal Processing Image",
    },
  },
  resinTreatment: {
    tr: {
      title: "Entegre Reçine İşleme",
      intro:
        "Her ONEFLOW reçine işleme hattı; taşın özelliklerine, gereken işleme ve üretim kapasitesine göre yapılandırılır. Tipik bir sistem şunları içerebilir:",
      items: [
        "otomatik levha yükleme",
        "döngüsel veya statik kurutma kuleleri",
        "file (mesh) ve reçine uygulaması",
        "vakum veya hiperbarik işlem",
        "levha tamponları ve çevirme sistemleri",
        "ara honlama",
        "ön yüz işlemesi",
        "döngüsel veya statik kürleme kuleleri",
        "genişletilmiş son kürleme",
      ],
      outro: "Konfigürasyon, sabit bir standart düzen yerine gereken süreç sırasına göre geliştirilir.",
      imageLabel: "Reçine İşleme Hattı Görseli",
    },
    en: {
      title: "Integrated Resin Treatment",
      intro:
        "Each ONEFLOW resin-treatment line is configured according to the stone characteristics, required treatment and production capacity. A typical system may include:",
      items: [
        "automatic slab loading",
        "cyclic or static drying towers",
        "mesh and resin application",
        "vacuum or hyperbaric treatment",
        "slab buffers and turning systems",
        "intermediate honing",
        "front-face treatment",
        "cyclic or static curing towers",
        "extended final curing",
      ],
      outro: "The configuration is developed around the required process sequence rather than a fixed standard layout.",
      imageLabel: "Resin Treatment Line Image",
    },
  },
  directConnection: {
    tr: {
      title: "Parlatmaya Doğrudan Bağlantı",
      text: [
        "Gerekli kürleme koşulu sağlandığında levha doğrudan parlatma bölümüne geçer. Bu, levhanın boşaltılması, geçici depoya taşınması, ortam koşullarında kürlenmesinin beklenmesi, yeniden bulunması ve parlatma hattına tekrar yüklenmesi ihtiyacını ortadan kaldırır.",
        "Sonuç olarak; daha az malzeme taşıma, azalmış süreç içi stok ve daha öngörülebilir bir üretim planı elde edilir.",
      ],
      imageLabel: "Parlatma Hattı Görseli",
    },
    en: {
      title: "Direct Connection to Polishing",
      text: [
        "Once the required curing condition has been achieved, the slab moves directly into the polishing section. This eliminates the need to unload the slab, transfer it to temporary storage, wait for ambient curing, locate it again and reload it onto the polishing line.",
        "The result is lower material handling, reduced work in progress and a more predictable production schedule.",
      ],
      imageLabel: "Polishing Line Image",
    },
  },
  storageMovement: {
    tr: {
      title: "Depolama ve Malzeme Hareketi",
      text: [
        "ION ONEFLOW; ham levhalar, süreç içi malzemeler ve bitmiş ürünler için otomatik depolamayı entegre edebilir.",
        "Levhalar; taş türüne, kalınlığa, yüzey işlemine, uygulanan işleme, üretim emrine veya varış noktasına göre düzenlenebilir. Sistem, gereken malzemeyi üretim planına göre bulup ilgili yükleme istasyonuna aktarabilir.",
        "AGV'ler ayrıca depolama alanlarını, reçine işleme hatlarını, parlatma hatlarını, kontrol bölgelerini ve bitmiş levha deposunu birbirine bağlayarak tekrarlanan forklift ve köprü vinç hareketlerini azaltabilir.",
      ],
      imageLabel: "Depo ve AGV Görseli",
    },
    en: {
      title: "Storage and Material Movement",
      text: [
        "ION ONEFLOW can integrate automated storage for raw slabs, work-in-progress materials and finished products.",
        "Slabs may be organised by stone type, thickness, finish, treatment, production order or destination. The system can retrieve the required material according to the production schedule and transfer it to the appropriate loading station.",
        "AGVs may also connect storage areas, resin-treatment lines, polishing lines, inspection zones and finished-slab storage, reducing repeated forklift and overhead-crane movements.",
      ],
      imageLabel: "Storage & AGV Image",
    },
  },
  factoryControl: {
    tr: {
      title: "Fabrika Genelinde Kontrol",
      intro: "Tek tek makineler, aşağıdakileri içeren koordineli bir kontrol mimarisi ile birbirine bağlanabilir:",
      items: [
        "ERP veya MES bağlantısı",
        "üretim emri aktarımı",
        "levha ve parti tanımlama",
        "barkod veya dijital takip",
        "reçete yönetimi",
        "hat durumu izleme",
        "üretim verisi kaydı",
        "alarm ve bakım bilgileri",
        "otomatik yönlendirme ve öncelik yönetimi",
      ],
      outro:
        "Operatörler denetim ve üretim kararlarındaki sorumluluğunu korurken, rutin malzeme transferleri ve makine koordinasyonu otomatik olarak yönetilebilir.",
      imageLabel: "Kontrol Odası Görseli",
    },
    en: {
      title: "Factory-Wide Control",
      intro: "The individual machines can be connected through a coordinated control architecture incorporating:",
      items: [
        "ERP or MES connectivity",
        "production-order transfer",
        "slab and batch identification",
        "barcode or digital tracking",
        "recipe management",
        "line-status monitoring",
        "production-data recording",
        "alarms and maintenance information",
        "automatic routing and priority management",
      ],
      outro:
        "Operators retain responsibility for supervision and production decisions, while routine material transfers and machine coordination can be managed automatically.",
      imageLabel: "Control Room Image",
    },
  },
  openIntegration: {
    tr: {
      title: "Açık Entegrasyon Mimarisi",
      intro: "ION ONEFLOW, yalnızca ION Meccanica tarafından üretilen ekipmanlarla sınırlı değildir. Sistem şunları entegre edebilir:",
      items: [
        "ION Meccanica reçine işleme makineleri",
        "ION taşıma ve otomasyon sistemleri",
        "müşterinin mevcut makineleri",
        "seçilen üçüncü taraf parlatma ekipmanları",
        "tarayıcılar ve tanımlama sistemleri",
        "AGV'ler ve otomatik depolama",
        "fabrika yazılımları ve ERP platformları",
      ],
      outro:
        "ION Meccanica, genel üretim mimarisini geliştirir, arayüzleri koordine eder ve seçilen teknolojileri tek bir işletim sistemi içinde entegre eder.",
      imageLabel: "Entegrasyon Görseli",
    },
    en: {
      title: "Open Integration Architecture",
      intro: "ION ONEFLOW is not limited to equipment manufactured by ION Meccanica. The system can integrate:",
      items: [
        "ION Meccanica resin-treatment machinery",
        "ION handling and automation systems",
        "existing customer machinery",
        "selected third-party polishing equipment",
        "scanners and identification systems",
        "AGVs and automated storage",
        "factory software and ERP platforms",
      ],
      outro:
        "ION Meccanica develops the overall production architecture, coordinates the interfaces and integrates the selected technologies into one operating system.",
      imageLabel: "Integration Image",
    },
  },
  mainAdvantages: {
    tr: {
      title: "Temel Avantajlar",
      items: [
        "Kesintisiz üretim",
        "Ara kürleme deposuna gerek olmaması",
        "Azaltılmış malzeme taşıma",
        "Daha kısa üretim teslim süreleri",
        "Daha düşük süreç içi stok",
        "Fabrika alanının daha iyi kullanımı",
        "Kontrollü süreç koşulları",
        "Daha yüksek izlenebilirlik",
        "Modüler fabrika gelişimi",
      ],
      imageLabel: "Fabrika Genel Görseli",
    },
    en: {
      title: "Main Advantages",
      items: [
        "Continuous production",
        "No intermediate curing storage",
        "Reduced material handling",
        "Shorter production lead times",
        "Lower work in progress",
        "Better use of factory space",
        "Controlled process conditions",
        "Greater traceability",
        "Modular factory development",
      ],
      imageLabel: "Factory Overview Image",
    },
  },
  provenConcept: {
    tr: {
      title: "Kanıtlanmış Üretim Konsepti",
      text: "Entegre reçine işleme ve parlatma konsepti, Türkiye'de üç taş işleme fabrikasında hayata geçirilmiştir. İki tesis 2019'dan beri, üçüncüsü ise 2023'ten beri faaliyettedir. Bu sistemler; reçine işleme, genişletilmiş termal kürleme ve parlatmayı kesintisiz bir üretim mimarisi içinde birbirine bağlayarak ION ONEFLOW'un pratik temelini oluşturmaktadır.",
      imageLabel: "Referans Tesis Görseli",
    },
    en: {
      title: "Proven Production Concept",
      text: "The integrated resin-treatment and polishing concept has been implemented in three stone-processing factories in Türkiye. Two installations have operated since 2019 and a third since 2023. These systems connect resin treatment, extended thermal curing and polishing within a continuous production architecture, providing the practical foundation for ION ONEFLOW.",
      imageLabel: "Reference Facility Image",
    },
  },
  buildFactory: {
    tr: {
      title: "ONEFLOW Fabrikanızı Kurun",
      text: "Her taş işleme fabrikasının farklı malzemeleri, üretim hedefleri, makineleri ve alan imkânları vardır. ION Meccanica, her ONEFLOW projesini müşterinin gerçek süreç ve üretim ihtiyaçlarına göre geliştirir.",
      closing: "Ham levhadan bitmiş yüzeye, tek bir bağlantılı akış.",
    },
    en: {
      title: "Build Your ONEFLOW Factory",
      text: "Every stone-processing factory has different materials, production targets, machinery and available space. ION Meccanica develops each ONEFLOW project around the customer's actual process and production requirements.",
      closing: "From raw slab to finished surface, one connected flow.",
    },
  },
};

// ---------------------------------------------------------------------------
// Metin solda, görsel sağda: içerik bölümleri için ortak satır bileşeni.
// text (paragraf/paragraflar) ya da items (madde listesi) kabul eder.
// ---------------------------------------------------------------------------
function SectionRow({
  eyebrow,
  title,
  text,
  intro,
  items,
  outro,
  imageLabel,
  imageLeft = false,
}: {
  eyebrow?: string;
  title: string;
  text?: string | string[];
  intro?: string;
  items?: string[];
  outro?: string;
  imageLabel: string;
  imageLeft?: boolean;
}) {
  const paragraphs = text ? (Array.isArray(text) ? text : [text]) : [];
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-20 md:py-28">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className={`text-left order-2 ${imageLeft ? "md:order-2" : "md:order-1"}`}>
          {eyebrow && (
            <span className="block text-xs font-bold tracking-[0.15em] text-[#B87332] mb-3">{eyebrow}</span>
          )}
          <h2 className="text-xl md:text-2xl font-extrabold text-[#3A3A3A] tracking-tight mb-4">{title}</h2>

          {intro && <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-5">{intro}</p>}

          {paragraphs.length > 0 && (
            <div className="space-y-4">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-sm md:text-base text-gray-600 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          )}

          {items && items.length > 0 && (
            <ul className="space-y-2 mb-1">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700 text-sm md:text-base leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#B87332] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}

          {outro && <p className="text-sm md:text-base text-gray-600 leading-relaxed mt-4">{outro}</p>}
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

// Ortalanmış, görselsiz bölüm (kapanış / CTA gibi metin-ağırlıklı yerler için)
function SectionCentered({ title, text }: { title: string; text: string | string[] }) {
  const paragraphs = Array.isArray(text) ? text : [text];
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-20 md:py-28">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-xl md:text-2xl font-extrabold text-[#3A3A3A] tracking-tight mb-5">{title}</h2>
        <div className="space-y-4">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-sm md:text-base text-gray-600 leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function IonOneflowPage() {
  const { lang } = useLanguage();
  const isTr = lang === "TR";
  const L = isTr ? "tr" : "en";

  const scrollToNext = () => {
    const hero = document.getElementById("oneflow-hero");
    if (hero && hero.nextElementSibling) {
      hero.nextElementSibling.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full bg-white font-montserrat">
      {/* 1. HERO VİDEO */}
      <div id="oneflow-hero" className="relative w-full h-screen overflow-hidden flex items-center justify-center">
        <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover z-0">
          <source src="/hero-video-2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 text-center text-white px-4 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-3 drop-shadow-md">
            ION ONEFLOW
          </h1>
          <p className="text-base sm:text-lg text-gray-200 font-semibold mb-3 drop-shadow">
            {CONTENT.hero[L].subtitle}
          </p>
          <p className="text-sm sm:text-base md:text-lg font-light text-gray-200 max-w-2xl mx-auto drop-shadow">
            {CONTENT.hero[L].tagline}
          </p>
        </div>
        <button
          onClick={scrollToNext}
          type="button"
          aria-label={isTr ? "Aşağı Kaydır" : "Scroll Down"}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 text-white/80 hover:text-white transition-all cursor-pointer animate-bounce p-2 focus:outline-none"
        >
          <ChevronDown size={38} className="stroke-[1.5]" />
        </button>
      </div>

      {/* 2. ION ONEFLOW NEDİR (hero'nun hemen altı) */}
      <SectionRow
        eyebrow={CONTENT.intro[L].eyebrow}
        title={CONTENT.intro[L].title}
        text={CONTENT.intro[L].text}
        imageLabel={CONTENT.intro[L].imageLabel}
      />

      {/* 3. İNTERAKTİF RESİM (ONEFLOW'un 5 bileşeni) */}
      <div className="max-w-[1400px] mx-auto px-6 pb-20 md:pb-28">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <span className="block text-xs font-bold tracking-[0.15em] text-[#B87332] mb-3">
            {CONTENT.diagramHeading[L].eyebrow}
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-[#3A3A3A] tracking-tight">
            {CONTENT.diagramHeading[L].title}
          </h2>
        </div>
        <InteractiveDiagram />
      </div>

      {/* 4. TEK FABRİKA. TEK ÜRETİM AKIŞI. */}
      <SectionRow
        title={CONTENT.oneFactory[L].title}
        text={CONTENT.oneFactory[L].text}
        imageLabel={CONTENT.oneFactory[L].imageLabel}
      />

      {/* 5. BEŞ KULELİ KÜRLEME KONSEPTİ */}
      <SectionRow
        title={CONTENT.fiveTower[L].title}
        text={CONTENT.fiveTower[L].text}
        imageLabel={CONTENT.fiveTower[L].imageLabel}
        imageLeft
      />

      {/* 6. KONTROLLÜ TERMAL İŞLEME */}
      <SectionRow
        title={CONTENT.thermalProcessing[L].title}
        intro={CONTENT.thermalProcessing[L].intro}
        items={CONTENT.thermalProcessing[L].items}
        imageLabel={CONTENT.thermalProcessing[L].imageLabel}
      />

      {/* 7. ENTEGRE REÇİNE İŞLEME */}
      <SectionRow
        title={CONTENT.resinTreatment[L].title}
        intro={CONTENT.resinTreatment[L].intro}
        items={CONTENT.resinTreatment[L].items}
        outro={CONTENT.resinTreatment[L].outro}
        imageLabel={CONTENT.resinTreatment[L].imageLabel}
        imageLeft
      />

      {/* 8. PARLATMAYA DOĞRUDAN BAĞLANTI */}
      <SectionRow
        title={CONTENT.directConnection[L].title}
        text={CONTENT.directConnection[L].text}
        imageLabel={CONTENT.directConnection[L].imageLabel}
      />

      {/* 9. DEPOLAMA VE MALZEME HAREKETİ */}
      <SectionRow
        title={CONTENT.storageMovement[L].title}
        text={CONTENT.storageMovement[L].text}
        imageLabel={CONTENT.storageMovement[L].imageLabel}
        imageLeft
      />

      {/* 10. FABRİKA GENELİNDE KONTROL */}
      <SectionRow
        title={CONTENT.factoryControl[L].title}
        intro={CONTENT.factoryControl[L].intro}
        items={CONTENT.factoryControl[L].items}
        outro={CONTENT.factoryControl[L].outro}
        imageLabel={CONTENT.factoryControl[L].imageLabel}
      />

      {/* 11. AÇIK ENTEGRASYON MİMARİSİ */}
      <SectionRow
        title={CONTENT.openIntegration[L].title}
        intro={CONTENT.openIntegration[L].intro}
        items={CONTENT.openIntegration[L].items}
        outro={CONTENT.openIntegration[L].outro}
        imageLabel={CONTENT.openIntegration[L].imageLabel}
        imageLeft
      />

      {/* 12. TEMEL AVANTAJLAR */}
      <SectionRow
        title={CONTENT.mainAdvantages[L].title}
        items={CONTENT.mainAdvantages[L].items}
        imageLabel={CONTENT.mainAdvantages[L].imageLabel}
      />

      {/* 13. KANITLANMIŞ ÜRETİM KONSEPTİ */}
      <SectionRow
        title={CONTENT.provenConcept[L].title}
        text={CONTENT.provenConcept[L].text}
        imageLabel={CONTENT.provenConcept[L].imageLabel}
        imageLeft
      />

      {/* 14. KAPANIŞ / CTA (görselsiz, ortalanmış) */}
      <SectionCentered title={CONTENT.buildFactory[L].title} text={[CONTENT.buildFactory[L].text, CONTENT.buildFactory[L].closing]} />
    </div>
  );
}