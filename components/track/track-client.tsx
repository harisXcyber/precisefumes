"use client";

import { useState } from "react";

interface TrackResult {
  ref: string;
  status: string;
  placedAt: string;
  items: { name: string; size: string; quantity: number }[];
  city: string;
  total: number;
  courier: string | null;
  tracking: string | null;
  trackingStatus: string | null;
  estimate: string;
}

const STEPS = ["Confirmed", "Shipped", "Delivered"] as const;

function stepIndex(status: string): number {
  if (status === "delivered") return 2;
  if (status === "shipped") return 1;
  if (status === "cancelled") return -1;
  return 0;
}

export function TrackClient() {
  const [ref, setRef] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TrackResult | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref: ref.trim(), contact: contact.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setResult(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const step = result ? stepIndex(result.status) : 0;
  const cancelled = result?.status === "cancelled";

  return (
    <div className="mx-auto max-w-xl">
      <form
        onSubmit={onSubmit}
        className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-6 md:p-8"
      >
        <div className="space-y-4">
          <div>
            <label className="pf-label mb-1.5 block" htmlFor="ref">
              Order number
            </label>
            <input
              id="ref"
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              placeholder="e.g. PF-3A9K2"
              required
              className="w-full rounded-[var(--radius)] border border-border bg-bg px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="pf-label mb-1.5 block" htmlFor="contact">
              Phone or email used at checkout
            </label>
            <input
              id="contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="03XX XXXXXXX or you@email.com"
              required
              className="w-full rounded-[var(--radius)] border border-border bg-bg px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60"
          >
            {loading ? "Checking…" : "Track my order"}
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-5 rounded-[var(--radius)] border border-accent-rose/30 bg-accent-rose/10 px-4 py-3 text-sm text-accent-rose">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-6 rounded-[var(--radius-lg)] border border-border bg-bg p-6 md:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="pf-eyebrow">Order</p>
              <p className="font-serif text-2xl">{result.ref}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs capitalize ${
                cancelled
                  ? "bg-accent-rose/15 text-accent-rose"
                  : "bg-accent/15 text-accent-deep"
              }`}
            >
              {result.status}
            </span>
          </div>

          {/* Timeline */}
          {cancelled ? (
            <p className="mt-6 rounded-[var(--radius)] bg-bg-soft p-4 text-sm text-fg-soft">
              This order was cancelled. If that&apos;s a mistake, message us on
              WhatsApp and we&apos;ll sort it out.
            </p>
          ) : (
            <div className="mt-7 flex items-center">
              {STEPS.map((label, i) => (
                <div key={label} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                        i <= step
                          ? "bg-accent text-on-accent"
                          : "border border-border bg-bg text-fg-faint"
                      }`}
                    >
                      {i < step ? "✓" : i + 1}
                    </span>
                    <span
                      className={`mt-2 text-[11px] uppercase tracking-[0.12em] ${
                        i <= step ? "text-fg" : "text-fg-faint"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`mx-1 h-0.5 flex-1 ${
                        i < step ? "bg-accent" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Courier tracking */}
          {result.tracking && (
            <div className="mt-6 rounded-[var(--radius)] border border-border bg-bg-soft p-4">
              <p className="pf-eyebrow mb-1">
                {result.courier ? `${result.courier} tracking` : "Courier tracking"}
              </p>
              <p className="font-mono text-sm">#{result.tracking}</p>
              {result.trackingStatus && (
                <p className="mt-1 text-sm text-accent-deep">
                  {result.trackingStatus}
                </p>
              )}
              <a
                href={`https://oshicourier.pk/tracking?trackingno=${result.tracking}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-accent-deep underline underline-offset-2"
              >
                View detailed tracking ↗
              </a>
            </div>
          )}

          {/* Summary */}
          <div className="mt-6 space-y-1 border-t border-border pt-4 text-sm">
            <p className="text-fg-soft">
              <span className="text-fg-faint">Items: </span>
              {result.items
                .map(
                  (it) => `${it.name}${it.quantity > 1 ? ` ×${it.quantity}` : ""}`
                )
                .join(", ")}
            </p>
            <p className="text-fg-soft">
              <span className="text-fg-faint">Deliver to: </span>
              {result.city}
            </p>
            <p className="text-fg-soft">
              <span className="text-fg-faint">Total (COD): </span>
              PKR {result.total.toLocaleString("en-PK")}
            </p>
            <p className="text-fg-soft">
              <span className="text-fg-faint">Estimated: </span>
              {result.estimate}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
