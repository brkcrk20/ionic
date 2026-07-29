"use client";

import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function HeroVideo() {
  const { t } = useLanguage();

  const scrollToNextSection = () => {
    // Hero alanından sonraki ilk bölümü bulup yumuşakça oraya kaydırır
    const heroSection = document.getElementById("hero-section");
    if (heroSection && heroSection.nextElementSibling) {
      heroSection.nextElementSibling.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* 1. Arka Plan Videosu */}
      <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover z-0">
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* 2. Koyu Karartma Katmanı */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* 3. Video Üzerindeki Yazılar */}
      <div className="relative z-20 text-center text-white px-4 max-w-4xl">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-4 uppercase drop-shadow-md">
          {t.home.hero.title}
        </h1>
        <p className="text-sm sm:text-base md:text-lg font-light text-gray-200 max-w-2xl mx-auto drop-shadow">
          {t.home.hero.subtitleLine1}
          <br />
          {t.home.hero.subtitleLine2}
        </p>
      </div>

      {/* 4. Alt Kısımda Süzülen ve Tıklanabilir Ok */}
      <button
        onClick={scrollToNextSection}
        type="button"
        aria-label="Aşağı Kaydır"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 text-white/80 hover:text-white transition-all cursor-pointer animate-bounce p-2 focus:outline-none"
      >
        <ChevronDown size={38} className="stroke-[1.5]" />
      </button>
    </div>
  );
}
