"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight, FileText } from "lucide-react";
import type { Category, MultiLangString, NavMenuItem, NavSubItem } from "@/lib/db";
import { useLanguage } from "@/lib/i18n";

const DEFAULT_NAV_MENU: NavMenuItem[] = [
  { id: "nav-engineering", label: { tr: "ION ONEFLOW", en: "ION ONEFLOW" }, href: "/ion-oneflow" },
  {
    id: "nav-machines",
    label: { tr: "Makineler", en: "Machines" },
    href: "/products",
    children: [
      {
        id: "nav-machines-g1",
        label: { tr: "Komple Hatlar", en: "Complete Lines" },
        href: "/category/komple-hatlar",
        children: [
          { id: "nav-machines-1", label: { tr: "Epoksi Fırın Hatları", en: "Epoxy Oven Lines" }, href: "/category/epoksi-firin-hatlari" },
          { id: "nav-machines-2", label: { tr: "Plaka Silim Hatları", en: "Slab Polishing Lines" }, href: "/category/plaka-silim-hatlari" },
        ],
      },
      {
        id: "nav-machines-g2",
        label: { tr: "Makineler", en: "Machines" },
        href: "/category/makineler",
        children: [
          { id: "nav-machines-4", label: { tr: "Epoksi Uygulama", en: "Epoxy Application" }, href: "/category/epoksi-uygulama" },
          { id: "nav-machines-5", label: { tr: "Atölye", en: "Workshop" }, href: "/category/atolye" },
          { id: "nav-machines-6", label: { tr: "Yükleme & Boşaltma", en: "Loading & Unloading" }, href: "/category/yukleme-bosaltma" },
        ],
      },
    ],
  },
  { id: "nav-service", label: { tr: "Hizmetler", en: "Service" }, href: "/service" },
  {
    id: "nav-company",
    label: { tr: "Kurumsal", en: "Company" },
    href: "/company",
    children: [
      { id: "nav-company-1", label: { tr: "Hakkımızda", en: "About Us" }, href: "/company/about-us" },
      { id: "nav-company-2", label: { tr: "Mühendislik & Üretim", en: "Engineering & Production" }, href: "/company/engineering-production" },
      { id: "nav-company-3", label: { tr: "Kalite", en: "Quality" }, href: "/company/quality" },
      { id: "nav-company-4", label: { tr: "Yetkinlikler", en: "Capabilities" }, href: "/company/capabilities" },
      { id: "nav-company-5", label: { tr: "Kariyer", en: "Careers" }, href: "/careers" },
    ],
  },
  { id: "nav-news", label: { tr: "Haberler", en: "News" }, href: "/news" },
  { id: "nav-contact", label: { tr: "İletişim", en: "Contact" }, href: "/contact" },
];

export default function Navbar({
  categories = [],
  navMenu,
  announcement,
}: {
  categories?: Category[];
  navMenu?: NavMenuItem[];
  announcement?: { text: MultiLangString; link?: string } | null;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileOpenId, setMobileOpenId] = useState<string | null>(null);
  const [mobileOpenSubId, setMobileOpenSubId] = useState<string | null>(null);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const { lang, setLang, t: tAll } = useLanguage();
  const t = tAll.nav;
  const announcementText = announcement
    ? lang === "EN"
      ? (typeof announcement.text === "string" ? announcement.text : announcement.text.en || announcement.text.tr)
      : (typeof announcement.text === "string" ? announcement.text : announcement.text.tr || announcement.text.en)
    : "";
  const showAnnouncement = Boolean(announcement && announcementText && !announcementDismissed);
  const menuItems = navMenu && navMenu.length > 0 ? navMenu : DEFAULT_NAV_MENU;
  const menuLabel = (item: NavMenuItem | NavSubItem) => {
    if (typeof item.label === "string") return item.label;
    return (lang === "EN" ? item.label.en : item.label.tr) || item.label.tr || item.label.en;
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!megaMenuOpen) {
      setMobileOpenId(null);
      setMobileOpenSubId(null);
    }
  }, [megaMenuOpen]);

  // Gelişmiş Kaydırma Dinleyicisi (Özel kaydırma konteynerlerini de yakalar)
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const scrollTop = target.scrollTop || window.scrollY || document.documentElement.scrollTop;
      
      if (scrollTop > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  // Sadece ana sayfanın en tepesindeyken şeffaf, diğer tüm durumlarda #3A3A3A (Ion Grafit)
  const navBg = isHome && !isScrolled
    ? "bg-transparent"
    : "bg-[#3A3A3A]";

  return (
    <>
      <nav className={`fixed top-0 inset-x-0 w-full z-50 transition-all duration-300 ${navBg}`}>
        {showAnnouncement && (
          <div className="h-9 bg-[#B87332] text-white flex items-center justify-center px-4 relative">
            {announcement?.link ? (
              <Link href={announcement.link} className="text-xs font-semibold tracking-wide hover:underline text-center">
                {announcementText}
              </Link>
            ) : (
              <span className="text-xs font-semibold tracking-wide text-center">{announcementText}</span>
            )}
            <button
              onClick={() => setAnnouncementDismissed(true)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
              aria-label="Duyuruyu kapat"
            >
              <X size={14} />
            </button>
          </div>
        )}
        {/* MASAÜSTÜ NAVBAR */}
        <div className="hidden xl:flex items-center justify-between max-w-[1850px] mx-auto px-6 lg:px-8 h-22">
          
          {/* 1. SOL: LOGO */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center hover:opacity-80 transition-all">
              <Image src="/logo.svg" alt="Ion Meccanica" width={72} height={72} className="object-contain h-16 w-auto" />
            </Link>
          </div>

          {/* 2. ORTA: ANA MENÜ ELEMANLARI */}
          <div className="flex items-center justify-center gap-5 xl:gap-8 text-[14px] xl:text-[15px] font-montserrat font-bold text-[#F3F1EC] tracking-wide h-full">

           {menuItems.map((item) => {
              const hasChildren = Array.isArray(item.children) && item.children.length > 0;

              if (hasChildren) {
                const isGrouped = item.children!.some((sub) => Array.isArray(sub.children) && sub.children.length > 0);
                return (
                  <div key={item.id} className="relative h-full flex items-center" onMouseEnter={() => setOpenMenu(item.id)} onMouseLeave={() => setOpenMenu(null)}>
                    <Link href={item.href} className="hover:text-[#B87332] transition-colors flex items-center gap-1 py-4">
                      {menuLabel(item)}
                    </Link>
                    {openMenu === item.id && isGrouped && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0.5 w-[min(92vw,720px)] bg-white/98 backdrop-blur-2xl border-t-2 border-t-[#B87332] border-x border-b border-gray-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] z-50 text-black rounded-b-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                        <div className="grid grid-cols-2 gap-8 px-10 py-8 bg-gradient-to-b from-gray-50/70 to-white">
                          {item.children!.map((group) => (
                            <div key={group.id} className="flex flex-col gap-3.5 group/col">
                              <Link href={group.href} className="font-extrabold text-[#0B1941] text-[13.5px] uppercase tracking-wider border-b border-gray-200/80 pb-2.5 hover:text-[#B87332] transition-colors flex items-center justify-between group-hover/col:border-[#B87332]/50">
                                <span>{menuLabel(group)}</span>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover/col:translate-x-1 group-hover/col:text-[#B87332] transition-all" />
                              </Link>
                              {Array.isArray(group.children) && group.children.length > 0 && (
                                <div className="flex flex-col gap-1.5">
                                  {group.children.map((leaf) => (
                                    <Link key={leaf.id} href={leaf.href} className="text-[13px] font-medium text-gray-600 hover:text-[#B87332] hover:translate-x-1 transition-all py-1.5 px-2.5 rounded-md hover:bg-white">
                                      {menuLabel(leaf)}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {openMenu === item.id && !isGrouped && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0.5 w-84 bg-white/98 backdrop-blur-2xl border-t-2 border-t-[#B87332] border-x border-b border-gray-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] z-50 text-black rounded-b-2xl overflow-hidden p-2.5 animate-in fade-in slide-in-from-top-2">
                        <div className="flex flex-col gap-1">
                          {item.children!.map((sub) => (
                            <Link key={sub.id} href={sub.href} className="group flex items-center justify-between text-[13.5px] font-medium text-gray-700 hover:text-[#B87332] hover:bg-gray-50 transition-all p-3 rounded-xl">
                              <span>{menuLabel(sub)}</span>
                              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#B87332] group-hover:translate-x-1 transition-all" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div key={item.id} className="relative h-full flex items-center">
                  <Link href={item.href} className="hover:text-[#B87332] transition-colors flex items-center gap-1 py-4">
                    {menuLabel(item)}
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-5 xl:gap-6 shrink-0">

            <div className="flex items-center gap-1 font-montserrat font-bold text-[14px] text-[#F3F1EC]">
              <button
                onClick={() => setLang("EN")}
                className={`transition-colors cursor-pointer hover:text-[#B87332] ${lang === "EN" ? "text-[#B87332]" : "text-[#F3F1EC]/60"}`}
              >
                EN
              </button>
              <span className="text-[#F3F1EC]/30 text-xs">/</span>
              <button
                onClick={() => setLang("TR")}
                className={`transition-colors cursor-pointer hover:text-[#B87332] ${lang === "TR" ? "text-[#B87332]" : "text-[#F3F1EC]/60"}`}
              >
                TR
              </button>
            </div>

            <button
              onClick={() => setMegaMenuOpen(true)}
              className="flex items-center gap-2 text-[#F3F1EC] hover:text-[#B87332] transition-colors p-1 cursor-pointer"
              aria-label="Menüyü Aç"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>

        {/* MOBİL NAVBAR BARI */}
        <div className="flex xl:hidden items-center justify-between px-4 sm:px-6 h-16">
          <Link href="/" className="flex items-center shrink-0 hover:opacity-80 transition-opacity">
            <Image src="/logo.svg" alt="Logo" width={48} height={48} className="object-contain h-10 w-auto" />
          </Link>
          
          <div className="flex items-center gap-3">
            <button className="p-1 text-[#F3F1EC]" onClick={() => setMegaMenuOpen(true)}>
              <Menu size={26} />
            </button>
          </div>
        </div>
      </nav>

      {/* AÇILIR MEGA MENÜ (OVERLAY) */}
      {megaMenuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-start">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMegaMenuOpen(false)}
          />

          <div className="relative w-full min-h-[50vh] max-h-[85vh] md:max-h-[55vh] bg-[#F3F1EC] text-[#0B1941] shadow-2xl overflow-y-auto flex flex-col justify-between z-10 animate-in slide-in-from-top duration-300">
            
            <div className="flex items-center justify-between max-w-[1850px] w-full mx-auto px-6 lg:px-12 h-20 shrink-0 border-b border-gray-100">
              <Link href="/" onClick={() => setMegaMenuOpen(false)} className="flex items-center pt-6">
                <Image src="/logo-2.svg" alt="Logo" width={110} height={36} className="object-contain h-14 w-auto" />
              </Link>

              <button
                onClick={() => setMegaMenuOpen(false)}
                className="flex items-center gap-2 font-bold text-sm tracking-wider text-[#0B1941] hover:text-[#B87332] transition-colors cursor-pointer"
              >
                <span>{t.close}</span>
                <X size={22} />
              </button>
            </div>

            <div className="max-w-[1500px] w-full mx-auto px-6 lg:px-12 py-6 md:py-8 my-auto">

              {/* MOBİL/TABLET: ANA MENÜ (masaüstünde navbar'da hover ile açılan menülerin karşılığı) */}
              <div className="xl:hidden mb-8 border-b border-gray-200 pb-2">
                <div className="flex flex-col divide-y divide-gray-100">
                  {menuItems.map((item) => {
                    const hasChildren = Array.isArray(item.children) && item.children.length > 0;

                    if (!hasChildren) {
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => setMegaMenuOpen(false)}
                          className="py-3.5 text-base font-extrabold text-[#0B1941] hover:text-[#B87332] transition-colors"
                        >
                          {menuLabel(item)}
                        </Link>
                      );
                    }

                    const isOpen = mobileOpenId === item.id;
                    return (
                      <div key={item.id}>
                        <div className="flex items-center justify-between py-3.5">
                          <Link
                            href={item.href}
                            onClick={() => setMegaMenuOpen(false)}
                            className="text-base font-extrabold text-[#0B1941] hover:text-[#B87332] transition-colors"
                          >
                            {menuLabel(item)}
                          </Link>
                          <button
                            type="button"
                            onClick={() => setMobileOpenId(isOpen ? null : item.id)}
                            aria-label={isOpen ? "Alt başlıkları kapat" : "Alt başlıkları aç"}
                            className="p-2 -mr-2 cursor-pointer"
                          >
                            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`} />
                          </button>
                        </div>
                        {isOpen && (
                          <div className="pb-3 pl-3 flex flex-col gap-0.5">
                            {item.children!.map((sub) => {
                              const subHasChildren = Array.isArray(sub.children) && sub.children.length > 0;

                              if (!subHasChildren) {
                                return (
                                  <Link
                                    key={sub.id}
                                    href={sub.href}
                                    onClick={() => setMegaMenuOpen(false)}
                                    className="py-2 text-sm font-semibold text-gray-600 hover:text-[#B87332] transition-colors"
                                  >
                                    {menuLabel(sub)}
                                  </Link>
                                );
                              }

                              const isSubOpen = mobileOpenSubId === sub.id;
                              return (
                                <div key={sub.id}>
                                  <div className="flex items-center justify-between py-2">
                                    <Link
                                      href={sub.href}
                                      onClick={() => setMegaMenuOpen(false)}
                                      className="text-sm font-bold text-gray-700 hover:text-[#B87332] transition-colors"
                                    >
                                      {menuLabel(sub)}
                                    </Link>
                                    <button
                                      type="button"
                                      onClick={() => setMobileOpenSubId(isSubOpen ? null : sub.id)}
                                      aria-label={isSubOpen ? "Alt başlıkları kapat" : "Alt başlıkları aç"}
                                      className="p-2 -mr-2 cursor-pointer"
                                    >
                                      <ChevronRight className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 ${isSubOpen ? "rotate-90" : ""}`} />
                                    </button>
                                  </div>
                                  {isSubOpen && (
                                    <div className="pb-2 pl-3 flex flex-col gap-0.5">
                                      {sub.children!.map((leaf) => (
                                        <Link
                                          key={leaf.id}
                                          href={leaf.href}
                                          onClick={() => setMegaMenuOpen(false)}
                                          className="py-1.5 text-xs font-medium text-gray-500 hover:text-[#B87332] transition-colors"
                                        >
                                          {menuLabel(leaf)}
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* MOBİL/TABLET: İLETİŞİM BİLGİLERİ + DİL SEÇENEĞİ */}
              <div className="xl:hidden mb-8 flex flex-col gap-4 text-sm text-gray-600 font-medium leading-relaxed">
                <div className="flex flex-col gap-0.5 text-gray-700">
                  <p className="font-semibold text-[#0B1941]">{t.addressTitle}</p>
                  <p>{t.addressSub}</p>
                  <p className="pt-1">+90 (258) 814 57 47</p>
                  <a href="mailto:info@ionmeccanica.com" className="text-[#0B1941] hover:underline font-semibold">
                    info@ionmeccanica.com
                  </a>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 tracking-widest pt-1">
                  <button onClick={() => setLang("EN")} className={`cursor-pointer hover:text-[#B87332] ${lang === "EN" ? "text-[#0B1941] font-extrabold" : ""}`}>
                    EN
                  </button>
                  /
                  <button onClick={() => setLang("TR")} className={`cursor-pointer hover:text-[#B87332] ${lang === "TR" ? "text-[#0B1941] font-extrabold" : ""}`}>
                    TR
                  </button>
                </div>
              </div>

              {/* MASAÜSTÜ: EK BAĞLANTILAR (Kurumsal / Neden Biz / Sektörler / vb.) */}
              <div className="hidden xl:grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
                
                <div className="md:col-span-5 flex flex-col gap-3 md:gap-5 font-montserrat">
                  <Link href="/company" onClick={() => setMegaMenuOpen(false)} className="text-xl md:text-2xl lg:text-3xl font-extrabold text-[#0B1941] hover:text-[#B87332] transition-colors">
                    {t.groupTitle}
                  </Link>
                  <Link href="/why-ion" onClick={() => setMegaMenuOpen(false)} className="text-xl md:text-2xl lg:text-3xl font-extrabold text-[#0B1941] hover:text-[#B87332] transition-colors">
                    {t.whyUs}
                  </Link>
                  <Link href="/sectors" onClick={() => setMegaMenuOpen(false)} className="text-xl md:text-2xl lg:text-3xl font-extrabold text-[#0B1941] hover:text-[#B87332] transition-colors">
                    {t.sectors}
                  </Link>
                </div>

                <div className="md:col-span-4 flex flex-col gap-3 text-xs md:text-sm font-bold tracking-wider uppercase text-[#0B1941]">
                  <Link href="/news" onClick={() => setMegaMenuOpen(false)} className="hover:text-[#B87332] transition-colors">
                    {t.news}
                  </Link>
                  <Link href="/contact" onClick={() => setMegaMenuOpen(false)} className="hover:text-[#B87332] transition-colors">
                    {t.contactSales}
                  </Link>
                  <Link href="/careers" onClick={() => setMegaMenuOpen(false)} className="hover:text-[#B87332] transition-colors">
                    {t.careers}
                  </Link>
                  <Link href="/portal" onClick={() => setMegaMenuOpen(false)} className="hover:text-[#B87332] transition-colors pt-1">
                    {t.portal}
                  </Link>
                </div>

                <div className="md:col-span-3 flex flex-col gap-4 text-xs md:text-sm text-gray-600 font-medium leading-relaxed">
                  <div className="flex flex-col gap-0.5 text-gray-700">
                    <p className="font-semibold text-[#0B1941]">{t.addressTitle}</p>
                    <p>{t.addressSub}</p>
                    <p className="pt-1">+90 (258) 814 57 47</p>
                    <a href="mailto:info@ionmeccanica.com" className="text-[#0B1941] hover:underline font-semibold">
                      info@ionmeccanica.com
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 tracking-widest pt-1">
                    <button onClick={() => setLang("EN")} className={`cursor-pointer hover:text-[#B87332] ${lang === "EN" ? "text-[#0B1941] font-extrabold" : ""}`}>
                      EN
                    </button>
                    /
                    <button onClick={() => setLang("TR")} className={`cursor-pointer hover:text-[#B87332] ${lang === "TR" ? "text-[#0B1941] font-extrabold" : ""}`}>
                      TR
                    </button>
                  </div>
                </div>

              </div>
            </div>

            <div className="h-4 w-full"></div>
          </div>
        </div>
      )}
  </>
  );
}