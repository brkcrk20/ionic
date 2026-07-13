"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = ["/resim1.jpg", "/resim2.jpg", "/resim3.jpg"];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    const timer = setInterval(next, 12000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[55vh] overflow-hidden bg-neutral-300 group">
      {/* Motion yapısını sadeleştirdik, drag yerine onPan kullandık */}
      <motion.div
        className="flex w-full h-full cursor-grab active:cursor-grabbing"
        animate={{ x: `-${index * 100}%` }}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.6 }}
        // drag yerine onPanEnd kullanıyoruz: Çakışmaları engeller
        onPanEnd={(_, info) => {
          if (info.offset.x > 50) prev();
          else if (info.offset.x < -50) next();
        }}
      >
        {images.map((img, i) => (
          <img 
            key={i} 
            src={img} 
            className="w-full h-full object-cover flex-shrink-0" 
            alt={`Slide ${i}`} 
            draggable="false" 
          />
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