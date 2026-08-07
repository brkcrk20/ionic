import { NextResponse } from "next/server";
import { upsertPage } from "@/lib/db";

export async function PUT(
  request: Request,
  props: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await props.params;
    const body = await request.json();
    const updatedPage = await upsertPage(key, body);
    return NextResponse.json({ success: true, page: updatedPage });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Hata oluştu" }, { status: 500 });
  }
}