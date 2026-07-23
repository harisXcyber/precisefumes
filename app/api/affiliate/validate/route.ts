import { NextRequest, NextResponse } from "next/server";
import { adminConfigured, createAdminClient } from "@/lib/supabase/admin";

/** Fallback shape check used only before the database is connected. */
const CODE_PATTERN = /^(ROGUE|ROYAL|BLOOM|BLOSSOM|LEGACY)[A-Z0-9]{2}$/;

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { valid: false, error: "No code provided." },
        { status: 400 }
      );
    }

    const normalized = code.trim().toUpperCase();

    if (adminConfigured()) {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("affiliates")
        .select("referral_code")
        .eq("referral_code", normalized)
        .eq("status", "active")
        .maybeSingle();

      if (!data) {
        return NextResponse.json(
          {
            valid: false,
            error: "This code is not valid. Check the spelling and try again.",
          },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { valid: true, code: normalized, singlePerfumePrice: 2500 },
        { status: 200 }
      );
    }

    // Pre-database fallback: format check only.
    if (!CODE_PATTERN.test(normalized)) {
      return NextResponse.json(
        {
          valid: false,
          error: "This code is not valid. Check the spelling and try again.",
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { valid: true, code: normalized, singlePerfumePrice: 2500 },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { valid: false, error: "Could not validate the code." },
      { status: 500 }
    );
  }
}
