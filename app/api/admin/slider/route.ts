import { NextResponse } from "next/server";
import { getDB, updateDB } from "@/lib/db";

export async function GET() {
  const db = await getDB();
  return NextResponse.json({ slider: db.slider || [] });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = await getDB();
    db.slider = body;
    await updateDB(db);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Kaydedilemedi" }, { status: 500 });
  }
}