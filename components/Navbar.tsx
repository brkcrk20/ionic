"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import type { Category } from "@/lib/db";

const MENU_ITEMS = ["PROJELER", "FUARLAR", "KATALOG", "İLETİŞİM"];

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
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState<string | null>(null);

  // Sayfa kaydırma durumunu dinleyen state
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const productColumns = buildProductColumns(categories);

  // ARKA PLAN VE SABİTLİK DÜZENLEMESİ:
  const navBg = isHome
    ? isScrolled
      ? "bg-[#3A3A3A]/95 backdrop-blur-md shadow-lg"
      : "bg-transparent"
    : "bg-[#3A3A3A]";

  return (
    <nav className={`fixed top-0 inset-x-0 w-full z-50 transition-all duration-300 ${navBg}`}>
      {/* MASAÜSTÜ NAVBAR */}
      <div className="hidden md:flex justify-between items-center px-4 lg:px-8 h-16">
        {/* LOGO */}
        <a href="/" className="flex items-center shrink-0 hover:opacity-80 transition-all -translate-x-2 lg:-translate-x-4">
          <Image src="/logo.svg" alt="Logo" width={72} height={72} className="object-contain h-10 w-auto" />
        </a>

        {/* MENÜ ELEMANLARI */}
        <div className="flex items-center gap-6 lg:gap-12 text-[13px] font-montserrat text-[#F3F1EC] uppercase tracking-wide h-full">
          {/* ÜRÜNLER DROPDOWN */}
          <div className="relative h-full flex items-center" onMouseEnter={() => setOpenMenu("urunler")} onMouseLeave={() => setOpenMenu(null)}>
            <a href="/urunler" className="hover:text-[#B87333] transition-colors flex items-center gap-1">
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
                            <a key={item.slug} href={`/kategori/${item.slug}`} className="text-[12.5px] font-normal normal-case text-gray-600 hover:text-[#B87333] transition-colors leading-snug">
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

          {/* KURUMSAL DROPDOWN */}
          <div className="relative h-full flex items-center" onMouseEnter={() => setOpenMenu("kurumsal")} onMouseLeave={() => setOpenMenu(null)}>
            <a href="#" className="hover:text-[#B87333] transition-colors flex items-center gap-1">KURUMSAL <ChevronDown size={14} /></a>
          </div>

          {/* DİĞER LİNKLER */}
          {MENU_ITEMS.slice(0, -1).map((item) => (
            <a key={item} href="#" className="hover:text-[#B87333] transition-colors">
              {item}
            </a>
          ))}

          {/* İLETİŞİM BUTONU */}
          <a
            href="#"
            className="bg-[#B87333] text-white px-5 py-2.5 rounded-sm text-[12px] font-bold tracking-wider hover:bg-[#a3652c] transition-colors normal-case"
          >
            {MENU_ITEMS[MENU_ITEMS.length - 1]}
          </a>
        </div>
      </div>

      {/* MOBİL NAVBAR BARI */}
      <div className="flex md:hidden items-center justify-between px-4 sm:px-6 h-16">
        <a href="/" className="flex items-center shrink-0 hover:opacity-80 transition-opacity">
          <Image src="/logo.svg" alt="Logo" width={48} height={48} className="object-contain h-10 w-auto" />
        </a>
        <button className="p-2 -mr-2 text-[#F3F1EC]" onClick={() => setMobileOpen(true)}>
          <Menu size={26} />
        </button>
      </div>

      {/* MOBİL MENÜ DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-[86%] max-w-sm bg-[#3A3A3A] shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
              <a href="/" onClick={() => setMobileOpen(false)}>
                <Image src="/logo.svg" alt="Logo" width={40} height={40} className="object-contain h-10 w-auto" />
              </a>
              <button className="p-2 text-[#F3F1EC]" onClick={() => setMobileOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col overflow-y-auto py-2 text-[13px] font-bold text-[#F3F1EC] uppercase">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <a href="/urunler" onClick={() => setMobileOpen(false)}>
                  ÜRÜNLER
                </a>
                <button onClick={() => setMobileSubOpen(mobileSubOpen === "urunler" ? null : "urunler")}>
                  <ChevronDown />
                </button>
              </div>
              {mobileSubOpen === "urunler" && (
                <div className="bg-black/20 px-5 py-4 flex flex-col gap-2">
                  {productColumns.map((col) =>
                    col.items.map((item) => (
                      <a
                        key={item.slug}
                        href={`/kategori/${item.slug}`}
                        className="text-[12.5px] font-normal normal-case text-[#F3F1EC]/70 pl-1"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.name}
                      </a>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}