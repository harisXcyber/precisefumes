"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { normalizePkMobile } from "@/lib/contact";

const BASE_PRICE = 3000;
const AFFILIATE_PRICE = 2500;
const CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Hyderabad",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Other",
];

export function CheckoutClient() {
  const { items, subtotal, getPromoInfo, getTesterInfo } = useCart();

  // Persisted cart loads on the client only — render after mount
  // to avoid a server/client hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [city, setCity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Email verification (OTP)
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpBusy, setOtpBusy] = useState(false);
  const [otpMsg, setOtpMsg] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  // Affiliate code state
  const [codeInput, setCodeInput] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [codeMessage, setCodeMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [checkingCode, setCheckingCode] = useState(false);

  if (!mounted) {
    return (
      <div className="py-24 text-center text-fg-soft">Loading your cart…</div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="mb-6 text-fg-soft">Your cart is empty.</p>
        <Link href="/shop" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const subtotalAmount = subtotal();
  const promo = getPromoInfo();
  const tester = getTesterInfo();

  // Affiliate savings: each standard PKR 3,000 bottle drops to PKR 2,500.
  const standardUnits = items
    .filter((i) => i.kind !== "tester" && i.price === BASE_PRICE)
    .reduce((sum, i) => sum + i.quantity, 0);
  const affiliateSavings = appliedCode
    ? standardUnits * (BASE_PRICE - AFFILIATE_PRICE)
    : 0;

  // Bonus codes apply to single perfumes only — never on top of a
  // bundle / buy-2-get-1 offer. Whichever saves more wins.
  const affiliateWins =
    appliedCode !== null && affiliateSavings > promo.discountAmount;
  const activeDiscount = affiliateWins
    ? affiliateSavings
    : promo.discountAmount;
  const activeDiscountLabel = affiliateWins
    ? `Bonus code ${appliedCode} — PKR 2,500 per perfume`
    : promo.description;

  const cartTotal = Math.max(
    0,
    subtotalAmount - activeDiscount - tester.discountAmount
  );
  const isKarachi = city === "Karachi";
  const shippingFee = city === "" ? 0 : isKarachi ? 0 : 300;
  const shippingLabel =
    city === ""
      ? "Select your city"
      : isKarachi
        ? "Free — 2–5 working days"
        : "PKR 300 — 5–7 working days";
  const finalTotal = cartTotal + shippingFee;

  async function applyCode() {
    const code = codeInput.trim().toUpperCase();
    if (!code) return;
    setCheckingCode(true);
    setCodeMessage(null);
    try {
      const res = await fetch("/api/affiliate/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedCode(code);
        setCodeMessage({
          type: "success",
          text: "Code applied — single perfumes now PKR 2,500 each.",
        });
      } else {
        setAppliedCode(null);
        setCodeMessage({
          type: "error",
          text: data.error || "This code is not valid.",
        });
      }
    } catch {
      setCodeMessage({
        type: "error",
        text: "Could not check the code. Please try again.",
      });
    } finally {
      setCheckingCode(false);
    }
  }

  function removeCode() {
    setAppliedCode(null);
    setCodeInput("");
    setCodeMessage(null);
  }

  async function sendOtp() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setOtpMsg({ type: "error", text: "Enter a valid email first." });
      return;
    }
    setOtpBusy(true);
    setOtpMsg(null);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "checkout" }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setOtpMsg({
          type: "success",
          text: "We emailed you a 6-digit code. Enter it below.",
        });
      } else {
        setOtpMsg({
          type: "error",
          text: data.error || "Could not send the code.",
        });
      }
    } catch {
      setOtpMsg({ type: "error", text: "Could not send the code." });
    } finally {
      setOtpBusy(false);
    }
  }

  async function verifyOtp() {
    setOtpBusy(true);
    setOtpMsg(null);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpInput, purpose: "checkout" }),
      });
      const data = await res.json();
      if (data.verified) {
        setOtpVerified(true);
        setOtpMsg({ type: "success", text: "Email verified ✓" });
      } else {
        setOtpMsg({
          type: "error",
          text: "That code is wrong or expired. Try again.",
        });
      }
    } catch {
      setOtpMsg({ type: "error", text: "Could not verify. Try again." });
    } finally {
      setOtpBusy(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!city) {
      setSubmitMessage({ type: "error", text: "Please select your city." });
      return;
    }

    const formData = new FormData(e.currentTarget);
    // A valid mobile is required so we can confirm the order on WhatsApp.
    const phone = normalizePkMobile(String(formData.get("phone") ?? ""));
    if (!phone) {
      setSubmitMessage({
        type: "error",
        text: "Please enter a valid mobile number (e.g. 03001234567) so we can confirm your order.",
      });
      return;
    }
    if (!otpVerified) {
      setSubmitMessage({
        type: "error",
        text: "Please verify your email address before placing the order.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    const orderData = {
      otp: otpInput,
      customer: {
        name: formData.get("name"),
        email,
        phone,
        address: formData.get("address"),
        city,
      },
      shipping: {
        zone: isKarachi ? "karachi" : "nationwide",
        fee: shippingFee,
      },
      payment: { method: "cod" },
      promo: affiliateWins
        ? null
        : promo.type
          ? { type: promo.type, discount: promo.discountAmount }
          : null,
      affiliate: affiliateWins
        ? { code: appliedCode, discount: affiliateSavings, commission: 300 }
        : null,
      items,
      subtotal: subtotalAmount,
      discount: activeDiscount + tester.discountAmount,
      freeTesters: tester.freeApplied,
      total: finalTotal,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        const { orderId } = await res.json();
        setSubmitMessage({
          type: "success",
          text: "Order placed! Taking you to your confirmation…",
        });
        setTimeout(() => {
          window.location.href = `/order-confirmation/${orderId}`;
        }, 1200);
      } else {
        setSubmitMessage({
          type: "error",
          text: "Failed to place order. Please try again.",
        });
      }
    } catch {
      setSubmitMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
      {/* ── Order Review ─────────────────────────────── */}
      <div className="lg:order-2">
        <div className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-6 md:p-8 lg:sticky lg:top-36">
          <h2 className="mb-6 font-serif text-2xl font-normal">Order Review</h2>

          {/* Items */}
          <ul className="mb-6 space-y-4 border-b border-border pb-6">
            {items.map((item) => (
              <li
                key={`${item.productId}-${item.size}`}
                className="flex items-start justify-between gap-4 text-sm"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="mt-0.5 text-xs text-fg-soft">
                    {item.size} × {item.quantity}
                  </p>
                </div>
                <p className="tabular-nums">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>

          {/* Totals */}
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-fg-soft">Subtotal</span>
              <span className="tabular-nums">
                {formatPrice(subtotalAmount)}
              </span>
            </div>

            {activeDiscount > 0 && (
              <div className="flex justify-between gap-4 text-accent-deep">
                <span>{activeDiscountLabel}</span>
                <span className="tabular-nums">
                  −{formatPrice(activeDiscount)}
                </span>
              </div>
            )}

            {tester.discountAmount > 0 && (
              <div className="flex justify-between gap-4 text-accent-deep">
                <span>{tester.description}</span>
                <span className="tabular-nums">
                  −{formatPrice(tester.discountAmount)}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-fg-soft">Delivery</span>
              <span className="text-right">{shippingLabel}</span>
            </div>

            <div className="mt-2 flex justify-between border-t border-border pt-4 font-serif text-xl">
              <span>Total</span>
              <span className="tabular-nums">{formatPrice(finalTotal)}</span>
            </div>
          </div>

          {/* Offer hint — crystal clear */}
          {tester.unused > 0 && (
            <p className="mt-5 rounded-[var(--radius)] bg-accent/15 p-3.5 text-xs leading-relaxed text-accent-deep">
              You have {tester.unused} free 5ml tester
              {tester.unused === 1 ? "" : "s"} unclaimed. Add one from any
              product page before you order.
            </p>
          )}
          {promo.type === null && !appliedCode && (
            <p className="mt-5 rounded-[var(--radius)] bg-bg p-3.5 text-xs leading-relaxed text-fg-soft">
              💡 Add a second perfume for the{" "}
              <strong className="text-fg">2-for-PKR-5,000 bundle</strong>, or four
              for <strong className="text-fg">Buy 3 Get 1 Free — PKR 9,000</strong>.
            </p>
          )}
          {appliedCode && !affiliateWins && promo.type !== null && (
            <p className="mt-5 rounded-[var(--radius)] bg-bg p-3.5 text-xs leading-relaxed text-fg-soft">
              Your {promo.description.toLowerCase()} saves more than the bonus
              code, so we applied the better offer. Bonus codes work on single
              perfumes only.
            </p>
          )}

          <p className="mt-4 text-xs text-fg-faint">
            Cash on Delivery — you pay when your order arrives. No advance
            payment needed.
          </p>
        </div>
      </div>

      {/* ── Checkout Form ────────────────────────────── */}
      <form onSubmit={handleSubmit} className="space-y-10 lg:order-1">
        {/* Delivery */}
        <fieldset>
          <legend className="mb-6 font-serif text-xl font-normal">
            1 · Delivery Details
          </legend>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="pf-label mb-2 block">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                autoComplete="name"
                className="w-full"
                placeholder="Your name"
              />
            </div>

            {/* Email + verification */}
            <div>
              <label htmlFor="email" className="pf-label mb-2 block">
                Email
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setOtpVerified(false);
                    setOtpSent(false);
                    setOtpMsg(null);
                  }}
                  disabled={otpVerified}
                  className="w-full disabled:opacity-70"
                  placeholder="you@email.com"
                />
                {!otpVerified && (
                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={otpBusy}
                    className="shrink-0 rounded-[var(--radius)] border border-fg px-4 text-xs uppercase tracking-[0.12em] transition-colors hover:bg-fg hover:text-bg disabled:opacity-40"
                  >
                    {otpBusy ? "…" : otpSent ? "Resend" : "Send code"}
                  </button>
                )}
              </div>

              {otpVerified ? (
                <p className="mt-2 text-xs font-medium text-[#1a8a4a]">
                  ✓ Email verified
                </p>
              ) : (
                otpSent && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) =>
                        setOtpInput(e.target.value.replace(/\D/g, ""))
                      }
                      className="w-40 tracking-[0.3em]"
                      placeholder="6-digit code"
                    />
                    <button
                      type="button"
                      onClick={verifyOtp}
                      disabled={otpBusy || otpInput.length !== 6}
                      className="shrink-0 rounded-[var(--radius)] bg-fg px-5 text-xs uppercase tracking-[0.12em] text-bg disabled:opacity-40"
                    >
                      Verify
                    </button>
                  </div>
                )
              )}
              {otpMsg && (
                <p
                  className={`mt-2 text-xs ${
                    otpMsg.type === "error"
                      ? "text-accent-rose"
                      : "text-accent-deep"
                  }`}
                >
                  {otpMsg.text}
                </p>
              )}
              {!otpVerified && (
                <p className="mt-2 text-xs text-fg-faint">
                  We verify your email with a quick code to prevent fake orders.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="pf-label mb-2 block">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                autoComplete="tel"
                className="w-full"
                placeholder="+92 3XX XXXXXXX"
              />
            </div>

            <div>
              <label htmlFor="address" className="pf-label mb-2 block">
                Full Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                autoComplete="street-address"
                className="w-full"
                placeholder="House, street, area"
              />
            </div>

            <div>
              <label htmlFor="city" className="pf-label mb-2 block">
                City
              </label>
              <select
                id="city"
                name="city"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full"
              >
                <option value="">Select your city</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c === "Karachi" ? "Karachi — Free delivery" : c}
                  </option>
                ))}
              </select>
              {city && (
                <p className="mt-2 text-xs text-fg-soft">
                  {isKarachi
                    ? "✓ Free delivery in Karachi, 2–5 working days."
                    : "Nationwide delivery PKR 300, 5–7 working days."}
                </p>
              )}
            </div>
          </div>
        </fieldset>

        {/* Payment */}
        <fieldset>
          <legend className="mb-6 font-serif text-xl font-normal">
            2 · Payment
          </legend>
          <div className="flex items-start gap-3 rounded-[var(--radius)] border border-accent bg-bg-soft p-4">
            <span className="mt-0.5 text-accent-deep" aria-hidden>✓</span>
            <span>
              <span className="block font-medium">Cash on Delivery</span>
              <span className="mt-0.5 block text-xs text-fg-soft">
                Pay in cash when your parcel arrives — anywhere in Pakistan.
                No advance payment. Online payments are coming soon.
              </span>
            </span>
          </div>
        </fieldset>

        {/* Bonus code */}
        <fieldset>
          <legend className="mb-3 font-serif text-xl font-normal">
            3 · Bonus Code{" "}
            <span className="text-sm text-fg-faint">(optional)</span>
          </legend>
          <p className="mb-4 text-xs leading-relaxed text-fg-soft">
            Have a code from one of our affiliates? Single perfumes drop from
            PKR 3,000 to <strong className="text-fg">PKR 2,500</strong>. Codes
            don't combine with bundle offers — we always apply whichever saves
            you more.
          </p>
          {appliedCode ? (
            <div className="flex items-center justify-between rounded-[var(--radius)] border border-accent bg-bg-soft px-4 py-3">
              <span className="text-sm">
                Code <strong className="tracking-wider">{appliedCode}</strong>{" "}
                applied
              </span>
              <button
                type="button"
                onClick={removeCode}
                className="text-xs uppercase tracking-wider text-fg-soft hover:text-fg"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="e.g. ROGUE4X"
                className="flex-1 uppercase"
                autoCapitalize="characters"
              />
              <button
                type="button"
                onClick={applyCode}
                disabled={checkingCode || !codeInput.trim()}
                className="shrink-0 rounded-[var(--radius)] border border-fg px-5 text-xs uppercase tracking-[0.14em] transition-colors hover:bg-fg hover:text-bg disabled:opacity-40"
              >
                {checkingCode ? "Checking…" : "Apply"}
              </button>
            </div>
          )}
          {codeMessage && (
            <p
              className={`mt-2 text-xs ${
                codeMessage.type === "error"
                  ? "text-accent-rose"
                  : "text-accent-deep"
              }`}
            >
              {codeMessage.text}
            </p>
          )}
        </fieldset>

        {submitMessage && (
          <div
            role="status"
            className={`rounded-[var(--radius)] border p-4 text-sm ${
              submitMessage.type === "success"
                ? "border-accent bg-bg-soft text-fg"
                : "border-accent-rose/40 bg-bg-soft text-accent-rose"
            }`}
          >
            {submitMessage.text}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full justify-center disabled:opacity-60"
          >
            {isSubmitting
              ? "Placing Order…"
              : `Place Order — ${formatPrice(finalTotal)}`}
          </button>
          <p className="mt-4 text-center text-xs text-fg-faint">
            By placing this order you agree to our{" "}
            <Link href="/terms" className="link-underline">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="link-underline">
              privacy policy
            </Link>
            .
          </p>
        </div>
      </form>
    </div>
  );
}
