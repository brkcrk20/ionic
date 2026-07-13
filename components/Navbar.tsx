"use client";
import { useState } from "react";
import Image from "next/image";
import { Mail, Phone, Search, Menu, X, ChevronDown } from "lucide-react";
import type { Category } from "@/lib/db";

const CORPORATE_ITEMS = ["Hakkımızda", "Kalite Politikamız", "Sertifikalar"];

const MENU_ITEMS = ["PROJELER", "FUARLAR", "KATALOG", "İLETİŞİM"];

type ProductColumn = { title: string; items: string[] };

// Kategorileri (üst kategori + alt kategoriler) mega menü sütunlarına dönüştürür
function buildProductColumns(categories: Category[]): ProductColumn[] {
  const topLevel = categories.filter((c) => !c.parentId);
  return topLevel.map((cat) => ({
    title: cat.name.toLocaleUpperCase("tr-TR"),
    items: categories.filter((c) => c.parentId === cat.id).map((c) => c.name),
  }));
}

export default function Navbar({ categories = [] }: { categories?: Category[] }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState<string | null>(null);

  const productColumns = buildProductColumns(categories);

  return (
    <nav className="w-full bg-white relative z-50 border-b border-gray-100">
      {/* 1. Üst kısım: İletişim barı + tam ortada logo (mobilde gizli) */}
      <div className="hidden md:block relative px-6 lg:px-12 pt-4 pb-3 border-b border-gray-100">
        <div className="flex justify-between items-start text-[11px] text-gray-500 tracking-wide">
          {/* Sol: mail + telefon */}
          <div className="flex gap-6 pl-16 lg:pl-28">
            <a href="mailto:global@ionicstone.com" className="flex items-center gap-2 hover:text-black transition-colors">
              <Mail size={13} /> global@ionicstone.com
            </a>
            <a href="tel:+902588145747" className="flex items-center gap-2 hover:text-black transition-colors">
              <Phone size={13} /> +90 258 814 5747
            </a>
          </div>
          {/* Sağ: hikayeler + dil */}
          <div className="flex gap-6 items-center pr-16 lg:pr-28">
            <Search size={14} className="cursor-pointer hover:text-black transition-colors" />
            <span className="cursor-pointer hover:text-black transition-colors uppercase tracking-widest">Hikayeler</span>
            <span className="cursor-pointer hover:text-black transition-colors flex items-center gap-1">
              🇹🇷 TR <ChevronDown size={12} />
            </span>
          </div>
        </div>

        {/* LOGO — siyah çerçeveli */}
        <div className="absolute left-80 top-18 -translate-x-1/2 w-16 h-16 lg:w-30 lg:h-30 flex items-center justify-center border border-black p-1 bg-white">
          <Image src="/logo.svg" alt="Logo" width={80} height={80} className="object-contain w-full h-full" />
        </div>
      </div>

      {/* 2. Menü satırı: sayfaya tam ortalı */}
      <div className="hidden md:flex items-center justify-center px-4 sm:px-6 lg:px-12 h-16 md:h-20">
        <div className="flex items-center gap-6 lg:gap-9 text-[13px] font-bold text-[#333] uppercase tracking-wide h-full">
          <div
            className="relative h-full flex items-center"
            onMouseEnter={() => setOpenMenu("urunler")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <a href="#" className="hover:text-black transition-colors flex items-center gap-1">
              ÜRÜNLER <ChevronDown size={14} className={`transition-transform ${openMenu === "urunler" ? "rotate-180" : ""}`} />
            </a>

            {/* MEGA MENÜ */}
            {openMenu === "urunler" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-[min(92vw,1100px)] bg-white border border-gray-100 shadow-2xl z-50">
                {productColumns.length === 0 ? (
                  <p className="px-10 py-9 text-sm text-gray-400">Henüz kategori eklenmedi.</p>
                ) : (
                  <div className="grid grid-cols-6 gap-8 px-10 py-9">
                    {productColumns.map((col) => (
                      <div key={col.title} className="flex flex-col gap-3">
                        <p className="font-bold text-black text-[13px] normal-case tracking-normal">{col.title}</p>
                        <div className="flex flex-col gap-2.5">
                          {col.items.map((item) => (
                            <a
                              key={item}
                              href="#"
                              className="text-[12.5px] font-normal normal-case tracking-normal text-gray-600 hover:text-black transition-colors leading-snug"
                            >
                              {item}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div
            className="relative h-full flex items-center"
            onMouseEnter={() => setOpenMenu("kurumsal")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <a href="#" className="hover:text-black transition-colors flex items-center gap-1">
              KURUMSAL <ChevronDown size={14} className={`transition-transform ${openMenu === "kurumsal" ? "rotate-180" : ""}`} />
            </a>
            {openMenu === "kurumsal" && (
              <div className="absolute top-full left-0 mt-0 w-[220px] bg-white border border-gray-100 shadow-2xl p-6 z-50 flex flex-col gap-3">
                {CORPORATE_ITEMS.map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-[12.5px] font-normal normal-case tracking-normal text-gray-600 hover:text-black transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            )}
          </div>

          {MENU_ITEMS.map((item) => (
            <a key={item} href="#" className="hover:text-black transition-colors">
              {item}
            </a>
          ))}
        </div>
      </div>

      {/* 3. Mobil üst satır */}
      <div className="flex md:hidden items-center justify-between px-4 sm:px-6 h-16">
        <div className="w-12 h-12 bg-white flex items-center justify-center shrink-0 border border-black p-0.5">
          <Image src="/logo.svg" alt="Logo" width={80} height={80} className="object-contain w-10 h-10" />
        </div>
        <button
          className="p-2 -mr-2 text-[#1A1A1A]"
          onClick={() => setMobileOpen(true)}
          aria-label="Menüyü aç"
        >
          <Menu size={26} strokeWidth={1.5} />
        </button>
      </div>

      {/* MOBİL MENÜ */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-[86%] max-w-sm bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 shrink-0">
              <Image src="/logo.png" alt="Logo" width={40} height={40} className="object-contain w-9 h-9 border border-black p-0.5" />
              <button className="p-2 text-[#1A1A1A]" onClick={() => setMobileOpen(false)} aria-label="Menüyü kapat">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex flex-col overflow-y-auto py-2 text-[13px] font-bold text-[#333] uppercase tracking-wide">
              <button
                className="flex items-center justify-between px-5 py-4 border-b border-gray-100"
                onClick={() => setMobileSubOpen(mobileSubOpen === "urunler" ? null : "urunler")}
              >
                ÜRÜNLER
                <ChevronDown size={16} className={`transition-transform ${mobileSubOpen === "urunler" ? "rotate-180" : ""}`} />
              </button>
              {mobileSubOpen === "urunler" && (
                <div className="bg-gray-50 border-b border-gray-100 px-5 py-4 flex flex-col gap-5">
                  {productColumns.length === 0 ? (
                    <p className="text-[12.5px] font-normal normal-case text-gray-400">
                      Henüz kategori eklenmedi.
                    </p>
                  ) : (
                    productColumns.map((col) => (
                      <div key={col.title} className="flex flex-col gap-2">
                        <p className="font-bold text-black text-[12px] normal-case">{col.title}</p>
                        {col.items.map((item) => (
                          <a key={item} href="#" className="text-[12.5px] font-normal normal-case text-gray-600 pl-1">
                            {item}
                          </a>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              )}

              <button
                className="flex items-center justify-between px-5 py-4 border-b border-gray-100"
                onClick={() => setMobileSubOpen(mobileSubOpen === "kurumsal" ? null : "kurumsal")}
              >
                KURUMSAL
                <ChevronDown size={16} className={`transition-transform ${mobileSubOpen === "kurumsal" ? "rotate-180" : ""}`} />
              </button>
              {mobileSubOpen === "kurumsal" && (
                <div className="bg-gray-50 border-b border-gray-100 px-5 py-4 flex flex-col gap-2.5">
                  {CORPORATE_ITEMS.map((item) => (
                    <a key={item} href="#" className="text-[12.5px] font-normal normal-case text-gray-600">
                      {item}
                    </a>
                  ))}
                </div>
              )}

              {MENU_ITEMS.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="px-5 py-4 border-b border-gray-100"
                  onClick={() => setMobileOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}