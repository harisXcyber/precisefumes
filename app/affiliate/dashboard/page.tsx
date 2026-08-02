"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

interface AffiliateSession {
  email: string;
  name?: string;
  code: string;
  status?: string;
}

interface AffiliateStats {
  code?: string;
  status?: string;
  totals: { earned: number; pending: number; inProgress?: number; sales: number };
  orders: {
    order_ref: string;
    commission: number;
    status: string;
    created_at: string;
  }[];
  note?: string;
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
    const password = String(formData.get("password") ?? "");

    try {
      const res = await fetch("/api/affiliate/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        onSignIn({
          email: data.email,
          code: data.code,
          name: data.name,
          status: data.status,
        });
      } else {
        setError(data.error ?? "Incorrect email or password.");
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
          <h1 className="mt-3 text-center font-serif text-4xl font-normal md:text-5xl">
            Sign In
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-center text-sm leading-relaxed text-fg-soft">
            Sign in with the email and password you used when joining the
            affiliate program.
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
              <label htmlFor="password" className="pf-label mb-2 block">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                autoComplete="current-password"
                className="w-full"
                placeholder="Your password"
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
  const [live, setLive] = useState<AffiliateStats | null>(null);

  // ── Email verification (6-digit code) ─────────────────
  const [localStatus, setLocalStatus] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState("");
  const [otpBusy, setOtpBusy] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [otpMsg, setOtpMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Tick the resend cooldown down once a second.
  useEffect(() => {
    if (resendIn <= 0) return;
    const id = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [resendIn]);

  const status = localStatus ?? live?.status ?? session.status ?? "active";
  const verified = status === "active";

  function persistSession(patch: Partial<AffiliateSession>) {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      const s = raw ? JSON.parse(raw) : session;
      localStorage.setItem(SESSION_KEY, JSON.stringify({ ...s, ...patch }));
    } catch {}
  }

  async function verifyEmail() {
    setOtpBusy(true);
    setOtpMsg(null);
    try {
      const res = await fetch("/api/affiliate/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.email, code: otpInput }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setLocalStatus("active");
        persistSession({ status: "active" });
        setOtpMsg({
          type: "success",
          text: "Email verified — your promo code is LIVE! 🎉",
        });
      } else {
        setOtpMsg({
          type: "error",
          text: data.error || "That code is wrong or expired.",
        });
      }
    } catch {
      setOtpMsg({ type: "error", text: "Network error — try again." });
    } finally {
      setOtpBusy(false);
    }
  }

  async function resendCode() {
    setOtpBusy(true);
    setOtpMsg(null);
    try {
      const res = await fetch("/api/affiliate/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.email }),
      });
      const data = await res.json();
      if (res.ok) {
        setResendIn(120);
        setOtpMsg({
          type: "success",
          text: "Fresh code sent — check your inbox (and spam folder).",
        });
      } else if (data.cooldown) {
        setResendIn(Number(data.cooldown));
        setOtpMsg({
          type: "error",
          text: `Please wait ${data.cooldown}s before resending.`,
        });
      } else {
        setOtpMsg({ type: "error", text: data.error || "Could not resend." });
      }
    } catch {
      setOtpMsg({ type: "error", text: "Network error — try again." });
    } finally {
      setOtpBusy(false);
    }
  }

  useEffect(() => {
    fetch("/api/affiliate/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session.email }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) return;
        setLive(d);
        // Self-heal stale cached values (regenerated code, or a status
        // that changed since last login).
        try {
          const raw = localStorage.getItem(SESSION_KEY);
          const s = raw ? JSON.parse(raw) : session;
          localStorage.setItem(
            SESSION_KEY,
            JSON.stringify({
              ...s,
              ...(d.code ? { code: d.code } : {}),
              ...(d.status ? { status: d.status } : {}),
            })
          );
        } catch {}
      })
      .catch(() => {});
  }, [session.email, session.code]);

  // Always show the live code when we have it; fall back to the cached one.
  const code = live?.code ?? session.code;

  const totals = live?.totals ?? {
    earned: 0,
    pending: 0,
    inProgress: 0,
    sales: 0,
  };
  const stats = [
    {
      label: "Total Earned",
      value: `PKR ${totals.earned.toLocaleString()}`,
      hint: "Paid out to you",
    },
    {
      label: "Pending Payout",
      value: `PKR ${totals.pending.toLocaleString()}`,
      hint: "Delivered — awaiting payout",
    },
    {
      label: "In Progress",
      value: `PKR ${(totals.inProgress ?? 0).toLocaleString()}`,
      hint: "Ordered — not delivered yet",
    },
    {
      label: "Sales",
      value: String(totals.sales),
      hint: "Orders with your code",
    },
  ];

  return (
    <div className="min-h-screen bg-bg text-fg">
      <div className="container-lux pt-32 pb-16 md:pt-36 md:pb-24">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="pf-eyebrow">Affiliate Dashboard</p>
            <h1 className="mt-2 font-serif text-4xl font-normal md:text-5xl">
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

        {/* ── Verification gate — impossible to miss ─────── */}
        {!verified && (
          <div className="mb-10 rounded-[var(--radius-lg)] border-2 border-accent-rose/50 bg-accent-rose/10 p-6 text-center md:p-10">
            <p className="font-serif text-3xl leading-tight md:text-5xl">
              ⚠ Your code won&apos;t work yet
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-fg-soft">
              Verify your email first. We sent a{" "}
              <strong className="text-fg">6-digit code</strong> to{" "}
              <strong className="text-fg">{session.email}</strong> — enter it
              below to activate your promo code. The code expires in 30
              minutes.
            </p>
            <div className="mx-auto mt-6 flex max-w-sm flex-col gap-3 sm:flex-row">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                placeholder="6-digit code"
                className="w-full text-center text-lg tracking-[0.4em]"
              />
              <button
                onClick={verifyEmail}
                disabled={otpBusy || otpInput.length !== 6}
                className="btn-primary shrink-0 justify-center disabled:opacity-50"
              >
                {otpBusy ? "…" : "Verify"}
              </button>
            </div>
            <button
              onClick={resendCode}
              disabled={otpBusy || resendIn > 0}
              className="mt-4 text-xs uppercase tracking-[0.14em] text-fg-soft underline-offset-4 hover:text-fg hover:underline disabled:opacity-50"
            >
              {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
            </button>
            {otpMsg && (
              <p
                className={`mt-3 text-sm font-medium ${
                  otpMsg.type === "error" ? "text-accent-rose" : "text-[#1a8a4a]"
                }`}
              >
                {otpMsg.text}
              </p>
            )}
          </div>
        )}
        {verified && otpMsg?.type === "success" && (
          <p className="mb-8 rounded-[var(--radius)] border border-[#1a8a4a]/30 bg-[#1a8a4a]/10 p-4 text-center text-sm font-medium text-[#1a8a4a]">
            {otpMsg.text}
          </p>
        )}

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
              <h2 className="font-serif text-2xl font-normal">
                Your Promo Code
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-fg-soft">
                Share it anywhere. Customers pay PKR 2,500 instead of PKR 3,000
                on single perfumes — you earn PKR 300 per sale.
              </p>
              <div
                className={`mt-5 rounded-[var(--radius-lg)] border-2 bg-bg p-5 md:p-6 ${
                  verified ? "border-accent" : "border-accent-rose/50"
                }`}
              >
                {!verified && (
                  <p className="mb-3 rounded-full bg-accent-rose/15 px-4 py-1.5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-accent-rose">
                    Inactive — verify your email first
                  </p>
                )}
                <p
                  className={`break-all text-center font-serif text-4xl tracking-[0.2em] md:text-5xl ${
                    verified ? "" : "opacity-40"
                  }`}
                >
                  {code}
                </p>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(code);
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
                    `Luxury perfumes at PKR 2,500 instead of 3,000 — use my code ${code} at precisefumes.com 🌟`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Share on WhatsApp
                </a>
              </div>
            </section>

            <section className="rounded-[var(--radius-lg)] border border-border p-6 md:p-8">
              <h2 className="font-serif text-2xl font-normal">Your Sales</h2>
              {live && live.orders.length > 0 ? (
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[26rem] text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="pf-label py-3">Date</th>
                        <th className="pf-label py-3">Order</th>
                        <th className="pf-label py-3 text-right">Commission</th>
                        <th className="pf-label py-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {live.orders.map((o) => (
                        <tr
                          key={o.order_ref}
                          className="border-b border-border text-fg-soft"
                        >
                          <td className="py-3">
                            {new Date(o.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3">{o.order_ref}</td>
                          <td className="py-3 text-right">
                            PKR {o.commission}
                          </td>
                          <td className="py-3 text-right capitalize">
                            {o.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="mt-6 rounded-[var(--radius)] bg-bg-soft p-8 text-center">
                  <p className="font-serif text-xl">No sales yet</p>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-fg-soft">
                    Every order placed with code{" "}
                    <strong className="text-fg">{code}</strong> will
                    appear here with its PKR 300 commission.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Side */}
          <div className="space-y-6">
            <section className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-6">
              <h3 className="font-serif text-lg font-normal">Account</h3>
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
              <h3 className="font-serif text-lg font-normal">Payouts</h3>
              <p className="mt-3 text-sm leading-relaxed text-fg-soft">
                Commissions are paid to your EasyPaisa or JazzCash once
                confirmed. Minimum payout PKR 900 (3 sales).
              </p>
            </section>

            <section className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-6">
              <h3 className="font-serif text-lg font-normal">Need Help?</h3>
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
