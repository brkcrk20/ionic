"use client";

// =========================================================================
// MERKEZİ DİL (TR / EN) SİSTEMİ
// Tüm site tek bir yerden bu sözlüğü ve dil state'ini kullanır.
// Navbar'daki dil değiştirici artık tüm sayfayı etkiler.
// =========================================================================

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "TR" | "EN";

export interface Translations {
  nav: {
    machines: string;
    engineering: string;
    service: string;
    company: string;
    projectsNews: string;
    contact: string;
    requestQuote: string;
    close: string;
    groupTitle: string;
    whyUs: string;
    sectors: string;
    news: string;
    contactSales: string;
    careers: string;
    portal: string;
    addressTitle: string;
    addressSub: string;
    catLines: string;
    resinLines: string;
    tileLines: string;
    integratedLines: string;
    catMachines: string;
    cncSaws: string;
    waterjet: string;
    stoneCutting: string;
    catAutomation: string;
    handling: string;
    loading: string;
    customMachinery: string;
    engItem1: string;
    engItem2: string;
    engItem3: string;
    engItem4: string;
    engItem5: string;
    srvItem1: string;
    srvItem2: string;
    srvItem3: string;
    srvItem4: string;
    srvItem5: string;
    srvItem6: string;
    cmpItem1: string;
    cmpItem2: string;
    cmpItem3: string;
    cmpItem4: string;
    cmpItem5: string;
    prjTitleCategories: string;
    prjTitleHighlights: string;
    prjItem1: string;
    prjItem2: string;
    prjItem3: string;
    prjItem4: string;
    prjItem5: string;
    prjItem6: string;
    prjItem7: string;
    prjSubItem1: string;
    prjSubItem2: string;
    prjSubItem3: string;
    prjSubItem4: string;
  };
  home: {
    hero: { title: string; subtitleLine1: string; subtitleLine2: string };
    brand: { title: string; description: string };
    capabilities: {
      title: string;
      description: string;
      card1Title: string;
      card1Desc: string;
      card2Title: string;
      card2Desc: string;
      card3Title: string;
      card3Desc: string;
      cta: string;
    };
    machines: {
      titleLine1: string;
      titleLine2: string;
      description: string;
      cta: string;
      items: Record<
        "resin" | "cnc" | "waterjet" | "tile" | "handling" | "custom",
        { name: string; category: string }
      >;
    };
    news: {
      title: string;
      readMore: string;
      card1: { badge: string; date: string; title: string; desc: string };
      card2: { badge: string; date: string; title: string; desc: string };
      card3: { badge: string; date: string; title: string; desc: string };
    };
    showroom: {
      factoryTitleLine1: string;
      factoryTitleLine2: string;
      factoryCta: string;
      eventTitleLine1: string;
      eventTitleLine2: string;
      eventCta: string;
    };
    mes: {
      sectionTitle: string;
      productName: string;
      subtitle: string;
      description: string;
      cta: string;
    };
    footer: {
      serviceTitle: string;
      linksTitle: string;
      linkNews: string;
      linkContacts: string;
      linkCareers: string;
      linkPortal: string;
      privacy: string;
      cookies: string;
      copyright: (year: number) => string;
      tagline: string;
    };
  };
}

const translations: Record<Lang, Translations> = {
  TR: {
    nav: {
      machines: "Makineler & Hatlar",
      engineering: "Mühendislik & Teknolojiler",
      service: "Servis & Hizmetler",
      company: "Kurumsal",
      projectsNews: "Projeler & Haberler",
      contact: "İletişim",
      requestQuote: "Teklif Alın",
      close: "Kapat",
      groupTitle: "Ion Meccanica Grubu",
      whyUs: "Neden Ion Meccanica?",
      sectors: "Uygulama Sektörleri",
      news: "Haberler & Projeler",
      contactSales: "İletişim & Satış Ağı",
      careers: "Kariyer",
      portal: "Müşteri Portalı Girişi",
      addressTitle: "Organize Sanayi Bölgesi, 14. Cadde",
      addressSub: "Denizli / Türkiye",
      catLines: "Komple Hatlar",
      resinLines: "Reçine İşleme Hatları",
      tileLines: "Fayans / Ebatlı Taş Hatları",
      integratedLines: "Entegre Üretim Hatları",
      catMachines: "Makineler",
      cncSaws: "CNC Köprü Kesim",
      waterjet: "Su Jeti Kesim Sistemleri",
      stoneCutting: "Taş Kesme & İşleme Makineleri",
      catAutomation: "Otomasyon",
      handling: "Taşıma & Otomasyon Sistemleri",
      loading: "Yükleme & Boşaltma Sistemleri",
      customMachinery: "Özel Tasarım Makineler",
      engItem1: "Mühendislik",
      engItem2: "Otomasyon & Kontrol",
      engItem3: "Üretim Kabiliyetleri",
      engItem4: "Özel Çözümler",
      engItem5: "Ar-Ge & Ürün Geliştirme",
      srvItem1: "Kurulum & Devreye Alma",
      srvItem2: "Teknik Destek",
      srvItem3: "Yedek Parça",
      srvItem4: "Bakım & Onarım",
      srvItem5: "Uzaktan Bağlantı / Destek",
      srvItem6: "Eğitim",
      cmpItem1: "ION MECCANICA Hakkında",
      cmpItem2: "Mühendislik & Üretim",
      cmpItem3: "Kalite Politikamız",
      cmpItem4: "Kabiliyetlerimiz",
      cmpItem5: "Kariyer",
      prjTitleCategories: "Proje & Güncelleme Türleri",
      prjTitleHighlights: "Öne Çıkanlar & Haberler",
      prjItem1: "Tamamlanan Projeler",
      prjItem2: "Üretimi Biten Makineler",
      prjItem3: "Reçine Hattı Projeleri",
      prjItem4: "Sevkiyatlar",
      prjItem5: "Kurulumlar",
      prjItem6: "Yeni Ürün Geliştirmeleri",
      prjItem7: "Fuar ve Şirket Haberleri",
      prjSubItem1: "Seçili Projeler",
      prjSubItem2: "Güncel Haberler",
      prjSubItem3: "Fuarlar & Etkinlikler",
      prjSubItem4: "Teknik Makaleler",
    },
    home: {
      hero: {
        title: "MÜHENDİSLİK. GÜVENİLİRLİK. BAĞLILIK.",
        subtitleLine1: "Doğal taş endüstrisi için komple üretim hatları ve makineler tasarlıyoruz.",
        subtitleLine2: "ION MECCANICA.",
      },
      brand: {
        title: "Mühendislik. Güvenilirlik. Bağlılık.",
        description:
          "ION MECCANICA, tek makinelerden komple üretim hatlarına kadar doğal taş sektörü için uygulamaya dönük mühendisliği, sağlam üretimi ve esnek proje yürütme kabiliyetini bir araya getirir.",
      },
      capabilities: {
        title: "Konseptten Devreye Almaya",
        description:
          "ION MECCANICA, doğal taş endüstrisi için güvenilir makineler ve komple üretim hatları sunmak amacıyla mühendislik, üretim ve otomasyonu bir araya getirir.",
        card1Title: "Mühendislik",
        card1Desc:
          "Müşterinin ürün, süreç, kapasite ve fabrika yerleşim gereksinimlerine göre geliştirilen makineler ve komple hatlar.",
        card2Title: "Üretim",
        card2Desc:
          "Sağlam ve güvenilir endüstriyel makineler için entegre imalat, işleme, montaj ve test kabiliyetleri.",
        card3Title: "Otomasyon & Entegrasyon",
        card3Desc:
          "Üretim akışını, tutarlılığı ve operasyonel verimliliği artırmak için tasarlanmış taşıma sistemleri, süreç kontrolü ve makine entegrasyonu.",
        cta: "Yetkinliklerimizi Keşfedin",
      },
      machines: {
        titleLine1: "Makineler &",
        titleLine2: "Komple Hatlar",
        description:
          "Tekli makinelerden tam entegre üretim hatlarına kadar ION MECCANICA, doğal taş işlemede kesim, reçine işleme, malzeme taşıma ve otomasyon için mühendislik çözümleri sunar.",
        cta: "Tüm Ürünleri Keşfet",
        items: {
          resin: { name: "Reçine İşleme Hatları", category: "Komple Hatlar" },
          cnc: { name: "CNC Köprü Kesim Makineleri", category: "Makineler" },
          waterjet: { name: "Su Jeti Kesim Sistemleri", category: "Makineler" },
          tile: { name: "Fayans İşleme Hatları", category: "Komple Hatlar" },
          handling: { name: "Taşıma & Otomasyon Sistemleri", category: "Otomasyon" },
          custom: { name: "Özel Makineler & Entegre Hatlar", category: "Özel Çözümler" },
        },
      },
      news: {
        title: "Son Projeler & Haberler",
        readMore: "Devamını Oku",
        card1: {
          badge: "Projeler",
          date: "14 Mart 2024",
          title: "Sevkiyata Hazır Komple Reçine Hattı",
          desc: "Kuzey Amerika'daki müşterimize gönderilecek 40 kuleli dev bir reçine işleme hattının son testleri tamamlandı.",
        },
        card2: {
          badge: "Ürün Geliştirme",
          date: "28 Şubat 2024",
          title: "Yeni CNC Köprü Kesim Makinesi Geliştirmesi",
          desc: "Yeni 5 eksenli ağır hizmet tipi köprü kesim makinemizin son prototip aşamasını duyurmaktan mutluluk duyuyoruz.",
        },
        card3: {
          badge: "Etkinlikler",
          date: "10 Şubat 2024",
          title: "ION MECCANICA Marmomac 2024'te",
          desc: "Doğal taş endüstrisi için en yeni entegre otomasyon çözümlerimizi keşfetmek üzere bu Eylül'de Verona'da bizimle buluşun.",
        },
      },
      showroom: {
        factoryTitleLine1: "Bir Tıkla Fabrikamızı",
        factoryTitleLine2: "Ziyaret Edin",
        factoryCta: "Sanal Turu Başlat",
        eventTitleLine1: "Standımızı ziyaret edin",
        eventTitleLine2: "Marmomac 2024",
        eventCta: "Sanal Turu Başlat",
      },
      mes: {
        sectionTitle: "Öne Çıkan",
        productName: "ION-MES",
        subtitle: "ION-MES, üretim yönetimi için ION MECCANICA sistemidir",
        description:
          "ION-MES, üretim planlaması, üretim döngülerinin izlenmesi ve kontrolü için özel işlevleriyle taş endüstrisinin ihtiyaçlarını karşılamak üzere tasarlanmıştır. Platformun tamamı, taş işleme endüstrisindeki süreçlerin karmaşıklığına ve çeşitliliğine uyum sağlayabilir.",
        cta: "Daha Fazla Bilgi Edinin",
      },
      footer: {
        serviceTitle: "Servis",
        linksTitle: "Bağlantılar",
        linkNews: "Haberler, etkinlikler & basın",
        linkContacts: "İletişim ve satış ağı",
        linkCareers: "Kariyer",
        linkPortal: "Müşteri Portalı",
        privacy: "Gizlilik Politikası",
        cookies: "Çerez Politikası",
        copyright: (year: number) => `Telif Hakkı © ${year} ION MECCANICA. Tüm hakları saklıdır.`,
        tagline: "Doğal Taş Endüstrisi İçin Tasarlandı.",
      },
    },
  },
  EN: {
    nav: {
      machines: "Machines & Lines",
      engineering: "Engineering & Technology",
      service: "Service",
      company: "Company",
      projectsNews: "Projects & News",
      contact: "Contact",
      requestQuote: "Request a Quote",
      close: "Close",
      groupTitle: "Ion Meccanica Group",
      whyUs: "Why Ion Meccanica?",
      sectors: "Application Sectors",
      news: "News & Projects",
      contactSales: "Contacts & Sales Network",
      careers: "Careers",
      portal: "Customer Portal Login",
      addressTitle: "Organize Sanayi Bölgesi, 14. Cadde",
      addressSub: "Denizli / Turkiye",
      catLines: "Complete Lines",
      resinLines: "Resin Treatment Lines",
      tileLines: "Tile Processing Lines",
      integratedLines: "Integrated Production Lines",
      catMachines: "Machines",
      cncSaws: "CNC Bridge Saws",
      waterjet: "Waterjet Cutting Systems",
      stoneCutting: "Stone Cutting & Processing Machines",
      catAutomation: "Automation",
      handling: "Handling & Automation Systems",
      loading: "Loading & Unloading Systems",
      customMachinery: "Custom Machinery",
      engItem1: "Engineering",
      engItem2: "Automation & Control",
      engItem3: "Manufacturing Capabilities",
      engItem4: "Custom Solutions",
      engItem5: "Research & Product Development",
      srvItem1: "Installation & Commissioning",
      srvItem2: "Technical Support",
      srvItem3: "Spare Parts",
      srvItem4: "Maintenance",
      srvItem5: "Remote Assistance",
      srvItem6: "Training",
      cmpItem1: "About ION MECCANICA",
      cmpItem2: "Engineering & Manufacturing",
      cmpItem3: "Quality",
      cmpItem4: "Our Capabilities",
      cmpItem5: "Careers",
      prjTitleCategories: "Project & News Types",
      prjTitleHighlights: "Highlights & Media",
      prjItem1: "Completed Projects",
      prjItem2: "Finished Machine Deliveries",
      prjItem3: "Resin Line Projects",
      prjItem4: "Shipments",
      prjItem5: "Installations",
      prjItem6: "New Product Developments",
      prjItem7: "Exhibitions & Company News",
      prjSubItem1: "Selected Projects",
      prjSubItem2: "Latest News",
      prjSubItem3: "Exhibitions & Events",
      prjSubItem4: "Technical Articles",
    },
    home: {
      hero: {
        title: "ENGINEERING. RELIABILITY. COMMITMENT.",
        subtitleLine1: "We design complete production lines and machines for the natural stone industry.",
        subtitleLine2: "ION MECCANICA.",
      },
      brand: {
        title: "Engineering. Reliability. Commitment.",
        description:
          "From standalone machines to complete processing lines, ION MECCANICA combines practical engineering, robust manufacturing and flexible project execution for the natural stone industry.",
      },
      capabilities: {
        title: "From Concept to Commissioning",
        description:
          "ION MECCANICA combines engineering, manufacturing and automation to deliver reliable machinery and complete production lines for the natural stone industry.",
        card1Title: "Engineering",
        card1Desc:
          "Machines and complete lines developed around the customer's product, process, capacity and factory layout requirements.",
        card2Title: "Manufacturing",
        card2Desc:
          "Integrated fabrication, machining, assembly and testing capabilities for robust and dependable industrial machinery.",
        card3Title: "Automation & Integration",
        card3Desc:
          "Handling systems, process control and machine integration designed to improve production flow, consistency and operational efficiency.",
        cta: "Discover Our Capabilities",
      },
      machines: {
        titleLine1: "Machines &",
        titleLine2: "Complete Lines",
        description:
          "From standalone machinery to fully integrated production lines, ION MECCANICA delivers engineered solutions for cutting, resin treatment, material handling and automation in natural stone processing.",
        cta: "Explore All Products",
        items: {
          resin: { name: "Resin Treatment Lines", category: "Complete Lines" },
          cnc: { name: "CNC Bridge Saws", category: "Machines" },
          waterjet: { name: "Waterjet Cutting Systems", category: "Machines" },
          tile: { name: "Tile Processing Lines", category: "Complete Lines" },
          handling: { name: "Handling & Automation Systems", category: "Automation" },
          custom: { name: "Custom Machinery & Integrated Lines", category: "Custom Solutions" },
        },
      },
      news: {
        title: "Latest Projects & News",
        readMore: "Read More",
        card1: {
          badge: "Projects",
          date: "14 March 2024",
          title: "Complete Resin Line Ready for Shipment",
          desc: "Final testing completed for a massive 40-tower resin treatment line heading to our client in North America.",
        },
        card2: {
          badge: "Product Development",
          date: "28 February 2024",
          title: "New CNC Bridge Saw Development",
          desc: "We are excited to announce the final prototyping phase of our new 5-axis heavy-duty bridge saw.",
        },
        card3: {
          badge: "Events",
          date: "10 February 2024",
          title: "ION MECCANICA at Marmomac 2024",
          desc: "Join us in Verona this September to discover our latest integrated automation solutions for the stone industry.",
        },
      },
      showroom: {
        factoryTitleLine1: "Visit our Factory",
        factoryTitleLine2: "with a click",
        factoryCta: "Start the virtual tour",
        eventTitleLine1: "Visit our booth at",
        eventTitleLine2: "Marmomac 2024",
        eventCta: "Start the virtual tour",
      },
      mes: {
        sectionTitle: "Featured",
        productName: "ION-MES",
        subtitle: "ION-MES is the ION MECCANICA system for production management",
        description:
          "ION-MES is designed to meet the needs of the stone industry through specific functions for planning production, and for monitoring and controlling production cycles. The entire platform is able to adapt to the complexity and variety of processes in the stone processing industry.",
        cta: "Find out more",
      },
      footer: {
        serviceTitle: "Service",
        linksTitle: "Links",
        linkNews: "News, events & press",
        linkContacts: "Contacts and Sales network",
        linkCareers: "Careers",
        linkPortal: "Customer Portal",
        privacy: "Privacy Policy",
        cookies: "Cookie Policy",
        copyright: (year: number) => `Copyright © ${year} ION MECCANICA. All rights reserved.`,
        tagline: "Engineered for the Natural Stone Industry.",
      },
    },
  },
};

// -------------------------------------------------------------------------
// REACT CONTEXT: Dil değiştirici artık tüm siteyi (Navbar + sayfalar) etkiler
// -------------------------------------------------------------------------
interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("TR");

  useEffect(() => {
    document.documentElement.lang = lang.toLowerCase();
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage(), <LanguageProvider> içinde kullanılmalıdır.");
  }
  return ctx;
}
