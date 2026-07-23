import "server-only";
import nodemailer from "nodemailer";

/** SMTP via the DirectAdmin mail server (contact@precisefumes.com).
 *  Vercel env vars:
 *    SMTP_HOST  e.g. mail.precisefumes.com
 *    SMTP_PORT  465 (SSL) or 587 (STARTTLS)
 *    SMTP_USER  contact@precisefumes.com
 *    SMTP_PASS  mailbox password
 *    SMTP_FROM  optional display-from, defaults to SMTP_USER
 *  When unset, sends become console logs so flows never break. */

export function emailConfigured(): boolean {
  return (
    !!process.env.SMTP_HOST && !!process.env.SMTP_USER && !!process.env.SMTP_PASS
  );
}

let cached: nodemailer.Transporter | null = null;

function transport(): nodemailer.Transporter {
  if (cached) return cached;
  const port = Number(process.env.SMTP_PORT ?? 465);
  cached = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return cached;
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ sent: boolean }> {
  if (!emailConfigured()) {
    console.log("[email skipped — SMTP not configured]", {
      to: opts.to,
      subject: opts.subject,
    });
    return { sent: false };
  }
  try {
    await transport().sendMail({
      from:
        process.env.SMTP_FROM ??
        `Precise Fumes <${process.env.SMTP_USER}>`,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    });
    return { sent: true };
  } catch (err) {
    console.error("[email failed]", err);
    return { sent: false };
  }
}

/* ── Templates ────────────────────────────────────────────── */

const wrap = (body: string) => `
<div style="margin:0;padding:32px 16px;background:#faf8f5;font-family:Georgia,'Times New Roman',serif;color:#1a1714;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e8e2d8;border-radius:16px;overflow:hidden;">
    <div style="background:#14100c;padding:28px 32px;text-align:center;">
      <span style="color:#f4ede3;font-size:20px;letter-spacing:0.2em;text-transform:uppercase;">Precise Fumes</span>
    </div>
    <div style="padding:32px;">${body}</div>
    <div style="padding:20px 32px;border-top:1px solid #e8e2d8;text-align:center;font-size:12px;color:#a39f96;">
      Precise Fumes · Karachi, Pakistan · <a href="mailto:contact@precisefumes.com" style="color:#a97d3a;">contact@precisefumes.com</a>
    </div>
  </div>
</div>`;

interface OrderEmailData {
  ref: string;
  name: string;
  city: string;
  items: { name: string; size: string; quantity: number; price: number }[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
}

export function orderConfirmationEmail(o: OrderEmailData): string {
  const pkr = (n: number) => `PKR ${n.toLocaleString("en-PK")}`;
  const rows = o.items
    .map(
      (i) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #f0ebe2;">${i.name} · ${i.size} × ${i.quantity}</td><td style="padding:8px 0;border-bottom:1px solid #f0ebe2;text-align:right;">${pkr(i.price * i.quantity)}</td></tr>`
    )
    .join("");
  const delivery =
    o.city === "Karachi"
      ? "Free delivery — 2–5 working days"
      : "PKR 300 — 5–7 working days";
  return wrap(`
    <h1 style="font-size:24px;font-weight:normal;margin:0 0 8px;">Order confirmed</h1>
    <p style="color:#6d6258;margin:0 0 24px;">Thank you, ${o.name}. Your order <strong>${o.ref}</strong> is being prepared.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">${rows}</table>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:16px;">
      <tr><td style="padding:4px 0;color:#6d6258;">Subtotal</td><td style="text-align:right;">${pkr(o.subtotal)}</td></tr>
      ${o.discount > 0 ? `<tr><td style="padding:4px 0;color:#a97d3a;">Savings</td><td style="text-align:right;color:#a97d3a;">−${pkr(o.discount)}</td></tr>` : ""}
      <tr><td style="padding:4px 0;color:#6d6258;">Delivery (${o.city})</td><td style="text-align:right;">${o.shippingFee === 0 ? "Free" : pkr(o.shippingFee)}</td></tr>
      <tr><td style="padding:12px 0 0;font-size:18px;">Total — Cash on Delivery</td><td style="padding:12px 0 0;text-align:right;font-size:18px;"><strong>${pkr(o.total)}</strong></td></tr>
    </table>
    <p style="margin:24px 0 0;color:#6d6258;font-size:13px;">${delivery}. Please keep the exact amount ready for the rider.</p>
  `);
}

export function affiliateVerifyEmail(name: string, verifyUrl: string): string {
  return wrap(`
    <h1 style="font-size:24px;font-weight:normal;margin:0 0 8px;">Verify your email</h1>
    <p style="color:#6d6258;margin:0 0 24px;">Salaam ${name}, one click and your Precise Fumes affiliate account is live — your personal bonus code will be shown right after.</p>
    <p style="text-align:center;margin:0 0 24px;">
      <a href="${verifyUrl}" style="display:inline-block;background:#c99a4e;color:#14100c;padding:14px 32px;border-radius:999px;text-decoration:none;letter-spacing:0.1em;text-transform:uppercase;font-size:13px;">Verify &amp; get my code</a>
    </p>
    <p style="color:#a39f96;font-size:12px;margin:0;">If the button doesn't work, open this link:<br>${verifyUrl}</p>
  `);
}

export function contactNotificationEmail(
  name: string,
  email: string,
  message: string
): string {
  return wrap(`
    <h1 style="font-size:20px;font-weight:normal;margin:0 0 16px;">New contact message</h1>
    <p style="margin:0 0 4px;"><strong>${name}</strong> &lt;${email}&gt;</p>
    <p style="color:#6d6258;white-space:pre-wrap;margin:16px 0 0;">${message}</p>
  `);
}
