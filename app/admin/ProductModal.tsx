"use client";

import { useState } from "react";
import type { Category, Product } from "@/lib/db";
import { X, Upload, Loader2, ImageOff } from "lucide-react";

export default function ProductModal({
  categories,
  product,
  onClose,
  onSaved,
}: {
  categories: Category[];
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [stock, setStock] = useState(product ? String(product.stock) : "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [active, setActive] = useState(product?.active ?? true);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Görsel yüklenemedi");
          continue;
        }
        setImages((prev) => [...prev, data.url]);
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((i) => i !== url));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: name.trim(),
        description,
        price: Number(price) || 0,
        stock: Number(stock) || 0,
        categoryId: categoryId || null,
        images,
        active,
      };
      const res = product
        ? await fetch(`/api/admin/products/${product.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Ürün kaydedilemedi");
        return;
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="text-sm font-medium text-gray-700">
            {product ? "Ürünü Düzenle" : "Yeni Ürün"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Ürün Adı</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20 focus:border-[#1A1A1A]"
              placeholder="Örn: Beyaz Mermer Levha"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Açıklama</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20 focus:border-[#1A1A1A]"
              placeholder="Ürün detayları..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Fiyat (₺)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20 focus:border-[#1A1A1A]"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Stok Adedi</label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20 focus:border-[#1A1A1A]"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Kategori</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20 focus:border-[#1A1A1A]"
            >
              <option value="">Kategorisiz</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.parentId ? "— " : ""}
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Görseller</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {images.map((url) => (
                <div key={url} className="relative w-16 h-16 group">
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover rounded-md border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
              {images.length === 0 && (
                <div className="w-16 h-16 rounded-md border border-dashed border-gray-300 flex items-center justify-center text-gray-300">
                  <ImageOff size={18} />
                </div>
              )}
            </div>
            <label className="inline-flex items-center gap-1.5 text-xs text-gray-600 border border-gray-300 rounded-md px-3 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors">
              {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
              {uploading ? "Yükleniyor..." : "Görsel Ekle"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                multiple
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="rounded border-gray-300"
            />
            Sitede yayında
          </label>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-600 text-sm font-medium rounded-md py-2 hover:bg-gray-50 transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={saving || uploading || !name.trim()}
              className="flex-1 bg-[#1A1A1A] text-white text-sm font-medium rounded-md py-2 hover:bg-black transition-colors disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
