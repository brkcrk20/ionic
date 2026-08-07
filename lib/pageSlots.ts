// Admin panelindeki "Sayfalar" bölümünde gösterilen sabit kurumsal sayfa ağacı.
// Her yuva (slot), sitedeki gerçek bir route'a karşılık gelir. Bu sayfalar
// silinmez; admin panelinden içerikleri düzenlenir ve yayın durumu açılıp kapatılır.
// Yeni bir kurumsal sayfa eklemek gerektiğinde buraya yeni bir slot eklemek yeterlidir.

export type PageSlot = {
  key: string;
  group: string;
  path: string;
  labelTr: string;
  labelEn: string;
};

export const PAGE_GROUPS = [
  "ONEFLOW",
  "Makineler",
  "Hatlar",
  "Hizmetler",
  "Hakkımızda",
  "Haberler",
  "İletişim",
] as const;

export const PAGE_SLOTS: PageSlot[] = [
  // 1. ONEFLOW
  {
    key: "ion-oneflow",
    group: "ONEFLOW",
    path: "/ion-oneflow",
    labelTr: "ION ONEFLOW",
    labelEn: "ION ONEFLOW",
  },

  // 2. MAKİNELER
  {
    key: "category-machines",
    group: "Makineler",
    path: "/category/machines",
    labelTr: "Makineler Ana Sayfası",
    labelEn: "Machines Main Page",
  },

  // 3. HATLAR
  {
    key: "category-lines",
    group: "Hatlar",
    path: "/category/lines",
    labelTr: "Hatlar Ana Sayfası",
    labelEn: "Lines Main Page",
  },

  // 4. HİZMETLER
  {
    key: "services",
    group: "Hizmetler",
    path: "/service",
    labelTr: "Hizmetler",
    labelEn: "Services",
  },

  // 5. HAKKIMIZDA
  {
    key: "about-us",
    group: "Hakkımızda",
    path: "/about-us",
    labelTr: "Hakkımızda",
    labelEn: "About Us",
  },
  {
    key: "company-index",
    group: "Hakkımızda",
    path: "/company",
    labelTr: "Kurumsal (Ana Sayfa)",
    labelEn: "Company (Index)",
  },
  {
    key: "capabilities",
    group: "Hakkımızda",
    path: "/company/capabilities",
    labelTr: "Yetkinlikler",
    labelEn: "Capabilities",
  },
  {
    key: "engineering-production",
    group: "Hakkımızda",
    path: "/company/engineering-production",
    labelTr: "Mühendislik & Üretim",
    labelEn: "Engineering & Production",
  },
  {
    key: "quality",
    group: "Hakkımızda",
    path: "/company/quality",
    labelTr: "Kalite Politikamız",
    labelEn: "Quality",
  },
  {
    key: "automation-control",
    group: "Hakkımızda",
    path: "/automation-control",
    labelTr: "Otomasyon & Kontrol",
    labelEn: "Automation Control",
  },
  {
    key: "careers",
    group: "Hakkımızda",
    path: "/careers",
    labelTr: "Kariyer",
    labelEn: "Careers",
  },

  // 6. HABERLER
  {
    key: "news-index",
    group: "Haberler",
    path: "/news",
    labelTr: "Haberler & Projeler",
    labelEn: "News & Projects",
  },

  // 7. İLETİŞİM
  {
    key: "contact",
    group: "İletişim",
    path: "/contact",
    labelTr: "İletişim",
    labelEn: "Contact",
  },
];

export function getPageSlot(key: string): PageSlot | undefined {
  return PAGE_SLOTS.find((s) => s.key === key);
}

export function getGroupedSlots(): { group: string; slots: PageSlot[] }[] {
  return PAGE_GROUPS.map((group) => ({
    group,
    slots: PAGE_SLOTS.filter((s) => s.group === group),
  }));
}