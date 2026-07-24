import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE = "pf-admin";
const MAX_AGE = 60 * 60 * 12; // 12 hours

function secret(): string {
  // Rotating the admin password invalidates every existing session.
  return (
    (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "pf") +
    (process.env.ADMIN_PASSWORD ?? "")
  );
}

function sign(expiry: number): string {
  return crypto
    .createHmac("sha256", secret())
    .update(String(expiry))
    .digest("hex");
}

export function issueToken(): { value: string; maxAge: number } {
  const expiry = Date.now() + MAX_AGE * 1000;
  return { value: `${expiry}.${sign(expiry)}`, maxAge: MAX_AGE };
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [expiryRaw, mac] = token.split(".");
  const expiry = Number(expiryRaw);
  if (!expiry || !mac || Date.now() > expiry) return false;
  const expected = sign(expiry);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export const ADMIN_COOKIE = COOKIE;

/** True when the current request carries a valid admin session. */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(COOKIE)?.value);
}
