import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Affiliate Dashboard",
  robots: { index: false },
};

// Mock affiliate data (TODO: fetch from Supabase based on session)
const mockAffiliate = {
  email: "affiliate@example.com",
  name: "Ahmed Khan",
  referralCode: "ROGUE42",
  totalCommission: 4500,
  pendingCommission: 900,
  totalSales: 15,
  bankMethod: "EasyPaisa",
  bankPhone: "+92 300 1234567",
  createdAt: "2026-07-15",
};

export default function AffiliateDashboard() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <div className="container-lux py-12 md:py-20">
        <div className="max-w-4xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-serif text-5xl font-light mb-2">
              Affiliate Dashboard
            </h1>
            <p className="text-fg-soft">Welcome back, {mockAffiliate.name}!</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {/* Total Commission */}
            <div className="bg-bg-soft p-6 rounded-[var(--radius)]">
              <p className="pf-eyebrow mb-3">Total Earned</p>
              <p className="font-serif text-3xl mb-2">
                PKR {mockAffiliate.totalCommission.toLocaleString()}
              </p>
              <p className="text-xs text-fg-soft">All-time commissions</p>
            </div>

            {/* Pending Commission */}
            <div className="bg-bg-soft p-6 rounded-[var(--radius)]">
              <p className="pf-eyebrow mb-3">Pending Payout</p>
              <p className="font-serif text-3xl mb-2 text-accent">
                PKR {mockAffiliate.pendingCommission.toLocaleString()}
              </p>
              <p className="text-xs text-fg-soft">
                Available for withdrawal
              </p>
            </div>

            {/* Total Sales */}
            <div className="bg-bg-soft p-6 rounded-[var(--radius)]">
              <p className="pf-eyebrow mb-3">Total Sales</p>
              <p className="font-serif text-3xl mb-2">
                {mockAffiliate.totalSales}
              </p>
              <p className="text-xs text-fg-soft">Sales via your code</p>
            </div>

            {/* Avg Commission */}
            <div className="bg-bg-soft p-6 rounded-[var(--radius)]">
              <p className="pf-eyebrow mb-3">Average per Sale</p>
              <p className="font-serif text-3xl mb-2">
                PKR {Math.round(mockAffiliate.totalCommission / mockAffiliate.totalSales).toLocaleString()}
              </p>
              <p className="text-xs text-fg-soft">Typical commission</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left: Your Code */}
            <div className="md:col-span-2 space-y-8">
              <section className="bg-bg-soft p-8 rounded-[var(--radius)]">
                <h2 className="font-serif text-2xl font-light mb-6">
                  Your Referral Code
                </h2>
                <p className="text-fg-soft mb-4">
                  Share this code with friends to earn PKR 300 per sale. Customers who
                  use your code get special pricing.
                </p>
                <div className="p-6 bg-bg rounded-[var(--radius)] border-2 border-accent mb-4">
                  <p className="font-serif text-5xl tracking-widest text-center">
                    {mockAffiliate.referralCode}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(mockAffiliate.referralCode);
                      alert("Code copied!");
                    }}
                    className="flex-1 btn-primary justify-center"
                  >
                    Copy Code
                  </button>
                  <button
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-fg/20 rounded-[var(--radius)] hover:bg-bg-soft transition-colors"
                  >
                    Share on Social
                  </button>
                </div>
              </section>

              {/* Recent Sales */}
              <section>
                <h2 className="font-serif text-2xl font-light mb-6">
                  Recent Sales
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 pf-label">Date</th>
                        <th className="text-left py-3 pf-label">Product</th>
                        <th className="text-right py-3 pf-label">Amount</th>
                        <th className="text-right py-3 pf-label">Commission</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Mock sales */}
                      {[
                        {
                          date: "2026-07-22",
                          product: "Rogue 50ml",
                          amount: 4500,
                          commission: 300,
                        },
                        {
                          date: "2026-07-21",
                          product: "Bloom 30ml",
                          amount: 3000,
                          commission: 300,
                        },
                        {
                          date: "2026-07-20",
                          product: "Royal Oud 100ml",
                          amount: 7000,
                          commission: 300,
                        },
                      ].map((sale, idx) => (
                        <tr key={idx} className="border-b border-border text-fg-soft">
                          <td className="py-3">{sale.date}</td>
                          <td className="py-3">{sale.product}</td>
                          <td className="text-right py-3">
                            PKR {sale.amount.toLocaleString()}
                          </td>
                          <td className="text-right py-3 font-medium">
                            PKR {sale.commission}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Right: Settings & Info */}
            <div className="space-y-6">
              <section className="bg-bg-soft p-6 rounded-[var(--radius)]">
                <h3 className="font-serif text-lg font-light mb-4">
                  Account Details
                </h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="pf-eyebrow mb-1">Email</dt>
                    <dd className="text-fg-soft">{mockAffiliate.email}</dd>
                  </div>
                  <div>
                    <dt className="pf-eyebrow mb-1">Name</dt>
                    <dd className="text-fg-soft">{mockAffiliate.name}</dd>
                  </div>
                  <div>
                    <dt className="pf-eyebrow mb-1">Payment Method</dt>
                    <dd className="text-fg-soft">
                      {mockAffiliate.bankMethod}
                    </dd>
                  </div>
                  <div>
                    <dt className="pf-eyebrow mb-1">Phone</dt>
                    <dd className="text-fg-soft">{mockAffiliate.bankPhone}</dd>
                  </div>
                  <div>
                    <dt className="pf-eyebrow mb-1">Joined</dt>
                    <dd className="text-fg-soft">{mockAffiliate.createdAt}</dd>
                  </div>
                </dl>
              </section>

              <section className="bg-bg-soft p-6 rounded-[var(--radius)]">
                <h3 className="font-serif text-lg font-light mb-4">
                  Request Payout
                </h3>
                {mockAffiliate.pendingCommission > 0 ? (
                  <>
                    <p className="text-sm text-fg-soft mb-4">
                      You have PKR {mockAffiliate.pendingCommission} available.
                    </p>
                    <button className="btn-primary w-full justify-center text-sm">
                      Request Withdrawal
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-fg-soft">
                    No pending payouts. Make more sales to earn!
                  </p>
                )}
              </section>

              <section className="bg-bg-soft p-6 rounded-[var(--radius)]">
                <h3 className="font-serif text-lg font-light mb-4">
                  Need Help?
                </h3>
                <Link
                  href="/contact"
                  className="text-sm text-accent hover:underline font-medium"
                >
                  Contact Support →
                </Link>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
