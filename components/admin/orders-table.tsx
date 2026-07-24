"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import type { AdminOrder } from "@/lib/admin-data";

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

  const visible =
    filter === "all" ? rows : rows.filter((o) => o.status === filter);

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
                    <td className="p-3 font-medium">{o.ref}</td>
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
                    </td>
                  </tr>

                  {isOpen && (
                    <tr key={`${o.id}-detail`} className="border-t border-border bg-bg-soft">
                      <td colSpan={6} className="p-5">
                        <div className="grid gap-6 md:grid-cols-3">
                          {/* Delivery */}
                          <div>
                            <p className="pf-eyebrow mb-2">Deliver to</p>
                            <p className="text-sm">{o.customer_name}</p>
                            <p className="text-sm text-fg-soft">{o.address}</p>
                            <p className="text-sm text-fg-soft">{o.city}</p>
                            <p className="mt-2 text-sm">
                              <a
                                href={`tel:${o.customer_phone}`}
                                className="text-accent-deep hover:underline"
                              >
                                {o.customer_phone}
                              </a>
                            </p>
                            <p className="text-sm">
                              <a
                                href={`mailto:${o.customer_email}`}
                                className="text-accent-deep hover:underline"
                              >
                                {o.customer_email}
                              </a>
                            </p>
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
                            <p className="pf-eyebrow mb-2">Update status</p>
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
