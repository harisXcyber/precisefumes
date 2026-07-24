import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { createAdminClient, adminConfigured } from "@/lib/supabase/admin";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!adminConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const { id } = await ctx.params;
  const b = await request.json();
  const patch: Record<string, unknown> = {};
  if (b.title !== undefined) patch.title = b.title;
  if (b.description !== undefined) patch.description = b.description || null;
  if (b.badge !== undefined) patch.badge = b.badge || null;
  if (b.active !== undefined) patch.active = !!b.active;
  if (b.endsAt !== undefined) patch.ends_at = b.endsAt || null;
  if (b.sortOrder !== undefined) patch.sort_order = Number(b.sortOrder);

  const supabase = createAdminClient();
  const { error } = await supabase.from("offers").update(patch).eq("id", id);
  if (error) {
    return NextResponse.json({ error: "Could not update offer." }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: NextRequest, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const supabase = createAdminClient();
  // Don't hard-delete the built-in pricing offers — deactivate instead.
  const { data: row } = await supabase
    .from("offers")
    .select("offer_key")
    .eq("id", id)
    .maybeSingle();
  if (row?.offer_key) {
    await supabase.from("offers").update({ active: false }).eq("id", id);
    return NextResponse.json({ ok: true, deactivated: true });
  }
  const { error } = await supabase.from("offers").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: "Could not delete offer." }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
