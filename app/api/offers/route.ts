import { NextResponse } from "next/server";
import { getActiveOffers } from "@/lib/offers";

export const revalidate = 60; // refresh at most once a minute

export async function GET() {
  const offers = await getActiveOffers();
  return NextResponse.json({ offers });
}
