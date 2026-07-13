import { NextRequest, NextResponse } from "next/server";
import { deleteCategory, updateCategory } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  ctx: RouteContext<"/api/admin/categories/[id]">
) {
  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }
  const category = await updateCategory(id, {
    name: body.name,
    parentId: body.parentId,
  });
  if (!category) {
    return NextResponse.json({ error: "Kategori bulunamadı" }, { status: 404 });
  }
  return NextResponse.json({ category });
}

export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/admin/categories/[id]">
) {
  const { id } = await ctx.params;
  const ok = await deleteCategory(id);
  if (!ok) {
    return NextResponse.json({ error: "Kategori bulunamadı" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
