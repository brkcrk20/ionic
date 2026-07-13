import { NextRequest, NextResponse } from "next/server";
import { createCategory, getCategories } from "@/lib/db";

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "Kategori adı gerekli" }, { status: 400 });
  }
  const category = await createCategory({
    name: body.name,
    parentId: body.parentId ?? null,
  });
  return NextResponse.json({ category }, { status: 201 });
}
