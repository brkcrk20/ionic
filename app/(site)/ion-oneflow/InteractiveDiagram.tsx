"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { useLanguage } from "@/lib/i18n";

// ---------------------------------------------------------------------------
// İNTERAKTİF RESİM / HOTSPOT BİLEŞENİ
// ---------------------------------------------------------------------------
// Nasıl çalışır:
// 1) Aşağıdaki HOTSPOTS listesine, resim üzerinde "+" butonu koymak istediğin
//    her nokta için bir satır eklersin. x/y değerleri resmin YÜZDE olarak
//    konumudur (0 = en sol/üst, 100 = en sağ/alt) — resmin boyutu değişse
//    bile noktalar hep doğru yerde kalır.
// 2) title/text alanlarını (TR/EN) ve istersen bir "image" (popup içinde
//    gösterilecek küçük görsel) doldurursun.
// 3) Kullanıcı "+" butonuna tıklayınca, o noktanın yanında başlık + açıklama
//    (+ varsa görsel) gösteren bir kart açılır. Tekrar tıklayınca veya
//    dışarı tıklayınca kapanır.
//
// Bu 5 hotspot, dokümandaki "The ONEFLOW Architecture" bölümünün 5
// bileşenini temsil eder: Process, Handling, Storage, Move, Control.
// Gerçek görsel eklendiğinde: DIAGRAM_IMAGE değişkenine görsel yolunu
// (örn. "/uploads/pages/oneflow-diagram.webp") yazman, ImagePlaceholder
// yerine <Image> kullanman yeterli.
// ---------------------------------------------------------------------------

const DIAGRAM_IMAGE: string | null = null; // örn: "/uploads/pages/oneflow-diagram.webp"

type Hotspot = {
  id: string;
  x: number; // % - soldan
  y: number; // % - üstten
  titleTr: string;
  titleEn: string;
  textTr: string;
  textEn: string;
  image?: string | null;
};

const HOTSPOTS: Hotspot[] = [
  {
    id: "spot-process",
    x: 15,
    y: 30,
    titleTr: "ONEFLOW Süreç",
    titleEn: "ONEFLOW Process",
    textTr:
      "Reçine işleme, kürleme, honlama, parlatma ve son işlemler tek bir koordineli süreç içinde birleşir.",
    textEn:
      "Resin treatment, curing, honing, polishing and finishing within one coordinated process.",
    image: null,
  },
  {
    id: "spot-handling",
    x: 38,
    y: 68,
    titleTr: "ONEFLOW Taşıma",
    titleEn: "ONEFLOW Handling",
    textTr:
      "Otomatik yükleme, boşaltma, çevirme, taşıma ve makineler arası transfer.",
    textEn:
      "Automatic loading, unloading, turning, conveying and inter-machine transfer.",
    image: null,
  },
  {
    id: "spot-storage",
    x: 62,
    y: 25,
    titleTr: "ONEFLOW Depolama",
    titleEn: "ONEFLOW Storage",
    textTr:
      "Ham levhaların, ara ürünlerin ve bitmiş ürünlerin otomatik olarak yönetilmesi.",
    textEn:
      "Automated management of raw slabs, intermediate materials and finished products.",
    image: null,
  },
  {
    id: "spot-move",
    x: 85,
    y: 62,
    titleTr: "ONEFLOW Nakliye",
    titleEn: "ONEFLOW Move",
    textTr:
      "Üretim bölümleri ile depolama alanları arasında AGV tabanlı taşıma.",
    textEn:
      "AGV-based transport between production departments and storage zones.",
    image: null,
  },
  {
    id: "spot-control",
    x: 50,
    y: 80,
    titleTr: "ONEFLOW Kontrol",
    titleEn: "ONEFLOW Control",
    textTr:
      "Üretim planlama, izlenebilirlik, ERP/MES bağlantısı ve fabrika denetimi.",
    textEn:
      "Production scheduling, traceability, ERP/MES connectivity and factory supervision.",
    image: null,
  },
];

export default function InteractiveDiagram() {
  const { lang } = useLanguage();
  const isTr = lang === "TR";
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeSpot = HOTSPOTS.find((h) => h.id === activeId) || null;

  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-[#3A3A3A]">
      {/* Arka plan görseli */}
      {DIAGRAM_IMAGE ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={DIAGRAM_IMAGE} alt="ION ONEFLOW" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <ImagePlaceholder label={isTr ? "İnteraktif Şema Görseli" : "Interactive Diagram Image"} />
      )}

      {/* Dışarı tıklanınca kapatmak için görünmez katman */}
      {activeId && (
        <button
          type="button"
          aria-label={isTr ? "Kapat" : "Close"}
          onClick={() => setActiveId(null)}
          className="absolute inset-0 z-10 cursor-default"
        />
      )}

      {/* Hotspot butonları */}
      {HOTSPOTS.map((spot) => {
        const isOpen = activeId === spot.id;
        // Kart, notanın alt yarısındaysa yukarı; üst yarısındaysa aşağı açılır
        const openUpward = spot.y > 50;
        // Kart, noktanın sol/sağ kenara çok yakın olduğu durumlarda taşmasın diye
        const alignRight = spot.x > 65;
        const alignLeft = spot.x < 35;

        return (
          <div
            key={spot.id}
            className="absolute z-20"
            style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: "translate(-50%, -50%)" }}
          >
            <button
              type="button"
              onClick={() => setActiveId(isOpen ? null : spot.id)}
              aria-label={isTr ? spot.titleTr : spot.titleEn}
              className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-[#F3F1EC] bg-[#B87332] text-[#F3F1EC] shadow-lg transition-transform hover:scale-110 cursor-pointer ${
                isOpen ? "scale-110 ring-4 ring-[#B87332]/30" : ""
              }`}
            >
              <Plus size={16} className={`transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`} />
              {!isOpen && <span className="absolute inset-0 rounded-full bg-[#B87332] animate-ping opacity-40" />}
            </button>

            {isOpen && (
              <div
                className={`absolute z-30 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden text-left ${
                  openUpward ? "bottom-[calc(100%+14px)]" : "top-[calc(100%+14px)]"
                } ${alignRight ? "right-0" : alignLeft ? "left-0" : "left-1/2 -translate-x-1/2"}`}
              >
                {spot.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={spot.image} alt={isTr ? spot.titleTr : spot.titleEn} className="w-full h-28 object-cover" />
                ) : null}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-sm font-extrabold text-[#3A3A3A]">{isTr ? spot.titleTr : spot.titleEn}</h4>
                    <button
                      type="button"
                      onClick={() => setActiveId(null)}
                      aria-label={isTr ? "Kapat" : "Close"}
                      className="shrink-0 text-gray-400 hover:text-gray-700 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{isTr ? spot.textTr : spot.textEn}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}