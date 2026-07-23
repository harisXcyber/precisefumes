"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

interface AffiliateSession {
  email: string;
  name?: string;
  code: string;
}

const SESSION_KEY = "pf-affiliate-session";

export default function AffiliateDashboard() {
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<AffiliateSession | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setSession(JSON.parse(raw));
    } catch {}
    setMounted(true);
  }, []);

  function signIn(s: AffiliateSession) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    setSession(s);
  }

  function signOut() {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-bg text-fg">
        <div className="container-lux pt-32 pb-16 text-center text-fg-soft">
          Loading…
        </div>
      </div>
    );
  }

  return session ? (
    <Dashboard session={session} onSignOut={signOut} />
  ) : (
    <SignIn onSignIn={signIn} />
  );
}

/* ── Sign-in gate ─────────────────────────────────────────── */

function SignIn({ onSignIn }: { onSignIn: (s: AffiliateSession) => void }) {
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setChecking(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const code = String(formData.get("code") ?? "")
      .trim()
      .toUpperCase();

    try {
      const res = await fetch("/api/affiliate/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        onSignIn({ email, code });
      } else {
        setError(
          "That code doesn't match our records. Use the bonus code from your verification email."
        );
      }
    } catch {
      setError("Could not sign you in. Please try again.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      <div className="container-lux flex flex-col items-center pt-32 pb-24 md:pt-40">
        <div className="w-full max-w-md">
          <p className="pf-eyebrow text-center">Affiliate Area</p>
          <h1 className="mt-3 text-center font-serif text-4xl font-light md:text-5xl">
            Sign In
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-center text-sm leading-relaxed text-fg-soft">
            Enter the email you signed up with and your bonus code — it was
            shown when you verified your email.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-4 rounded-[var(--radius-lg)] border border-border bg-bg-soft p-6 md:p-8"
          >
            <div>
              <label htmlFor="email" className="pf-label mb-2 block">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                autoComplete="email"
                className="w-full"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label htmlFor="code" className="pf-label mb-2 block">
                Your Bonus Code
              </label>
              <input
                type="text"
                id="code"
                name="code"
                required
                className="w-full uppercase"
                placeholder="e.g. ROGUE4X"
                autoCapitalize="characters"
              />
            </div>

            {error && <p className="text-xs text-accent-rose">{error}</p>}

            <button
              type="submit"
              disabled={checking}
              className="btn-primary w-full justify-center disabled:opacity-60"
            >
              {checking ? "Signing In…" : "Open Dashboard"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-fg-soft">
            Not an affiliate yet?{" "}
            <Link
              href="/affiliate/signup"
              className="link-underline font-medium text-fg"
            >
              Join the program
            </Link>{" "}
            — earn PKR 300 per sale.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Dashboard (per-session; live stats arrive with Supabase) ── */

function Dashboard({
  session,
  onSignOut,
}: {
  session: AffiliateSession;
  onSignOut: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const stats = [
    { label: "Total Earned", value: "PKR 0", hint: "All-time commissions" },
    { label: "Pending Payout", value: "PKR 0", hint: "Available to withdraw" },
    { label: "Sales", value: "0", hint: "Orders with your code" },
    { label: "Per Sale", value: "PKR 300", hint: "Your commission rate" },
  ];

  return (
    <div className="min-h-screen bg-bg text-fg">
      <div className="container-lux pt-32 pb-16 md:pt-36 md:pb-24">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="pf-eyebrow">Affiliate Dashboard</p>
            <h1 className="mt-2 font-serif text-4xl font-light md:text-5xl">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-fg-soft">{session.email}</p>
          </div>
          <button
            onClick={onSignOut}
            className="self-start text-xs uppercase tracking-[0.14em] text-fg-soft underline-offset-4 hover:text-fg hover:underline sm:self-end"
          >
            Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-5 md:p-6"
            >
              <p className="pf-eyebrow">{s.label}</p>
              <p className="mt-3 font-serif text-2xl md:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs text-fg-soft">{s.hint}</p>
            </div>
          ))}
        </div>

        {/* Main */}
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Code + sales */}
          <div className="space-y-6 lg:col-span-2">
            <section className="pf-tint rounded-[var(--radius-lg)] border border-border bg-bg-soft p-6 md:p-8">
              <h2 className="font-serif text-2xl font-light">
                Your Bonus Code
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-fg-soft">
                Share it anywhere. Customers pay PKR 2,500 instead of PKR 3,000
                on single perfumes — you earn PKR 300 per sale.
              </p>
              <div className="mt-5 rounded-[var(--radius-lg)] border-2 border-accent bg-bg p-5 md:p-6">
                <p className="break-all text-center font-serif text-4xl tracking-[0.2em] md:text-5xl">
                  {session.code}
                </p>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(session.code);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="btn-primary flex-1 justify-center"
                >
                  {copied ? "✓ Copied!" : "Copy Code"}
                </button>
                <a
                  className="btn-ghost flex-1 justify-center"
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Luxury perfumes at PKR 2,500 instead of 3,000 — use my code ${session.code} at precisefumes.com 🌟`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Share on WhatsApp
                </a>
              </div>
            </section>

            <section className="rounded-[var(--radius-lg)] border border-border p-6 md:p-8">
              <h2 className="font-serif text-2xl font-light">Your Sales</h2>
              <div className="mt-6 rounded-[var(--radius)] bg-bg-soft p-8 text-center">
                <p className="font-serif text-xl">No sales yet</p>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-fg-soft">
                  Every order placed with code{" "}
                  <strong className="text-fg">{session.code}</strong> will
                  appear here with its PKR 300 commission.
                </p>
              </div>
            </section>
          </div>

          {/* Side */}
          <div className="space-y-6">
            <section className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-6">
              <h3 className="font-serif text-lg font-light">Account</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="pf-eyebrow">Email</dt>
                  <dd className="mt-0.5 break-all text-fg-soft">
                    {session.email}
                  </dd>
                </div>
                <div>
                  <dt className="pf-eyebrow">Payouts Via</dt>
                  <dd className="mt-0.5 text-fg-soft">
                    EasyPaisa / JazzCash (from your signup)
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-6">
              <h3 className="font-serif text-lg font-light">Payouts</h3>
              <p className="mt-3 text-sm leading-relaxed text-fg-soft">
                Commissions are paid to your EasyPaisa or JazzCash once
                confirmed. Minimum payout PKR 900 (3 sales).
              </p>
            </section>

            <section className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-6">
              <h3 className="font-serif text-lg font-light">Need Help?</h3>
              <Link
                href="/contact"
                className="mt-3 inline-block text-sm font-medium text-accent-deep hover:underline"
              >
                Contact Support →
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
