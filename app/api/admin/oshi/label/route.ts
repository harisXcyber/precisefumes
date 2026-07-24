import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { labelPdf, oshiConfigured } from "@/lib/oshi";

/** Stream the Oshi A4 shipping-label PDF for a tracking number. */
export async function GET(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!oshiConfigured()) {
    return NextResponse.json({ error: "Oshi is not configured." }, { status: 503 });
  }
  const tracking = request.nextUrl.searchParams.get("tracking");
  if (!tracking) {
    return NextResponse.json({ error: "Missing tracking" }, { status: 400 });
  }
  const result = await labelPdf(tracking);
  if (!result.ok || !result.pdf) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return new NextResponse(result.pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="label-${tracking}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
