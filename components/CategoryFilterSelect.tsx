"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export type CategoryFilterOption = {
  slug: string;
  label: string;
  depth: number;
};

// Ürün/Hat filtre şeridindeki kategori seçim kutusu.
// Native <select> yerine, açılınca şık görünen özel bir dropdown.
export default function CategoryFilterSelect({
  options,
  value,
  onChange,
  allLabel,
}: {
  options: CategoryFilterOption[];
  value: string; // "all" ya da seçili kategori slug'ı
  onChange: (slug: string) => void;
  allLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const allOptions: CategoryFilterOption[] = [
    { slug: "all", label: allLabel, depth: 0 },
    ...options,
  ];
  const selected = allOptions.find((o) => o.slug === value) || allOptions[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 bg-white text-gray-800 text-sm font-semibold py-3.5 pl-5 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A3A3A] cursor-pointer shadow-sm hover:shadow-md transition-shadow"
      >
        <span className="truncate">{selected.label}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        role="listbox"
        className={`absolute left-0 right-0 mt-2 max-h-80 overflow-y-auto rounded-xl border border-gray-100 bg-white py-2 shadow-2xl z-50 origin-top transition-all duration-150 ease-out ${
          open ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible pointer-events-none"
        }`}
      >
        {allOptions.map((opt) => {
          const isActive = opt.slug === value;
          return (
            <button
              key={opt.slug}
              type="button"
              role="option"
              aria-selected={isActive}
              onClick={() => {
                onChange(opt.slug);
                setOpen(false);
              }}
              style={{ paddingLeft: `${20 + opt.depth * 18}px` }}
              className={`w-full flex items-center justify-between gap-2 pr-4 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                isActive
                  ? "bg-[#B87332]/10 text-[#B87332] font-bold"
                  : "text-gray-700 hover:bg-gray-50 font-medium"
              }`}
            >
              <span className="truncate">{opt.label}</span>
              {isActive && <Check size={15} className="shrink-0 text-[#B87332]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}