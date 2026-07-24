import "server-only";
import { adminConfigured, createAdminClient } from "@/lib/supabase/admin";

export interface AdminOrder {
  id: string;
  ref: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  city: string;
  shipping_zone: string;
  shipping_fee: number;
  payment_method: string;
  payment_status: string;
  items: { name: string; size: string; quantity: number; price: number }[];
  subtotal: number;
  discount: number;
  promo_type: string | null;
  affiliate_code: string | null;
  affiliate_commission: number;
  status: string;
  tracking_note: string | null;
  confirmation_sent: boolean;
  created_at: string;
}

export async function fetchOrders(limit = 200): Promise<AdminOrder[]> {
  if (!adminConfigured()) return [];
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as AdminOrder[]) ?? [];
}

export async function fetchProducts() {
  if (!adminConfigured()) return [];
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function fetchProductById(id: string) {
  if (!adminConfigured()) return null;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}

export async function fetchAffiliates() {
  if (!adminConfigured()) return [];
  const supabase = createAdminClient();
  const { data: affiliates } = await supabase
    .from("affiliates")
    .select("id, email, name, referral_code, status, bank_method, bank_phone, bank_account_name, created_at")
    .order("created_at", { ascending: false });
  const { data: commissions } = await supabase
    .from("affiliate_orders")
    .select("affiliate_id, commission, status");

  return (affiliates ?? []).map((a) => {
    const mine = (commissions ?? []).filter((c) => c.affiliate_id === a.id);
    return {
      ...a,
      sales: mine.length,
      owed: mine
        .filter((c) => c.status !== "paid")
        .reduce((s, c) => s + c.commission, 0),
      paid: mine
        .filter((c) => c.status === "paid")
        .reduce((s, c) => s + c.commission, 0),
    };
  });
}

export async function fetchAllOffers() {
  if (!adminConfigured()) return [];
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("offers")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function fetchMessages() {
  if (!adminConfigured()) return { messages: [], subscribers: [] };
  const supabase = createAdminClient();
  const [{ data: messages }, { data: subscribers }] = await Promise.all([
    supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200),
  ]);
  return { messages: messages ?? [], subscribers: subscribers ?? [] };
}
