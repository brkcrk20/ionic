"use client";
import { useState } from "react";
import Image from "next/image";
import { Mail, Phone, Search, Menu, X, ChevronDown } from "lucide-react";
import type { Category } from "@/lib/db";

const CORPORATE_ITEMS = ["Hakkımızda", "Kalite Politikamız", "Sertifikalar"];
const MENU_ITEMS = ["PROJELER", "FUARLAR", "KATALOG", "İLETİŞİM"];

// Tip tanımını güncelledik: artık items içinde isim ve slug var
type ProductColumn = { title: string; items: { name: string; slug: string }[] };

function buildProductColumns(categories: Category[]): ProductColumn[] {
  const topLevel = categories.filter((c) => !c.parentId);
  return topLevel.map((cat) => ({
    title: cat.name.toLocaleUpperCase("tr-TR"),
    items: categories
      .filter((c) => c.parentId === cat.id)
      .map((c) => ({ name: c.name, slug: c.slug })),
  }));
}

export default function Navbar({ categories = [] }: { categories?: Category[] }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState<string | null>(null);

  const productColumns = buildProductColumns(categories);

  return (
    <nav className="w-full bg-white relative z-50 border-b border-gray-100">
      <div className="hidden md:block relative px-6 lg:px-12 pt-4 pb-3 border-b border-gray-100">
        <div className="flex justify-between items-start text-[11px] text-gray-500 tracking-wide">
          <div className="flex gap-6 pl-16 lg:pl-28">
            <a href="mailto:global@ionicstone.com" className="flex items-center gap-2 hover:text-black transition-colors">
              <Mail size={13} /> global@ionicstone.com
            </a>
            <a href="tel:+902588145747" className="flex items-center gap-2 hover:text-black transition-colors">
              <Phone size={13} /> +90 258 814 5747
            </a>
          </div>
          <div className="flex gap-6 items-center pr-16 lg:pr-28">
            <Search size={14} className="cursor-pointer hover:text-black transition-colors" />
            <span className="cursor-pointer hover:text-black transition-colors uppercase tracking-widest">Hikayeler</span>
            <span className="cursor-pointer hover:text-black transition-colors flex items-center gap-1">
              🇹🇷 TR <ChevronDown size={12} />
            </span>
          </div>
        </div>
        <a href="/" className="absolute left-80 top-18 -translate-x-1/2 w-16 h-16 lg:w-30 lg:h-30 flex items-center justify-center border border-black p-1 bg-white hover:opacity-80 transition-opacity">
          <Image src="/logo.svg" alt="Logo" width={80} height={80} className="object-contain w-full h-full" />
        </a>
      </div>

      <div className="hidden md:flex items-center justify-center px-4 sm:px-6 lg:px-12 h-16 md:h-20">
        <div className="flex items-center gap-6 lg:gap-9 text-[13px] font-bold text-[#333] uppercase tracking-wide h-full">
          <div className="relative h-full flex items-center" onMouseEnter={() => setOpenMenu("urunler")} onMouseLeave={() => setOpenMenu(null)}>
            <a href="/urunler" className="hover:text-black transition-colors flex items-center gap-1">
              ÜRÜNLER <ChevronDown size={14} className={`transition-transform ${openMenu === "urunler" ? "rotate-180" : ""}`} />
            </a>
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
                            <a key={item.slug} href={`/kategori/${item.slug}`} className="text-[12.5px] font-normal normal-case text-gray-600 hover:text-black transition-colors leading-snug">
                              {item.name}
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
          <div className="relative h-full flex items-center" onMouseEnter={() => setOpenMenu("kurumsal")} onMouseLeave={() => setOpenMenu(null)}>
            <a href="#" className="hover:text-black transition-colors flex items-center gap-1">KURUMSAL <ChevronDown size={14} /></a>
          </div>
          {MENU_ITEMS.map((item) => <a key={item} href="#" className="hover:text-black transition-colors">{item}</a>)}
        </div>
      </div>

      <div className="flex md:hidden items-center justify-between px-4 sm:px-6 h-16">
        <a href="/" className="w-12 h-12 bg-white flex items-center justify-center shrink-0 border border-black p-0.5 hover:opacity-80 transition-opacity">
          <Image src="/logo.svg" alt="Logo" width={80} height={80} className="object-contain w-10 h-10" />
        </a>
        <button className="p-2 -mr-2 text-[#1A1A1A]" onClick={() => setMobileOpen(true)}><Menu size={26} /></button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-[86%] max-w-sm bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100">
              <a href="/" onClick={() => setMobileOpen(false)}><Image src="/logo.png" alt="Logo" width={40} height={40} /></a>
              <button className="p-2" onClick={() => setMobileOpen(false)}><X size={24} /></button>
            </div>
            <div className="flex flex-col overflow-y-auto py-2 text-[13px] font-bold text-[#333] uppercase">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <a href="/urunler" onClick={() => setMobileOpen(false)}>ÜRÜNLER</a>
                <button onClick={() => setMobileSubOpen(mobileSubOpen === "urunler" ? null : "urunler")}><ChevronDown /></button>
              </div>
              {mobileSubOpen === "urunler" && (
                <div className="bg-gray-50 px-5 py-4 flex flex-col gap-2">
                  {productColumns.map((col) => col.items.map((item) => (
                    <a key={item.slug} href={`/kategori/${item.slug}`} className="text-[12.5px] font-normal normal-case text-gray-600 pl-1" onClick={() => setMobileOpen(false)}>
                      {item.name}
                    </a>
                  )))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}