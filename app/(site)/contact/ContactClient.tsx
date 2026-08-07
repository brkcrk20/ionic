"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function ContactPage() {
  const { lang } = useLanguage();
  const isTr = lang === "TR";

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F3F1EC] font-montserrat text-[#3A3A3A] pt-16 xl:pt-22">
      
      {/* 1. ÜST HERO ALANI (Diğer Sayfalarla Birebir Aynı Hizalama) */}
      <section className="w-full bg-[#3A3A3A] text-[#F3F1EC] py-16 px-6 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col items-center text-center">
          
          <div className="text-xs uppercase tracking-widest text-[#F3F1EC]/60 mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-[#B87332] transition-colors">
              {isTr ? "Anasayfa" : "Homepage"}
            </Link>
            <span>/</span>
            <span className="font-bold text-[#B87332]">
              {isTr ? "İletişim" : "Contacts"}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-[#F3F1EC]">
            {isTr ? "İletişim" : "Contacts"}
          </h1>

        </div>
      </section>

      {/* 2. ANA İÇERİK BÖLÜMÜ */}
      <section className="w-full bg-[#F3F1EC] pt-16 md:pt-20 pb-24">
        
        {/* 3. İLETİŞİM BİLGİLERİ (3 Eşit Sütun) */}
        <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-16 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 items-start">
          
          {/* Sütun 1: Logo & Sosyal Medya */}
          <div className="flex flex-col gap-6">
            <Image src="/logo-2.svg" alt="ION MECCANICA" width={200} height={70} className="object-contain w-40 h-auto sm:w-[220px]" />
            <p className="text-base text-gray-700 font-medium leading-relaxed">
              {isTr ? "Doğal Taş Endüstrisi İçin Tasarlandı." : "Engineered for the Natural Stone."}
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
                <a href="mailto:info@ionmeccanica.com" className="hover:text-[#B87332] transition-colors">E: info@ionmeccanica.com</a>
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
                {isTr ? "Teknik destek, yedek parça ve servis talepleriniz için." : "For technical support, spare parts, and service requests."}
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
      </section>

    </div>
  );
}