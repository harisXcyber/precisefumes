"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Sale, Expense } from "@/lib/finance-data";

const pkr = (n: number) => `PKR ${Math.round(n).toLocaleString("en-PK")}`;

const EXPENSE_CATEGORIES: { value: string; label: string }[] = [
  { value: "perfume_cost", label: "Perfume Cost" },
  { value: "transportation", label: "Transportation" },
  { value: "delivery", label: "Delivery Charges" },
  { value: "packaging", label: "Packaging" },
  { value: "additional", label: "Additional Costs" },
  { value: "other", label: "Other" },
];
const catLabel = (v: string) =>
  EXPENSE_CATEGORIES.find((c) => c.value === v)?.label ?? "Other";

type Tab = "overview" | "sales" | "expenses";

export function FinanceDashboard({
  sales: initialSales,
  expenses: initialExpenses,
}: {
  sales: Sale[];
  expenses: Expense[];
}) {
  const router = useRouter();
  const [sales, setSales] = useState(initialSales);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [tab, setTab] = useState<Tab>("overview");

  const totals = useMemo(() => {
    const revenue = sales.reduce((s, r) => s + r.amount, 0);
    const unitsSold = sales.reduce((s, r) => s + r.quantity, 0);
    const totalExpenses = expenses.reduce((s, r) => s + r.amount, 0);
    const byCategory: Record<string, number> = {};
    for (const e of expenses)
      byCategory[e.category] = (byCategory[e.category] ?? 0) + e.amount;
    return {
      revenue,
      unitsSold,
      orders: sales.length,
      totalExpenses,
      profit: revenue - totalExpenses,
      byCategory,
      avgSale: sales.length ? revenue / sales.length : 0,
    };
  }, [sales, expenses]);

  async function signOut() {
    await fetch("/api/finance/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-bg/95 backdrop-blur-md">
        <div className="container-lux flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="font-serif text-lg">
              Precise Fumes<span className="text-accent"> · Finances</span>
            </span>
            <nav className="hidden items-center gap-5 sm:flex">
              {(["overview", "sales", "expenses"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`text-xs uppercase tracking-[0.14em] capitalize transition-colors ${
                    tab === t ? "text-fg" : "text-fg-soft hover:text-fg"
                  }`}
                >
                  {t}
                </button>
              ))}
            </nav>
          </div>
          <button
            onClick={signOut}
            className="text-xs uppercase tracking-[0.14em] text-fg-soft hover:text-fg"
          >
            Sign Out
          </button>
        </div>
        {/* mobile tabs */}
        <div className="container-lux flex gap-5 border-t border-border py-2 sm:hidden">
          {(["overview", "sales", "expenses"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-xs uppercase tracking-[0.14em] capitalize ${
                tab === t ? "text-fg" : "text-fg-soft"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <main className="container-lux py-8 md:py-12">
        {tab === "overview" && <Overview totals={totals} />}
        {tab === "sales" && (
          <SalesSection sales={sales} setSales={setSales} />
        )}
        {tab === "expenses" && (
          <ExpensesSection expenses={expenses} setExpenses={setExpenses} />
        )}
      </main>
    </div>
  );
}

/* ── Overview ─────────────────────────────────────────────── */

function Overview({
  totals,
}: {
  totals: {
    revenue: number;
    unitsSold: number;
    orders: number;
    totalExpenses: number;
    profit: number;
    byCategory: Record<string, number>;
    avgSale: number;
  };
}) {
  const cards = [
    { label: "Total Revenue", value: pkr(totals.revenue), hint: `${totals.orders} sales · ${totals.unitsSold} units` },
    { label: "Total Expenses", value: pkr(totals.totalExpenses), hint: "All costs logged" },
    {
      label: "Net Profit",
      value: pkr(totals.profit),
      hint: totals.profit >= 0 ? "In profit" : "At a loss",
      accent: true,
    },
    { label: "Avg. Sale Value", value: pkr(totals.avgSale), hint: "Revenue ÷ sales" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-3xl font-normal md:text-4xl">Overview</h1>
        <p className="mt-2 text-sm text-fg-soft">
          A live picture of sales, costs and profit. Add records under the Sales
          and Expenses tabs.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`rounded-[var(--radius-lg)] border p-5 md:p-6 ${
              c.accent
                ? totals.profit >= 0
                  ? "border-accent bg-accent/5"
                  : "border-accent-rose bg-accent-rose/5"
                : "border-border bg-bg-soft"
            }`}
          >
            <p className="pf-eyebrow">{c.label}</p>
            <p
              className={`mt-3 font-serif text-2xl md:text-3xl ${
                c.accent && totals.profit < 0 ? "text-accent-rose" : ""
              }`}
            >
              {c.value}
            </p>
            <p className="mt-1 text-xs text-fg-soft">{c.hint}</p>
          </div>
        ))}
      </div>

      {/* Profit bar */}
      <section className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-6">
        <h2 className="mb-4 font-serif text-xl font-normal">
          Where the money goes
        </h2>
        {totals.revenue === 0 ? (
          <p className="text-sm text-fg-soft">
            No revenue logged yet. Add your first sale to see the breakdown.
          </p>
        ) : (
          <>
            <div className="flex h-8 w-full overflow-hidden rounded-full border border-border">
              <div
                className="h-full bg-accent"
                style={{
                  width: `${Math.min(100, (totals.totalExpenses / totals.revenue) * 100)}%`,
                }}
                title="Expenses"
              />
              <div
                className="h-full flex-1 bg-accent-teal/50"
                title="Profit"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-fg-soft">
              <span>
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-accent align-middle" />
                Expenses {pkr(totals.totalExpenses)}
              </span>
              <span>
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-accent-teal/50 align-middle" />
                Profit {pkr(totals.profit)}
              </span>
              <span className="text-fg-faint">
                Margin{" "}
                {totals.revenue
                  ? Math.round((totals.profit / totals.revenue) * 100)
                  : 0}
                %
              </span>
            </div>
          </>
        )}
      </section>

      {/* Expenses by category */}
      {Object.keys(totals.byCategory).length > 0 && (
        <section>
          <h2 className="mb-4 font-serif text-xl font-normal">
            Expenses by category
          </h2>
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border">
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(totals.byCategory)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, amt]) => (
                    <tr key={cat} className="border-b border-border last:border-0">
                      <td className="p-3">{catLabel(cat)}</td>
                      <td className="p-3 text-right tabular-nums">{pkr(amt)}</td>
                      <td className="w-1/2 p-3">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-bg-soft">
                          <div
                            className="h-full bg-accent-deep"
                            style={{
                              width: `${(amt / totals.totalExpenses) * 100}%`,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

/* ── Sales ────────────────────────────────────────────────── */

function SalesSection({
  sales,
  setSales,
}: {
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [unit, setUnit] = useState(3000);

  async function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      saleDate: fd.get("saleDate"),
      item: fd.get("item"),
      quantity: Number(fd.get("quantity")),
      unitPrice: Number(fd.get("unitPrice")),
      amount: Number(fd.get("amount")),
      channel: fd.get("channel"),
      createdBy: fd.get("createdBy"),
      notes: fd.get("notes"),
    };
    try {
      const res = await fetch("/api/finance/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setSales((prev) => [
          {
            id: data.id,
            sale_date: String(payload.saleDate),
            item: String(payload.item),
            quantity: payload.quantity,
            unit_price: payload.unitPrice,
            amount: payload.amount,
            channel: (payload.channel as string) || null,
            notes: (payload.notes as string) || null,
            created_by: (payload.createdBy as string) || null,
          },
          ...prev,
        ]);
        (e.target as HTMLFormElement).reset();
        setQty(1);
        setUnit(3000);
      } else setError(data.error ?? "Could not save.");
    } catch {
      setError("Could not save.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this sale record?")) return;
    const res = await fetch(`/api/finance/sales/${id}`, { method: "DELETE" });
    if (res.ok) setSales((prev) => prev.filter((s) => s.id !== id));
  }

  const total = sales.reduce((s, r) => s + r.amount, 0);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-normal md:text-4xl">Sales</h1>
        <p className="mt-2 text-sm text-fg-soft">
          Log every sale — from the website, WhatsApp, Instagram or in person.
        </p>
      </div>

      {/* Add form */}
      <form
        onSubmit={add}
        className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-5 md:p-6"
      >
        <h2 className="mb-4 font-serif text-lg font-normal">Add a sale</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="pf-label mb-2 block">Date</label>
            <input type="date" name="saleDate" defaultValue={today} className="w-full" />
          </div>
          <div className="lg:col-span-2">
            <label className="pf-label mb-2 block">Item</label>
            <input
              name="item"
              required
              className="w-full"
              placeholder="e.g. Rogue 50ml, or 2-perfume bundle"
            />
          </div>
          <div>
            <label className="pf-label mb-2 block">Channel</label>
            <select name="channel" className="w-full" defaultValue="website">
              <option value="website">Website</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="instagram">Instagram</option>
              <option value="in-person">In person</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="pf-label mb-2 block">Quantity</label>
            <input
              type="number"
              name="quantity"
              min={1}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="pf-label mb-2 block">Unit price</label>
            <input
              type="number"
              name="unitPrice"
              value={unit}
              onChange={(e) => setUnit(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="pf-label mb-2 block">Total received</label>
            <input
              type="number"
              name="amount"
              required
              defaultValue={qty * unit}
              key={qty * unit}
              className="w-full"
            />
            <p className="mt-1 text-xs text-fg-faint">
              Auto-filled from qty × price — edit for discounts.
            </p>
          </div>
          <div>
            <label className="pf-label mb-2 block">Logged by</label>
            <input name="createdBy" className="w-full" placeholder="Your name" />
          </div>
        </div>
        <div className="mt-4">
          <label className="pf-label mb-2 block">Notes (optional)</label>
          <input name="notes" className="w-full" placeholder="Customer, city, anything useful" />
        </div>
        {error && <p className="mt-3 text-xs text-accent-rose">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="btn-primary mt-5 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Add sale"}
        </button>
      </form>

      {/* Table */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-xl font-normal">
            {sales.length} sale{sales.length === 1 ? "" : "s"}
          </h2>
          <p className="text-sm text-fg-soft">
            Total: <strong className="text-fg">{pkr(total)}</strong>
          </p>
        </div>
        {sales.length === 0 ? (
          <p className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-8 text-center text-sm text-fg-soft">
            No sales logged yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-border">
            <table className="w-full min-w-[46rem] text-sm">
              <thead className="bg-bg-soft">
                <tr className="text-left">
                  <th className="pf-label p-3">Date</th>
                  <th className="pf-label p-3">Item</th>
                  <th className="pf-label p-3">Channel</th>
                  <th className="pf-label p-3 text-right">Qty</th>
                  <th className="pf-label p-3 text-right">Amount</th>
                  <th className="pf-label p-3">By</th>
                  <th className="pf-label p-3"></th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s) => (
                  <tr key={s.id} className="border-t border-border">
                    <td className="p-3 text-fg-soft">{s.sale_date}</td>
                    <td className="p-3">
                      {s.item}
                      {s.notes && (
                        <span className="block text-xs text-fg-faint">
                          {s.notes}
                        </span>
                      )}
                    </td>
                    <td className="p-3 capitalize text-fg-soft">
                      {s.channel ?? "—"}
                    </td>
                    <td className="p-3 text-right tabular-nums">{s.quantity}</td>
                    <td className="p-3 text-right font-medium tabular-nums">
                      {pkr(s.amount)}
                    </td>
                    <td className="p-3 text-fg-soft">{s.created_by ?? "—"}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => remove(s.id)}
                        className="text-xs text-accent-rose hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Expenses ─────────────────────────────────────────────── */

function ExpensesSection({
  expenses,
  setExpenses,
}: {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      expenseDate: fd.get("expenseDate"),
      category: fd.get("category"),
      description: fd.get("description"),
      amount: Number(fd.get("amount")),
      createdBy: fd.get("createdBy"),
      notes: fd.get("notes"),
    };
    try {
      const res = await fetch("/api/finance/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setExpenses((prev) => [
          {
            id: data.id,
            expense_date: String(payload.expenseDate),
            category: String(payload.category),
            description: String(payload.description),
            amount: payload.amount,
            notes: (payload.notes as string) || null,
            created_by: (payload.createdBy as string) || null,
          },
          ...prev,
        ]);
        (e.target as HTMLFormElement).reset();
      } else setError(data.error ?? "Could not save.");
    } catch {
      setError("Could not save.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this expense record?")) return;
    const res = await fetch(`/api/finance/expenses/${id}`, { method: "DELETE" });
    if (res.ok) setExpenses((prev) => prev.filter((x) => x.id !== id));
  }

  const total = expenses.reduce((s, r) => s + r.amount, 0);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-normal md:text-4xl">Expenses</h1>
        <p className="mt-2 text-sm text-fg-soft">
          Track every cost — stock, transport, delivery, packaging and more.
        </p>
      </div>

      <form
        onSubmit={add}
        className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-5 md:p-6"
      >
        <h2 className="mb-4 font-serif text-lg font-normal">Add an expense</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="pf-label mb-2 block">Date</label>
            <input
              type="date"
              name="expenseDate"
              defaultValue={today}
              className="w-full"
            />
          </div>
          <div>
            <label className="pf-label mb-2 block">Category</label>
            <select name="category" className="w-full" defaultValue="perfume_cost">
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="lg:col-span-2">
            <label className="pf-label mb-2 block">Description</label>
            <input
              name="description"
              required
              className="w-full"
              placeholder="e.g. 50 bottles Rogue stock, courier to Lahore"
            />
          </div>
          <div>
            <label className="pf-label mb-2 block">Amount</label>
            <input type="number" name="amount" required className="w-full" />
          </div>
          <div>
            <label className="pf-label mb-2 block">Logged by</label>
            <input name="createdBy" className="w-full" placeholder="Your name" />
          </div>
          <div className="lg:col-span-2">
            <label className="pf-label mb-2 block">Notes (optional)</label>
            <input name="notes" className="w-full" placeholder="Supplier, reference, anything useful" />
          </div>
        </div>
        {error && <p className="mt-3 text-xs text-accent-rose">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="btn-primary mt-5 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Add expense"}
        </button>
      </form>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-xl font-normal">
            {expenses.length} expense{expenses.length === 1 ? "" : "s"}
          </h2>
          <p className="text-sm text-fg-soft">
            Total: <strong className="text-fg">{pkr(total)}</strong>
          </p>
        </div>
        {expenses.length === 0 ? (
          <p className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-8 text-center text-sm text-fg-soft">
            No expenses logged yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-border">
            <table className="w-full min-w-[42rem] text-sm">
              <thead className="bg-bg-soft">
                <tr className="text-left">
                  <th className="pf-label p-3">Date</th>
                  <th className="pf-label p-3">Category</th>
                  <th className="pf-label p-3">Description</th>
                  <th className="pf-label p-3 text-right">Amount</th>
                  <th className="pf-label p-3">By</th>
                  <th className="pf-label p-3"></th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((x) => (
                  <tr key={x.id} className="border-t border-border">
                    <td className="p-3 text-fg-soft">{x.expense_date}</td>
                    <td className="p-3">
                      <span className="rounded-full bg-bg-soft px-3 py-1 text-xs">
                        {catLabel(x.category)}
                      </span>
                    </td>
                    <td className="p-3">
                      {x.description}
                      {x.notes && (
                        <span className="block text-xs text-fg-faint">
                          {x.notes}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right font-medium tabular-nums">
                      {pkr(x.amount)}
                    </td>
                    <td className="p-3 text-fg-soft">{x.created_by ?? "—"}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => remove(x.id)}
                        className="text-xs text-accent-rose hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
