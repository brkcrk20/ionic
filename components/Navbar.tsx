"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight, FileText } from "lucide-react";
import type { Category } from "@/lib/db";
import { useLanguage } from "@/lib/i18n";

export default function Navbar({ categories = [] }: { categories?: Category[] }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const { lang, setLang, t: tAll } = useLanguage();
  const t = tAll.nav;

  const [isScrolled, setIsScrolled] = useState(false);

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
        {/* MASAÜSTÜ NAVBAR */}
        <div className="hidden md:flex items-center justify-between max-w-[1850px] mx-auto px-6 lg:px-8 h-22">
          
          {/* 1. SOL: LOGO */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center hover:opacity-80 transition-all">
              <Image src="/logo.svg" alt="Ion Meccanica" width={72} height={72} className="object-contain h-16 w-auto" />
            </Link>
          </div>

          {/* 2. ORTA: ANA MENÜ ELEMANLARI */}
          <div className="flex items-center justify-center gap-5 xl:gap-8 text-[14px] xl:text-[15px] font-montserrat font-bold text-[#F3F1EC] tracking-wide h-full">
            
            {/* MACHINES & LINES DROPDOWN */}
            <div className="relative h-full flex items-center" onMouseEnter={() => setOpenMenu("machines")} onMouseLeave={() => setOpenMenu(null)}>
              <Link href="/urunler" className="hover:text-[#B87332] transition-colors flex items-center gap-1 py-4">
                {t.machines}
              </Link>
              {openMenu === "machines" && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0.5 w-[min(92vw,980px)] bg-white/98 backdrop-blur-2xl border-t-2 border-t-[#B87332] border-x border-b border-gray-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] z-50 text-black rounded-b-2xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-top-2">
                  <div className="grid grid-cols-3 gap-8 px-10 py-8 bg-gradient-to-b from-gray-50/70 to-white">
                    <div className="flex flex-col gap-3.5 group/col">
                      <Link href="/kategori/komple-hatlar" className="font-extrabold text-[#0B1941] text-[13.5px] uppercase tracking-wider border-b border-gray-200/80 pb-2.5 hover:text-[#B87332] transition-colors flex items-center justify-between group-hover/col:border-[#B87332]/50">
                        <span>{t.catLines}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover/col:translate-x-1 group-hover/col:text-[#B87332] transition-all" />
                      </Link>
                      <div className="flex flex-col gap-1.5">
                        <Link href="/kategori/recine-hatlari" className="text-[13px] font-medium text-gray-600 hover:text-[#B87332] hover:translate-x-1 transition-all py-1.5 px-2.5 rounded-md hover:bg-white">{t.resinLines}</Link>
                        <Link href="/kategori/fayans-hatlari" className="text-[13px] font-medium text-gray-600 hover:text-[#B87332] hover:translate-x-1 transition-all py-1.5 px-2.5 rounded-md hover:bg-white">{t.tileLines}</Link>
                        <Link href="/kategori/entegre-hatlar" className="text-[13px] font-medium text-gray-600 hover:text-[#B87332] hover:translate-x-1 transition-all py-1.5 px-2.5 rounded-md hover:bg-white">{t.integratedLines}</Link>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3.5 group/col">
                      <Link href="/kategori/makineler" className="font-extrabold text-[#0B1941] text-[13.5px] uppercase tracking-wider border-b border-gray-200/80 pb-2.5 hover:text-[#B87332] transition-colors flex items-center justify-between group-hover/col:border-[#B87332]/50">
                        <span>{t.catMachines}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover/col:translate-x-1 group-hover/col:text-[#B87332] transition-all" />
                      </Link>
                      <div className="flex flex-col gap-1.5">
                        <Link href="/kategori/cnc-kopru-kesim" className="text-[13px] font-medium text-gray-600 hover:text-[#B87332] hover:translate-x-1 transition-all py-1.5 px-2.5 rounded-md hover:bg-white">{t.cncSaws}</Link>
                        <Link href="/kategori/su-jeti-kesim" className="text-[13px] font-medium text-gray-600 hover:text-[#B87332] hover:translate-x-1 transition-all py-1.5 px-2.5 rounded-md hover:bg-white">{t.waterjet}</Link>
                        <Link href="/kategori/tas-kesme-isleme" className="text-[13px] font-medium text-gray-600 hover:text-[#B87332] hover:translate-x-1 transition-all py-1.5 px-2.5 rounded-md hover:bg-white">{t.stoneCutting}</Link>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3.5 group/col">
                      <Link href="/kategori/otomasyon" className="font-extrabold text-[#0B1941] text-[13.5px] uppercase tracking-wider border-b border-gray-200/80 pb-2.5 hover:text-[#B87332] transition-colors flex items-center justify-between group-hover/col:border-[#B87332]/50">
                        <span>{t.catAutomation}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover/col:translate-x-1 group-hover/col:text-[#B87332] transition-all" />
                      </Link>
                      <div className="flex flex-col gap-1.5">
                        <Link href="/kategori/tasima-otomasyon" className="text-[13px] font-medium text-gray-600 hover:text-[#B87332] hover:translate-x-1 transition-all py-1.5 px-2.5 rounded-md hover:bg-white">{t.handling}</Link>
                        <Link href="/kategori/yukleme-bosaltma" className="text-[13px] font-medium text-gray-600 hover:text-[#B87332] hover:translate-x-1 transition-all py-1.5 px-2.5 rounded-md hover:bg-white">{t.loading}</Link>
                        <Link href="/kategori/ozel-tasarim-makineler" className="text-[13px] font-medium text-gray-600 hover:text-[#B87332] hover:translate-x-1 transition-all py-1.5 px-2.5 rounded-md hover:bg-white">{t.customMachinery}</Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ENGINEERING DROPDOWN */}
            <div className="relative h-full flex items-center" onMouseEnter={() => setOpenMenu("engineering")} onMouseLeave={() => setOpenMenu(null)}>
              <Link href="/muhendislik" className="hover:text-[#B87332] transition-colors flex items-center gap-1 py-4">
                {t.engineering}
              </Link>
              {openMenu === "engineering" && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0.5 w-80 bg-white/98 backdrop-blur-2xl border-t-2 border-t-[#B87332] border-x border-b border-gray-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] z-50 text-black rounded-b-2xl overflow-hidden p-2.5 animate-in fade-in slide-in-from-top-2">
                  <div className="flex flex-col gap-1">
                    <Link href="/muhendislik/muhendislik" className="group flex items-center justify-between text-[13.5px] font-medium text-gray-700 hover:text-[#B87332] hover:bg-gray-50 transition-all p-3 rounded-xl">
                      <span>{t.engItem1}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#B87332] group-hover:translate-x-1 transition-all" />
                    </Link>
                    <Link href="/muhendislik/otomasyon-kontrol" className="group flex items-center justify-between text-[13.5px] font-medium text-gray-700 hover:text-[#B87332] hover:bg-gray-50 transition-all p-3 rounded-xl">
                      <span>{t.engItem2}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#B87332] group-hover:translate-x-1 transition-all" />
                    </Link>
                    <Link href="/muhendislik/uretim-kabiliyetleri" className="group flex items-center justify-between text-[13.5px] font-medium text-gray-700 hover:text-[#B87332] hover:bg-gray-50 transition-all p-3 rounded-xl">
                      <span>{t.engItem3}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#B87332] group-hover:translate-x-1 transition-all" />
                    </Link>
                    <Link href="/muhendislik/ozel-cozumler" className="group flex items-center justify-between text-[13.5px] font-medium text-gray-700 hover:text-[#B87332] hover:bg-gray-50 transition-all p-3 rounded-xl">
                      <span>{t.engItem4}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#B87332] group-hover:translate-x-1 transition-all" />
                    </Link>
                    <Link href="/muhendislik/ar-ge" className="group flex items-center justify-between text-[13.5px] font-medium text-gray-700 hover:text-[#B87332] hover:bg-gray-50 transition-all p-3 rounded-xl">
                      <span>{t.engItem5}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#B87332] group-hover:translate-x-1 transition-all" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* SERVICE DROPDOWN */}
            <div className="relative h-full flex items-center" onMouseEnter={() => setOpenMenu("service")} onMouseLeave={() => setOpenMenu(null)}>
              <Link href="/servis" className="hover:text-[#B87332] transition-colors flex items-center gap-1 py-4">
                {t.service}
              </Link>
              {openMenu === "service" && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0.5 w-84 bg-white/98 backdrop-blur-2xl border-t-2 border-t-[#B87332] border-x border-b border-gray-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] z-50 text-black rounded-b-2xl overflow-hidden p-2.5 animate-in fade-in slide-in-from-top-2">
                  <div className="flex flex-col gap-1">
                    <Link href="/servis/kurulum-devreye-alma" className="group flex items-center justify-between text-[13.5px] font-medium text-gray-700 hover:text-[#B87332] hover:bg-gray-50 transition-all p-3 rounded-xl">
                      <span>{t.srvItem1}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#B87332] group-hover:translate-x-1 transition-all" />
                    </Link>
                    <Link href="/servis/teknik-destek" className="group flex items-center justify-between text-[13.5px] font-medium text-gray-700 hover:text-[#B87332] hover:bg-gray-50 transition-all p-3 rounded-xl">
                      <span>{t.srvItem2}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#B87332] group-hover:translate-x-1 transition-all" />
                    </Link>
                    <Link href="/servis/yedek-parca" className="group flex items-center justify-between text-[13.5px] font-medium text-gray-700 hover:text-[#B87332] hover:bg-gray-50 transition-all p-3 rounded-xl">
                      <span>{t.srvItem3}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#B87332] group-hover:translate-x-1 transition-all" />
                    </Link>
                    <Link href="/servis/bakim-onarim" className="group flex items-center justify-between text-[13.5px] font-medium text-gray-700 hover:text-[#B87332] hover:bg-gray-50 transition-all p-3 rounded-xl">
                      <span>{t.srvItem4}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#B87332] group-hover:translate-x-1 transition-all" />
                    </Link>
                    <Link href="/servis/uzaktan-destek" className="group flex items-center justify-between text-[13.5px] font-medium text-gray-700 hover:text-[#B87332] hover:bg-gray-50 transition-all p-3 rounded-xl">
                      <span>{t.srvItem5}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#B87332] group-hover:translate-x-1 transition-all" />
                    </Link>
                    <Link href="/servis/egitim" className="group flex items-center justify-between text-[13.5px] font-medium text-gray-700 hover:text-[#B87332] hover:bg-gray-50 transition-all p-3 rounded-xl">
                      <span>{t.srvItem6}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#B87332] group-hover:translate-x-1 transition-all" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* COMPANY DROPDOWN */}
            <div className="relative h-full flex items-center" onMouseEnter={() => setOpenMenu("company")} onMouseLeave={() => setOpenMenu(null)}>
              <Link href="/kurumsal" className="hover:text-[#B87332] transition-colors flex items-center gap-1 py-4">
                {t.company}
              </Link>
              {openMenu === "company" && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0.5 w-84 bg-white/98 backdrop-blur-2xl border-t-2 border-t-[#B87332] border-x border-b border-gray-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] z-50 text-black rounded-b-2xl overflow-hidden p-2.5 animate-in fade-in slide-in-from-top-2">
                  <div className="flex flex-col gap-1">
                    <Link href="/kurumsal/hakkimizda" className="group flex items-center justify-between text-[13.5px] font-medium text-gray-700 hover:text-[#B87332] hover:bg-gray-50 transition-all p-3 rounded-xl">
                      <span>{t.cmpItem1}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#B87332] group-hover:translate-x-1 transition-all" />
                    </Link>
                    <Link href="/kurumsal/muhendislik-uretim" className="group flex items-center justify-between text-[13.5px] font-medium text-gray-700 hover:text-[#B87332] hover:bg-gray-50 transition-all p-3 rounded-xl">
                      <span>{t.cmpItem2}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#B87332] group-hover:translate-x-1 transition-all" />
                    </Link>
                    <Link href="/kurumsal/kalite" className="group flex items-center justify-between text-[13.5px] font-medium text-gray-700 hover:text-[#B87332] hover:bg-gray-50 transition-all p-3 rounded-xl">
                      <span>{t.cmpItem3}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#B87332] group-hover:translate-x-1 transition-all" />
                    </Link>
                    <Link href="/kurumsal/kabiliyetlerimiz" className="group flex items-center justify-between text-[13.5px] font-medium text-gray-700 hover:text-[#B87332] hover:bg-gray-50 transition-all p-3 rounded-xl">
                      <span>{t.cmpItem4}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#B87332] group-hover:translate-x-1 transition-all" />
                    </Link>
                    <Link href="/kariyer" className="group flex items-center justify-between text-[13.5px] font-medium text-gray-700 hover:text-[#B87332] hover:bg-gray-50 transition-all p-3 rounded-xl">
                      <span>{t.cmpItem5}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#B87332] group-hover:translate-x-1 transition-all" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* PROJECTS & NEWS DROPDOWN */}
            <div className="relative h-full flex items-center" onMouseEnter={() => setOpenMenu("projects")} onMouseLeave={() => setOpenMenu(null)}>
              <Link href="/projeler" className="hover:text-[#B87332] transition-colors flex items-center gap-1 py-4">
                {t.projectsNews}
              </Link>
              {openMenu === "projects" && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0.5 w-[min(92vw,720px)] bg-white/98 backdrop-blur-2xl border-t-2 border-t-[#B87332] border-x border-b border-gray-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] z-50 text-black rounded-b-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="grid grid-cols-2 gap-8 px-8 py-7 bg-gradient-to-b from-gray-50/70 to-white">
                    <div className="flex flex-col gap-3 group/col">
                      <div className="font-extrabold text-[#0B1941] text-[13px] uppercase tracking-wider border-b border-gray-200/80 pb-2">
                        <span>{t.prjTitleCategories}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Link href="/projeler/tamamlanan-projeler" className="text-[13px] font-medium text-gray-600 hover:text-[#B87332] hover:translate-x-1 transition-all py-1.5 px-2 rounded-md">{t.prjItem1}</Link>
                        <Link href="/projeler/uretimi-biten-makineler" className="text-[13px] font-medium text-gray-600 hover:text-[#B87332] hover:translate-x-1 transition-all py-1.5 px-2 rounded-md">{t.prjItem2}</Link>
                        <Link href="/projeler/recine-hatti-projeleri" className="text-[13px] font-medium text-gray-600 hover:text-[#B87332] hover:translate-x-1 transition-all py-1.5 px-2 rounded-md">{t.prjItem3}</Link>
                        <Link href="/projeler/sevkiyatlar" className="text-[13px] font-medium text-gray-600 hover:text-[#B87332] hover:translate-x-1 transition-all py-1.5 px-2 rounded-md">{t.prjItem4}</Link>
                        <Link href="/projeler/kurulumlar" className="text-[13px] font-medium text-gray-600 hover:text-[#B87332] hover:translate-x-1 transition-all py-1.5 px-2 rounded-md">{t.prjItem5}</Link>
                        <Link href="/projeler/yeni-urun-gelistirmeleri" className="text-[13px] font-medium text-gray-600 hover:text-[#B87332] hover:translate-x-1 transition-all py-1.5 px-2 rounded-md">{t.prjItem6}</Link>
                        <Link href="/haberler/fuar-ve-sirket-haberleri" className="text-[13px] font-medium text-gray-600 hover:text-[#B87332] hover:translate-x-1 transition-all py-1.5 px-2 rounded-md">{t.prjItem7}</Link>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 group/col">
                      <div className="font-extrabold text-[#0B1941] text-[13px] uppercase tracking-wider border-b border-gray-200/80 pb-2">
                        <span>{t.prjTitleHighlights}</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Link href="/projeler/secili-projeler" className="group flex items-center justify-between text-[13px] font-medium text-gray-700 hover:text-[#B87332] hover:bg-white transition-all p-2.5 rounded-lg">
                          <span>{t.prjSubItem1}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#B87332] group-hover:translate-x-1 transition-all" />
                        </Link>
                        <Link href="/haberler/guncel-haberler" className="group flex items-center justify-between text-[13px] font-medium text-gray-700 hover:text-[#B87332] hover:bg-white transition-all p-2.5 rounded-lg">
                          <span>{t.prjSubItem2}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#B87332] group-hover:translate-x-1 transition-all" />
                        </Link>
                        <Link href="/haberler/fuarlar-etkinlikler" className="group flex items-center justify-between text-[13px] font-medium text-gray-700 hover:text-[#B87332] hover:bg-white transition-all p-2.5 rounded-lg">
                          <span>{t.prjSubItem3}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#B87332] group-hover:translate-x-1 transition-all" />
                        </Link>
                        <Link href="/haberler/teknik-makaleler" className="group flex items-center justify-between text-[13px] font-medium text-gray-700 hover:text-[#B87332] hover:bg-white transition-all p-2.5 rounded-lg">
                          <span>{t.prjSubItem4}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#B87332] group-hover:translate-x-1 transition-all" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CONTACT */}
            <Link href="/iletisim" className="hover:text-[#B87332] transition-colors">
              {t.contact}
            </Link>
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
        <div className="flex md:hidden items-center justify-between px-4 sm:px-6 h-16">
          <Link href="/" className="flex items-center shrink-0 hover:opacity-80 transition-opacity">
            <Image src="/logo-2.svg" alt="Logo" width={48} height={48} className="object-contain h-10 w-auto" />
          </Link>
          
          <div className="flex items-center gap-3">
            <Link
              href="/teklif-al"
              className="bg-[#B87332] text-white text-[11px] font-bold uppercase px-3 py-1.5 rounded-md"
            >
              {t.requestQuote}
            </Link>
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
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
                
                <div className="md:col-span-5 flex flex-col gap-3 md:gap-5 font-montserrat">
                  <Link href="/kurumsal" onClick={() => setMegaMenuOpen(false)} className="text-xl md:text-2xl lg:text-3xl font-extrabold text-[#0B1941] hover:text-[#B87332] transition-colors">
                    {t.groupTitle}
                  </Link>
                  <Link href="/neden-ion" onClick={() => setMegaMenuOpen(false)} className="text-xl md:text-2xl lg:text-3xl font-extrabold text-[#0B1941] hover:text-[#B87332] transition-colors">
                    {t.whyUs}
                  </Link>
                  <Link href="/sektorler" onClick={() => setMegaMenuOpen(false)} className="text-xl md:text-2xl lg:text-3xl font-extrabold text-[#0B1941] hover:text-[#B87332] transition-colors">
                    {t.sectors}
                  </Link>
                </div>

                <div className="md:col-span-4 flex flex-col gap-3 text-xs md:text-sm font-bold tracking-wider uppercase text-[#0B1941]">
                  <Link href="/projeler" onClick={() => setMegaMenuOpen(false)} className="hover:text-[#B87332] transition-colors">
                    {t.news}
                  </Link>
                  <Link href="/iletisim" onClick={() => setMegaMenuOpen(false)} className="hover:text-[#B87332] transition-colors">
                    {t.contactSales}
                  </Link>
                  <Link href="/kariyer" onClick={() => setMegaMenuOpen(false)} className="hover:text-[#B87332] transition-colors">
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