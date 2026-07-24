import { NextRequest, NextResponse } from "next/server";
import { isFinanceUser } from "@/lib/finance-auth";
import { createAdminClient, adminConfigured } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  if (!(await isFinanceUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!adminConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const b = await request.json();
  if (!b.item || !b.amount) {
    return NextResponse.json(
      { error: "Item and amount are required." },
      { status: 400 }
    );
  }
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("finance_sales")
    .insert({
      sale_date: b.saleDate || undefined,
      item: b.item,
      quantity: Number(b.quantity ?? 1),
      unit_price: Number(b.unitPrice ?? 0),
      amount: Number(b.amount),
      channel: b.channel || null,
      notes: b.notes || null,
      created_by: b.createdBy || null,
    })
    .select("id")
    .single();
  if (error) {
    return NextResponse.json({ error: "Could not save the sale." }, { status: 400 });
  }
  return NextResponse.json({ id: data.id });
}
