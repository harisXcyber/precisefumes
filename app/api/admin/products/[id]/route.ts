import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { createAdminClient, adminConfigured } from "@/lib/supabase/admin";

type Ctx = { params: Promise<{ id: string }> };

/** Update a product. */
export async function PATCH(request: NextRequest, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!adminConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { id } = await ctx.params;
  const body = await request.json();

  const patch: Record<string, unknown> = {};
  if (body.name !== undefined) patch.name = body.name;
  if (body.slug !== undefined) patch.slug = String(body.slug).toLowerCase();
  if (body.tagline !== undefined) patch.tagline = body.tagline;
  if (body.description !== undefined) patch.description = body.description;
  if (body.category !== undefined)
    patch.category = body.category === "Her" ? "Her" : "Him";
  if (body.price !== undefined) patch.price = Number(body.price);
  if (body.compareAtPrice !== undefined)
    patch.compare_at_price = body.compareAtPrice
      ? Number(body.compareAtPrice)
      : null;
  if (body.sizes !== undefined) patch.sizes = body.sizes;
  if (body.notes !== undefined) patch.notes = body.notes;
  if (body.images !== undefined) patch.images = body.images;
  if (body.concentration !== undefined) patch.concentration = body.concentration;
  if (body.longevity !== undefined) patch.longevity = body.longevity;
  if (body.stock !== undefined) patch.stock = Number(body.stock);
  if (body.featured !== undefined) patch.featured = !!body.featured;
  if (body.active !== undefined) patch.active = !!body.active;
  if (body.sortOrder !== undefined) patch.sort_order = Number(body.sortOrder);

  const supabase = createAdminClient();
  const { error } = await supabase.from("products").update(patch).eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "Could not update the product." },
      { status: 400 }
    );
  }
  return NextResponse.json({ ok: true });
}

/** Delete a product. */
export async function DELETE(_request: NextRequest, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: "Could not delete." }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
