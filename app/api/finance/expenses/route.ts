import { NextRequest, NextResponse } from "next/server";
import { isFinanceUser } from "@/lib/finance-auth";
import { createAdminClient, adminConfigured } from "@/lib/supabase/admin";

const CATEGORIES = [
  "perfume_cost",
  "transportation",
  "delivery",
  "packaging",
  "additional",
  "other",
];

export async function POST(request: NextRequest) {
  if (!(await isFinanceUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!adminConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const b = await request.json();
  if (!b.description || !b.amount) {
    return NextResponse.json(
      { error: "Description and amount are required." },
      { status: 400 }
    );
  }
  const category = CATEGORIES.includes(b.category) ? b.category : "other";
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("finance_expenses")
    .insert({
      expense_date: b.expenseDate || undefined,
      category,
      description: b.description,
      amount: Number(b.amount),
      notes: b.notes || null,
      created_by: b.createdBy || null,
    })
    .select("id")
    .single();
  if (error) {
    return NextResponse.json({ error: "Could not save the expense." }, { status: 400 });
  }
  return NextResponse.json({ id: data.id });
}
