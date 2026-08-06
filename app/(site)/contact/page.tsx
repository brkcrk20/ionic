"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function ContactPage() {
  const { lang } = useLanguage();
  const isTr = lang === "TR";

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white font-montserrat text-[#3A3A3A]">
      
      {/* 1. ÜST KISIM */}
      <section className="w-full bg-[#3A3A3A] px-6 pt-32 pb-8 lg:pl-16 lg:pr-16">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-gray-300">
            <Link href="/" className="transition-colors hover:text-[#B87332]">{isTr ? "Anasayfa" : "Homepage"}</Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="font-bold text-[#B87332]">{isTr ? "İletişim" : "Contacts"}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            {isTr ? "İletişim" : "Contacts"}
          </h1>
        </div>
      </section>

      {/* 2. ANA İÇERİK BÖLÜMÜ */}
      <section className="w-full bg-[#F3F1EC] pb-24">
        
        {/* Harita Görseli */}
        <div className="w-full mb-20 mt-0">
          <a 
            href="https://maps.app.goo.gl/T34cYtYXMXaGt9TH8" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative block aspect-[21/6] md:aspect-[14/5] w-full overflow-hidden bg-gray-100 shadow-sm transition-transform hover:scale-[1.01]"
          >
            <Image 
              src="/yerleske.webp" 
              alt="Google Maps Konum" 
              fill 
              className="object-cover transition-transform duration-500 group-hover:scale-105" 
            />
          </a>
        </div>

        {/* 3. İLETİŞİM BİLGİLERİ (3 Eşit Sütun - Düzenli ve Hifalı) */}
        <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-16 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 items-start">
          
          {/* Sütun 1: Logo & Sosyal Medya */}
          <div className="flex flex-col gap-6">
            <Image src="/logo-2.svg" alt="ION MECCANICA" width={200} height={70} className="object-contain w-40 h-auto sm:w-[220px]" />
            <p className="text-base text-gray-700 font-medium leading-relaxed">
              Innovative solutions for mechanical engineering and production.
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
          <div className="flex flex-col gap-3">
            <h4 className="font-extrabold text-xl text-[#3A3A3A] tracking-wide mb-1">
              {isTr ? "Merkez Ofis" : "Headquarters"}
            </h4>
            <p className="text-base text-gray-700 leading-relaxed font-medium">
              ION Meccanica
              <br />
              Kocabaş mahallesi, mermerciler 3. sokak
              <br />
              No: 2/1, 20330 Honaz / Denizli
            </p>
            <div className="pt-2 flex flex-col gap-1">
              <p className="text-base font-bold text-gray-800">
                <a href="tel:+902583730120" className="hover:text-[#B87332] transition-colors">+90 258 373 0120</a>
              </p>
              <p className="text-base font-bold text-gray-800">
                <a href="mailto:info@ionmeccanica.com" className="hover:text-[#B87332] transition-colors">info@ionmeccanica.com</a>
              </p>
            </div>
          </div>

          {/* Sütun 3: Satış Sonrası Destek */}
          <div className="flex flex-col gap-3">
            <h4 className="font-extrabold text-xl text-[#3A3A3A] tracking-wide mb-1">
              {isTr ? "Satış Sonrası Destek" : "After-sales assistance"}
            </h4>
            <p className="text-base text-gray-700 leading-relaxed font-medium">
              {isTr ? "Teknik destek, yedek parça ve servis talepleriniz için." : "For technical support, spare parts, and service requests."}
            </p>
            <div className="pt-2 flex flex-col gap-1">
              <p className="text-base font-bold text-gray-800">
                <a href="tel:+902583730120" className="hover:text-[#B87332] transition-colors">+90 258 373 0120</a>
              </p>
              <p className="text-base font-bold text-gray-800">
                <a href="mailto:service@ionmeccanica.com" className="hover:text-[#B87332] transition-colors">service@ionmeccanica.com</a>
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}