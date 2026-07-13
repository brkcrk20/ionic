"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Upload, Loader2, ImageOff } from "lucide-react";

type SliderItem = { id: string; image: string; title: string; subtitle: string; buttonText: string; buttonLink: string; };

export default function SliderPanel() {
  const [slider, setSlider] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/slider")
      .then(res => res.json())
      .then(data => {
        // API'den gelen veriyi kontrol ederek state'e ata
        setSlider(Array.isArray(data.slider) ? data.slider : []);
      });
  }, []);

  const handleChange = (id: string, field: keyof SliderItem, val: string) => {
    setSlider(prev => prev.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  const addItem = () => {
    const newItem: SliderItem = { 
      id: `s-${Date.now()}`, 
      image: "", 
      title: "", 
      subtitle: "", 
      buttonText: "İncele", 
      buttonLink: "/urunler" 
    };
    // State'i güncellemeye zorluyoruz
    setSlider(prev => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    setSlider(prev => prev.filter(item => item.id !== id));
  };

  async function handleImageUpload(id: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingId(id);
    setMsg("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error || "Görsel yüklenemedi");
        return;
      }
      handleChange(id, "image", data.url);
    } finally {
      setUploadingId(null);
      e.target.value = "";
    }
  }

  const handleSave = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/slider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slider)
      });
      if (res.ok) {
        setMsg("Slider başarıyla kaydedildi!");
      } else {
        setMsg("Bir hata oluştu.");
      }
    } catch {
      setMsg("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">Ana sayfadaki büyük kayan görselleri ve üzerindeki metinleri yönetin.</p>
        <button 
          type="button" 
          onClick={addItem} 
          className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-black px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        >
          <Plus size={14} /> Yeni Slayt Ekle
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {slider.map((item, index) => (
          <div key={item.id} className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 flex flex-col gap-4 relative">
            <button 
              type="button" 
              onClick={() => removeItem(item.id)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 size={16} />
            </button>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Slayt #{index + 1}</h3>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="shrink-0">
                <label className="block text-xs font-medium text-gray-600 mb-1">Görsel</label>
                <div className="flex items-center gap-3">
                  {item.image ? (
                    <img src={item.image} alt="" className="w-16 h-16 rounded-md object-cover border border-gray-200" />
                  ) : (
                    <div className="w-16 h-16 rounded-md border border-dashed border-gray-300 flex items-center justify-center text-gray-300">
                      <ImageOff size={18} />
                    </div>
                  )}
                  <label className="inline-flex items-center gap-1.5 text-xs text-gray-600 border border-gray-300 rounded-md px-3 py-1.5 cursor-pointer hover:bg-white transition-colors bg-white">
                    {uploadingId === item.id ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                    {uploadingId === item.id ? "Yükleniyor..." : "Görsel Seç"}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      className="hidden"
                      onChange={(e) => handleImageUpload(item.id, e)}
                      disabled={uploadingId === item.id}
                    />
                  </label>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Buton Metni</label>
                  <input type="text" value={item.buttonText} onChange={e => handleChange(item.id, "buttonText", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none" placeholder="İncele"/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Buton Linki</label>
                  <input type="text" value={item.buttonLink} onChange={e => handleChange(item.id, "buttonLink", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none" placeholder="/urunler"/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Ana Başlık</label>
                  <input type="text" value={item.title} onChange={e => handleChange(item.id, "title", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none" placeholder="Başlık girin"/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Alt Başlık</label>
                  <input type="text" value={item.subtitle} onChange={e => handleChange(item.id, "subtitle", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none" placeholder="Alt başlık girin"/>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
        <button 
          onClick={handleSave} 
          disabled={loading} 
          className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          <Save size={16} /> {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </button>
        {msg && <p className={`text-sm ${msg.includes("başarıyla") ? "text-green-600" : "text-red-600"}`}>{msg}</p>}
      </div>
    </div>
  );
}