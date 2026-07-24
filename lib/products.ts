import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Product } from "@/types";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

/** Returns true when the public Supabase credentials are present. */
function supabaseConfigured() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** Cookie-free client so these reads stay safe inside
 *  generateStaticParams / static rendering. Products are publicly
 *  readable by RLS policy, so the anon key is enough. */
function publicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function rowToProduct(row: any): Product {
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
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    notes: row.notes ?? undefined,
    images: Array.isArray(row.images) ? row.images : [],
    stock: Number(row.stock ?? 0),
    featured: !!row.featured,
    active: row.active ?? true,
    concentration: row.concentration ?? undefined,
    longevity: row.longevity ?? undefined,
    sortOrder: row.sort_order ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function mockList(filters?: { featured?: boolean }): Product[] {
  let results = MOCK_PRODUCTS.filter((p) => p.active);
  if (filters?.featured) results = results.filter((p) => p.featured);
  return results;
}

/** Active products, ordered as arranged in the admin panel.
 *  Falls back to the built-in catalog if the database is
 *  unreachable, so the storefront can never go blank. */
export async function getProducts(filters?: {
  featured?: boolean;
}): Promise<Product[]> {
  if (!supabaseConfigured()) return mockList(filters);

  try {
    let query = publicClient()
      .from("products")
      .select("*")
      .eq("active", true);
    if (filters?.featured) query = query.eq("featured", true);

    const { data, error } = await query.order("sort_order", {
      ascending: true,
    });

    if (error || !data || data.length === 0) return mockList(filters);
    return data.map(rowToProduct);
  } catch {
    return mockList(filters);
  }
}

/** Single product by slug. */
export async function getProduct(slug: string): Promise<Product | null> {
  const mock = MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  if (!supabaseConfigured()) return mock;

  try {
    const { data, error } = await publicClient()
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();

    if (error || !data) return mock;
    return rowToProduct(data);
  } catch {
    return mock;
  }
}

/** Every active slug — used to pre-render product pages. */
export async function getProductSlugs(): Promise<string[]> {
  if (!supabaseConfigured()) return MOCK_PRODUCTS.map((p) => p.slug);
  try {
    const { data, error } = await publicClient()
      .from("products")
      .select("slug")
      .eq("active", true);
    if (error || !data || data.length === 0) {
      return MOCK_PRODUCTS.map((p) => p.slug);
    }
    return data.map((r) => r.slug as string);
  } catch {
    return MOCK_PRODUCTS.map((p) => p.slug);
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
