import { NextResponse } from "next/server";
import { getPages } from "@/lib/db";

export async function GET() {
  const pages = await getPages();
  return NextResponse.json({ pages });
}
