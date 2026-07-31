"use client";
import { useState, useEffect } from "react";
import { Save, Search, Wrench, Megaphone, BarChart3, Copyright } from "lucide-react";

type Lang = { tr: string; en: string };

type SiteSettings = {
  seoTitle: string;
  seoDescription: string;
  maintenanceMode: boolean;
  maintenanceMessage: Lang;
  announcementEnabled: boolean;
  announcementText: Lang;
  announcementLink: string;
  googleAnalyticsId: string;
  footerText: Lang;
};

const EMPTY_LANG: Lang = { tr: "", en: "" };

const DEFAULT_SETTINGS: SiteSettings = {
  seoTitle: "",
  seoDescription: "",
  maintenanceMode: false,
  maintenanceMessage: EMPTY_LANG,
  announcementEnabled: false,
  announcementText: EMPTY_LANG,
  announcementLink: "",
  googleAnalyticsId: "",
  footerText: EMPTY_LANG,
};

function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-md bg-[#F3F1EC] text-[#B87332] flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
          {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function LangInput({
  value,
  onChange,
  placeholderTR,
  placeholderEN,
  multiline = false,
}: {
  value: Lang;
  onChange: (v: Lang) => void;
  placeholderTR: string;
  placeholderEN: string;
  multiline?: boolean;
}) {
  const cls =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20 focus:border-[#1A1A1A]";
  if (multiline) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <textarea value={value.tr} onChange={(e) => onChange({ ...value, tr: e.target.value })} placeholder={placeholderTR} className={`${cls} h-20 resize-none`} />
        <textarea value={value.en} onChange={(e) => onChange({ ...value, en: e.target.value })} placeholder={placeholderEN} className={`${cls} h-20 resize-none`} />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <input type="text" value={value.tr} onChange={(e) => onChange({ ...value, tr: e.target.value })} placeholder={placeholderTR} className={cls} />
      <input type="text" value={value.en} onChange={(e) => onChange({ ...value, en: e.target.value })} placeholder={placeholderEN} className={cls} />
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${checked ? "bg-[#B87332]" : "bg-gray-300"}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${checked ? "left-4.5 translate-x-0.5" : "left-0.5"}`} />
      </button>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

export default function SettingsPanel() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
      });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setMsg(res.ok ? "Ayarlar başarıyla güncellendi!" : "Bir hata oluştu.");
    } catch {
      setMsg("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <p className="text-sm text-gray-500">
        Sitenin genelini etkileyen, nadiren değişen ayarları buradan yönetin.
      </p>

      <SectionCard icon={<Search size={16} />} title="SEO" description="Google ve sosyal medyada sitenin nasıl göründüğünü belirler.">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Site Başlığı</label>
          <input
            type="text"
            value={settings.seoTitle}
            onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
            placeholder="Ion Meccanica"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20 focus:border-[#1A1A1A]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Site Açıklaması</label>
          <textarea
            value={settings.seoDescription}
            onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
            placeholder="Doğal taş işleme makineleri ve komple üretim hatları."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20 focus:border-[#1A1A1A] h-20 resize-none"
          />
        </div>
      </SectionCard>

      <SectionCard icon={<Wrench size={16} />} title="Bakım Modu" description="Açıkken ziyaretçiler siteyi göremez; admin panel etkilenmez.">
        <Toggle checked={settings.maintenanceMode} onChange={(v) => setSettings({ ...settings, maintenanceMode: v })} label="Bakım modunu etkinleştir" />
        {settings.maintenanceMode && (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Ziyaretçilere gösterilecek mesaj</label>
            <LangInput
              value={settings.maintenanceMessage}
              onChange={(v) => setSettings({ ...settings, maintenanceMessage: v })}
              placeholderTR="Sitemiz kısa bir bakımda..."
              placeholderEN="Our site is under brief maintenance..."
              multiline
            />
          </div>
        )}
      </SectionCard>

      <SectionCard icon={<Megaphone size={16} />} title="Duyuru Çubuğu" description="Navbar'ın üstünde gösterilen ince bilgilendirme şeridi.">
        <Toggle checked={settings.announcementEnabled} onChange={(v) => setSettings({ ...settings, announcementEnabled: v })} label="Duyuru çubuğunu göster" />
        {settings.announcementEnabled && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Duyuru Metni</label>
              <LangInput
                value={settings.announcementText}
                onChange={(v) => setSettings({ ...settings, announcementText: v })}
                placeholderTR="Örn: Marmomac 2026'da standımızı ziyaret edin"
                placeholderEN="Ex: Visit our booth at Marmomac 2026"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Bağlantı (opsiyonel)</label>
              <input
                type="text"
                value={settings.announcementLink}
                onChange={(e) => setSettings({ ...settings, announcementLink: e.target.value })}
                placeholder="/news veya https://..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20 focus:border-[#1A1A1A]"
              />
            </div>
          </>
        )}
      </SectionCard>

      <SectionCard icon={<BarChart3 size={16} />} title="Google Analytics" description="Boş bırakılırsa hiçbir izleme kodu yüklenmez.">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Ölçüm Kimliği</label>
          <input
            type="text"
            value={settings.googleAnalyticsId}
            onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
            placeholder="G-XXXXXXXXXX"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20 focus:border-[#1A1A1A]"
          />
        </div>
      </SectionCard>

      <SectionCard icon={<Copyright size={16} />} title="Footer Metni" description="Footer'da yıl otomatik eklenir, siz sadece metni girin.">
        <LangInput
          value={settings.footerText}
          onChange={(v) => setSettings({ ...settings, footerText: v })}
          placeholderTR="Tüm hakları saklıdır."
          placeholderEN="All rights reserved."
        />
      </SectionCard>

      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          <Save size={16} /> {loading ? "Kaydediliyor..." : "Ayarları Kaydet"}
        </button>
        {msg && <p className={`text-sm ${msg.includes("başarıyla") ? "text-green-600" : "text-red-600"}`}>{msg}</p>}
      </div>
    </div>
  );
}
