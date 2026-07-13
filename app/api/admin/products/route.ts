import { NextRequest, NextResponse } from "next/server";
import { createProduct, getProducts } from "@/lib/db";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "Ürün adı gerekli" }, { status: 400 });
  }
  const product = await createProduct({
    name: body.name,
    description: body.description ?? "",
    categoryId: body.categoryId ?? null,
    images: Array.isArray(body.images) ? body.images : [],
    specs: Array.isArray(body.specs) ? body.specs : [],
    active: body.active !== false,
  });
  return NextResponse.json({ product }, { status: 201 });
}
