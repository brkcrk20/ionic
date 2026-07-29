import { NextRequest, NextResponse } from "next/server";
import { createCategory, getCategories } from "@/lib/db";

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  // body.name ister düz string ister çoklu dil objesi ({ tr, en }) olsun kabul et
  const hasName =
    typeof body?.name === "string"
      ? body.name.trim().length > 0
      : typeof body?.name === "object" && body?.name !== null
      ? Boolean((body.name.tr && body.name.tr.trim().length > 0) || (body.name.en && body.name.en.trim().length > 0))
      : false;

  if (!hasName) {
    return NextResponse.json({ error: "Kategori adı gerekli" }, { status: 400 });
  }

  const category = await createCategory({
    name: body.name,
    parentId: body.parentId ?? null,
    image: body.image ?? null,
  });
  return NextResponse.json({ category }, { status: 201 });
}
