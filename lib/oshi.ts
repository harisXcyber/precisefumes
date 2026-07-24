import "server-only";

/**
 * Oshi Courier integration.
 *
 * Oshi is a courier aggregator: one API books through TCS, Leopards, etc.
 * All endpoints are POST + JSON, authenticated by clients + token in the body.
 * COD-native — `total` is the cash amount the rider collects on delivery.
 */

const BASE = "https://oshicourier.pk";

function creds() {
  return {
    clients: process.env.OSHI_CLIENT_ID ?? "",
    token: process.env.OSHI_TOKEN ?? "",
  };
}

export function oshiConfigured(): boolean {
  const { clients, token } = creds();
  return Boolean(clients && token);
}

/** Couriers enabled on this Oshi account (from the Shippers endpoint). */
export const OSHI_COURIERS: { id: string; label: string }[] = [
  { id: "1", label: "TCS" },
  { id: "3", label: "Leopards" },
];

export function courierLabel(id: string | null | undefined): string {
  return OSHI_COURIERS.find((c) => c.id === String(id))?.label ?? "Courier";
}

/**
 * Our checkout cities → Oshi city IDs (from the Cities endpoint).
 * Checkout only offers these, so every order maps cleanly.
 */
const CITY_IDS: Record<string, string> = {
  karachi: "1024",
  lahore: "1025",
  islamabad: "1026",
  rawalpindi: "1038",
  hyderabad: "1046",
  faisalabad: "1028",
  multan: "1039",
  peshawar: "1027",
  quetta: "1031",
};

export function cityToOshiId(city: string): string | null {
  return CITY_IDS[String(city ?? "").trim().toLowerCase()] ?? null;
}

/** Normalise a PK mobile to the 03XXXXXXXXX shape Oshi expects. */
function toLocalMobile(raw: string): string {
  const digits = String(raw ?? "").replace(/\D/g, "");
  if (digits.startsWith("92") && digits.length === 12) return "0" + digits.slice(2);
  if (digits.startsWith("0") && digits.length === 11) return digits;
  if (digits.length === 10) return "0" + digits;
  return digits;
}

async function post(path: string, body: Record<string, unknown>) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...creds(), ...body }),
    cache: "no-store",
  });
  return res;
}

export interface BookInput {
  ref: string; // our order ref, e.g. PF-1234
  name: string;
  email?: string;
  mobile: string;
  city: string; // our city string, e.g. "Karachi"
  address: string;
  itemsSummary: string; // "Rogue, Legacy ×2"
  qty: number;
  codAmount: number; // cash to collect
  courier: string; // Oshi shipment_services id ("1" TCS, "3" Leopards)
  openAllow?: boolean; // may the buyer open before paying? default false
}

export interface BookResult {
  ok: boolean;
  tracking?: string;
  service?: string;
  oshiId?: string; // Oshi order id — needed for cancel/track
  error?: string;
}

/** Estimate parcel weight (kg) from bottle count — courier min is 0.5kg. */
function estimateWeight(qty: number): string {
  return Math.max(0.5, Math.round(qty * 0.35 * 10) / 10).toString();
}

export async function bookShipment(input: BookInput): Promise<BookResult> {
  if (!oshiConfigured()) return { ok: false, error: "Oshi is not configured." };
  const cityId = cityToOshiId(input.city);
  if (!cityId) {
    return {
      ok: false,
      error: `City "${input.city}" isn't mapped to Oshi. Book this one in the portal.`,
    };
  }
  try {
    const res = await post("/bookingapi", {
      name: input.name,
      email: input.email ?? "",
      mobile: toLocalMobile(input.mobile),
      city: cityId,
      address: input.address,
      details: input.itemsSummary,
      qty: String(Math.max(1, input.qty)),
      weight: estimateWeight(input.qty),
      total: String(Math.round(input.codAmount)),
      source: "Precise Fumes",
      open_allow: input.openAllow ? "1" : "0",
      shipment_services: input.courier,
      client_order_id: input.ref,
    });
    const data = await res.json().catch(() => null);
    if (!data || data.success !== "true") {
      return { ok: false, error: data?.errors || "Oshi rejected the booking." };
    }
    return {
      ok: true,
      tracking: String(data.tracking),
      service: data.service ? String(data.service) : undefined,
      oshiId: String(data.id),
    };
  } catch {
    return { ok: false, error: "Couldn't reach Oshi. Try again." };
  }
}

export interface TrackEvent {
  status: string;
  createdon: string | null;
}

export async function trackShipment(
  oshiId: string,
  tracking: string
): Promise<{ ok: boolean; events?: TrackEvent[]; latest?: string; error?: string }> {
  if (!oshiConfigured()) return { ok: false, error: "Oshi is not configured." };
  try {
    const res = await post("/trackingapi", { id: oshiId, shipped_ref: tracking });
    const data = await res.json().catch(() => null);
    if (!Array.isArray(data)) {
      return { ok: false, error: "No tracking available yet." };
    }
    const events = data as TrackEvent[];
    return { ok: true, events, latest: events[events.length - 1]?.status };
  } catch {
    return { ok: false, error: "Couldn't reach Oshi." };
  }
}

export async function cancelShipment(
  oshiId: string
): Promise<{ ok: boolean; error?: string }> {
  if (!oshiConfigured()) return { ok: false, error: "Oshi is not configured." };
  try {
    const res = await post("/cancelapi", { id: oshiId });
    const data = await res.json().catch(() => null);
    if (!data || data.success !== "true") {
      return { ok: false, error: data?.errors || "Could not cancel." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Couldn't reach Oshi." };
  }
}

/** Fetch the A4 shipping-label PDF for one or more tracking numbers. */
export async function labelPdf(
  trackingNos: string
): Promise<{ ok: boolean; pdf?: ArrayBuffer; error?: string }> {
  if (!oshiConfigured()) return { ok: false, error: "Oshi is not configured." };
  try {
    const res = await post("/pdfapi", { trackingnos: trackingNos });
    const type = res.headers.get("content-type") ?? "";
    if (!type.includes("pdf")) {
      return { ok: false, error: "Label not ready yet." };
    }
    return { ok: true, pdf: await res.arrayBuffer() };
  } catch {
    return { ok: false, error: "Couldn't reach Oshi." };
  }
}
