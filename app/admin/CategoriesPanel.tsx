"use client";

import { useEffect, useState } from "react";
import type { Category, MultiLangString } from "@/lib/db";
import { Pencil, Trash2, Plus, X, FolderTree, Upload, Loader2, ImageOff } from "lucide-react";

function getLangText(val: MultiLangString | undefined, lang: "tr" | "en" = "tr"): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return lang === "tr" ? (val.tr || val.en || "") : (val.en || val.tr || "");
}

// Bir kategorinin tüm alt/torun kategorilerinin id'lerini bulur (döngüsel referansı engellemek için)
function getDescendantIds(categories: Category[], id: string): Set<string> {
  const result = new Set<string>();
  let changed = true;
  while (changed) {
    changed = false;
    for (const c of categories) {
      if (c.parentId && (c.parentId === id || result.has(c.parentId)) && !result.has(c.id)) {
        result.add(c.id);
        changed = true;
      }
    }
  }
  return result;
}

// Üst kategori seçim kutusu için ağacı derinlik bilgisiyle düz bir listeye çevirir
function flattenForSelect(
  categories: Category[],
  excludeIds: Set<string>,
  parentId: string | null = null,
  depth = 0
): { cat: Category; depth: number }[] {
  const result: { cat: Category; depth: number }[] = [];
  for (const c of categories.filter((x) => x.parentId === parentId)) {
    if (excludeIds.has(c.id)) continue;
    result.push({ cat: c, depth });
    result.push(...flattenForSelect(categories, excludeIds, c.id, depth + 1));
  }
  return result;
}

function CategoryNode({
  cat,
  depth,
  categories,
  onEdit,
  onDelete,
}: {
  cat: Category;
  depth: number;
  categories: Category[];
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
}) {
  const children = categories.filter((c) => c.parentId === cat.id);
  const isLeaf = children.length === 0;

  return (
    <li>
      <div
        className={`flex items-center justify-between px-5 py-2.5 ${depth > 0 ? "border-t border-gray-50" : ""}`}
        style={{ paddingLeft: 20 + depth * 22 }}
      >
        <div className="flex items-center gap-3 min-w-0">
          {depth === 0 ? (
            cat.image ? (
              <img
                src={cat.image}
                alt=""
                className="w-9 h-9 rounded-md object-cover border border-gray-200 shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-md border border-gray-200 flex items-center justify-center text-gray-300 shrink-0">
                <ImageOff size={14} />
              </div>
            )
          ) : (
            <span className="text-gray-300 shrink-0">—</span>
          )}
          <span
            className={`text-sm truncate ${depth === 0 ? "text-[#1A1A1A] font-medium" : "text-gray-600"}`}
          >
            {getLangText(cat.name)}
          </span>
          {!isLeaf && (
            <span className="shrink-0 text-[10px] uppercase tracking-wide text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">
              grup
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onEdit(cat)}
            className="p-1.5 text-gray-400 hover:text-[#1A1A1A] transition-colors"
            aria-label="Düzenle"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(cat)}
            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
            aria-label="Sil"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      {children.length > 0 && (
        <ul>
          {children.map((child) => (
            <CategoryNode
              key={child.id}
              cat={child}
              depth={depth + 1}
              categories={categories}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function CategoriesPanel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [nameTr, setNameTr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [parentId, setParentId] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
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
    if (typeof cat.name === "string") {
      setNameTr(cat.name);
      setNameEn("");
    } else {
      setNameTr(cat.name.tr || "");
      setNameEn(cat.name.en || "");
    }
    setParentId(cat.parentId ?? "");
    setImage(cat.image ?? null);
    setSeoTitle(cat.seoTitle ?? "");
    setSeoDescription(cat.seoDescription ?? "");
  }

  function resetForm() {
    setEditing(null);
    setNameTr("");
    setNameEn("");
    setParentId("");
    setImage(null);
    setSeoTitle("");
    setSeoDescription("");
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
    if (!nameTr.trim()) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: { tr: nameTr.trim(), en: nameEn.trim() },
        parentId: parentId || null,
        image,
        seoTitle: seoTitle.trim(),
        seoDescription: seoDescription.trim(),
      };
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
    const catName = getLangText(cat.name);
    const hasChildren = categories.some((c) => c.parentId === cat.id);
    const message = hasChildren
      ? `"${catName}" silinsin mi? Alt kategorileri de silinecek.`
      : `"${catName}" silinsin mi?`;
    if (!confirm(message)) return;
    await fetch(`/api/admin/categories/${cat.id}`, { method: "DELETE" });
    if (editing?.id === cat.id) resetForm();
    await load();
  }

  const topLevel = categories.filter((c) => !c.parentId);

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
              <CategoryNode
                key={cat.id}
                cat={cat}
                depth={0}
                categories={categories}
                onEdit={startEdit}
                onDelete={handleDelete}
              />
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
            <label className="block text-xs text-gray-500 mb-1">Kategori Adı (Türkçe)</label>
            <input
              value={nameTr}
              onChange={(e) => setNameTr(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20 focus:border-[#1A1A1A]"
              placeholder="Örn: Mermer Serisi"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Kategori Adı (İngilizce)</label>
            <input
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20 focus:border-[#1A1A1A]"
              placeholder="Örn: Marble Series"
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
              {flattenForSelect(
                categories,
                editing ? new Set([editing.id, ...getDescendantIds(categories, editing.id)]) : new Set()
              ).map(({ cat, depth }) => (
                <option key={cat.id} value={cat.id}>
                  {"— ".repeat(depth)}
                  {getLangText(cat.name)}
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

          <div className="border-t border-gray-100 pt-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">SEO (opsiyonel)</p>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Meta Başlık <span className="text-gray-400">({seoTitle.length}/70)</span>
              </label>
              <input
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                maxLength={70}
                placeholder={`${nameTr || "Kategori Adı"} | Ion Meccanica`}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20 focus:border-[#1A1A1A]"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Meta Açıklama <span className="text-gray-400">({seoDescription.length}/160)</span>
              </label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                maxLength={160}
                rows={2}
                placeholder="Bu kategori hakkında kısa bir açıklama..."
                className="w-full resize-none border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20 focus:border-[#1A1A1A]"
              />
            </div>
            <p className="text-[11px] text-gray-400">
              Boş bırakılırsa kategori adından otomatik oluşturulur.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving || uploading || !nameTr.trim()}
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