"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SliderItem } from "@/lib/db";

const FALLBACK_SLIDES: SliderItem[] = [
  { id: "fallback-1", image: "/resim1.jpg", title: "", subtitle: "", buttonText: "", buttonLink: "" },
  { id: "fallback-2", image: "/resim2.jpg", title: "", subtitle: "", buttonText: "", buttonLink: "" },
  { id: "fallback-3", image: "/resim3.jpg", title: "", subtitle: "", buttonText: "", buttonLink: "" },
];

export default function HeroSlider({ slides }: { slides?: SliderItem[] }) {
  const items = slides && slides.length > 0 ? slides : FALLBACK_SLIDES;
  const images = items.map((s) => s.image);
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    const timer = setInterval(next, 12000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[55vh] overflow-hidden bg-neutral-300 group">
      {/* SADECE BURAYA touch-pan-y EKLENDİ */}
      <motion.div
        className="flex w-full h-full cursor-grab active:cursor-grabbing touch-pan-y"
        animate={{ x: `-${index * 100}%` }}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.6 }}
        onPanEnd={(_, info) => {
          if (info.offset.x > 50) prev();
          else if (info.offset.x < -50) next();
        }}
      >
        {items.map((item, i) => (
          <div key={item.id} className="relative w-full h-full flex-shrink-0">
            <img
              src={item.image}
              className="w-full h-full object-cover"
              alt={item.title || `Slide ${i}`}
              draggable="false"
            />
            {(item.title || item.subtitle) && (
              <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-center px-4 gap-4">
                {item.title && (
                  <h2 className="text-white font-serif italic text-3xl md:text-5xl max-w-2xl">
                    {item.title}
                  </h2>
                )}
                {item.subtitle && (
                  <p className="text-white/90 text-sm md:text-base max-w-lg">{item.subtitle}</p>
                )}
                {item.buttonText && item.buttonLink && (
                  <a
                    href={item.buttonLink}
                    className="mt-2 inline-block bg-white text-black px-6 py-2.5 text-sm font-medium tracking-wide hover:bg-gray-100 transition-colors"
                  >
                    {item.buttonText}
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </motion.div>

      {/* Manuel Kontrol Okları */}
      <button
        onClick={prev}
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-30 text-white/70 hover:text-white transition-all p-2 cursor-pointer opacity-60 md:opacity-0 md:group-hover:opacity-100"
      >
        <ChevronLeft size={32} strokeWidth={1} className="md:w-12 md:h-12" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-30 text-white/70 hover:text-white transition-all p-2 cursor-pointer opacity-60 md:opacity-0 md:group-hover:opacity-100"
      >
        <ChevronRight size={32} strokeWidth={1} className="md:w-12 md:h-12" />
      </button>

      {/* İndikatörler */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${index === i ? "bg-white scale-110" : "bg-white/50 hover:bg-white/80"}`}
          />
        ))}
      </div>
    </div>
  );
}