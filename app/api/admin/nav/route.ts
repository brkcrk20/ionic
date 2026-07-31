import { NextResponse } from "next/server";
import { getNavMenu, updateNavMenu } from "@/lib/db";

export async function GET() {
  const navMenu = await getNavMenu();
  return NextResponse.json({ navMenu });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
  }
  const navMenu = await updateNavMenu(body);
  return NextResponse.json({ success: true, navMenu });
}
