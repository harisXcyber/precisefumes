import "server-only";
import type { Product } from "@/types";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

/** Returns true when Supabase env vars are present. */
function supabaseConfigured() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** Map a DB row (snake_case) to our Product type (camelCase). */
/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToProduct(row: any): Product {
  return {
    id: String(row.id),
    name: row.name,
    slug: row.slug,
    tagline: row.tagline ?? undefined,
    description: row.description ?? "",
    category: row.category ?? "Him",
    price: Number(row.price),
    compareAtPrice: row.compare_at_price
      ? Number(row.compare_at_price)
      : undefined,
    sizes: row.sizes ?? [],
    notes: row.notes ?? undefined,
    images: row.images ?? [],
    stock: Number(row.stock ?? 0),
    featured: !!row.featured,
    active: row.active ?? true,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function mockList(filters?: { featured?: boolean }): Product[] {
  let results = MOCK_PRODUCTS.filter((p) => p.active);
  if (filters?.featured) {
    results = results.filter((p) => p.featured);
  }
  return results;
}

/** Fetch products with optional filters. Falls back to the built-in
 *  catalog whenever Supabase is missing OR unreachable (including at
 *  build time, where request APIs like cookies() are unavailable —
 *  the try/catch keeps static generation safe). */
export async function getProducts(filters?: {
  featured?: boolean;
}): Promise<Product[]> {
  if (!supabaseConfigured()) return mockList(filters);

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    let query = supabase.from("products").select("*").eq("active", true);
    if (filters?.featured) query = query.eq("featured", true);

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error || !data || data.length === 0) return mockList(filters);
    return data.map(rowToProduct);
  } catch {
    return mockList(filters);
  }
}

/** Fetch a single product by slug. Build-safe like getProducts. */
export async function getProduct(slug: string): Promise<Product | null> {
  const mock = MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  if (!supabaseConfigured()) return mock;

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return mock;
    return rowToProduct(data);
  } catch {
    return mock;
  }
}

/** Related products in the same category (excluding the current one). */
export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const all = await getProducts();
  return all
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}
