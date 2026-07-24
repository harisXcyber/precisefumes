"use client";

import { FormEvent, useState } from "react";

export function AdminLogin() {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const password = String(
      new FormData(e.currentTarget).get("password") ?? ""
    );
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        setError(data.error ?? "Incorrect password.");
      }
    } catch {
      setError("Could not sign in. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-5 text-fg">
      <div className="w-full max-w-sm">
        <p className="pf-eyebrow text-center">Precise Fumes</p>
        <h1 className="mt-3 text-center font-serif text-4xl font-normal">
          Admin
        </h1>
        <p className="mt-3 text-center text-sm text-fg-soft">
          Enter the admin password to manage orders and products.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-[var(--radius-lg)] border border-border bg-bg-soft p-6"
        >
          <div>
            <label htmlFor="password" className="pf-label mb-2 block">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              autoFocus
              autoComplete="current-password"
              className="w-full"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-xs text-accent-rose">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="btn-primary w-full justify-center disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
