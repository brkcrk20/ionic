import { NextResponse } from "next/server";
import { getDB, updateDB } from "@/lib/db";

export async function GET() {
  const db = await getDB();
  return NextResponse.json({ settings: db.settings });
}

export async function POST(req: Request) {
  const settingsData = await req.json();
  const db = await getDB();
  db.settings = settingsData;
  await updateDB(db);
  return NextResponse.json({ success: true });
}