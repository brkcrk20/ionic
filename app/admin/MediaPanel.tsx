"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import {
  ImageIcon,
  Upload,
  Loader2,
  Trash2,
  Copy,
  Check,
  Search,
  AlertTriangle,
  X,
} from "lucide-react";

type MediaUsage = { type: "product" | "category"; id: string; name: string; field: string };
type MediaFile = {
  filename: string;
  url: string;
  size: number;
  uploadedAt: string;
  usage: MediaUsage[];
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaPanel() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null);
  const [deleteError, setDeleteError] = useState<MediaUsage[] | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/media");
    const data = await res.json().catch(() => ({ files: [] }));
    setFiles(Array.isArray(data.files) ? data.files : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return files;
    const q = query.trim().toLowerCase();
    return files.filter((f) => f.filename.toLowerCase().includes(q));
  }, [files, query]);

  async function handleUpload(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        const formData = new FormData();
        formData.append("file", file);
        await fetch("/api/admin/upload", { method: "POST", body: formData });
      }
      await load();
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleCopy(url: string) {
    try {
      await navigator.clipboard.writeText(window.location.origin + url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 1500);
    } catch {
      // clipboard erişimi yoksa sessizce geç
    }
  }

  async function confirmDelete(force: boolean) {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    const res = await fetch("/api/admin/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: deleteTarget.filename, force }),
    });
    if (res.ok) {
      setFiles((prev) => prev.filter((f) => f.filename !== deleteTarget.filename));
      setDeleteTarget(null);
      setDeleteError(null);
    } else {
      const data = await res.json().catch(() => null);
      if (data?.usage) {
        setDeleteError(data.usage);
      } else {
        setDeleteError([]);
      }
    }
    setDeleting(false);
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ImageIcon size={18} className="text-[#B87332]" />
          <h2 className="text-sm font-medium text-gray-700">
            Medya Kütüphanesi {!loading && <span className="text-gray-400">({files.length})</span>}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Dosya adı ara..."
              className="w-48 rounded-md border border-gray-300 py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 rounded-md bg-[#1A1A1A] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-black disabled:opacity-50 cursor-pointer"
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading ? "Yükleniyor..." : "Görsel Yükle"}
          </button>
        </div>
      </div>

      <p className="mb-6 text-xs text-gray-400">
        Burada yüklediğiniz görseller ürün ve kategori formlarında görsel seçerken kullanılabilir. Bir görsel bir üründe veya
        kategoride kullanılıyorsa, kartın üzerinde nerede kullanıldığı gösterilir ve önce oradan kaldırmadan silinemez.
      </p>

      {loading ? (
        <p className="py-10 text-center text-sm text-gray-400">Yükleniyor...</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
          <ImageIcon size={28} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm text-gray-400">{query ? "Eşleşen görsel bulunamadı." : "Henüz görsel yüklenmedi."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((f) => (
            <div key={f.filename} className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="relative h-32 w-full bg-gray-50">
                <Image src={f.url} alt={f.filename} fill className="object-contain p-2" />
                <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => handleCopy(f.url)}
                    className="rounded-full bg-white p-2 text-gray-700 shadow-md hover:text-[#B87332]"
                    title="URL'yi kopyala"
                  >
                    {copiedUrl === f.url ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                  </button>
                  <button
                    onClick={() => {
                      setDeleteTarget(f);
                      setDeleteError(null);
                    }}
                    className="rounded-full bg-red-600 p-2 text-white shadow-md hover:bg-red-700"
                    title="Sil"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1 p-3">
                <p className="truncate text-[11px] font-medium text-gray-700" title={f.filename}>
                  {f.filename}
                </p>
                <p className="text-[10px] text-gray-400">{formatSize(f.size)}</p>
                {f.usage.length > 0 ? (
                  <span className="mt-1 inline-block w-fit rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                    {f.usage.length} yerde kullanılıyor
                  </span>
                ) : (
                  <span className="mt-1 inline-block w-fit rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                    Kullanılmıyor
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1A1A1A]">Görseli Sil</h3>
              <button onClick={() => setDeleteTarget(null)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="relative mb-4 h-28 w-full overflow-hidden rounded-md border border-gray-100 bg-gray-50">
              <Image src={deleteTarget.url} alt={deleteTarget.filename} fill className="object-contain p-2" />
            </div>

            {deleteError ? (
              deleteError.length > 0 ? (
                <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3">
                  <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-amber-800">
                    <AlertTriangle size={13} /> Bu görsel şu anda kullanımda
                  </div>
                  <ul className="mb-2 list-inside list-disc text-xs text-amber-800">
                    {deleteError.map((u, i) => (
                      <li key={i}>
                        {u.name} — {u.field}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-amber-700">
                    Yine de silmek istersen, bu kayıtlardaki görsel referansı bozulur. Önce ilgili üründen/kategoriden görseli
                    kaldırman önerilir.
                  </p>
                </div>
              ) : (
                <p className="mb-4 text-xs text-red-600">Silme işlemi sırasında bir hata oluştu.</p>
              )
            ) : (
              <p className="mb-4 text-xs text-gray-500">
                <strong>{deleteTarget.filename}</strong> kalıcı olarak silinecek. Bu işlem geri alınamaz.
              </p>
            )}

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                onClick={() => confirmDelete(deleteError !== null && deleteError.length > 0)}
                disabled={deleting}
                className="flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
              >
                {deleting && <Loader2 size={13} className="animate-spin" />}
                {deleteError && deleteError.length > 0 ? "Yine de Sil" : "Sil"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
