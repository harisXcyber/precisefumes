"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { toWaNumber } from "@/lib/contact";
import type { AdminOrder } from "@/lib/admin-data";

/** Pre-written WhatsApp order-confirmation message. */
function confirmationMessage(o: AdminOrder): string {
  const total = o.subtotal - o.discount + o.shipping_fee;
  const items = o.items
    .map((it) => `• ${it.name} (${it.size}) × ${it.quantity}`)
    .join("\n");
  const delivery =
    o.shipping_fee === 0
      ? "Free delivery (2–5 days)"
      : `Delivery PKR ${o.shipping_fee} (5–7 days)`;
  return `Assalam-o-Alaikum ${o.customer_name}! 🌸

Thank you for your order with *Precise Fumes*.

*Order ${o.ref}*
${items}

Total: *PKR ${total.toLocaleString("en-PK")}* (Cash on Delivery)
Deliver to: ${o.address}, ${o.city}
${delivery}

Please reply *YES* to confirm your order and we'll dispatch it right away. JazakAllah! 🖤`;
}

const STATUSES = [
  "new",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

const STATUS_STYLE: Record<string, string> = {
  new: "bg-accent/20 text-accent-deep",
  confirmed: "bg-accent-violet/20 text-accent-violet",
  shipped: "bg-accent-teal/20 text-accent-teal",
  delivered: "bg-green-500/15 text-green-700 dark:text-green-400",
  cancelled: "bg-accent-rose/20 text-accent-rose",
};

/** Couriers enabled on the Oshi account. */
const OSHI_COURIERS = [
  { id: "1", label: "TCS" },
  { id: "3", label: "Leopards" },
];

function courierName(id: string | null): string {
  return OSHI_COURIERS.find((c) => c.id === id)?.label ?? "Courier";
}

// Format timestamps in Pakistan time on both server and client so the
// pre-hydration HTML matches (avoids a hydration mismatch).
const TZ = "Asia/Karachi";
function placedDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TZ,
  });
}
function placedTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: TZ,
  });
}

/** A short "Rogue ×2, Legacy" summary for the list row. */
function itemsSummary(o: AdminOrder): string {
  return (
    o.items
      .map((it) => `${it.name}${it.quantity > 1 ? ` ×${it.quantity}` : ""}`)
      .join(", ") || "—"
  );
}

/** Group a customer's orders by phone (fallback email) to spot repeats. */
function custKey(o: AdminOrder): string {
  const phone = (o.customer_phone || "").replace(/\D/g, "").slice(-10);
  return phone || (o.customer_email || "").toLowerCase() || o.id;
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
}

export function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  const [rows, setRows] = useState(orders);
  const [openId, setOpenId] = useState<string | null>(null);
  const [archive, setArchive] = useState<"live" | "test">("live");
  const [filter, setFilter] = useState<string>("all");
  const [confFilter, setConfFilter] = useState<"all" | "sent" | "unsent">(
    "all"
  );
  const [saving, setSaving] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    setSaving(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          // COD is settled on delivery
          ...(status === "delivered" ? { paymentStatus: "paid" } : {}),
        }),
      });
      if (res.ok) {
        setRows((prev) =>
          prev.map((o) =>
            o.id === id
              ? {
                  ...o,
                  status,
                  payment_status:
                    status === "delivered" ? "paid" : o.payment_status,
                }
              : o
          )
        );
      }
    } finally {
      setSaving(null);
    }
  }

  /** Move an order into (or out of) the test archive. */
  async function toggleTest(o: AdminOrder) {
    setSaving(o.id);
    try {
      const res = await fetch(`/api/admin/orders/${o.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isTest: !o.is_test }),
      });
      if (res.ok) {
        setRows((prev) =>
          prev.map((r) => (r.id === o.id ? { ...r, is_test: !o.is_test } : r))
        );
        setOpenId(null); // it just moved archives — collapse it
      }
    } finally {
      setSaving(null);
    }
  }

  /** Open WhatsApp to the customer with the pre-written confirmation,
   *  and mark the order as confirmation-sent (→ status "confirmed"). */
  async function sendConfirmation(o: AdminOrder) {
    const wa = toWaNumber(o.customer_phone);
    if (wa) {
      window.open(
        `https://wa.me/${wa}?text=${encodeURIComponent(confirmationMessage(o))}`,
        "_blank",
        "noopener"
      );
    }
    // Record it even if the number was odd — the admin still acted.
    try {
      await fetch(`/api/admin/orders/${o.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmationSent: true }),
      });
      setRows((prev) =>
        prev.map((r) =>
          r.id === o.id
            ? { ...r, confirmation_sent: true, status: "confirmed" }
            : r
        )
      );
    } catch {
      /* opening WhatsApp is the important part */
    }
  }

  // ── Oshi courier ──────────────────────────────────────
  const [oshiBusy, setOshiBusy] = useState<string | null>(null);
  const [courierSel, setCourierSel] = useState<Record<string, string>>({});
  const [oshiMsg, setOshiMsg] = useState<Record<string, string>>({});

  async function oshiAction(o: AdminOrder, action: "book" | "track" | "cancel") {
    setOshiBusy(o.id + action);
    setOshiMsg((m) => ({ ...m, [o.id]: "" }));
    try {
      const res = await fetch("/api/admin/oshi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: o.id,
          action,
          courier: courierSel[o.id] || "1",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOshiMsg((m) => ({ ...m, [o.id]: data.error || "Failed." }));
        return;
      }
      if (action === "book") {
        setRows((prev) =>
          prev.map((r) =>
            r.id === o.id
              ? {
                  ...r,
                  oshi_tracking: data.tracking,
                  oshi_courier: courierSel[o.id] || "1",
                  oshi_status: data.status || "Shipment Booked",
                  status: "shipped",
                }
              : r
          )
        );
      } else if (action === "track") {
        setRows((prev) =>
          prev.map((r) =>
            r.id === o.id ? { ...r, oshi_status: data.latest || r.oshi_status } : r
          )
        );
        setOshiMsg((m) => ({ ...m, [o.id]: `Latest: ${data.latest ?? "—"}` }));
      } else if (action === "cancel") {
        setRows((prev) =>
          prev.map((r) =>
            r.id === o.id
              ? {
                  ...r,
                  oshi_tracking: null,
                  oshi_courier: null,
                  oshi_status: null,
                  status: "confirmed",
                }
              : r
          )
        );
      }
    } catch {
      setOshiMsg((m) => ({ ...m, [o.id]: "Network error." }));
    } finally {
      setOshiBusy(null);
    }
  }

  if (rows.length === 0) {
    return (
      <p className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-10 text-center text-sm text-fg-soft">
        No orders yet. They&apos;ll appear here the moment a customer checks out.
      </p>
    );
  }

  const liveCount = rows.filter((o) => !o.is_test).length;
  const testCount = rows.filter((o) => o.is_test).length;

  // Orders in the current archive (live vs test) — everything else keys off this.
  const scoped = rows.filter((o) =>
    archive === "test" ? o.is_test : !o.is_test
  );

  // Group the current archive's orders by customer to flag repeat buyers.
  const custGroups = new Map<string, AdminOrder[]>();
  for (const o of scoped) {
    const k = custKey(o);
    const arr = custGroups.get(k);
    if (arr) arr.push(o);
    else custGroups.set(k, [o]);
  }
  for (const arr of custGroups.values()) {
    arr.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }
  function customerOrders(o: AdminOrder): AdminOrder[] {
    return custGroups.get(custKey(o)) ?? [o];
  }

  const visible = scoped.filter((o) => {
    if (filter !== "all" && o.status !== filter) return false;
    if (confFilter === "sent" && !o.confirmation_sent) return false;
    if (confFilter === "unsent" && o.confirmation_sent) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Live vs Test archive */}
      <div className="inline-flex rounded-full border border-border bg-bg-soft p-1">
        {(
          [
            ["live", "Live orders", liveCount],
            ["test", "Test archive", testCount],
          ] as const
        ).map(([key, label, count]) => (
          <button
            key={key}
            onClick={() => {
              setArchive(key);
              setFilter("all");
              setConfFilter("all");
              setOpenId(null);
            }}
            className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.12em] transition-colors ${
              archive === key
                ? key === "test"
                  ? "bg-fg text-bg"
                  : "bg-accent text-on-accent"
                : "text-fg-soft hover:text-fg"
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {archive === "test" && (
        <p className="text-xs text-fg-soft">
          Test orders are excluded from Overview totals and can&apos;t be booked
          with a courier. Use them to trial checkout without polluting real
          numbers.
        </p>
      )}

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {["all", ...STATUSES].map((s) => {
          const count =
            s === "all"
              ? scoped.length
              : scoped.filter((o) => o.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.12em] transition-colors ${
                filter === s
                  ? "border-accent bg-accent text-on-accent"
                  : "border-border text-fg-soft hover:border-fg-faint"
              }`}
            >
              {s} ({count})
            </button>
          );
        })}
      </div>

      {/* Confirmation filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-[0.12em] text-fg-faint">
          Confirmation:
        </span>
        {(
          [
            ["all", "All"],
            ["unsent", "To confirm"],
            ["sent", "Confirmed ✓"],
          ] as const
        ).map(([key, label]) => {
          const count =
            key === "all"
              ? scoped.length
              : key === "sent"
                ? scoped.filter((o) => o.confirmation_sent).length
                : scoped.filter((o) => !o.confirmation_sent).length;
          return (
            <button
              key={key}
              onClick={() => setConfFilter(key)}
              className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.12em] transition-colors ${
                confFilter === key
                  ? "border-accent-teal bg-accent-teal/15 text-accent-teal"
                  : "border-border text-fg-soft hover:border-fg-faint"
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-8 text-center text-sm text-fg-soft">
          {archive === "test"
            ? "No test orders. Open any live order and choose “Mark as test” to move it here."
            : "No orders match these filters."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-border">
          <table className="w-full min-w-[64rem] text-sm">
            <thead className="bg-bg-soft">
              <tr className="text-left">
                <th className="pf-label p-3">Ref</th>
                <th className="pf-label p-3">Placed</th>
                <th className="pf-label p-3">Customer</th>
                <th className="pf-label p-3">Items</th>
                <th className="pf-label p-3">City</th>
                <th className="pf-label p-3 text-right">Collect (COD)</th>
                <th className="pf-label p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((o) => {
                const total = o.subtotal - o.discount + o.shipping_fee;
                const isOpen = openId === o.id;
                const mates = customerOrders(o);
                const ord = mates.findIndex((m) => m.id === o.id) + 1;
                const returning = mates.length > 1;
                return (
                  <>
                    <tr
                      key={o.id}
                      onClick={() => setOpenId(isOpen ? null : o.id)}
                      className="cursor-pointer border-t border-border transition-colors hover:bg-bg-soft"
                    >
                      <td className="p-3 font-medium">
                        <span className="flex items-center gap-1.5">
                          <span
                            className={`text-fg-faint transition-transform ${
                              isOpen ? "rotate-90" : ""
                            }`}
                            aria-hidden
                          >
                            ›
                          </span>
                          <span>
                            {o.ref}
                            {o.is_test && (
                              <span className="ml-1.5 rounded bg-fg/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-fg-soft">
                                Test
                              </span>
                            )}
                          </span>
                        </span>
                      </td>
                      <td className="p-3 text-fg-soft">
                        <span className="block whitespace-nowrap">
                          {placedDate(o.created_at)}
                        </span>
                        <span className="block whitespace-nowrap text-xs text-fg-faint">
                          {placedTime(o.created_at)}
                        </span>
                      </td>
                      <td className="p-3">
                        {o.customer_name}
                        <span className="block text-xs text-fg-soft">
                          {o.customer_phone}
                        </span>
                        {returning && (
                          <span className="mt-1 inline-block rounded-full bg-accent-violet/15 px-2 py-0.5 text-[10px] font-medium text-accent-violet">
                            ↩ Returning · {ordinal(ord)} order
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-fg-soft">
                        <span className="block max-w-[15rem] text-xs leading-relaxed">
                          {itemsSummary(o)}
                        </span>
                      </td>
                      <td className="p-3 text-fg-soft">
                        {o.city}
                        {o.shipping_fee === 0 && (
                          <span className="block text-xs text-accent-deep">
                            Free delivery
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right font-medium tabular-nums">
                        {formatPrice(total)}
                      </td>
                      <td className="p-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs capitalize ${
                            STATUS_STYLE[o.status] ?? "bg-bg-soft"
                          }`}
                        >
                          {o.status}
                        </span>
                        {o.confirmation_sent ? (
                          <span className="mt-1 block text-[11px] text-[#1a8a4a]">
                            ✓ Confirmation sent
                          </span>
                        ) : (
                          <span className="mt-1 block text-[11px] text-accent-deep">
                            ⧗ Not confirmed
                          </span>
                        )}
                      </td>
                    </tr>

                    {isOpen && (
                      <tr
                        key={`${o.id}-detail`}
                        className="border-t border-border bg-bg-soft"
                      >
                        <td colSpan={7} className="p-5">
                          <div className="grid gap-6 md:grid-cols-3">
                            {/* Delivery + customer history */}
                            <div className="space-y-3">
                              <div>
                                <p className="pf-eyebrow mb-1">Deliver to</p>
                                <p className="text-sm font-medium">
                                  {o.customer_name}
                                </p>
                                <p className="text-sm leading-relaxed text-fg-soft">
                                  {o.address}
                                  <br />
                                  {o.city}
                                </p>
                              </div>
                              <div>
                                <p className="pf-eyebrow mb-1">Phone</p>
                                <p className="text-sm">
                                  <a
                                    href={`tel:${o.customer_phone}`}
                                    className="font-medium text-accent-deep hover:underline"
                                  >
                                    {o.customer_phone}
                                  </a>
                                  {toWaNumber(o.customer_phone) && (
                                    <a
                                      href={`https://wa.me/${toWaNumber(
                                        o.customer_phone
                                      )}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="ml-2 text-xs text-[#1a8a4a] hover:underline"
                                    >
                                      (WhatsApp)
                                    </a>
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="pf-eyebrow mb-1">Email</p>
                                {o.customer_email ? (
                                  <a
                                    href={`mailto:${o.customer_email}`}
                                    className="break-all text-sm text-accent-deep hover:underline"
                                  >
                                    {o.customer_email}
                                  </a>
                                ) : (
                                  <p className="text-sm text-fg-faint">
                                    Not provided
                                  </p>
                                )}
                              </div>

                              {/* This customer's order history */}
                              <div className="border-t border-border pt-3">
                                <p className="pf-eyebrow mb-1.5">
                                  Customer history ({mates.length}{" "}
                                  {mates.length === 1 ? "order" : "orders"})
                                </p>
                                <ul className="space-y-1 text-xs">
                                  {mates.map((m) => (
                                    <li
                                      key={m.id}
                                      className={`flex items-center justify-between gap-2 ${
                                        m.id === o.id
                                          ? "font-medium text-fg"
                                          : "text-fg-soft"
                                      }`}
                                    >
                                      <button
                                        onClick={() => setOpenId(m.id)}
                                        className="hover:text-accent-deep hover:underline"
                                      >
                                        {m.ref}
                                        {m.id === o.id ? " (this one)" : ""}
                                      </button>
                                      <span className="tabular-nums">
                                        {placedDate(m.created_at)} ·{" "}
                                        {formatPrice(
                                          m.subtotal - m.discount + m.shipping_fee
                                        )}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                                {returning && (
                                  <p className="mt-1.5 text-[11px] text-accent-violet">
                                    Repeat customer — worth a personal thank-you.
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Items */}
                            <div>
                              <p className="pf-eyebrow mb-2">Items</p>
                              <ul className="space-y-1 text-sm">
                                {o.items.map((it, i) => (
                                  <li
                                    key={i}
                                    className="flex justify-between gap-3"
                                  >
                                    <span>
                                      {it.name} · {it.size} × {it.quantity}
                                    </span>
                                    <span className="tabular-nums text-fg-soft">
                                      {formatPrice(it.price * it.quantity)}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                              <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
                                <div className="flex justify-between text-fg-soft">
                                  <span>Subtotal</span>
                                  <span className="tabular-nums">
                                    {formatPrice(o.subtotal)}
                                  </span>
                                </div>
                                {o.discount > 0 && (
                                  <div className="flex justify-between text-accent-deep">
                                    <span>
                                      {o.promo_type === "bundle"
                                        ? "Bundle offer"
                                        : o.promo_type === "pack4"
                                          ? "Buy 3 Get 1 Free"
                                          : o.affiliate_code
                                            ? `Code ${o.affiliate_code}`
                                            : "Discount"}
                                    </span>
                                    <span className="tabular-nums">
                                      −{formatPrice(o.discount)}
                                    </span>
                                  </div>
                                )}
                                <div className="flex justify-between text-fg-soft">
                                  <span>Delivery</span>
                                  <span className="tabular-nums">
                                    {o.shipping_fee === 0
                                      ? "Free"
                                      : formatPrice(o.shipping_fee)}
                                  </span>
                                </div>
                                <div className="flex justify-between font-medium">
                                  <span>Collect in cash</span>
                                  <span className="tabular-nums">
                                    {formatPrice(total)}
                                  </span>
                                </div>
                                {o.affiliate_code && (
                                  <p className="pt-2 text-xs text-fg-soft">
                                    Affiliate {o.affiliate_code} earns PKR{" "}
                                    {o.affiliate_commission} on delivery.
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div>
                              {/* Confirm via WhatsApp */}
                              <p className="pf-eyebrow mb-2">Confirm the order</p>
                              <button
                                onClick={() => sendConfirmation(o)}
                                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
                              >
                                {o.confirmation_sent
                                  ? "Send confirmation again"
                                  : "Send WhatsApp Confirmation"}
                              </button>
                              <p className="mt-2 text-xs text-fg-soft">
                                {o.confirmation_sent
                                  ? "✓ Confirmation already sent."
                                  : "Opens WhatsApp with a ready-to-send message to the customer, and marks this order confirmed."}
                              </p>

                              <p className="pf-eyebrow mb-2 mt-5">Update status</p>
                              <div className="flex flex-wrap gap-2">
                                {STATUSES.map((s) => (
                                  <button
                                    key={s}
                                    disabled={saving === o.id || o.status === s}
                                    onClick={() => updateStatus(o.id, s)}
                                    className={`rounded-full border px-3 py-1.5 text-xs capitalize transition-colors disabled:opacity-40 ${
                                      o.status === s
                                        ? "border-accent bg-accent text-on-accent"
                                        : "border-border hover:border-accent"
                                    }`}
                                  >
                                    {s}
                                  </button>
                                ))}
                              </div>
                              <p className="mt-3 text-xs text-fg-soft">
                                Marking an order <strong>delivered</strong>{" "}
                                records the cash as collected and releases any
                                affiliate commission for payout.
                              </p>

                              {/* Courier — Oshi */}
                              <div className="mt-6 border-t border-border pt-4">
                                <p className="pf-eyebrow mb-2">Courier — Oshi</p>
                                {o.is_test ? (
                                  <p className="rounded-[var(--radius)] border border-dashed border-border bg-bg p-3 text-xs text-fg-soft">
                                    This is a test order — courier booking is
                                    disabled. Move it back to live to book it.
                                  </p>
                                ) : !o.oshi_tracking ? (
                                  <>
                                    <div className="mb-2 flex gap-2">
                                      {OSHI_COURIERS.map((c) => {
                                        const sel =
                                          (courierSel[o.id] || "1") === c.id;
                                        return (
                                          <button
                                            key={c.id}
                                            onClick={() =>
                                              setCourierSel((s) => ({
                                                ...s,
                                                [o.id]: c.id,
                                              }))
                                            }
                                            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                                              sel
                                                ? "border-accent bg-accent text-on-accent"
                                                : "border-border text-fg-soft hover:border-accent"
                                            }`}
                                          >
                                            {c.label}
                                          </button>
                                        );
                                      })}
                                    </div>
                                    <button
                                      onClick={() => oshiAction(o, "book")}
                                      disabled={oshiBusy === o.id + "book"}
                                      className="w-full rounded-full bg-fg px-4 py-2.5 text-sm font-medium text-bg transition-transform hover:scale-[1.02] disabled:opacity-50"
                                    >
                                      {oshiBusy === o.id + "book"
                                        ? "Booking…"
                                        : "Book with Oshi"}
                                    </button>
                                    <p className="mt-2 text-xs text-fg-soft">
                                      Creates the consignment and returns a
                                      tracking number and printable label.
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <div className="rounded-[var(--radius)] border border-border bg-bg p-3 text-sm">
                                      <div className="flex items-center justify-between">
                                        <span className="text-fg-soft">
                                          {courierName(o.oshi_courier)}
                                        </span>
                                        <span className="rounded-full bg-accent-teal/15 px-2 py-0.5 text-xs text-accent-teal">
                                          {o.oshi_status || "Booked"}
                                        </span>
                                      </div>
                                      <p className="mt-1 font-mono text-xs">
                                        #{o.oshi_tracking}
                                      </p>
                                    </div>
                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                      <a
                                        href={`/api/admin/oshi/label?tracking=${o.oshi_tracking}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-full border border-border px-3 py-2 text-center text-xs transition-colors hover:border-accent"
                                      >
                                        Print label
                                      </a>
                                      <button
                                        onClick={() => oshiAction(o, "track")}
                                        disabled={oshiBusy === o.id + "track"}
                                        className="rounded-full border border-border px-3 py-2 text-xs transition-colors hover:border-accent disabled:opacity-50"
                                      >
                                        {oshiBusy === o.id + "track"
                                          ? "…"
                                          : "Refresh tracking"}
                                      </button>
                                    </div>
                                    <button
                                      onClick={() => oshiAction(o, "cancel")}
                                      disabled={oshiBusy === o.id + "cancel"}
                                      className="mt-2 w-full rounded-full border border-accent-rose/40 px-3 py-2 text-xs text-accent-rose transition-colors hover:bg-accent-rose/10 disabled:opacity-50"
                                    >
                                      {oshiBusy === o.id + "cancel"
                                        ? "Cancelling…"
                                        : "Cancel booking"}
                                    </button>
                                  </>
                                )}
                                {oshiMsg[o.id] && (
                                  <p className="mt-2 text-xs text-fg-soft">
                                    {oshiMsg[o.id]}
                                  </p>
                                )}
                              </div>

                              {/* Test archive toggle */}
                              <div className="mt-6 border-t border-border pt-4">
                                <button
                                  onClick={() => toggleTest(o)}
                                  disabled={saving === o.id}
                                  className="text-xs text-fg-faint underline-offset-2 transition-colors hover:text-fg hover:underline disabled:opacity-50"
                                >
                                  {o.is_test
                                    ? "↩ Move back to live orders"
                                    : "⚠ Mark as test order (won’t be booked)"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
