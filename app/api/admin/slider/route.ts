import { NextResponse } from "next/server";
import { getDB, updateDB } from "@/lib/db";

export async function GET() {
  const db = await getDB();
  return NextResponse.json({ slider: db.slider });
}

export async function POST(req: Request) {
  const sliderData = await req.json();
  const db = await getDB();
  db.slider = sliderData;
  await updateDB(db);
  return NextResponse.json({ success: true });
}