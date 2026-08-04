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

export const PAGE_GROUPS = ["ONEFLOW", "Makineler", "Hatlar", "Hizmetler", "Hakkımızda", "Haberler", "İletişim",] as const;

export const PAGE_SLOTS: PageSlot[] = [
  { key: "about-us", group: "Hakkımızda", path: "/about-us/company", labelTr: "Hakkımızda", labelEn: "About Us" },
  { key: "company-index", group: "Kurumsal", path: "/company", labelTr: "Kurumsal (Ana Sayfa)", labelEn: "Company (Index)" },
  { key: "capabilities", group: "Kurumsal", path: "/company/capabilities", labelTr: "Yetkinlikler", labelEn: "Capabilities" },
  { key: "engineering-production", group: "Kurumsal", path: "/company/engineering-production", labelTr: "Mühendislik & Üretim", labelEn: "Engineering & Production" },
  { key: "quality", group: "Kurumsal", path: "/company/quality", labelTr: "Kalite Politikamız", labelEn: "Quality" },
  { key: "automation-control", group: "Teknoloji", path: "/automation-control", labelTr: "Otomasyon & Kontrol", labelEn: "Automation Control" },
  { key: "careers", group: "Kariyer", path: "/careers", labelTr: "Kariyer", labelEn: "Careers" },
  { key: "contact", group: "İletişim", path: "/contact", labelTr: "İletişim", labelEn: "Contact" },
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
