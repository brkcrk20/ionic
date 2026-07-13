"use client";

import { useEffect, useState } from "react";
import type { Category } from "@/lib/db";
import { Pencil, Trash2, Plus, X, FolderTree, Upload, Loader2, ImageOff } from "lucide-react";

export default function CategoriesPanel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data.categories ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(cat: Category) {
    setEditing(cat);
    setName(cat.name);
    setParentId(cat.parentId ?? "");
    setImage(cat.image ?? null);
  }

  function resetForm() {
    setEditing(null);
    setName("");
    setParentId("");
    setImage(null);
    setError("");
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Görsel yüklenemedi");
        return;
      }
      setImage(data.url);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError("");
    try {
      const payload = { name: name.trim(), parentId: parentId || null, image };
      const res = editing
        ? await fetch(`/api/admin/categories/${editing.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "İşlem başarısız oldu");
        return;
      }
      resetForm();
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(cat: Category) {
    const hasChildren = categories.some((c) => c.parentId === cat.id);
    const message = hasChildren
      ? `"${cat.name}" silinsin mi? Alt kategorileri de silinecek.`
      : `"${cat.name}" silinsin mi?`;
    if (!confirm(message)) return;
    await fetch(`/api/admin/categories/${cat.id}`, { method: "DELETE" });
    if (editing?.id === cat.id) resetForm();
    await load();
  }

  const topLevel = categories.filter((c) => !c.parentId);
  const childrenOf = (id: string) => categories.filter((c) => c.parentId === id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <FolderTree size={16} className="text-gray-500" />
          <h2 className="text-sm font-medium text-gray-700">
            Kategoriler {!loading && <span className="text-gray-400">({categories.length})</span>}
          </h2>
        </div>

        {loading ? (
          <p className="p-6 text-sm text-gray-400">Yükleniyor...</p>
        ) : topLevel.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">Henüz kategori eklenmedi.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {topLevel.map((cat) => (
              <li key={cat.id}>
                <div className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt=""
                        className="w-9 h-9 rounded-md object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-md border border-gray-200 flex items-center justify-center text-gray-300 shrink-0">
                        <ImageOff size={14} />
                      </div>
                    )}
                    <span className="text-sm text-[#1A1A1A] font-medium">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(cat)}
                      className="p-1.5 text-gray-400 hover:text-[#1A1A1A] transition-colors"
                      aria-label="Düzenle"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                      aria-label="Sil"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {childrenOf(cat.id).length > 0 && (
                  <ul className="pl-9 pb-2">
                    {childrenOf(cat.id).map((child) => (
                      <li
                        key={child.id}
                        className="flex items-center justify-between pr-5 py-1.5"
                      >
                        <span className="text-sm text-gray-600">— {child.name}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEdit(child)}
                            className="p-1.5 text-gray-400 hover:text-[#1A1A1A] transition-colors"
                            aria-label="Düzenle"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(child)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                            aria-label="Sil"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5 h-fit">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">
            {editing ? "Kategoriyi Düzenle" : "Yeni Kategori"}
          </h3>
          {editing && (
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-700">
              <X size={15} />
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Kategori Adı</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20 focus:border-[#1A1A1A]"
              placeholder="Örn: Mermer Serisi"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Üst Kategori (opsiyonel)</label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20 focus:border-[#1A1A1A]"
            >
              <option value="">Yok (ana kategori)</option>
              {topLevel
                .filter((c) => c.id !== editing?.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Görsel (opsiyonel — ana sayfada gösterilir)
            </label>
            <div className="flex items-center gap-3">
              {image ? (
                <div className="relative w-14 h-14 group shrink-0">
                  <img
                    src={image}
                    alt=""
                    className="w-full h-full object-cover rounded-md border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={11} />
                  </button>
                </div>
              ) : (
                <div className="w-14 h-14 rounded-md border border-dashed border-gray-300 flex items-center justify-center text-gray-300 shrink-0">
                  <ImageOff size={16} />
                </div>
              )}
              <label className="inline-flex items-center gap-1.5 text-xs text-gray-600 border border-gray-300 rounded-md px-3 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors">
                {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                {uploading ? "Yükleniyor..." : "Görsel Seç"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={saving || uploading || !name.trim()}
            className="w-full flex items-center justify-center gap-1.5 bg-[#1A1A1A] text-white text-sm font-medium rounded-md py-2 hover:bg-black transition-colors disabled:opacity-50"
          >
            {!editing && <Plus size={14} />}
            {saving ? "Kaydediliyor..." : editing ? "Güncelle" : "Kategori Ekle"}
          </button>
        </form>
      </div>
    </div>
  );
}
