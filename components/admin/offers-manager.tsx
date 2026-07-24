"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* eslint-disable @typescript-eslint/no-explicit-any */

function daysFromNowIso(days: number) {
  return new Date(Date.now() + days * 86400_000).toISOString();
}
function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  // yyyy-MM-ddThh:mm for datetime-local
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
}
function fromLocalInput(v: string) {
  return v ? new Date(v).toISOString() : null;
}
function timeLeft(iso: string | null) {
  if (!iso) return "No end date";
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "Expired";
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  return `${d}d ${h}h left`;
}

export function OffersManager({ offers }: { offers: any[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(offers);
  const [busy, setBusy] = useState<string | null>(null);

  async function patch(id: string, body: any) {
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/offers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setRows((prev) =>
          prev.map((o) =>
            o.id === id
              ? {
                  ...o,
                  ...("active" in body ? { active: body.active } : {}),
                  ...("endsAt" in body ? { ends_at: body.endsAt } : {}),
                  ...("title" in body ? { title: body.title } : {}),
                  ...("description" in body
                    ? { description: body.description }
                    : {}),
                  ...("badge" in body ? { badge: body.badge } : {}),
                }
              : o
          )
        );
      }
    } finally {
      setBusy(null);
    }
  }

  async function remove(o: any) {
    const isBuiltIn = !!o.offer_key;
    const msg = isBuiltIn
      ? `Pause "${o.title}"? It will stop applying at checkout until you re-activate it.`
      : `Delete "${o.title}"?`;
    if (!confirm(msg)) return;
    const res = await fetch(`/api/admin/offers/${o.id}`, { method: "DELETE" });
    if (res.ok) {
      if (isBuiltIn) {
        setRows((prev) =>
          prev.map((r) => (r.id === o.id ? { ...r, active: false } : r))
        );
      } else {
        setRows((prev) => prev.filter((r) => r.id !== o.id));
      }
    }
  }

  async function addOffer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = {
      title: fd.get("title"),
      description: fd.get("description"),
      badge: fd.get("badge"),
      endsAt: fromLocalInput(String(fd.get("endsAt") || "")),
    };
    const res = await fetch("/api/admin/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      (e.target as HTMLFormElement).reset();
      router.refresh();
    }
  }

  return (
    <div className="space-y-8">
      {/* Existing offers */}
      <div className="space-y-4">
        {rows.map((o) => {
          const expired = o.ends_at && new Date(o.ends_at).getTime() <= Date.now();
          const liveNow = o.active && !expired;
          return (
            <div
              key={o.id}
              className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-5 md:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-xl">{o.title}</h3>
                    {o.offer_key && (
                      <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent-deep">
                        Pricing offer
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                        liveNow
                          ? "bg-green-500/15 text-green-700"
                          : "bg-accent-rose/15 text-accent-rose"
                      }`}
                    >
                      {liveNow ? "Live" : expired ? "Expired" : "Paused"}
                    </span>
                  </div>
                  {o.description && (
                    <p className="mt-1 max-w-lg text-sm text-fg-soft">
                      {o.description}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-fg-faint">
                    {timeLeft(o.ends_at)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    disabled={busy === o.id}
                    onClick={() => patch(o.id, { active: !o.active })}
                    className="rounded-full border border-border px-3 py-1.5 text-xs hover:border-accent disabled:opacity-40"
                  >
                    {o.active ? "Pause" : "Activate"}
                  </button>
                  <button
                    disabled={busy === o.id}
                    onClick={() => patch(o.id, { endsAt: daysFromNowIso(7) })}
                    className="rounded-full border border-border px-3 py-1.5 text-xs hover:border-accent disabled:opacity-40"
                  >
                    Extend 7 days
                  </button>
                  <button
                    onClick={() => remove(o)}
                    className="rounded-full border border-accent-rose/40 px-3 py-1.5 text-xs text-accent-rose hover:bg-accent-rose/10"
                  >
                    {o.offer_key ? "Pause" : "Delete"}
                  </button>
                </div>
              </div>

              {/* End-date editor */}
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4">
                <label className="text-xs uppercase tracking-wider text-fg-faint">
                  Ends
                </label>
                <input
                  type="datetime-local"
                  defaultValue={toLocalInput(o.ends_at)}
                  onBlur={(e) =>
                    patch(o.id, { endsAt: fromLocalInput(e.target.value) })
                  }
                  className="text-sm"
                />
                <span className="text-xs text-fg-soft">
                  Leave empty for no end date. Changes save on blur.
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add promotional offer */}
      <form
        onSubmit={addOffer}
        className="rounded-[var(--radius-lg)] border border-border p-5 md:p-6"
      >
        <h2 className="mb-4 font-serif text-xl font-normal">
          Add a promotional offer
        </h2>
        <p className="mb-4 text-xs text-fg-soft">
          These show on the site with a countdown (announcements, seasonal
          promos). Cart pricing is driven only by the two built-in offers above.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="pf-label mb-2 block">Title</label>
            <input name="title" required className="w-full" placeholder="Eid Special" />
          </div>
          <div>
            <label className="pf-label mb-2 block">Badge (short)</label>
            <input name="badge" className="w-full" placeholder="Eid Sale" />
          </div>
          <div className="md:col-span-2">
            <label className="pf-label mb-2 block">Description</label>
            <input
              name="description"
              className="w-full"
              placeholder="Free gift with every order this Eid."
            />
          </div>
          <div>
            <label className="pf-label mb-2 block">Ends (optional)</label>
            <input type="datetime-local" name="endsAt" className="w-full" />
          </div>
        </div>
        <button type="submit" className="btn-primary mt-5">
          Add offer
        </button>
      </form>
    </div>
  );
}
