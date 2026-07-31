import { NextRequest, NextResponse } from "next/server";
import { createNews, getNews } from "@/lib/db";

export async function GET() {
  const news = await getNews();
  return NextResponse.json({ news });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  const hasTitle =
    typeof body?.title === "string"
      ? body.title.trim().length > 0
      : typeof body?.title === "object" && body?.title !== null
      ? (body.title.tr && body.title.tr.trim().length > 0) || (body.title.en && body.title.en.trim().length > 0)
      : false;

  if (!hasTitle) {
    return NextResponse.json({ error: "Haber başlığı gerekli" }, { status: 400 });
  }

  const news = await createNews(body);
  return NextResponse.json({ news }, { status: 201 });
}
