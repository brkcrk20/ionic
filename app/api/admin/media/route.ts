import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getDB } from "@/lib/db";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");

type MediaUsage = { type: "product" | "category"; id: string; name: string; field: string };

function getLangText(val: unknown): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object" && val !== null) {
    const v = val as { tr?: string; en?: string };
    return v.tr || v.en || "";
  }
  return "";
}

async function findUsage(url: string): Promise<MediaUsage[]> {
  const db = await getDB();
  const usage: MediaUsage[] = [];

  for (const p of db.products) {
    const name = getLangText(p.name) || "(isimsiz ürün)";
    if (p.heroImage === url) usage.push({ type: "product", id: p.id, name, field: "Kapak görseli" });
    if (p.images?.includes(url)) usage.push({ type: "product", id: p.id, name, field: "Galeri" });
  }
  for (const c of db.categories) {
    const name = getLangText(c.name) || "(isimsiz kategori)";
    if (c.image === url) usage.push({ type: "category", id: c.id, name, field: "Kategori görseli" });
  }

  return usage;
}

export async function GET() {
  let entries: string[] = [];
  try {
    entries = await fs.readdir(UPLOAD_DIR);
  } catch {
    return NextResponse.json({ files: [] });
  }

  const db = await getDB();

  // Tüm ürün/kategori görsellerini tek seferde toplayıp haritalıyoruz (N dosya için N ayrı DB okuması yapmamak adına)
  const usageMap = new Map<string, MediaUsage[]>();
  const pushUsage = (url: string | null | undefined, entry: MediaUsage) => {
    if (!url) return;
    const list = usageMap.get(url) ?? [];
    list.push(entry);
    usageMap.set(url, list);
  };
  for (const p of db.products) {
    const name = getLangText(p.name) || "(isimsiz ürün)";
    pushUsage(p.heroImage, { type: "product", id: p.id, name, field: "Kapak görseli" });
    for (const img of p.images ?? []) {
      pushUsage(img, { type: "product", id: p.id, name, field: "Galeri" });
    }
  }
  for (const c of db.categories) {
    const name = getLangText(c.name) || "(isimsiz kategori)";
    pushUsage(c.image, { type: "category", id: c.id, name, field: "Kategori görseli" });
  }

  const files = await Promise.all(
    entries.map(async (filename) => {
      const filePath = path.join(UPLOAD_DIR, filename);
      const stat = await fs.stat(filePath);
      const url = `/uploads/products/${filename}`;
      return {
        filename,
        url,
        size: stat.size,
        uploadedAt: stat.mtime.toISOString(),
        usage: usageMap.get(url) ?? [],
      };
    })
  );

  files.sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1));

  return NextResponse.json({ files });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const filename = body?.filename;
  if (!filename || typeof filename !== "string" || filename.includes("/") || filename.includes("..")) {
    return NextResponse.json({ error: "Geçersiz dosya adı" }, { status: 400 });
  }

  const url = `/uploads/products/${filename}`;
  const usage = await findUsage(url);
  if (usage.length > 0 && !body?.force) {
    return NextResponse.json({ error: "Görsel kullanımda", usage }, { status: 409 });
  }

  try {
    await fs.unlink(path.join(UPLOAD_DIR, filename));
  } catch {
    return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
