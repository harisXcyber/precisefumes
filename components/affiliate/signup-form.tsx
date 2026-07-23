"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type BankMethod = "easypaisa" | "jazzcash";

export function AffiliateSignupForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [verifyUrl, setVerifyUrl] = useState<string | null>(null);
  const [bankMethod, setBankMethod] = useState<BankMethod>("easypaisa");

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
    const data = {
      email: formData.get("email"),
      name: formData.get("name"),
      password,
      bankMethod: bankMethod,
      bankPhone: formData.get("bankPhone"),
      bankAccountName: formData.get("bankAccountName"),
    };

    try {
      const res = await fetch("/api/affiliate/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.verifyUrl) {
          setVerifyUrl(data.verifyUrl);
          setMessage({
            type: "success",
            text: "Signup successful! Click the button below to verify and get your code.",
          });
        } else {
          setMessage({
            type: "success",
            text: "Signup successful! Check your email (and spam folder) for the verification link.",
          });
        }
        (e.target as HTMLFormElement).reset();
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

      {/* Banking Info */}
      <fieldset className="space-y-4 pt-6 border-t border-border">
        <legend className="font-serif text-xl font-normal mb-6">
          Payment Details
        </legend>

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
          Verify & Get My Code →
        </a>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full justify-center"
      >
        {isSubmitting ? "Signing Up..." : "Create Affiliate Account"}
      </button>

      <p className="text-xs text-fg-soft text-center">
        Already have an account?{" "}
        <Link href="/affiliate/dashboard" className="link-underline font-medium">
          Sign in to dashboard
        </Link>
      </p>
    </form>
  );
}
