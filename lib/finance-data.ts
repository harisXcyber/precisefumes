import "server-only";
import { adminConfigured, createAdminClient } from "@/lib/supabase/admin";

export interface Sale {
  id: string;
  sale_date: string;
  item: string;
  quantity: number;
  unit_price: number;
  amount: number;
  channel: string | null;
  notes: string | null;
  created_by: string | null;
}

export interface Expense {
  id: string;
  expense_date: string;
  category: string;
  description: string;
  amount: number;
  notes: string | null;
  created_by: string | null;
}

export async function fetchFinance(): Promise<{
  sales: Sale[];
  expenses: Expense[];
}> {
  if (!adminConfigured()) return { sales: [], expenses: [] };
  const supabase = createAdminClient();
  const [{ data: sales }, { data: expenses }] = await Promise.all([
    supabase
      .from("finance_sales")
      .select("*")
      .order("sale_date", { ascending: false })
      .limit(1000),
    supabase
      .from("finance_expenses")
      .select("*")
      .order("expense_date", { ascending: false })
      .limit(1000),
  ]);
  return {
    sales: (sales as Sale[]) ?? [],
    expenses: (expenses as Expense[]) ?? [],
  };
}
