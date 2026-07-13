import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DIMENSION = 1600; // px — bundan büyük görseller otomatik küçültülür

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Sadece JPG, PNG, WEBP veya GIF yükleyebilirsiniz" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Dosya 5MB'dan büyük olamaz" }, { status: 400 });
  }

  let bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || ".jpg";

  // GIF'ler hariç (animasyon bozulmasın diye), görsel gereksiz büyükse otomatik küçült
  // ve dosya boyutunu makul seviyeye indir. Kırpma yapılmaz, en-boy oranı korunur.
  if (file.type !== "image/gif") {
    try {
      const image = sharp(bytes, { failOn: "none" }).rotate(); // EXIF yönünü uygula
      const metadata = await image.metadata();
      const needsResize =
        (metadata.width ?? 0) > MAX_DIMENSION || (metadata.height ?? 0) > MAX_DIMENSION;

      let pipeline = needsResize
        ? image.resize({
            width: MAX_DIMENSION,
            height: MAX_DIMENSION,
            fit: "inside",
            withoutEnlargement: true,
          })
        : image;

      if (file.type === "image/jpeg") pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true });
      else if (file.type === "image/png") pipeline = pipeline.png({ quality: 82, compressionLevel: 8 });
      else if (file.type === "image/webp") pipeline = pipeline.webp({ quality: 82 });

      bytes = await pipeline.toBuffer();
    } catch {
      // Sharp işleyemezse orijinal dosyayı olduğu gibi kaydet
    }
  }

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "products");

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), bytes);

  return NextResponse.json({ url: `/uploads/products/${filename}` }, { status: 201 });
}
