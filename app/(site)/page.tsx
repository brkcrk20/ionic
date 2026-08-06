"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import HeroVideo from "@/components/HeroVideo";
import MachinesSection from "@/components/MachinesSection";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { useLanguage } from "@/lib/i18n";
import { Settings, Wrench, Cpu, ArrowRight } from "lucide-react";

export default function Home() {
  const languageContext = useLanguage() as any;
  const { t } = languageContext;
  const home = t.home;
  
  // Dil bilgisini i18n context'inden tam tespit etme
  const activeLang = languageContext.lang || languageContext.locale || languageContext.language || (t?.home?.brand?.title?.includes("Gelecek") ? "tr" : "en");
  const isTr = activeLang === "tr" || activeLang === "TR";

  // Aktif bölümü takip etmek için state (Toplam 6 bölüm var)
  const [activeSection, setActiveSection] = useState(0);

  const sectionsCount = 6;

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const container = e.target as HTMLElement;
      const scrollTop = container.scrollTop || window.scrollY;
      const sectionHeight = window.innerHeight;
      const current = Math.round(scrollTop / sectionHeight);
      setActiveSection(current);
    };

    const container = document.getElementById("home-container");
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const scrollToSection = (index: number) => {
    const sections = document.querySelectorAll(".snap-section");
    if (sections[index]) {
      sections[index].scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="home-container" className="w-full h-dvh overflow-y-auto md:snap-y md:snap-mandatory scroll-smooth bg-white relative">

      {/* SAĞ TARAF GEZİNTİ ÇUBUĞU (DOT NAVIGATION) */}
      <div className="hidden md:flex flex-col fixed right-8 top-1/2 -translate-y-1/2 z-40 gap-3.5 items-center bg-black/15 backdrop-blur-md px-3 py-4 rounded-full border border-white/10 shadow-lg">
        {Array.from({ length: sectionsCount }).map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className={`group relative flex items-center justify-center transition-all duration-300 cursor-pointer ${
              activeSection === index ? "w-3.5 h-3.5" : "w-2.5 h-2.5"
            }`}
            aria-label={`Bölüm ${index + 1}`}
          >
            <span
              className={`absolute rounded-full transition-all duration-300 ${
                activeSection === index
                  ? "w-full h-full bg-[#B87332] shadow-[0_0_10px_#B87332]"
                  : "w-full h-full bg-white/60 hover:bg-white"
              }`}
            />
          </button>
        ))}
      </div>

      {/* 1. BÖLÜM: HERO VIDEO */}
      <section className="snap-section w-full h-dvh md:snap-start shrink-0 relative">
        <HeroVideo />
      </section>

      {/* 2. BÖLÜM: MARKA MESAJI */}
      <section className="snap-section w-full min-h-dvh md:h-dvh md:snap-start shrink-0 relative flex flex-col justify-start pt-28 md:pt-36 overflow-hidden bg-white">
        
        {/* ARKAPLAN RESMİ VE TÜL KATMANI */}
        <div className="absolute inset-0 w-full h-full z-0">
          <Image
            src="/brand-hero-2.webp"
            alt="Ion Meccanica Production"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          
          <div className="absolute inset-0 bg-black/55 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-transparent h-[60%] z-20 pointer-events-none" />
        </div>

        {/* ÖN PLAN METİN ALANI */}
        <div className="max-w-6xl mx-auto px-6 text-center z-30 relative">
          <h2 className="text-4xl md:text-5xl lg:text-[4rem] font-extrabold text-[#3A3A3A] tracking-tighter mb-6 font-montserrat">
            {home.brand.title}
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto font-medium">
            {home.brand.description}
          </p>
        </div>

      </section>

      {/* 3. BÖLÜM: YETKİNLİKLER */}
      <section className="snap-section w-full min-h-dvh md:snap-start shrink-0 bg-[#3A3A3A] flex flex-col justify-center items-center py-24 px-6 relative">
        <div className="text-center mb-16 max-w-4xl z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#F3F1EC] mb-6 font-montserrat">
            {home.capabilities.title}
          </h2>
          <p className="text-[#F3F1EC]/70 text-lg md:text-xl">{home.capabilities.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1400px] w-full z-10">
          {/* Card 1 */}
          <div className="bg-[#454545] p-8 md:p-10 rounded-2xl border border-white/5 hover:border-[#B87332] transition-colors group shadow-lg">
            <div className="w-14 h-14 bg-[#B87332]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#B87332] transition-colors">
              <Settings className="text-[#B87332] group-hover:text-white w-7 h-7 transition-colors" />
            </div>
            <h3 className="text-[#F3F1EC] text-xl font-bold tracking-wider mb-4 uppercase">{home.capabilities.card1Title}</h3>
            <p className="text-[#F3F1EC]/70 leading-relaxed text-sm md:text-base">{home.capabilities.card1Desc}</p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#454545] p-8 md:p-10 rounded-2xl border border-white/5 hover:border-[#B87332] transition-colors group shadow-lg">
            <div className="w-14 h-14 bg-[#B87332]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#B87332] transition-colors">
              <Wrench className="text-[#B87332] group-hover:text-white w-7 h-7 transition-colors" />
            </div>
            <h3 className="text-[#F3F1EC] text-xl font-bold tracking-wider mb-4 uppercase">{home.capabilities.card2Title}</h3>
            <p className="text-[#F3F1EC]/70 leading-relaxed text-sm md:text-base">{home.capabilities.card2Desc}</p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#454545] p-8 md:p-10 rounded-2xl border border-white/5 hover:border-[#B87332] transition-colors group shadow-lg">
            <div className="w-14 h-14 bg-[#B87332]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#B87332] transition-colors">
              <Cpu className="text-[#B87332] group-hover:text-white w-7 h-7 transition-colors" />
            </div>
            <h3 className="text-[#F3F1EC] text-xl font-bold tracking-wider mb-4 uppercase">{home.capabilities.card3Title}</h3>
            <p className="text-[#F3F1EC]/70 leading-relaxed text-sm md:text-base">{home.capabilities.card3Desc}</p>
          </div>
        </div>

        <div className="mt-16 z-10">
          <Link
            href="/about-us/company"
            className="bg-[#B87332] hover:bg-[#a06228] text-white font-bold tracking-wider uppercase text-sm px-8 py-4 rounded-full shadow-lg transition-all flex items-center gap-2"
          >
            {home.capabilities.cta} <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* 4. BÖLÜM: MAKİNELER VE KOMPLE HATLAR */}
      <div className="snap-section w-full min-h-dvh md:snap-start shrink-0">
        <MachinesSection />
      </div>

      {/* 5. BÖLÜM: PROJELER VE HABERLER */}
      <section className="snap-section w-full min-h-dvh md:snap-start shrink-0 bg-[#F3F1EC] flex flex-col justify-center items-center py-24 px-6 relative">
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#3A3A3A] mb-16 text-center font-montserrat">
          {home.news.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1400px] w-full">
          {/* News Card 1 */}
          <Link href="/projects/detail-1" className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group flex flex-col">
            <div className="relative h-44 sm:h-60 w-full overflow-hidden">
              <ImagePlaceholder className="group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4 bg-[#B87332] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                {home.news.card1.badge}
              </div>
            </div>
            <div className="p-8 flex flex-col flex-1">
              <span className="text-gray-400 text-xs font-bold mb-3">{home.news.card1.date}</span>
              <h3 className="text-[#3A3A3A] text-xl font-bold mb-3 leading-snug group-hover:text-[#B87332] transition-colors">{home.news.card1.title}</h3>
              <p className="text-gray-600 text-sm mb-6 flex-1">{home.news.card1.desc}</p>
              <span className="text-[#B87332] font-bold text-sm flex items-center gap-1">{home.news.readMore} <ArrowRight size={16} /></span>
            </div>
          </Link>

          {/* News Card 2 */}
          <Link href="/projects/detail-2" className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group flex flex-col">
            <div className="relative h-44 sm:h-60 w-full overflow-hidden">
              <ImagePlaceholder className="group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4 bg-[#B87332] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                {home.news.card2.badge}
              </div>
            </div>
            <div className="p-8 flex flex-col flex-1">
              <span className="text-gray-400 text-xs font-bold mb-3">{home.news.card2.date}</span>
              <h3 className="text-[#3A3A3A] text-xl font-bold mb-3 leading-snug group-hover:text-[#B87332] transition-colors">{home.news.card2.title}</h3>
              <p className="text-gray-600 text-sm mb-6 flex-1">{home.news.card2.desc}</p>
              <span className="text-[#B87332] font-bold text-sm flex items-center gap-1">{home.news.readMore} <ArrowRight size={16} /></span>
            </div>
          </Link>

          {/* News Card 3 */}
          <Link href="/projects/detail-3" className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group flex flex-col">
            <div className="relative h-44 sm:h-60 w-full overflow-hidden">
              <ImagePlaceholder className="group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4 bg-[#B87332] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                {home.news.card3.badge}
              </div>
            </div>
            <div className="p-8 flex flex-col flex-1">
              <span className="text-gray-400 text-xs font-bold mb-3">{home.news.card3.date}</span>
              <h3 className="text-[#3A3A3A] text-xl font-bold mb-3 leading-snug group-hover:text-[#B87332] transition-colors">{home.news.card3.title}</h3>
              <p className="text-gray-600 text-sm mb-6 flex-1">{home.news.card3.desc}</p>
              <span className="text-[#B87332] font-bold text-sm flex items-center gap-1">{home.news.readMore} <ArrowRight size={16} /></span>
            </div>
          </Link>
        </div>
      </section>

      {/* 6. BÖLÜM: FOOTER */}
      <footer className="snap-section w-full min-h-dvh md:h-dvh md:snap-start shrink-0 bg-[#F3F1EC] flex flex-col justify-between pt-20 pb-12 px-6 lg:px-16 text-[#3A3A3A] font-montserrat">
        <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 my-auto items-start">
          
          {/* Sütun 1: Logo & Sosyal Medya */}
          <div className="flex flex-col gap-6">
            <Image src="/logo-2.svg" alt="ION MECCANICA" width={200} height={70} className="object-contain w-40 h-auto sm:w-[220px]" />
            <p className="text-base text-gray-700 font-medium leading-relaxed">
              {home.footer.tagline || "Innovative solutions for mechanical engineering and production."}
            </p>
            <div className="flex gap-5 text-[#3A3A3A] pt-2">
              <a href="#" className="hover:text-[#B87332] transition-colors" aria-label="Youtube">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.1C2.3 8.3 2 10.1 2 12s.3 3.7.5 4.9c.3 1.6 1.4 2.8 3 3.1 2.2.3 6.5.3 6.5.3s4.3 0 6.5-.3c1.6-.3 2.7-1.5 3-3.1.2-1.2.5-3 .5-4.9s-.3-3.7-.5-4.9c-.3-1.6-1.4-2.8-3-3.1-2.2-.3-6.5-.3-6.5-.3s-4.3 0-6.5.3c-1.6.3-2.7 1.5-3 3.1z"/><path d="M9.75 15.02l5.75-3.02-5.75-3.02v6.04z"/></svg>
              </a>
              <a href="#" className="hover:text-[#B87332] transition-colors" aria-label="Linkedin">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="hover:text-[#B87332] transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
            </div>
          </div>

          {/* Sütun 2: Merkez Ofis */}
          <div className="flex flex-col gap-4">
            <h4 className="font-extrabold text-xl text-[#3A3A3A] tracking-wide mb-1">
              {isTr ? "Merkez Ofis" : "Headquarters"}
            </h4>
            <div className="flex flex-col gap-2.5 text-base text-gray-700 font-medium leading-relaxed">
              <p className="font-bold text-[#3A3A3A]">ION Meccanica</p>
              <p>Kocabaş Mah., Mermerciler/3. Sk.</p>
              <p>No: 2/1, 20330 Honaz Denizli Türkiye</p>
              <p className="font-bold text-[#3A3A3A] pt-1">
                <a href="tel:+902583730120" className="hover:text-[#B87332] transition-colors">T: +90 258 373 0120</a>
              </p>
              <p className="font-bold text-[#3A3A3A]">
                <a href="mailto:info@ionmeccanica.com" className="hover:text-[#B87332] transition-colors">E: ion@ionmeccanica.com</a>
              </p>
            </div>
          </div>

          {/* Sütun 3: Satış Sonrası Destek */}
          <div className="flex flex-col gap-4">
            <h4 className="font-extrabold text-xl text-[#3A3A3A] tracking-wide mb-1">
              {isTr ? "Satış Sonrası Destek" : "After-sales assistance"}
            </h4>
            <div className="flex flex-col gap-2.5 text-base text-gray-700 font-medium leading-relaxed">
              <p>
                {isTr 
                  ? "Teknik destek, yedek parça ve servis talepleriniz için." 
                  : "For technical support, spare parts, and service requests."}
              </p>
              <p className="font-bold text-[#3A3A3A] pt-1">
                <a href="tel:+902583730120" className="hover:text-[#B87332] transition-colors">T: +90 258 373 0120</a>
              </p>
              <p className="font-bold text-[#3A3A3A]">
                <a href="mailto:service@ionmeccanica.com" className="hover:text-[#B87332] transition-colors">E: service@ionmeccanica.com</a>
              </p>
              <p className="font-bold text-[#3A3A3A]">
                <a href="mailto:spareparts@ionmeccanica.com" className="hover:text-[#B87332] transition-colors">E: spareparts@ionmeccanica.com</a>
              </p>
            </div>
          </div>
        </div>

        {/* Alt Telif Alanı */}
        <div className="max-w-[1400px] w-full mx-auto border-t border-gray-300/80 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-semibold text-gray-600 shrink-0">
          <p>{home.footer.copyright(new Date().getFullYear())}</p>
          <p>{home.footer.tagline}</p>
        </div>
      </footer>

    </div>
  );
}