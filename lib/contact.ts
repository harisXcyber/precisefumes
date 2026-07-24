/** Single source of truth for contact details. WhatsApp is the
 *  primary channel — prefer it over email everywhere. */
export const WHATSAPP_NUMBER = "923172388450"; // international, no +/0
export const WHATSAPP_DISPLAY = "0317 2388450";
export const CONTACT_EMAIL = "contact@precisefumes.com";
export const HOURS = "Mon–Sat, 10:00–19:00 PKT";

/** WhatsApp deep link with an optional pre-filled message. */
export function waLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Normalise any Pakistani mobile input to canonical 03XXXXXXXXX, or
 *  null if it isn't a valid PK mobile. Accepts 0300…, 300…, +9230…,
 *  92300…, 0092300… with spaces/dashes. */
export function normalizePkMobile(raw: string): string | null {
  let n = String(raw ?? "").replace(/\D/g, "");
  if (n.startsWith("0092")) n = n.slice(2);
  if (n.startsWith("92")) n = "0" + n.slice(2);
  if (n.length === 10 && n.startsWith("3")) n = "0" + n;
  return /^03\d{9}$/.test(n) ? n : null;
}

/** wa.me-ready number (92XXXXXXXXXX) from any PK mobile input, or null. */
export function toWaNumber(raw: string): string | null {
  const n = normalizePkMobile(raw);
  return n ? "92" + n.slice(1) : null;
}
