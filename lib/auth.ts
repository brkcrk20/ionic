import { NextRequest } from "next/server";

export const ADMIN_COOKIE = "admin_session";

const SECRET = process.env.ADMIN_SESSION_SECRET || "ionic-admin-dev-secret";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin123";
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return toHex(signature);
}

export async function createSessionToken(): Promise<string> {
  const payload = `admin:${Date.now()}`;
  const signature = await sign(payload);
  return Buffer.from(`${payload}:${signature}`).toString("base64");
}

export async function isValidSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");
    const signature = parts.pop() as string;
    const payload = parts.join(":");
    return (await sign(payload)) === signature;
  } catch {
    return false;
  }
}

export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  return isValidSessionToken(token);
}
