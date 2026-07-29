"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function AffiliatesTable({ affiliates }: { affiliates: any[] }) {
  const [rows, setRows] = useState(affiliates);
  const [busy, setBusy] = useState<string | null>(null);

  // ── Create a direct promo code (super-admin) ──────────
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [paysCommission, setPaysCommission] = useState(true);
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const cleanCode = newCode.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 16);

  async function createCode() {
    setCreating(true);
    setCreateMsg(null);
    try {
      const res = await fetch("/api/admin/affiliates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: cleanCode,
          name: newName,
          phone: newPhone,
          paysCommission,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateMsg({ type: "error", text: data.error || "Could not create." });
        return;
      }
      setRows((prev) => [
        {
          id: data.id,
          name: newName,
          email: `code.${data.code.toLowerCase()}@admin.precisefumes.com`,
          referral_code: data.code,
          status: "active",
          source: "admin",
          commission: data.commission,
          bank_method: "admin",
          bank_phone: newPhone || "—",
          bank_account_name: newName,
          sales: 0,
          pending: 0,
          owed: 0,
          paid: 0,
        },
        ...prev,
      ]);
      setCreateMsg({
        type: "success",
        text: `Code ${data.code} is live — it works at checkout right now${
          data.commission ? " and earns PKR 300 per sale" : " (discount-only)"
        }.`,
      });
      setNewCode("");
      setNewName("");
      setNewPhone("");
      setPaysCommission(true);
    } catch {
      setCreateMsg({ type: "error", text: "Network error — try again." });
    } finally {
      setCreating(false);
    }
  }

  /** Pause / re-activate a code (admin-created ones). */
  async function setStatus(id: string, status: "active" | "inactive") {
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/affiliates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setStatus", status }),
      });
      if (res.ok) {
        setRows((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status } : a))
        );
      }
    } finally {
      setBusy(null);
    }
  }

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

  const activeCodes = rows.filter((a) => a.status === "active");

  const createPanel = (
    <div className="rounded-[var(--radius-lg)] border border-accent/40 bg-accent/5 p-5">
      <p className="pf-eyebrow mb-1">Create a promo code directly</p>
      <p className="mb-4 text-xs text-fg-soft">
        For special people — no signup, no verification, no account. Type the
        exact code, hit create, and it works at checkout immediately (PKR 2,500
        single-perfume pricing for their customers).
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="pf-label mb-1.5 block">Code</label>
          <input
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            placeholder="e.g. HARIS10"
            className="w-full uppercase tracking-wider"
          />
          {cleanCode && cleanCode !== newCode && (
            <p className="mt-1 text-[11px] text-fg-faint">
              Will be saved as: <strong>{cleanCode}</strong>
            </p>
          )}
        </div>
        <div>
          <label className="pf-label mb-1.5 block">Whose code (name)</label>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Precise Fumes"
            className="w-full"
          />
        </div>
        <div>
          <label className="pf-label mb-1.5 block">
            Phone <span className="text-fg-faint">(optional)</span>
          </label>
          <input
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            placeholder="03XX XXXXXXX"
            className="w-full"
          />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-fg-soft">
          <input
            type="checkbox"
            checked={paysCommission}
            onChange={(e) => setPaysCommission(e.target.checked)}
            className="h-4 w-4 accent-[var(--pf-accent,#c99a4e)]"
          />
          Pays PKR 300 commission per sale
        </label>
        <button
          onClick={createCode}
          disabled={creating || cleanCode.length < 2 || !newName.trim()}
          className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-on-accent transition-transform hover:scale-[1.02] disabled:opacity-50"
        >
          {creating ? "Creating…" : "Create code"}
        </button>
      </div>
      {createMsg && (
        <p
          className={`mt-3 text-sm ${
            createMsg.type === "error" ? "text-accent-rose" : "text-[#1a8a4a]"
          }`}
        >
          {createMsg.text}
        </p>
      )}
    </div>
  );

  if (rows.length === 0) {
    return (
      <div className="space-y-6">
        {createPanel}
        <p className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-10 text-center text-sm text-fg-soft">
          No affiliates yet. Signups from /affiliate/signup appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {createPanel}

      {/* Active promo codes summary */}
      <div className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-5">
        <p className="pf-eyebrow mb-3">
          Active promo codes ({activeCodes.length})
        </p>
        {activeCodes.length === 0 ? (
          <p className="text-sm text-fg-soft">
            No active codes yet — affiliates appear here once they verify their
            email.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {activeCodes.map((a) => (
              <span
                key={a.id}
                title={`${a.name} · ${a.sales} sales`}
                className="rounded-full border border-accent bg-accent/10 px-3 py-1.5 text-sm font-medium tracking-wider text-accent-deep"
              >
                {a.referral_code}
              </span>
            ))}
          </div>
        )}
        <p className="mt-3 text-xs text-fg-faint">
          These give customers PKR 2,500 single-perfume pricing and earn the
          affiliate PKR 300 per sale. Unverified codes don&apos;t work until the
          affiliate confirms their email.
        </p>
      </div>

      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-border">
      <table className="w-full min-w-[48rem] text-sm">
        <thead className="bg-bg-soft">
          <tr className="text-left">
            <th className="pf-label p-3">Affiliate</th>
            <th className="pf-label p-3">Code</th>
            <th className="pf-label p-3">Pay to</th>
            <th className="pf-label p-3 text-right">Sales</th>
            <th className="pf-label p-3 text-right">Pipeline</th>
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
                {a.source === "admin" ? (
                  <span className="mt-1 block">
                    <span className="inline-block rounded-full bg-accent-violet/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent-violet">
                      Direct code
                    </span>
                    {a.commission === 0 && (
                      <span className="ml-1 inline-block rounded-full bg-bg-elevated px-2 py-0.5 text-[10px] uppercase tracking-wider text-fg-faint">
                        No commission
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="block text-xs text-fg-soft">{a.email}</span>
                )}
                {a.status === "pending_verification" && (
                  <span className="mt-1 inline-block rounded-full bg-accent/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent-deep">
                    Unverified
                  </span>
                )}
                {a.status === "inactive" && (
                  <span className="mt-1 inline-block rounded-full bg-accent-rose/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent-rose">
                    Paused
                  </span>
                )}
              </td>
              <td className="p-3 font-medium tracking-wider">
                {a.referral_code}
              </td>
              <td className="p-3 text-fg-soft">
                {a.source === "admin" ? (
                  <>
                    <span className="text-xs">Created by you</span>
                    {a.bank_phone !== "—" && (
                      <span className="block text-xs">{a.bank_phone}</span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="capitalize">{a.bank_method}</span>
                    <span className="block text-xs">{a.bank_phone}</span>
                    <span className="block text-xs">{a.bank_account_name}</span>
                  </>
                )}
              </td>
              <td className="p-3 text-right tabular-nums">{a.sales}</td>
              <td
                className="p-3 text-right tabular-nums text-fg-faint"
                title="Sales made but not yet delivered — cash not received, so not owed yet"
              >
                {formatPrice(a.pending ?? 0)}
              </td>
              <td className="p-3 text-right tabular-nums font-medium">
                {formatPrice(a.owed)}
              </td>
              <td className="p-3 text-right tabular-nums text-fg-soft">
                {formatPrice(a.paid)}
              </td>
              <td className="p-3 text-right">
                <span className="inline-flex gap-1.5">
                  {a.owed > 0 && (
                    <button
                      onClick={() => markPaid(a.id)}
                      disabled={busy === a.id}
                      className="rounded-full border border-accent px-3 py-1.5 text-xs uppercase tracking-wider text-accent-deep transition-colors hover:bg-accent hover:text-on-accent disabled:opacity-50"
                    >
                      {busy === a.id ? "…" : "Mark paid"}
                    </button>
                  )}
                  {a.source === "admin" &&
                    (a.status === "active" ? (
                      <button
                        onClick={() => setStatus(a.id, "inactive")}
                        disabled={busy === a.id}
                        className="rounded-full border border-border px-3 py-1.5 text-xs uppercase tracking-wider text-fg-soft transition-colors hover:border-accent-rose hover:text-accent-rose disabled:opacity-50"
                      >
                        Pause
                      </button>
                    ) : (
                      <button
                        onClick={() => setStatus(a.id, "active")}
                        disabled={busy === a.id}
                        className="rounded-full border border-border px-3 py-1.5 text-xs uppercase tracking-wider text-fg-soft transition-colors hover:border-accent hover:text-accent-deep disabled:opacity-50"
                      >
                        Activate
                      </button>
                    ))}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <p className="text-xs leading-relaxed text-fg-faint">
        <strong className="text-fg-soft">Pipeline</strong> = sales made but the
        order isn&apos;t delivered yet — no cash collected, so nothing is owed.{" "}
        <strong className="text-fg-soft">Owed</strong> counts only once you mark
        the order <strong>delivered</strong> (COD cash received). Cancelling an
        order removes its commission. &ldquo;Mark paid&rdquo; only pays out
        what&apos;s owed.
      </p>
    </div>
  );
}
