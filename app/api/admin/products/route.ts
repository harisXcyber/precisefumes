import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { createAdminClient, adminConfigured } from "@/lib/supabase/admin";

/** Create a product. */
export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!adminConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const body = await request.json();
  if (!body.name || !body.slug) {
    return NextResponse.json(
      { error: "Name and slug are required." },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      slug: String(body.slug).toLowerCase(),
      name: body.name,
      tagline: body.tagline ?? null,
      description: body.description ?? "",
      category: body.category === "Her" ? "Her" : "Him",
      price: Number(body.price) || 3000,
      compare_at_price: body.compareAtPrice ? Number(body.compareAtPrice) : null,
      sizes: body.sizes ?? [{ label: "50ml", price: Number(body.price) || 3000, stock: 999 }],
      notes: body.notes ?? { top: [], heart: [], base: [] },
      images: body.images ?? [],
      concentration: body.concentration ?? null,
      longevity: body.longevity ?? null,
      stock: Number(body.stock ?? 999),
      featured: !!body.featured,
      active: body.active !== false,
      sort_order: Number(body.sortOrder ?? 99),
    })
    .select("id")
    .single();

  if (error) {
    const msg = error.message.includes("duplicate")
      ? "A product with that slug already exists."
      : "Could not save the product.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  return NextResponse.json({ id: data.id });
}
