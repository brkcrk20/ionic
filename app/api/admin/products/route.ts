import { NextRequest, NextResponse } from "next/server";
import { createProduct, getProducts } from "@/lib/db";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  
  // body.name ister string ister çoklu dil objesi ({ tr, en }) olsun, boş olmadığını kontrol ediyoruz
  const hasName =
    typeof body?.name === "string"
      ? body.name.trim().length > 0
      : typeof body?.name === "object" && body?.name !== null
      ? (body.name.tr && body.name.tr.trim().length > 0) || (body.name.en && body.name.en.trim().length > 0)
      : false;

  if (!hasName) {
    return NextResponse.json({ error: "Ürün adı gerekli" }, { status: 400 });
  }

  const product = await createProduct(body);
  return NextResponse.json({ product }, { status: 201 });
}