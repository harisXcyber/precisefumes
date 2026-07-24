import type { Metadata } from "next";
import { isFinanceUser } from "@/lib/finance-auth";
import { fetchFinance } from "@/lib/finance-data";
import { FinanceLogin } from "@/components/finance/finance-login";
import { FinanceDashboard } from "@/components/finance/finance-dashboard";

export const metadata: Metadata = {
  title: "Finances",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function FinancesPage() {
  if (!(await isFinanceUser())) return <FinanceLogin />;

  const { sales, expenses } = await fetchFinance();
  return <FinanceDashboard sales={sales} expenses={expenses} />;
}
