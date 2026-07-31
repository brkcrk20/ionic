import { NextRequest, NextResponse } from "next/server";
import { deleteNews, updateNews } from "@/lib/db";

export async function PUT(request: NextRequest, ctx: any) {
  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const news = await updateNews(id, body);
  if (!news) {
    return NextResponse.json({ error: "Haber bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({ news });
}

export async function DELETE(_request: NextRequest, ctx: any) {
  const { id } = await ctx.params;
  const ok = await deleteNews(id);
  if (!ok) {
    return NextResponse.json({ error: "Haber bulunamadı" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
