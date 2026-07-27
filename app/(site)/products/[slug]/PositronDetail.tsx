"use client";
 
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { Download, ChevronRight, Image as ImageIcon, Plus, Minus } from "lucide-react";
 
/* ------------------------------------------------------------------ */
/*  STANDARD STYLE TOKENS                                             */
/* ------------------------------------------------------------------ */
const styles = {
  sectionEyebrow: "text-2xl md:text-3xl font-extrabold tracking-tight text-[#B87332] mb-5",
  card: "bg-[#F3F1EC] rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col h-full",
  cardTitle: "text-lg font-extrabold text-[#3A3A3A] mb-3 pb-3 border-b border-[#B87332]/25",
  body: "text-sm text-[#3A3A3A] leading-relaxed font-semibold",
  bodyStack: "space-y-3 text-sm text-[#3A3A3A] leading-relaxed font-semibold",
  listItem: "text-sm text-[#3A3A3A] leading-relaxed font-semibold",
  subLabel: "text-sm font-extrabold text-[#B87332] mb-1.5",
};
 
/* ------------------------------------------------------------------ */
/*  PRODUCT CONTENT                                                   */
/* ------------------------------------------------------------------ */
const content = {
  en: {
    descriptionTitle: "Description & System Architecture",
    description: [
      "POSITRON is a fully insulated cyclic tower oven designed for drying natural-stone slabs before resin application and curing them after resin treatment. The system is available in 20+20, 30+30 and 40+40 slab configurations, allowing the oven capacity and dimensions to be selected according to the required production output and line architecture.",
      "Each configuration consists of two vertical processing units containing stacked slab trays. During operation, the trays are cyclically moved through a controlled heating environment to provide consistent temperature exposure across the entire slab load.",
      "The oven can be supplied with either electric-resistance heating or a gas-fired heating system. Two independent hot-air circulation systems distribute heated air through internal diffusers positioned approximately 80 mm from the slab trays. Steel airflow guides contain and direct the air within the slab-treatment zone, allowing heat to reach the slab surfaces directly and consistently. Combined with the oven's fully insulated construction, this close-coupled airflow architecture minimises temperature differences between slab levels, limits unnecessary heat loss and enables efficient use of the installed heating power. The electric version uses energy-efficient serpentine resistance heaters.",
      "The external structure is fully insulated using high-density panels and additional thermal insulation materials. Chamber temperature is continuously monitored by electronic sensors. Humidity is measured at multiple locations within the chamber, while moisture-laden air generated during the drying process is automatically extracted.",
      "POSITRON is controlled through an industrial PC-based automation system incorporating variable-frequency drives, sensors and automatic process controls. Its electrical and electronic architecture can be integrated into Industry 4.0 production environments.",
    ],
    headStartLabel: "HeadStart",
    headStart:
      "The HeadStart function schedules oven preheating before the production shift begins. The oven can therefore reach the required operating temperature before the first slabs arrive, eliminating unnecessary start-up delays.",
    configTitle: "Available Configurations",
    configs: [
      { name: "POSITRON 40", text: "Two groups of 20 slab trays, providing a total capacity of 40 slabs." },
      { name: "POSITRON 60", text: "Two groups of 30 slab trays, providing a total capacity of 60 slabs." },
      { name: "POSITRON 80", text: "Two groups of 40 slab trays, providing a total capacity of 80 slabs." },
    ],
    configNote:
      "POSITRON is available in marble and granite configurations. The marble version accommodates slabs up to 2,100 × 3,300 mm, while the granite version accommodates slabs up to 2,300 × 3,700 mm. Oven dimensions, tray construction and handling equipment are adapted to the selected slab format.",
    configNote2:
      "Machine dimensions, installed power, fan arrangement and airflow capacity vary according to the selected configuration.",
    versionsTitle: "Available Versions & Options",
    versions: [
      {
        label: "POSITRON Speedy",
        text: "The Speedy version is developed for production lines requiring shorter slab-handling times and higher throughput. Its principal movement axes are equipped with servo motors and rack-and-pinion drive systems, providing rapid movement and accurate positioning. The slab-tray lifting system is hydraulically operated and incorporates a high-flow hydraulic power unit to reduce lifting and lowering times.",
      },
      {
        label: "Options: Enhanced Air Homogeneity Fan",
        text: "For demanding drying applications, POSITRON can be equipped with an additional recirculation fan to improve air distribution throughout the oven chamber. The supplementary fan helps minimise temperature and airflow differences between slab levels, supporting more uniform moisture removal and consistent drying performance across the full oven load.",
      },
      {
        label: "Options: IntelliHot",
        text: "The optional IntelliHot system measures the temperature of slabs leaving the oven and automatically adjusts the internal heating regime. This reduces the need for operator intervention and helps maintain the required slab outlet temperature under changing production conditions.",
      },
    ],
    featuresTitle: "Main Features",
    features: [
      "Fully insulated cyclic tower construction",
      "20+20, 30+30 and 40+40 capacity configurations",
      "Marble and granite configurations",
      "Suitable for slab drying and resin curing",
      "Electric or gas-fired heating configurations",
      "Two independent hot-air circulation systems",
      "Internal diffusers positioned approximately 80 mm from the slab trays",
      "Steel airflow guides for controlled air distribution",
      "Continuous chamber-temperature monitoring",
      "Multi-point humidity monitoring",
      "Automatic extraction of excess moisture",
      "Industrial PC-based command and control system",
      "Variable-frequency drives and process sensors",
      "European-origin hydraulic lifting equipment",
      "Industry 4.0-compatible control architecture",
      "Programmable HeadStart preheating",
    ],
  },
  tr: {
    descriptionTitle: "Açıklama & Sistem Mimarisi",
    description: [
      "POSITRON, reçine uygulamasından önce doğal taş plakaların kurutulması ve reçine işleminden sonra kürlenmesi için tasarlanmış, tam yalıtımlı döngüsel bir kule fırındır. Sistem 20+20, 30+30 ve 40+40 plaka konfigürasyonlarında sunulur; böylece fırın kapasitesi ve boyutları, gerekli üretim çıktısına ve hat mimarisine göre seçilebilir.",
      "Her konfigürasyon, istiflenmiş plaka tepsilerini içeren iki dikey işleme ünitesinden oluşur. Çalışma sırasında tepsiler, tüm plaka yükü boyunca tutarlı bir sıcaklık maruziyeti sağlamak için kontrollü bir ısıtma ortamında döngüsel olarak hareket ettirilir.",
      "Fırın, elektrik dirençli ısıtma veya gaz yakıtlı ısıtma sistemi ile tedarik edilebilir. İki bağımsız sıcak hava sirkülasyon sistemi, plaka tepsilerinden yaklaşık 80 mm uzaklıkta konumlandırılmış iç difüzörler aracılığıyla ısıtılmış havayı dağıtır. Çelik hava akışı kılavuzları, havayı plaka işleme bölgesi içinde tutarak yönlendirir ve ısının plaka yüzeylerine doğrudan ve tutarlı şekilde ulaşmasını sağlar. Fırının tam yalıtımlı yapısıyla birleşen bu sıkı bağlantılı hava akışı mimarisi, plaka katmanları arasındaki sıcaklık farklarını en aza indirir, gereksiz ısı kaybını sınırlar ve kurulu ısıtma gücünün verimli kullanılmasını sağlar. Elektrikli versiyon, enerji verimli serpantin dirençli ısıtıcılar kullanır.",
      "Dış yapı, yüksek yoğunluklu paneller ve ilave termal yalıtım malzemeleri kullanılarak tam olarak yalıtılmıştır. Oda sıcaklığı elektronik sensörlerle sürekli izlenir. Nem, oda içinde birden fazla noktada ölçülürken, kurutma işlemi sırasında oluşan nemli hava otomatik olarak tahliye edilir.",
      "POSITRON, değişken frekanslı sürücüler, sensörler ve otomatik proses kontrolleri içeren endüstriyel PC tabanlı bir otomasyon sistemi ile kontrol edilir. Elektrik ve elektronik mimarisi, Endüstri 4.0 üretim ortamlarına entegre edilebilir.",
    ],
    headStartLabel: "HeadStart",
    headStart:
      "HeadStart fonksiyonu, üretim vardiyası başlamadan önce fırın ön ısıtmasını planlar. Böylece fırın, ilk plakalar gelmeden gerekli çalışma sıcaklığına ulaşabilir ve gereksiz başlangıç gecikmeleri önlenir.",
    configTitle: "Mevcut Konfigürasyonlar",
    configs: [
      { name: "POSITRON 40", text: "20'şerli 2 grup plaka tepsisi, toplam 40 plaka kapasitesi sağlar." },
      { name: "POSITRON 60", text: "30'arlı 2 grup plaka tepsisi, toplam 60 plaka kapasitesi sağlar." },
      { name: "POSITRON 80", text: "40'arlı 2 grup plaka tepsisi, toplam 80 plaka kapasitesi sağlar." },
    ],
    configNote:
      "POSITRON, mermer ve granit konfigürasyonlarında sunulur. Mermer versiyonu 2.100 × 3.300 mm'ye kadar, granit versiyonu ise 2.300 × 3.700 mm'ye kadar plakaları barındırır. Fırın boyutları, tepsi konstrüksiyonu ve taşıma ekipmanı seçilen plaka formatına göre uyarlanır.",
    configNote2:
      "Makine boyutları, kurulu güç, fan düzeni ve hava akış kapasitesi seçilen konfigürasyona göre değişir.",
    versionsTitle: "Mevcut Versiyonlar & Opsiyonlar",
    versions: [
      {
        label: "POSITRON Speedy",
        text: "Speedy versiyonu, daha kısa plaka taşıma süreleri ve yüksek iş hacmi gerektiren üretim hatları için geliştirilmiştir. Ana hareket eksenleri, hızlı hareket ve hassas konumlandırma sağlamak için servo motorlar ve kremayer-pinyon tahrik sistemleri ile donatılmıştır. Plaka tepsisi kaldırma sistemi hidrolik olarak çalışır ve kaldırma ile indirme sürelerini azaltmak için yüksek akışlı bir hidrolik güç ünitesi içerir.",
      },
      {
        label: "Opsiyon: Gelişmiş Hava Homojenliği Fanı",
        text: "Zorlu kurutma uygulamaları için POSITRON, fırın odası genelinde hava dağılımını iyileştiren ilave bir resirkülasyon fanı ile donatılabilir. Bu ek fan, plaka katmanları arasındaki sıcaklık ve hava akışı farklarını en aza indirmeye yardımcı olarak, tam fırın yükü boyunca daha homojen nem giderimi ve tutarlı kurutma performansı sağlar.",
      },
      {
        label: "Opsiyon: IntelliHot",
        text: "Opsiyonel IntelliHot sistemi, fırından çıkan plakaların sıcaklığını ölçer ve iç ısıtma rejimini otomatik olarak ayarlar. Bu, operatör müdahalesi ihtiyacını azaltır ve değişen üretim koşullarında gerekli plaka çıkış sıcaklığının korunmasına yardımcı olur.",
      },
    ],
    featuresTitle: "Temel Özellikler",
    features: [
      "Tam yalıtımlı döngüsel kule konstrüksiyonu",
      "20+20, 30+30 ve 40+40 kapasite konfigürasyonları",
      "Mermer ve granit konfigürasyonları",
      "Plaka kurutma ve reçine kürleme için uygundur",
      "Elektrikli veya gaz yakıtlı ısıtma konfigürasyonları",
      "İki bağımsız sıcak hava sirkülasyon sistemi",
      "Plaka tepsilerinden yaklaşık 80 mm uzaklıkta konumlandırılmış iç difüzörler",
      "Kontrollü hava dağılımı için çelik hava akışı kılavuzları",
      "Sürekli oda sıcaklığı izleme",
      "Çok noktalı nem izleme",
      "Fazla nemin otomatik tahliyesi",
      "Endüstriyel PC tabanlı komuta ve kontrol sistemi",
      "Değişken frekanslı sürücüler ve proses sensörleri",
      "Avrupa menşeli hidrolik kaldırma ekipmanı",
      "Endüstri 4.0 uyumlu kontrol mimarisi",
      "Programlanabilir HeadStart ön ısıtma",
    ],
  },
};
 
export default function PositronDetail() {
  const { lang, t } = useLanguage();
  const isTr = lang === "TR";
  const c = content[isTr ? "tr" : "en"];
 
  const [openSections, setOpenSections] = useState<{ [key: number]: boolean }>({ 0: true });

  const toggleSection = (index: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const photoItems = [
    { label: isTr ? "Görsel 1" : "Image 1" },
    { label: isTr ? "Görsel 2" : "Image 2" },
    { label: isTr ? "Görsel 3" : "Image 3" },
    { label: isTr ? "Görsel 4" : "Image 4" },
  ];
 
  return (
    <div className="w-full min-h-screen bg-white relative font-montserrat text-[#3A3A3A] overflow-x-hidden">
 
      {/* 1. BÖLÜM: HERO & GENEL BAKIŞ */}
      <section 
        className="w-full min-h-screen relative flex flex-col justify-start px-6 lg:pl-16 lg:pr-16 pt-28 lg:pt-32 pb-20 bg-[#3A3A3A] bg-no-repeat bg-bottom bg-[length:100%_auto] lg:bg-[length:100%_auto]"
        style={{ backgroundImage: "url('/Positron_2.png')" }}
      >
 
        {/* Üst Kısım: Anasayfa / Ürünler / Positron */}
        <div className="w-full lg:ml-[-30px] mx-auto relative z-10 -mt-6">
          <div className="text-[8pt] uppercase tracking-widest text-white/70 mb-4 flex flex-wrap items-center gap-2">
            <Link href="/" className="hover:text-[#B87332] transition-colors">{isTr ? "Anasayfa" : "Homepage"}</Link>
            <ChevronRight size={14} />
            <Link href="/products" className="hover:text-[#B87332] transition-colors">{isTr ? "Ürünler" : "Products"}</Link>
            <ChevronRight size={14} />
            <span className="text-[#B87332] font-bold">Posıtron</span>
          </div>
        </div>

        {/* Alt Kısım */}
        <div className="w-full max-w-5xl mx-auto relative z-10 mt-8 pl-0 lg:pl-12">
          <div className="max-w-3xl flex flex-col items-start gap-6">
            <div>
              <h1 className="text-4xl md:text-[48px] font-extrabold tracking-tight text-white mb-2">POSITRON</h1>
              <p className="text-xl md:text-2xl font-bold text-[#B87332] mb-4">
                {isTr ? "Plaka Kurutma ve Reçine Kürleme için Döngüsel Fırın" : "Cyclic Oven for Slab Drying and Resin Curing"}
              </p>
              <p className="text-base text-white/90 leading-relaxed font-medium">
                {isTr
                  ? "POSITRON, reçine uygulaması öncesi doğal taş plakaları kurutmak ve reçine işleminden sonra kürlemek için tasarlanmış tam yalıtımlı döngüsel bir kule fırınıdır."
                  : "POSITRON is a fully insulated cyclic tower oven designed for drying natural-stone slabs before resin application and curing them after resin treatment."}
              </p>
            </div>
          </div>
        </div>
      </section>
 
      {/* 2. BÖLÜM: AÇIKLAMA (4 Madde Akordiyon / Plus-Minus Yapısı) */}
      <section className="w-full bg-[#F3F1EC] flex flex-col justify-start px-6 lg:pl-16 lg:pr-16 py-20">
        <div className="w-full max-w-5xl mx-auto relative z-10">
          <h2 className={styles.sectionEyebrow}>
            {isTr ? "Açıklama & Teknik Detaylar" : "Description & Technical Details"}
          </h2>
 
          <div className="space-y-4">
            
            {/* 1. Madde: Description & Architecture */}
            <div className="bg-[#F3F1EC] rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300">
              <button
                onClick={() => toggleSection(0)}
                className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer hover:bg-gray-200/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#B87332] text-white flex items-center justify-center shrink-0 transition-transform duration-300">
                    {openSections[0] ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                  <h3 className="text-lg md:text-xl font-extrabold text-[#3A3A3A]">
                    {c.descriptionTitle}
                  </h3>
                </div>
              </button>
              
              {openSections[0] && (
                <div className="px-6 pb-6 pt-2 border-t border-[#B87332]/20">
                  <div className={styles.bodyStack}>
                    {c.description.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                    {c.headStart && (
                      <p className="pt-2">
                        <strong className="text-[#B87332] font-extrabold">{c.headStartLabel}: </strong>
                        {c.headStart}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Madde: Available Configurations */}
            <div className="bg-[#F3F1EC] rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300">
              <button
                onClick={() => toggleSection(1)}
                className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer hover:bg-gray-200/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#B87332] text-white flex items-center justify-center shrink-0 transition-transform duration-300">
                    {openSections[1] ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                  <h3 className="text-lg md:text-xl font-extrabold text-[#3A3A3A]">
                    {c.configTitle}
                  </h3>
                </div>
              </button>
              
              {openSections[1] && (
                <div className="px-6 pb-6 pt-2 border-t border-[#B87332]/20 space-y-4">
                  <div className={styles.bodyStack}>
                    {c.configs.map((cfg) => (
                      <p key={cfg.name}>
                        <strong className="text-[#B87332] font-extrabold">{cfg.name}: </strong>
                        {cfg.text}
                      </p>
                    ))}
                  </div>
                  <p className={`${styles.body} pt-2`}>{c.configNote}</p>
                  <p className={`${styles.body} pt-1`}>{c.configNote2}</p>
                </div>
              )}
            </div>

            {/* 3. Madde: Available Versions & Options */}
            <div className="bg-[#F3F1EC] rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300">
              <button
                onClick={() => toggleSection(2)}
                className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer hover:bg-gray-200/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#B87332] text-white flex items-center justify-center shrink-0 transition-transform duration-300">
                    {openSections[2] ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                  <h3 className="text-lg md:text-xl font-extrabold text-[#3A3A3A]">
                    {c.versionsTitle}
                  </h3>
                </div>
              </button>
              
              {openSections[2] && (
                <div className="px-6 pb-6 pt-2 border-t border-[#B87332]/20 space-y-4">
                  <div className={styles.bodyStack}>
                    {c.versions.map((v) => (
                      <p key={v.label}>
                        <strong className="text-[#B87332] font-extrabold">{v.label}: </strong>
                        {v.text}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Madde: Main Features */}
            <div className="bg-[#F3F1EC] rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300">
              <button
                onClick={() => toggleSection(3)}
                className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer hover:bg-gray-200/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#B87332] text-white flex items-center justify-center shrink-0 transition-transform duration-300">
                    {openSections[3] ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                  <h3 className="text-lg md:text-xl font-extrabold text-[#3A3A3A]">
                    {c.featuresTitle}
                  </h3>
                </div>
              </button>
              
              {openSections[3] && (
                <div className="px-6 pb-6 pt-2 border-t border-[#B87332]/20">
                  <div className={styles.bodyStack}>
                    {c.features.map((f, i) => (
                      <p key={i}>
                        <strong className="text-[#B87332] font-extrabold">• </strong>
                        {f}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
 
      {/* 3. BÖLÜM: FOTOĞRAFLAR (Düz, Aynı Boyutta Yan Yana Kutular) */}
      <section className="w-full bg-[#F3F1EC] flex flex-col justify-center px-6 lg:pl-20 lg:pr-16 py-20">
        <div className="w-full max-w-[1500px] mx-auto relative z-10 flex flex-col gap-6">
          <h2 className={styles.sectionEyebrow}>
            {isTr ? "Fotoğraflar" : "Photos"}
          </h2>
 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {photoItems.map((photo, index) => (
              <div 
                key={index}
                className="w-full h-[280px] md:h-[320px] bg-black/80 border-2 border-[#B87332] rounded-3xl shadow-[0_0_30px_rgba(184,115,50,0.2)] flex flex-col items-center justify-center text-white transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden group"
              >
                <ImageIcon size={56} className="mb-3 text-white/90 group-hover:text-[#B87332] transition-colors" />
                <span className="text-xl md:text-2xl font-extrabold tracking-wide">{photo.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* 4. BÖLÜM: FOOTER */}
      <footer className="w-full bg-[#F3F1EC] flex flex-col justify-between py-16 px-6 lg:px-20 text-[#3A3A3A]">
        <div className="max-w-[1500px] w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="flex flex-col gap-8 justify-center">
            <Image src="/logo-2.svg" alt="ION MECCANICA" width={200} height={70} className="object-contain w-36 h-auto sm:w-[200px]" />
          </div>
 
          <div className="flex flex-col gap-6 justify-center">
            <div>
              <h4 className="font-extrabold text-base mb-2">ION MECCANICA</h4>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {t.nav.addressTitle}
                <br />
                {t.nav.addressSub}
              </p>
              <p className="text-sm text-gray-600 mt-2 font-semibold">+90 (258) 814 57 47</p>
              <p className="text-sm text-gray-600 font-semibold">info@ionmeccanica.com</p>
            </div>
          </div>
 
          <div className="flex flex-col gap-2.5 justify-center">
            <h4 className="font-extrabold text-base mb-2">Links</h4>
            <Link href="/projeler" className="text-sm font-medium text-gray-600 hover:text-[#B87332] transition-colors">News & Projects</Link>
            <Link href="/iletisim" className="text-sm font-medium text-gray-600 hover:text-[#B87332] transition-colors">Contacts & Sales Network</Link>
            <Link href="/navigator" className="text-sm font-medium text-gray-600 hover:text-[#B87332] transition-colors">Careers</Link>
            <Link href="/portal" className="text-sm font-medium text-gray-600 hover:text-[#B87332] transition-colors">Customer Portal Login</Link>
          </div>
 
          <div className="flex items-start gap-4 justify-start lg:justify-end pt-4">
            <div className="w-20 h-20 border border-gray-300 rounded-lg flex items-center justify-center text-xs text-center text-gray-500 font-bold bg-white/50 shadow-xs">
              ISO 9001
            </div>
            <div className="w-20 h-20 border border-gray-300 rounded-lg flex items-center justify-center text-xs text-center text-gray-500 font-bold bg-white/50 shadow-xs">
              CE CERT
            </div>
          </div>
        </div>
 
        <div className="max-w-[1500px] w-full mx-auto border-t border-gray-300/80 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-gray-500">
          <p>© {new Date().getFullYear()} ION MECCANICA. All rights reserved.</p>
          <p>Engineering • Reliability • Commitment</p>
        </div>
      </footer>
 
    </div>
  );
}