import Link from "next/link";
import { fetchOrders, fetchProducts, fetchAffiliates } from "@/lib/admin-data";
import { formatPrice } from "@/lib/utils";

export default async function AdminOverview() {
  const [orders, products, affiliates] = await Promise.all([
    fetchOrders(500),
    fetchProducts(),
    fetchAffiliates(),
  ]);

  const open = orders.filter(
    (o) => o.status === "new" || o.status === "confirmed"
  );
  const revenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((s, o) => s + (o.subtotal - o.discount + o.shipping_fee), 0);
  const owed = affiliates.reduce((s, a) => s + a.owed, 0);

  const cards = [
    { label: "Orders to fulfil", value: String(open.length), href: "/admin/orders" },
    { label: "Total orders", value: String(orders.length), href: "/admin/orders" },
    { label: "Delivered revenue", value: formatPrice(revenue), href: "/admin/orders" },
    { label: "Commission owed", value: formatPrice(owed), href: "/admin/affiliates" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-3xl font-normal md:text-4xl">Overview</h1>
        <p className="mt-2 text-sm text-fg-soft">
          {products.length} products live · {affiliates.length} affiliates
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-5 transition-colors hover:border-accent"
          >
            <p className="pf-eyebrow">{c.label}</p>
            <p className="mt-3 font-serif text-2xl md:text-3xl">{c.value}</p>
          </Link>
        ))}
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-normal">Latest orders</h2>
          <Link
            href="/admin/orders"
            className="text-xs uppercase tracking-[0.14em] text-accent-deep hover:underline"
          >
            View all →
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-8 text-center text-sm text-fg-soft">
            No orders yet. They'll appear here the moment a customer checks out.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-border">
            <table className="w-full min-w-[40rem] text-sm">
              <thead className="bg-bg-soft">
                <tr className="text-left">
                  <th className="pf-label p-3">Ref</th>
                  <th className="pf-label p-3">Customer</th>
                  <th className="pf-label p-3">City</th>
                  <th className="pf-label p-3 text-right">Total</th>
                  <th className="pf-label p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 8).map((o) => (
                  <tr key={o.id} className="border-t border-border">
                    <td className="p-3 font-medium">{o.ref}</td>
                    <td className="p-3 text-fg-soft">{o.customer_name}</td>
                    <td className="p-3 text-fg-soft">{o.city}</td>
                    <td className="p-3 text-right tabular-nums">
                      {formatPrice(o.subtotal - o.discount + o.shipping_fee)}
                    </td>
                    <td className="p-3 capitalize text-fg-soft">{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
