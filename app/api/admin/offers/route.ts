import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { createAdminClient, adminConfigured } from "@/lib/supabase/admin";

/** Create a display-only promotional offer (offer_key stays null;
 *  the two pricing offers bundle2/pack4 are seeded and edited in place). */
export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!adminConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const b = await request.json();
  if (!b.title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("offers")
    .insert({
      offer_key: null,
      title: b.title,
      description: b.description || null,
      badge: b.badge || null,
      active: b.active !== false,
      ends_at: b.endsAt || null,
      sort_order: Number(b.sortOrder ?? 50),
    })
    .select("id")
    .single();
  if (error) {
    return NextResponse.json({ error: "Could not create offer." }, { status: 400 });
  }
  return NextResponse.json({ id: data.id });
}
