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

export function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  const [rows, setRows] = useState(orders);
  const [openId, setOpenId] = useState<string | null>(null);
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

  const visible = rows.filter((o) => {
    if (filter !== "all" && o.status !== filter) return false;
    if (confFilter === "sent" && !o.confirmation_sent) return false;
    if (confFilter === "unsent" && o.confirmation_sent) return false;
    return true;
  });

  if (rows.length === 0) {
    return (
      <p className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-10 text-center text-sm text-fg-soft">
        No orders yet. They'll appear here the moment a customer checks out.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["all", ...STATUSES].map((s) => {
          const count =
            s === "all" ? rows.length : rows.filter((o) => o.status === s).length;
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
              ? rows.length
              : key === "sent"
                ? rows.filter((o) => o.confirmation_sent).length
                : rows.filter((o) => !o.confirmation_sent).length;
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

      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-border">
        <table className="w-full min-w-[52rem] text-sm">
          <thead className="bg-bg-soft">
            <tr className="text-left">
              <th className="pf-label p-3">Ref</th>
              <th className="pf-label p-3">Placed</th>
              <th className="pf-label p-3">Customer</th>
              <th className="pf-label p-3">City</th>
              <th className="pf-label p-3 text-right">Collect (COD)</th>
              <th className="pf-label p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((o) => {
              const total = o.subtotal - o.discount + o.shipping_fee;
              const isOpen = openId === o.id;
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
                        {o.ref}
                      </span>
                    </td>
                    <td className="p-3 text-fg-soft">
                      {new Date(o.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {o.customer_name}
                      <span className="block text-xs text-fg-soft">
                        {o.customer_phone}
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
                    <tr key={`${o.id}-detail`} className="border-t border-border bg-bg-soft">
                      <td colSpan={6} className="p-5">
                        <div className="grid gap-6 md:grid-cols-3">
                          {/* Delivery */}
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
                              <a
                                href={`mailto:${o.customer_email}`}
                                className="break-all text-sm text-accent-deep hover:underline"
                              >
                                {o.customer_email}
                              </a>
                            </div>
                          </div>

                          {/* Items */}
                          <div>
                            <p className="pf-eyebrow mb-2">Items</p>
                            <ul className="space-y-1 text-sm">
                              {o.items.map((it, i) => (
                                <li key={i} className="flex justify-between gap-3">
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
                            <p className="pf-eyebrow mb-2">
                              Confirm the order
                            </p>
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
                              Marking an order <strong>delivered</strong> records
                              the cash as collected and releases any affiliate
                              commission for payout.
                            </p>
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
    </div>
  );
}
