"use client";

import { useState } from "react";
import type { Category, Product, ProductSpec } from "@/lib/db";
import { X, Upload, Loader2, ImageOff, Plus, GripVertical } from "lucide-react";

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
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [active, setActive] = useState(product?.active ?? true);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [specs, setSpecs] = useState<ProductSpec[]>(product?.specs ?? []);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function addSpec() {
    setSpecs((prev) => [...prev, { label: "", unit: "", value: "" }]);
  }

  function updateSpec(index: number, field: "label" | "unit" | "value", val: string) {
    setSpecs((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: val } : s)));
  }

  function removeSpec(index: number) {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  }

  function moveSpec(from: number, to: number) {
    if (to < 0 || to >= specs.length || from === to) return;
    setSpecs((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

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
        categoryId: categoryId || null,
        images,
        specs: specs.filter((s) => s.label.trim() || s.value.trim()),
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

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs text-gray-500">Teknik Özellikler</label>
              <button
                type="button"
                onClick={addSpec}
                className="flex items-center gap-1 text-xs text-gray-600 hover:text-[#1A1A1A] transition-colors"
              >
                <Plus size={12} /> Özellik Ekle
              </button>
            </div>
            {specs.length === 0 ? (
              <p className="text-xs text-gray-400 border border-dashed border-gray-300 rounded-md px-3 py-3 text-center">
                Örn: Güç, Ölçüler, Malzeme, Kapasite gibi teknik detayları ekleyin.
              </p>
            ) : (
              <div className="space-y-2">
                {specs.map((spec, i) => (
                  <div
                    key={i}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (dragIndex !== null) moveSpec(dragIndex, i);
                      setDragIndex(null);
                    }}
                    className={`flex items-center gap-2 rounded-md transition-colors ${
                      dragIndex === i ? "opacity-40" : ""
                    }`}
                  >
                    <span
                      draggable
                      onDragStart={() => setDragIndex(i)}
                      onDragEnd={() => setDragIndex(null)}
                      className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 shrink-0 touch-none"
                      aria-label="Taşımak için sürükleyin"
                    >
                      <GripVertical size={14} />
                    </span>
                    <input
                      value={spec.label}
                      onChange={(e) => updateSpec(i, "label", e.target.value)}
                      placeholder="Özellik (örn: Güç)"
                      className="w-[34%] border border-gray-300 rounded-md px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20 focus:border-[#1A1A1A]"
                    />
                    <input
                      value={spec.unit}
                      onChange={(e) => updateSpec(i, "unit", e.target.value)}
                      placeholder="Birim (örn: kW)"
                      className="w-[22%] border border-gray-300 rounded-md px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20 focus:border-[#1A1A1A]"
                    />
                    <input
                      value={spec.value}
                      onChange={(e) => updateSpec(i, "value", e.target.value)}
                      placeholder="Değer (örn: 5.5)"
                      className="flex-1 border border-gray-300 rounded-md px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20 focus:border-[#1A1A1A]"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpec(i)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors shrink-0"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
                    className="w-full h-full object-contain bg-gray-50 rounded-md border border-gray-200 p-0.5"
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
