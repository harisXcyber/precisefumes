import { NextRequest, NextResponse } from "next/server";

/** Bonus codes are generated as SCENT + 2 chars (e.g. ROGUE4X).
 *  TODO: replace the format check with a Supabase lookup against
 *  the affiliate_codes table once the database is connected. */
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
      {
        valid: true,
        code: normalized,
        singlePerfumePrice: 2500,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { valid: false, error: "Could not validate the code." },
      { status: 500 }
    );
  }
}
