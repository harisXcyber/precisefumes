import { createClient } from "@supabase/supabase-js";

export interface Offer {
  id: string;
  offer_key: string | null; // 'bundle2' | 'pack4' | null (display-only)
  title: string;
  description: string | null;
  badge: string | null;
  active: boolean;
  ends_at: string | null;
  sort_order: number;
}

function publicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

/** Active, non-expired offers for the storefront. */
export async function getActiveOffers(): Promise<Offer[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const nowIso = new Date().toISOString();
    const { data, error } = await publicClient()
      .from("offers")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    return (data as Offer[]).filter(
      (o) => !o.ends_at || o.ends_at > nowIso
    );
  } catch {
    return [];
  }
}
