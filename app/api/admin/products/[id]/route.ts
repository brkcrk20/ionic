import { NextRequest, NextResponse } from "next/server";
import { deleteProduct, updateProduct } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  ctx: RouteContext<"/api/admin/products/[id]">
) {
  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  if (body.name !== undefined) update.name = body.name;
  if (body.description !== undefined) update.description = body.description;
  if (body.price !== undefined) update.price = Number(body.price) || 0;
  if (body.stock !== undefined) update.stock = Number(body.stock) || 0;
  if (body.categoryId !== undefined) update.categoryId = body.categoryId;
  if (body.images !== undefined) update.images = body.images;
  if (body.active !== undefined) update.active = Boolean(body.active);

  const product = await updateProduct(id, update);
  if (!product) {
    return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/admin/products/[id]">
) {
  const { id } = await ctx.params;
  const ok = await deleteProduct(id);
  if (!ok) {
    return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
