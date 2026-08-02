import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { isAdmin } from "@/lib/admin-auth";
import { createAdminClient, adminConfigured } from "@/lib/supabase/admin";
import { hashPassword } from "@/lib/password";
import { normalizePkMobile } from "@/lib/contact";

/**
 * Create a promo code directly from the admin panel — for special people
 * who skip the affiliate signup entirely. The code lives as an active
 * affiliate row (so checkout validation and order attribution work
 * unchanged) with source 'admin' and no usable login.
 */
export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!adminConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const b = await request.json();
  const code = String(b.code ?? "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 16);
  const name = String(b.name ?? "").trim();

  if (code.length < 2) {
    return NextResponse.json(
      { error: "Code must be at least 2 letters/numbers." },
      { status: 400 }
    );
  }
  if (!name) {
    return NextResponse.json(
      { error: "Whose code is this? Enter a name." },
      { status: 400 }
    );
  }
  // Commission is optional — untick it for discount-only codes.
  const commission = b.paysCommission === false ? 0 : 300;
  const phone = b.phone ? (normalizePkMobile(String(b.phone)) ?? "—") : "—";
  // Optional real email → the owner gets "your code made a sale" alerts.
  const notifyEmail = String(b.email ?? "").trim().toLowerCase();
  if (notifyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notifyEmail)) {
    return NextResponse.json(
      { error: "That notification email doesn't look valid." },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  const { data: clash } = await supabase
    .from("affiliates")
    .select("id, status")
    .eq("referral_code", code)
    .maybeSingle();
  if (clash) {
    return NextResponse.json(
      { error: `Code ${code} is already taken.` },
      { status: 409 }
    );
  }

  const { data: created, error } = await supabase.from("affiliates").insert({
    // The password is random, so nobody can sign in to a dashboard with
    // this row. If the admin gave a real email, sale alerts go there;
    // otherwise a synthetic address keeps the row valid and silent.
    email: notifyEmail || `code.${code.toLowerCase()}@admin.precisefumes.com`,
    name,
    password_hash: hashPassword(crypto.randomBytes(24).toString("hex")),
    bank_method: "admin",
    bank_phone: phone,
    bank_account_name: name,
    referral_code: code,
    status: "active",
    source: "admin",
    commission,
  })
    .select("id")
    .single();

  if (error || !created) {
    console.error("Admin code create failed:", error?.message);
    return NextResponse.json(
      { error: "Could not create the code." },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true, id: created.id, code, commission });
}
