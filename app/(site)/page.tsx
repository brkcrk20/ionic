// app/(site)/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import HeroVideo from "@/components/HeroVideo";
import MachinesSection from "@/components/MachinesSection";
import { useLanguage } from "@/lib/i18n";
import { Settings, Wrench, Cpu, ArrowRight } from "lucide-react";

export default function Home() {
  const { t } = useLanguage();
  const home = t.home;

  return (
    <div className="w-full h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth bg-white">

      {/* 1. BÖLÜM: HERO VIDEO */}
      <section id="hero-section" className="w-full h-screen snap-start shrink-0 relative">
        <HeroVideo />
      </section>

      {/* 2. BÖLÜM: MARKA MESAJI */}
      <section className="w-full h-screen snap-start shrink-0 flex flex-col justify-between bg-white pt-24 md:pt-32 overflow-hidden relative">
        <div className="max-w-6xl mx-auto px-6 text-center z-10 shrink-0">
          <h2 className="text-4xl md:text-5xl lg:text-[4rem] font-extrabold text-[#3A3A3A] tracking-tighter mb-6 font-montserrat">
            {home.brand.title}
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto font-medium">
            {home.brand.description}
          </p>
        </div>

        <div className="relative w-full flex-1 min-h-[45vh] mt-12">
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <Image
            src="/resin-line-wide.jpg"
            alt="ION MECCANICA Complete Resin Processing Line"
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
          />
        </div>
      </section>

      {/* 3. BÖLÜM: YETKİNLİKLER (Konseptten Devreye Almaya) */}
      <section className="w-full min-h-screen snap-start shrink-0 bg-[#3A3A3A] flex flex-col justify-center items-center py-24 px-6 relative">
        <div className="text-center mb-16 max-w-4xl z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#F3F1EC] mb-6 font-montserrat">
            {home.capabilities.title}
          </h2>
          <p className="text-[#F3F1EC]/70 text-lg md:text-xl">{home.capabilities.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1400px] w-full z-10">
          {/* Card 1: ENGINEERING */}
          <div className="bg-[#454545] p-8 md:p-10 rounded-2xl border border-white/5 hover:border-[#B87332] transition-colors group shadow-lg">
            <div className="w-14 h-14 bg-[#B87332]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#B87332] transition-colors">
              <Settings className="text-[#B87332] group-hover:text-white w-7 h-7 transition-colors" />
            </div>
            <h3 className="text-[#F3F1EC] text-xl font-bold tracking-wider mb-4 uppercase">{home.capabilities.card1Title}</h3>
            <p className="text-[#F3F1EC]/70 leading-relaxed text-sm md:text-base">{home.capabilities.card1Desc}</p>
          </div>

          {/* Card 2: MANUFACTURING */}
          <div className="bg-[#454545] p-8 md:p-10 rounded-2xl border border-white/5 hover:border-[#B87332] transition-colors group shadow-lg">
            <div className="w-14 h-14 bg-[#B87332]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#B87332] transition-colors">
              <Wrench className="text-[#B87332] group-hover:text-white w-7 h-7 transition-colors" />
            </div>
            <h3 className="text-[#F3F1EC] text-xl font-bold tracking-wider mb-4 uppercase">{home.capabilities.card2Title}</h3>
            <p className="text-[#F3F1EC]/70 leading-relaxed text-sm md:text-base">{home.capabilities.card2Desc}</p>
          </div>

          {/* Card 3: AUTOMATION */}
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
            href="/muhendislik"
            className="bg-[#B87332] hover:bg-[#a06228] text-white font-bold tracking-wider uppercase text-sm px-8 py-4 rounded-full shadow-lg transition-all flex items-center gap-2"
          >
            {home.capabilities.cta} <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* 4. BÖLÜM: MAKİNELER VE KOMPLE HATLAR */}
      <MachinesSection />

      {/* 5. BÖLÜM: PROJELER VE HABERLER */}
      <section className="w-full min-h-screen snap-start shrink-0 bg-[#F3F1EC] flex flex-col justify-center items-center py-24 px-6 relative">
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#3A3A3A] mb-16 text-center font-montserrat">
          {home.news.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1400px] w-full">
          {/* News Card 1 */}
          <Link href="/projeler/detay-1" className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group flex flex-col">
            <div className="relative h-60 w-full overflow-hidden">
              <Image src="/news-1.jpg" alt={home.news.card1.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
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
          <Link href="/projeler/detay-2" className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group flex flex-col">
            <div className="relative h-60 w-full overflow-hidden">
              <Image src="/news-2.jpg" alt={home.news.card2.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
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
          <Link href="/projeler/detay-3" className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group flex flex-col">
            <div className="relative h-60 w-full overflow-hidden">
              <Image src="/news-3.jpg" alt={home.news.card3.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
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

      {/* 6. BÖLÜM: SHOWROOM / SANAL TUR */}
      <section className="w-full h-screen snap-start shrink-0 relative bg-white flex flex-col pt-24">
        <div className="max-w-[1400px] w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 z-10 text-center md:text-left">

          {/* Sol Kısım - Fabrika Turu */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#3A3A3A] mb-6 font-montserrat">
              {home.showroom.factoryTitleLine1} <br className="hidden md:block" /> {home.showroom.factoryTitleLine2}
            </h2>
            <Link href="/virtual-tour" className="inline-flex items-center gap-3 text-[#3A3A3A] hover:text-[#B87332] font-bold transition-colors text-lg">
              <div className="w-10 h-10 rounded-full bg-[#3A3A3A] text-[#F3F1EC] flex items-center justify-center hover:bg-[#B87332] transition-colors">
                <ArrowRight size={18} />
              </div>
              {home.showroom.factoryCta}
            </Link>
          </div>

          {/* Sağ Kısım - Fuar/Etkinlik */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#3A3A3A] mb-6 font-montserrat">
              {home.showroom.eventTitleLine1} <br className="hidden md:block" /> {home.showroom.eventTitleLine2}
            </h2>
            <Link href="/virtual-tour-marmomac" className="inline-flex items-center gap-3 text-[#3A3A3A] hover:text-[#B87332] font-bold transition-colors text-lg">
              <div className="w-10 h-10 rounded-full bg-[#3A3A3A] text-[#F3F1EC] flex items-center justify-center hover:bg-[#B87332] transition-colors">
                <ArrowRight size={18} />
              </div>
              {home.showroom.eventCta}
            </Link>
          </div>
        </div>

        {/* Arka Plan Görseli */}
        <div className="relative flex-1 w-full mt-12">
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white to-transparent z-10" />
          <Image src="/factory-exterior.jpg" alt="ION MECCANICA Factory" fill className="object-cover object-bottom" sizes="100vw" />
        </div>
      </section>

      {/* 7. BÖLÜM: YAZILIM / SİSTEM VURGUSU */}
      <section className="w-full min-h-screen snap-start shrink-0 bg-[#3A3A3A] flex flex-col justify-center items-center py-24 px-6 relative">
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#F3F1EC] mb-12 text-center font-montserrat">
          {home.mes.sectionTitle}
        </h2>

        <div className="max-w-[1400px] w-full flex flex-col lg:flex-row items-stretch rounded-2xl overflow-hidden shadow-2xl">

          {/* Sol Taraf: Açıklama ve Buton */}
          <div className="lg:w-2/5 bg-[#F3F1EC] p-10 lg:p-16 flex flex-col justify-center">
            <h3 className="text-3xl md:text-4xl font-extrabold text-[#3A3A3A] mb-6 font-montserrat tracking-wide">{home.mes.productName}</h3>
            <h4 className="text-lg md:text-xl font-bold text-[#3A3A3A] mb-4">{home.mes.subtitle}</h4>
            <p className="text-gray-600 mb-10 leading-relaxed text-sm md:text-base">{home.mes.description}</p>
            <Link href="/otomasyon-kontrol" className="inline-flex items-center gap-3 text-[#3A3A3A] hover:text-[#B87332] font-bold transition-colors mt-auto">
              <div className="w-10 h-10 rounded-full bg-[#3A3A3A] text-[#F3F1EC] flex items-center justify-center hover:bg-[#B87332] transition-colors shadow-md">
                <ArrowRight size={18} />
              </div>
              {home.mes.cta}
            </Link>
          </div>

          {/* Sağ Taraf: Yazılım / Arayüz Görseli */}
          <div className="lg:w-3/5 relative min-h-[350px] lg:min-h-full bg-[#2A2A2A]">
            <Image src="/mes-dashboard.png" alt="ION-MES Dashboard" fill className="object-cover object-left" sizes="(max-width: 1024px) 100vw, 60vw" />
          </div>
        </div>
      </section>

      {/* 8. BÖLÜM: FOOTER (Tam Ekran ve Snap Uyumlu) */}
      <footer className="w-full h-screen snap-start shrink-0 bg-[#F3F1EC] flex flex-col justify-between pt-24 pb-12 px-6 lg:px-16 text-[#3A3A3A] font-montserrat">

        {/* Üst Kısım / İçerikler */}
        <div className="max-w-[1600px] w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 my-auto">

          {/* Logo & Sosyal Medya */}
          <div className="flex flex-col gap-8 justify-center">
            <Image src="/logo.svg" alt="ION MECCANICA" width={200} height={70} className="object-contain" />
            <div className="flex gap-5 text-[#3A3A3A]">
              <a href="#" className="hover:text-[#B87332] transition-colors" aria-label="Youtube">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.1C2.3 8.3 2 10.1 2 12s.3 3.7.5 4.9c.3 1.6 1.4 2.8 3 3.1 2.2.3 6.5.3 6.5.3s4.3 0 6.5-.3c1.6-.3 2.7-1.5 3-3.1.2-1.2.5-3 .5-4.9s-.3-3.7-.5-4.9c-.3-1.6-1.4-2.8-3-3.1-2.2-.3-6.5-.3-6.5-.3s-4.3 0-6.5.3c-1.6.3-2.7 1.5-3 3.1z"/><path d="M9.75 15.02l5.75-3.02-5.75-3.02v6.04z"/></svg>
              </a>
              <a href="#" className="hover:text-[#B87332] transition-colors" aria-label="Linkedin">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="hover:text-[#B87332] transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
            </div>
          </div>

          {/* İletişim Bilgileri */}
          <div className="flex flex-col gap-6 justify-center">
            <div>
              <h4 className="font-extrabold text-base mb-2">ION MECCANICA</h4>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {t.nav.addressTitle}
                <br />
                {t.nav.addressSub}
              </p>
              <p className="text-sm text-gray-600 mt-2 font-semibold">+90 (0212) 686 25 48</p>
              <p className="text-sm text-gray-600 font-semibold">info@ionmeccanica.com</p>
            </div>
            <div>
              <h4 className="font-extrabold text-base mb-2">{home.footer.serviceTitle}</h4>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                +90 (0212) 686 25 50
                <br />
                service@ionmeccanica.com
                <br />
                spareparts@ionmeccanica.com
              </p>
            </div>
          </div>

          {/* Menü Linkleri */}
          <div className="flex flex-col gap-2.5 justify-center">
            <h4 className="font-extrabold text-base mb-2">{home.footer.linksTitle}</h4>
            <Link href="/projeler" className="text-sm font-medium text-gray-600 hover:text-[#B87332] transition-colors">{home.footer.linkNews}</Link>
            <Link href="/iletisim" className="text-sm font-medium text-gray-600 hover:text-[#B87332] transition-colors">{home.footer.linkContacts}</Link>
            <Link href="/kariyer" className="text-sm font-medium text-gray-600 hover:text-[#B87332] transition-colors">{home.footer.linkCareers}</Link>
            <Link href="/portal" className="text-sm font-medium text-gray-600 hover:text-[#B87332] transition-colors">{home.footer.linkPortal}</Link>
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/gizlilik" className="text-sm font-medium text-gray-600 hover:text-[#B87332] transition-colors">{home.footer.privacy}</Link>
              <Link href="/cerez" className="text-sm font-medium text-gray-600 hover:text-[#B87332] transition-colors">{home.footer.cookies}</Link>
            </div>
          </div>

          {/* Sertifikalar / Dernekler */}
          <div className="flex items-start gap-4 justify-start lg:justify-end pt-4">
            <div className="w-20 h-20 border border-gray-300 rounded-lg flex items-center justify-center text-xs text-center text-gray-500 font-bold bg-white/50 shadow-xs">
              ISO 9001
            </div>
            <div className="w-20 h-20 border border-gray-300 rounded-lg flex items-center justify-center text-xs text-center text-gray-500 font-bold bg-white/50 shadow-xs">
              CE CERT
            </div>
          </div>
        </div>

        {/* En Alt Copyright Çizgisi */}
        <div className="max-w-[1600px] w-full mx-auto border-t border-gray-300/80 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-gray-500 shrink-0">
          <p>{home.footer.copyright(new Date().getFullYear())}</p>
          <p>{home.footer.tagline}</p>
        </div>
      </footer>

    </div>
  );
}
