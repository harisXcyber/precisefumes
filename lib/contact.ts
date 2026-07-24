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
