"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const styles = {
  subHeading: "text-lg md:text-xl font-extrabold text-[#3A3A3A] mb-3",
  body: "text-sm text-[#3A3A3A] leading-relaxed font-medium",
};

export default function ContactPage() {
  const { lang } = useLanguage();
  const isTr = lang === "TR";

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white font-montserrat text-[#3A3A3A]">
      
      {/* 1. ÜST KISIM: Menünün arkasında kalmaması için üst boşluk (pt-32 / pt-36) eklendi */}
      <section className="w-full bg-[#3A3A3A] px-6 pt-25 pb-1 lg:pl-15 lg:pr-16">
        <div className="mx-auto w-full max-w-1xl">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-[8pt] uppercase tracking-widest text-gray-200">
            <Link href="/" className="transition-colors hover:text-[#B87332]">{isTr ? "Anasayfa" : "Homepage"}</Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="font-bold text-[#B87332]">{isTr ? "İletişim" : "Contacts"}</span>
          </div>
        </div>
      </section>

      {/* 2. ANA İÇERİK BÖLÜMÜ */}
      <section className="w-full bg-[#F3F1EC] pb-16">
        
        {/* Tam Genişlikte Harita Görseli */}
        <div className="w-full mb-16 mt-0">
          <a 
            href="https://maps.app.goo.gl/T34cYtYXMXaGt9TH8" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative block aspect-[21/6] md:aspect-[14/5] w-full overflow-hidden bg-gray-100 shadow-sm transition-transform hover:scale-[1.01]"
          >
            <Image 
              src="/harita.webp" 
              alt="Google Maps Konum" 
              fill 
              className="object-cover transition-transform duration-500 group-hover:scale-105" 
            />
          </a>
        </div>

        {/* 3. İLETİŞİM BİLGİLERİ (İçerik Hizasında) */}
        <div className="mx-auto w-full max-w-5xl px-6 lg:px-16 space-y-16">
          <div>
            {/* İKİ SÜTUNLU YAPI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start">
              
              {/* SOL SÜTUN: Headquarters */}
              <div className="space-y-6">
                <div>
                  <h3 className={styles.subHeading}>
                    {isTr ? "Merkez Ofis" : "Headquarters"}
                  </h3>
                  <div className={`${styles.body} space-y-1`}>
                    <p className="font-bold text-black">ION Makine</p>
                    <p>Kocabaş mahallesi, mermer fabrikaları kümesi</p>
                    <p>No: 5, 20330</p>
                    <p>Honaz / Denizli</p>
                  </div>
                </div>

                <div className={`${styles.body} space-y-1.5 pt-2`}>
                  <div className="flex gap-6">
                    <span className="w-28 text-gray-500 font-medium">Phone number</span>
                    <a href="tel:+902588145747" className="font-semibold text-black hover:text-[#B87332]">+90 258 814 5747</a>
                  </div>
                  <div className="flex gap-6">
                    <span className="w-28 text-gray-500 font-medium">E-Mail</span>
                    <a href="mailto:info@ionmakine.com" className="font-semibold text-black hover:text-[#B87332]">info@ionmakine.com</a>
                  </div>
                </div>
              </div>

              {/* SAĞ SÜTUN: After-sales assistance */}
              <div className="space-y-6">
                <div>
                  <h3 className={styles.subHeading}>
                    {isTr ? "Satış Sonrası Destek" : "After-sales assistance"}
                  </h3>
                </div>

                <div className={`${styles.body} space-y-1.5 pt-2`}>
                  <div className="flex gap-6">
                    <span className="w-28 text-gray-500 font-medium">Phone number</span>
                    <a href="tel:+902588145747" className="font-semibold text-black hover:text-[#B87332]">+90 258 814 5747</a>
                  </div>
                  <div className="flex gap-6">
                    <span className="w-28 text-gray-500 font-medium">E-Mail</span>
                    <a href="mailto:info@ionmakine.com" className="font-semibold text-black hover:text-[#B87332]">info@ionmakine.com</a>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}