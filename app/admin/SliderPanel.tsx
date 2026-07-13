"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Save } from "lucide-react";

type SliderItem = { id: string; image: string; title: string; subtitle: string; buttonText: string; buttonLink: string; };

export default function SliderPanel() {
  const [slider, setSlider] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/slider").then(res => res.json()).then(data => setSlider(data.slider || []));
  }, []);

  const handleChange = (id: string, field: keyof SliderItem, val: string) => {
    setSlider(prev => prev.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  const addItem = () => {
    const newItem: SliderItem = { id: `s-${Date.now()}`, image: "", title: "", subtitle: "", buttonText: "İncele", buttonLink: "/urunler" };
    setSlider(prev => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    setSlider(prev => prev.filter(item => item.id !== id));
  };

  const handleSave = async () => {
    setLoading(true);
    setMsg("");
    const res = await fetch("/api/admin/slider", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slider)
    });
    setLoading(false);
    setMsg(res.ok ? "Slider başarıyla kaydedildi!" : "Bir hata oluştu.");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">Ana sayfadaki büyük kayan görselleri ve üzerindeki metinleri yönetin.</p>
        <button onClick={addItem} className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-black px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"><Plus size={14} /> Yeni Slayt Ekle</button>
      </div>

      <div className="flex flex-col gap-4">
        {slider.map((item, index) => (
          <div key={item.id} className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 flex flex-col gap-4 relative">
            <button onClick={() => removeItem(item.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Slayt #{index + 1}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Görsel URL (/resim.jpg veya link)</label>
                <input type="text" value={item.image} onChange={e => handleChange(item.id, "image", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none" placeholder="/slider1.jpg"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Buton Yönlendirme Linki</label>
                <input type="text" value={item.buttonLink} onChange={e => handleChange(item.id, "buttonLink", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none" placeholder="/urunler"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Ana Başlık</label>
                <input type="text" value={item.title} onChange={e => handleChange(item.id, "title", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none" placeholder="Doğal Taş Koleksiyonu"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Alt Başlık</label>
                <input type="text" value={item.subtitle} onChange={e => handleChange(item.id, "subtitle", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none" placeholder="Mimari Projeleriniz İçin"/>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
        <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"><Save size={16} /> {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}</button>
        {msg && <p className={`text-sm ${msg.includes("başarıyla") ? "text-green-600" : "text-red-600"}`}>{msg}</p>}
      </div>
    </div>
  );
}