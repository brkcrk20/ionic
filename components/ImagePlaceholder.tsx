"use client";

import { ImageIcon } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface ImagePlaceholderProps {
  label?: string;
  className?: string;
}

// public/ klasöründe henüz karşılığı olmayan görseller için geçici blok.
// Gerçek görsel eklendiğinde bu bileşen yerine <Image src="..." /> kullanılabilir.
export default function ImagePlaceholder({ label, className = "" }: ImagePlaceholderProps) {
  const { t } = useLanguage();

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#3A3A3A] to-[#1f1f1f] text-[#F3F1EC]/40 ${className}`}
    >
      <ImageIcon size={36} strokeWidth={1.5} />
      <span className="text-[11px] font-semibold uppercase tracking-widest text-center px-4">
        {label || t.pages.imagePlaceholder}
      </span>
    </div>
  );
}
