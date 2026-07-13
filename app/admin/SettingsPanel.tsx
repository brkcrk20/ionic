"use client";
import { useState, useEffect } from "react";
import { Save } from "lucide-react";

type SiteSettings = { phone: string; email: string; address: string; instagram: string; };

export default function SettingsPanel() {
  const [settings, setSettings] = useState<SiteSettings>({ phone: "", email: "", address: "", instagram: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings").then(res => res.json()).then(data => setSettings(data.settings || { phone: "", email: "", address: "", instagram: "" }));
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setMsg("");
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    setLoading(false);
    setMsg(res.ok ? "Ayarlar başarıyla güncellendi!" : "Bir hata oluştu.");
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <p className="text-sm text-gray-500">Sitenin üst barında, footer alanında yer alan genel iletişim ve kurumsal bilgileri buradan güncelleyin.</p>
      
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Telefon Numarası</label>
          <input type="text" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"/>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">E-Posta Adresi</label>
          <input type="email" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"/>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Adres Bilgisi</label>
          <textarea value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none h-20 resize-none"/>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Instagram Kullanıcı Adı</label>
          <input type="text" value={settings.instagram} onChange={e => setSettings({...settings, instagram: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none" placeholder="Örn: ionicstone"/>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"><Save size={16} /> {loading ? "Kaydediliyor..." : "Ayarları Kaydet"}</button>
        {msg && <p className="text-sm text-green-600">{msg}</p>}
      </div>
    </div>
  );
}