import { NextRequest, NextResponse } from "next/server";
import { getPageByKey, upsertPage } from "@/lib/db";
import { getPageSlot } from "@/lib/pageSlots";

export async function GET(_request: NextRequest, ctx: any) {
  const { key } = await ctx.params;
  const slot = getPageSlot(key);
  if (!slot) {
    return NextResponse.json({ error: "Sayfa yuvası bulunamadı" }, { status: 404 });
  }
  const page = await getPageByKey(key);
  return NextResponse.json({ page, slot });
}

export async function PUT(request: NextRequest, ctx: any) {
  const { key } = await ctx.params;
  const slot = getPageSlot(key);
  if (!slot) {
    return NextResponse.json({ error: "Sayfa yuvası bulunamadı" }, { status: 404 });
  }
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const page = await upsertPage(key, body);
  return NextResponse.json({ page });
}
