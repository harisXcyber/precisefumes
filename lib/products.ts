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
    category: row.category ?? "Unisex",
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

/** Fetch products with optional filters. Falls back to mock data when Supabase
 *  isn't configured yet, so the site is browsable during development. */
export async function getProducts(filters?: {
  featured?: boolean;
}): Promise<Product[]> {
  if (!supabaseConfigured()) {
    let results = MOCK_PRODUCTS.filter((p) => p.active);
    if (filters?.featured) {
      results = results.filter((p) => p.featured);
    }
    return results;
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  let query = supabase.from("products").select("*").eq("active", true);

  if (filters?.featured) {
    query = query.eq("featured", true);
  }

  const { data, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error || !data) {
    console.error("getProducts error:", error?.message);
    let fallback = MOCK_PRODUCTS.filter((p) => p.active);
    if (filters?.featured) {
      fallback = fallback.filter((p) => p.featured);
    }
    return fallback;
  }
  return data.map(rowToProduct);
}

/** Fetch a single product by slug. */
export async function getProduct(slug: string): Promise<Product | null> {
  if (!supabaseConfigured()) {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
  return rowToProduct(data);
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
