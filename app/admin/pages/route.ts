import { NextResponse } from "next/server";
import { getPages } from "@/lib/db";

export async function GET() {
  try {
    const pages = await getPages();
    return NextResponse.json({ pages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Sayfalar alınamadı" }, { status: 500 });
  }
}