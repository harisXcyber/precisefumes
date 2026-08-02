"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { normalizePkMobile, waLink } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

type BankMethod = "easypaisa" | "jazzcash";

function cleanWord(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
}

export function AffiliateSignupForm({
  signupOpen = true,
}: {
  /** False once the free-registration offer has expired — the form is
   *  replaced with the paid-registration WhatsApp flow. */
  signupOpen?: boolean;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [verifyUrl, setVerifyUrl] = useState<string | null>(null);
  const [bankMethod, setBankMethod] = useState<BankMethod>("easypaisa");
  const [codeWord, setCodeWord] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirmPassword") ?? "");
    if (password.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters.",
      });
      setIsSubmitting(false);
      return;
    }
    if (password !== confirm) {
      setMessage({ type: "error", text: "Passwords don't match." });
      setIsSubmitting(false);
      return;
    }
    const bankPhone = String(formData.get("bankPhone") ?? "");
    if (!normalizePkMobile(bankPhone)) {
      setMessage({
        type: "error",
        text: "Enter a valid Pakistani mobile number for payouts (e.g. 03001234567).",
      });
      setIsSubmitting(false);
      return;
    }
    if (cleanWord(codeWord).length < 2) {
      setMessage({
        type: "error",
        text: "Choose a promo-code word of at least 2 letters (e.g. your name).",
      });
      setIsSubmitting(false);
      return;
    }
    const data = {
      email: formData.get("email"),
      name: formData.get("name"),
      password,
      codeWord: cleanWord(codeWord),
      bankMethod: bankMethod,
      bankPhone,
      bankAccountName: formData.get("bankAccountName"),
    };

    try {
      const res = await fetch("/api/affiliate/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        await res.json();
        setVerifyUrl("/affiliate/dashboard");
        setMessage({
          type: "success",
          text: "Account created! We've emailed you a 6-digit verification code (check spam too). Sign in to your dashboard and enter it there — your promo code activates the moment you do.",
        });
        (e.target as HTMLFormElement).reset();
        setCodeWord("");
      } else {
        const errorData = await res.json();
        setMessage({
          type: "error",
          text: errorData.error || "Signup failed. Please try again.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Free-registration offer over → paid registration via WhatsApp.
  if (!signupOpen) {
    return (
      <div className="max-w-xl mx-auto rounded-[var(--radius-lg)] border border-border bg-bg-soft p-8 text-center">
        <p className="font-serif text-2xl">
          Registration fee: PKR 2,500
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-fg-soft">
          The free-registration offer has ended. To join the affiliate
          program, message us on WhatsApp — we&apos;ll take your PKR 2,500
          registration and set up your account and promo code for you.
        </p>
        <a
          href={waLink(
            "Assalam-o-Alaikum Precise Fumes! I'd like to register as an affiliate (PKR 2,500 registration). Please guide me through the payment and setup."
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
        >
          <WhatsAppIcon className="h-4 w-4" />
          Register via WhatsApp
        </a>
        <p className="mt-6 text-xs text-fg-faint">
          Already an affiliate?{" "}
          <Link href="/affiliate/dashboard" className="underline underline-offset-2 hover:text-fg">
            Sign in to your dashboard
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
      {/* Contact Info */}
      <fieldset className="space-y-4">
        <legend className="font-serif text-xl font-normal mb-6">
          Your Information
        </legend>

        <div>
          <label htmlFor="name" className="block pf-label mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block pf-label mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full"
            placeholder="your@email.com"
          />
          <p className="text-xs text-fg-soft mt-2">
            You'll receive a verification link here. Check spam if needed.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className="block pf-label mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full"
              placeholder="Min. 8 characters"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block pf-label mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full"
              placeholder="Repeat password"
            />
          </div>
        </div>
      </fieldset>

      {/* Promo code */}
      <fieldset className="space-y-4 pt-6 border-t border-border">
        <legend className="font-serif text-xl font-normal mb-2">
          Your Promo Code
        </legend>
        <p className="text-xs leading-relaxed text-fg-soft">
          Choose a word — your name or brand works great. Your promo code
          becomes your word + 2 numbers. Share it to earn PKR 300 per sale.
        </p>
        <div>
          <label htmlFor="codeWord" className="block pf-label mb-2">
            Choose your word
          </label>
          <input
            type="text"
            id="codeWord"
            value={codeWord}
            onChange={(e) => setCodeWord(e.target.value)}
            required
            maxLength={12}
            className="w-full"
            placeholder="e.g. HARIS"
          />
          {cleanWord(codeWord).length >= 2 && (
            <p className="mt-2 text-sm text-fg-soft">
              Your code will look like:{" "}
              <span className="font-medium tracking-wider text-accent-deep">
                {cleanWord(codeWord)}
                <span className="opacity-60">##</span>
              </span>
            </p>
          )}
        </div>
      </fieldset>

      {/* Banking Info */}
      <fieldset className="space-y-4 pt-6 border-t border-border">
        <legend className="font-serif text-xl font-normal mb-2">
          Payment Details
        </legend>
        <p className="mb-6 text-xs leading-relaxed text-fg-soft">
          This is the account we'll transfer your PKR 300 commission to for
          every sale made with your coupon code.
        </p>

        <div>
          <label className="block pf-label mb-4">Preferred Payment Method</label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="bankMethod"
                value="easypaisa"
                checked={bankMethod === "easypaisa"}
                onChange={(e) => setBankMethod(e.target.value as BankMethod)}
              />
              <span className="font-medium">EasyPaisa</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="bankMethod"
                value="jazzcash"
                checked={bankMethod === "jazzcash"}
                onChange={(e) => setBankMethod(e.target.value as BankMethod)}
              />
              <span className="font-medium">JazzCash</span>
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="bankPhone" className="block pf-label mb-2">
            Mobile Number (for {bankMethod === "easypaisa" ? "EasyPaisa" : "JazzCash"})
          </label>
          <input
            type="tel"
            id="bankPhone"
            name="bankPhone"
            required
            className="w-full"
            placeholder="+92 300 1234567"
          />
          <p className="text-xs text-fg-soft mt-2">
            Your registered {bankMethod === "easypaisa" ? "EasyPaisa" : "JazzCash"} phone number.
          </p>
        </div>

        <div>
          <label htmlFor="bankAccountName" className="block pf-label mb-2">
            Account Holder Name
          </label>
          <input
            type="text"
            id="bankAccountName"
            name="bankAccountName"
            required
            className="w-full"
            placeholder="Name on your account"
          />
        </div>
      </fieldset>

      {/* Terms */}
      <fieldset className="pt-6 border-t border-border">
        <label className="flex gap-3">
          <input
            type="checkbox"
            name="terms"
            required
            className="mt-1"
          />
          <span className="text-sm text-fg-soft">
            I agree to the{" "}
            <Link href="/terms" className="link-underline font-medium">
              terms of service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="link-underline font-medium">
              privacy policy
            </Link>
            .
          </span>
        </label>
      </fieldset>

      {message && (
        <div
          className={`text-sm p-4 rounded ${
            message.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {verifyUrl && (
        <a href={verifyUrl} className="btn-primary w-full justify-center">
          Open Dashboard & Enter My Code →
        </a>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full justify-center"
      >
        {isSubmitting ? "Signing Up..." : "Create Affiliate Account"}
      </button>

      <Link
        href="/affiliate/dashboard"
        className="btn-ghost w-full justify-center text-center"
      >
        Already an affiliate? Sign In to Dashboard →
      </Link>
    </form>
  );
}
