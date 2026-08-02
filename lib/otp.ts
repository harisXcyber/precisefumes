import "server-only";
import crypto from "crypto";
import { adminConfigured, createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";

/** Per-purpose behaviour: how long a code lives, how often it can be
 *  re-sent, and what the email tells the reader to do with it. */
const PURPOSES: Record<
  string,
  { ttlMin: number; cooldownSec: number; blurb: string }
> = {
  checkout: {
    ttlMin: 10,
    cooldownSec: 45,
    blurb: "Enter this code to confirm your order.",
  },
  "affiliate-verify": {
    ttlMin: 30,
    cooldownSec: 120,
    blurb:
      "Enter this code in your affiliate dashboard to verify your email and activate your promo code.",
  },
};

function purposeConfig(purpose: string) {
  return PURPOSES[purpose] ?? PURPOSES.checkout;
}

function sixDigit(): string {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
}

function otpEmail(code: string, blurb: string, ttlMin: number): string {
  return `
<div style="margin:0;padding:32px 16px;background:#faf8f5;font-family:Georgia,serif;color:#1a1714;">
  <div style="max-width:480px;margin:0 auto;background:#fff;border:1px solid #e8e2d8;border-radius:16px;overflow:hidden;">
    <div style="background:#14100c;padding:24px;text-align:center;">
      <span style="color:#f4ede3;letter-spacing:.2em;text-transform:uppercase;">Precise Fumes</span>
    </div>
    <div style="padding:32px;text-align:center;">
      <p style="color:#6d6258;margin:0 0 16px;">Your verification code is</p>
      <p style="font-size:36px;letter-spacing:.3em;font-weight:bold;margin:0 0 16px;">${code}</p>
      <p style="color:#a39f96;font-size:13px;margin:0;">${blurb} It expires in ${ttlMin} minutes. If you didn't request it, ignore this email.</p>
    </div>
  </div>
</div>`;
}

export interface OtpResult {
  ok: boolean;
  error?: string;
  cooldown?: number;
}

/** Generate + email a fresh code. Rate-limited per email. */
export async function sendOtp(
  emailRaw: string,
  purpose = "checkout"
): Promise<OtpResult> {
  if (!adminConfigured()) return { ok: false, error: "Not configured" };
  const email = emailRaw.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  const supabase = createAdminClient();
  const cfg = purposeConfig(purpose);

  // Cooldown: block rapid re-sends.
  const { data: recent } = await supabase
    .from("otp_codes")
    .select("created_at")
    .eq("email", email)
    .eq("purpose", purpose)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (recent) {
    const ageSec = (Date.now() - new Date(recent.created_at).getTime()) / 1000;
    if (ageSec < cfg.cooldownSec) {
      return {
        ok: false,
        error: "Please wait before requesting another code.",
        cooldown: Math.ceil(cfg.cooldownSec - ageSec),
      };
    }
  }

  const code = sixDigit();
  const expires_at = new Date(Date.now() + cfg.ttlMin * 60_000).toISOString();
  const { error } = await supabase
    .from("otp_codes")
    .insert({ email, code, purpose, expires_at });
  if (error) return { ok: false, error: "Could not generate a code." };

  const sent = await sendEmail({
    to: email,
    subject: `${code} is your Precise Fumes verification code`,
    html: otpEmail(code, cfg.blurb, cfg.ttlMin),
  });
  if (!sent.sent) {
    return { ok: false, error: "Could not send the code. Please try again." };
  }
  return { ok: true };
}

/** Check a code without consuming it (for live UX feedback). */
export async function checkOtp(
  emailRaw: string,
  code: string,
  purpose = "checkout"
): Promise<boolean> {
  if (!adminConfigured()) return false;
  const email = emailRaw.trim().toLowerCase();
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("otp_codes")
    .select("id, code, expires_at, consumed")
    .eq("email", email)
    .eq("purpose", purpose)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data || data.consumed) return false;
  if (new Date(data.expires_at).getTime() < Date.now()) return false;
  return data.code === String(code).trim();
}

/** Verify AND consume a code — call at order creation. */
export async function consumeOtp(
  emailRaw: string,
  code: string,
  purpose = "checkout"
): Promise<boolean> {
  if (!adminConfigured()) return false;
  const email = emailRaw.trim().toLowerCase();
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("otp_codes")
    .select("id, code, expires_at, consumed")
    .eq("email", email)
    .eq("purpose", purpose)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data || data.consumed) return false;
  if (new Date(data.expires_at).getTime() < Date.now()) return false;
  if (data.code !== String(code).trim()) return false;
  await supabase
    .from("otp_codes")
    .update({ consumed: true })
    .eq("id", data.id);
  return true;
}
