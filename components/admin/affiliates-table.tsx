"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function AffiliatesTable({ affiliates }: { affiliates: any[] }) {
  const [rows, setRows] = useState(affiliates);
  const [busy, setBusy] = useState<string | null>(null);

  async function markPaid(id: string) {
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/affiliates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markPaid" }),
      });
      if (res.ok) {
        setRows((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, paid: a.paid + a.owed, owed: 0 } : a
          )
        );
      }
    } finally {
      setBusy(null);
    }
  }

  if (rows.length === 0) {
    return (
      <p className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-10 text-center text-sm text-fg-soft">
        No affiliates yet. Signups from /affiliate/signup appear here.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-border">
      <table className="w-full min-w-[48rem] text-sm">
        <thead className="bg-bg-soft">
          <tr className="text-left">
            <th className="pf-label p-3">Affiliate</th>
            <th className="pf-label p-3">Code</th>
            <th className="pf-label p-3">Pay to</th>
            <th className="pf-label p-3 text-right">Sales</th>
            <th className="pf-label p-3 text-right">Owed</th>
            <th className="pf-label p-3 text-right">Paid</th>
            <th className="pf-label p-3"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => (
            <tr key={a.id} className="border-t border-border">
              <td className="p-3">
                {a.name}
                <span className="block text-xs text-fg-soft">{a.email}</span>
                {a.status !== "active" && (
                  <span className="mt-1 inline-block rounded-full bg-accent/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent-deep">
                    Unverified
                  </span>
                )}
              </td>
              <td className="p-3 font-medium tracking-wider">
                {a.referral_code}
              </td>
              <td className="p-3 text-fg-soft">
                <span className="capitalize">{a.bank_method}</span>
                <span className="block text-xs">{a.bank_phone}</span>
                <span className="block text-xs">{a.bank_account_name}</span>
              </td>
              <td className="p-3 text-right tabular-nums">{a.sales}</td>
              <td className="p-3 text-right tabular-nums font-medium">
                {formatPrice(a.owed)}
              </td>
              <td className="p-3 text-right tabular-nums text-fg-soft">
                {formatPrice(a.paid)}
              </td>
              <td className="p-3 text-right">
                {a.owed > 0 && (
                  <button
                    onClick={() => markPaid(a.id)}
                    disabled={busy === a.id}
                    className="rounded-full border border-accent px-3 py-1.5 text-xs uppercase tracking-wider text-accent-deep transition-colors hover:bg-accent hover:text-on-accent disabled:opacity-50"
                  >
                    {busy === a.id ? "…" : "Mark paid"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
