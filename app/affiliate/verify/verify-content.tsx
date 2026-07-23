"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "invalid"
  >("loading");
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    async function verifyToken() {
      try {
        const res = await fetch("/api/affiliate/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (res.ok) {
          const data = await res.json();
          setReferralCode(data.referralCode);
          setEmail(data.email);
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        setStatus("error");
      }
    }

    verifyToken();
  }, [token]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-bg text-fg flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 text-accent">
              <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m0 0h6m0-6v6m0 0v6" />
              </svg>
            </div>
          </div>
          <h2 className="font-serif text-2xl font-light mb-2">Verifying...</h2>
          <p className="text-fg-soft">Please wait while we verify your email.</p>
        </div>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="min-h-screen bg-bg text-fg flex items-center justify-center">
        <div className="text-center max-w-xl">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h2 className="font-serif text-2xl font-light mb-2">Invalid Link</h2>
          <p className="text-fg-soft mb-6">
            The verification link is missing or invalid. Please try signing up again.
          </p>
          <Link href="/affiliate/signup" className="btn-primary">
            Back to Signup
          </Link>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-bg text-fg flex items-center justify-center">
        <div className="text-center max-w-xl">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h2 className="font-serif text-2xl font-light mb-2">
            Verification Failed
          </h2>
          <p className="text-fg-soft mb-6">
            This link may have expired or been used already. Please request a new
            verification email or contact support.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/affiliate/signup" className="btn-primary">
              Try Again
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-fg/20 rounded-[var(--radius)] text-sm uppercase tracking-[0.18em] hover:bg-bg-soft"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-fg flex items-center justify-center py-12">
      <div className="container-lux max-w-xl text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-600 mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="font-serif text-4xl font-light mb-4">Welcome to Precise Fumes Affiliates!</h1>
        <p className="text-lg text-fg-soft mb-8">
          Your email has been verified. You're all set to start earning commissions.
        </p>

        {/* Your Code */}
        <div className="bg-bg-soft p-8 rounded-[var(--radius)] mb-12">
          <p className="pf-eyebrow mb-3">Your Unique Bonus Code</p>
          <div className="mb-4 p-4 bg-bg rounded-[var(--radius)] border-2 border-accent">
            <p className="font-serif text-3xl tracking-widest">{referralCode}</p>
          </div>
          <p className="text-sm text-fg-soft mb-4">
            Share this code with friends and followers to earn PKR 300 per sale.
          </p>
          <button
            onClick={() => {
              if (referralCode) {
                navigator.clipboard.writeText(referralCode);
                alert("Code copied to clipboard!");
              }
            }}
            className="text-sm text-accent hover:underline font-medium"
          >
            Copy to Clipboard
          </button>
        </div>

        {/* What to Do Next */}
        <div className="bg-bg-soft p-8 rounded-[var(--radius)] text-left mb-12">
          <h2 className="font-serif text-2xl font-light mb-6">What's Next?</h2>
          <ol className="space-y-4 text-sm text-fg-soft">
            <li className="flex gap-4">
              <span className="font-serif text-lg text-accent flex-shrink-0">1.</span>
              <div>
                <p className="font-medium text-fg">Share Your Code</p>
                <p>Tell your network about Precise Fumes and share your unique code.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-serif text-lg text-accent flex-shrink-0">2.</span>
              <div>
                <p className="font-medium text-fg">Get Referrals</p>
                <p>When people use your code at checkout, they get PKR 2,500 pricing on single scents.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-serif text-lg text-accent flex-shrink-0">3.</span>
              <div>
                <p className="font-medium text-fg">Earn Commissions</p>
                <p>Receive PKR 300 for every purchase made with your code.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-serif text-lg text-accent flex-shrink-0">4.</span>
              <div>
                <p className="font-medium text-fg">Track & Withdraw</p>
                <p>Monitor your earnings in your dashboard and request payouts anytime.</p>
              </div>
            </li>
          </ol>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop" className="btn-primary">
            Explore Fragrances
          </Link>
          <Link
            href="/affiliate/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 border border-accent text-accent rounded-[var(--radius)] text-sm uppercase tracking-[0.18em] hover:bg-bg-soft transition-colors"
          >
            View Dashboard
          </Link>
        </div>

        <p className="mt-12 text-xs text-fg-faint">
          Email: {email}
          <br />
          Need help? <Link href="/contact" className="link-underline">Contact support</Link>
        </p>
      </div>
    </div>
  );
}
