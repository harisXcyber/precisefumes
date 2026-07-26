import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { createAdminClient, adminConfigured } from "@/lib/supabase/admin";

type Ctx = { params: Promise<{ id: string }> };

const STATUSES = ["new", "contacted", "approved", "rejected"];

/** Update an influencer application's review status. */
export async function PATCH(request: NextRequest, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!adminConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const { id } = await ctx.params;
  const body = await request.json();
  if (!STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Unknown status" }, { status: 400 });
  }
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("influencer_applications")
    .update({ status: body.status })
    .eq("id", id);
  if (error) {
    return NextResponse.json({ error: "Could not update." }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
