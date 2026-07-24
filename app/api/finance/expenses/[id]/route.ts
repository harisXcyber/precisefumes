import { NextRequest, NextResponse } from "next/server";
import { isFinanceUser } from "@/lib/finance-auth";
import { createAdminClient, adminConfigured } from "@/lib/supabase/admin";

export async function DELETE(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isFinanceUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!adminConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const { id } = await ctx.params;
  const supabase = createAdminClient();
  const { error } = await supabase.from("finance_expenses").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: "Could not delete." }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
