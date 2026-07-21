"use client";
import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const next = () => setActive((prev) => (prev + 1) % images.length);
  const prev = () => setActive((prev) => (prev - 1 + images.length) % images.length);

  // Lightbox açıkken klavye ile gezinme ve arka plan kaydırmasını engelleme
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen]);

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="group bg-gray-50 rounded-lg overflow-hidden border border-gray-100 aspect-square relative w-full cursor-zoom-in"
        aria-label="Görseli büyüt"
      >
        <img
          src={images[active]}
          alt={name}
          className="w-full h-full object-contain p-4"
        />
        <span className="absolute bottom-3 right-3 bg-white/90 text-gray-600 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
          <ZoomIn size={16} />
        </span>
      </button>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={`aspect-square rounded-md overflow-hidden border-2 bg-gray-50 transition-colors ${
                i === active ? "border-[#B87333]" : "border-transparent hover:border-gray-300"
              }`}
              aria-label={`Görsel ${i + 1}`}
            >
              <img src={src} alt={`${name} ${i + 1}`} className="w-full h-full object-contain p-1" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center px-4 py-8"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 md:top-6 md:right-6 text-white/80 hover:text-white transition-colors p-2"
            aria-label="Kapat"
          >
            <X size={28} />
          </button>

          <img
            src={images[active]}
            alt={name}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[92vw] max-h-[85vh] object-contain select-none"
            draggable={false}
          />

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2"
                aria-label="Önceki görsel"
              >
                <ChevronLeft size={36} strokeWidth={1.5} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2"
                aria-label="Sonraki görsel"
              >
                <ChevronRight size={36} strokeWidth={1.5} />
              </button>

              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActive(i);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      active === i ? "bg-white scale-110" : "bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Görsel ${i + 1}'e git`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
