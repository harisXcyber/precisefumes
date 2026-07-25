import Link from "next/link";
import { fetchOrders } from "@/lib/admin-data";
import type { AdminOrder } from "@/lib/admin-data";
import { formatPrice } from "@/lib/utils";

function custKey(o: AdminOrder): string {
  const phone = (o.customer_phone || "").replace(/\D/g, "").slice(-10);
  return phone || (o.customer_email || "").toLowerCase() || o.id;
}

const TZ = "Asia/Karachi";
function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TZ,
  });
}

interface Customer {
  key: string;
  name: string;
  phone: string;
  email: string;
  orders: number;
  spent: number; // lifetime order value (COD totals)
  delivered: number; // value actually delivered
  lastAt: string;
}

export default async function AdminCustomers() {
  const all = await fetchOrders(1000);
  const live = all.filter((o) => !o.is_test);

  const map = new Map<string, Customer>();
  for (const o of live) {
    const k = custKey(o);
    const total = o.subtotal - o.discount + o.shipping_fee;
    const existing = map.get(k);
    if (existing) {
      existing.orders += 1;
      existing.spent += total;
      if (o.status === "delivered") existing.delivered += total;
      if (new Date(o.created_at) > new Date(existing.lastAt)) {
        existing.lastAt = o.created_at;
        existing.name = o.customer_name;
        existing.phone = o.customer_phone;
        existing.email = o.customer_email ?? "";
      }
    } else {
      map.set(k, {
        key: k,
        name: o.customer_name,
        phone: o.customer_phone,
        email: o.customer_email ?? "",
        orders: 1,
        spent: total,
        delivered: o.status === "delivered" ? total : 0,
        lastAt: o.created_at,
      });
    }
  }

  const customers = [...map.values()].sort(
    (a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime()
  );
  const repeat = customers.filter((c) => c.orders > 1).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-normal md:text-4xl">Customers</h1>
        <p className="mt-2 max-w-2xl text-sm text-fg-soft">
          Everyone who has placed an order, grouped by phone number. Shoppers
          check out as guests (Cash on Delivery — no password accounts); the
          people with actual login accounts are your{" "}
          <Link href="/admin/affiliates" className="text-accent-deep hover:underline">
            affiliates
          </Link>
          .
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-5">
          <p className="pf-eyebrow">Customers</p>
          <p className="mt-2 font-serif text-2xl md:text-3xl">
            {customers.length}
          </p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-5">
          <p className="pf-eyebrow">Repeat buyers</p>
          <p className="mt-2 font-serif text-2xl md:text-3xl">{repeat}</p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-5">
          <p className="pf-eyebrow">Total orders</p>
          <p className="mt-2 font-serif text-2xl md:text-3xl">{live.length}</p>
        </div>
      </div>

      {customers.length === 0 ? (
        <p className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-8 text-center text-sm text-fg-soft">
          No customers yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-border">
          <table className="w-full min-w-[48rem] text-sm">
            <thead className="bg-bg-soft">
              <tr className="text-left">
                <th className="pf-label p-3">Customer</th>
                <th className="pf-label p-3">Contact</th>
                <th className="pf-label p-3 text-center">Orders</th>
                <th className="pf-label p-3 text-right">Lifetime value</th>
                <th className="pf-label p-3 text-right">Delivered</th>
                <th className="pf-label p-3">Last order</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.key} className="border-t border-border">
                  <td className="p-3 font-medium">
                    {c.name}
                    {c.orders > 1 && (
                      <span className="ml-2 rounded-full bg-accent-violet/15 px-2 py-0.5 text-[10px] font-medium text-accent-violet">
                        Repeat
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-fg-soft">
                    <a
                      href={`tel:${c.phone}`}
                      className="text-accent-deep hover:underline"
                    >
                      {c.phone}
                    </a>
                    <span className="block break-all text-xs text-fg-faint">
                      {c.email}
                    </span>
                  </td>
                  <td className="p-3 text-center tabular-nums">{c.orders}</td>
                  <td className="p-3 text-right font-medium tabular-nums">
                    {formatPrice(c.spent)}
                  </td>
                  <td className="p-3 text-right tabular-nums text-fg-soft">
                    {formatPrice(c.delivered)}
                  </td>
                  <td className="p-3 whitespace-nowrap text-fg-soft">
                    {fmtDate(c.lastAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
