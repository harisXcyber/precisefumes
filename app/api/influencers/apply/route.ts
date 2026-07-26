import { NextRequest, NextResponse } from "next/server";
import { adminConfigured, createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";
import { normalizePkMobile } from "@/lib/contact";

const TIERS = ["collab", "signature", "brand"] as const;

/** Influencer programme application. */
export async function POST(request: NextRequest) {
  try {
    const b = await request.json();
    const { name, phone, email, instagram, followers, avgViews, avgLikes, tier, pitch } = b;

    if (!name || !phone || !instagram || !followers || !avgViews || !tier) {
      return NextResponse.json(
        { error: "Please fill in every required field." },
        { status: 400 }
      );
    }
    if (!TIERS.includes(tier)) {
      return NextResponse.json({ error: "Pick a tier." }, { status: 400 });
    }
    const normalizedPhone = normalizePkMobile(phone);
    if (!normalizedPhone) {
      return NextResponse.json(
        { error: "Enter a valid Pakistani WhatsApp number (e.g. 03001234567)." },
        { status: 400 }
      );
    }

    const handle = String(instagram).trim().replace(/^@/, "");

    if (adminConfigured()) {
      const supabase = createAdminClient();
      const { error } = await supabase.from("influencer_applications").insert({
        name: String(name).trim(),
        phone: normalizedPhone,
        email: email ? String(email).trim().toLowerCase() : null,
        instagram: handle,
        followers: String(followers).trim(),
        avg_views: String(avgViews).trim(),
        avg_likes: avgLikes ? String(avgLikes).trim() : null,
        tier,
        pitch: pitch ? String(pitch).trim().slice(0, 2000) : null,
      });
      if (error) {
        console.error("Influencer application insert failed:", error.message);
        return NextResponse.json(
          { error: "Could not submit your application. Please try again." },
          { status: 500 }
        );
      }
    }

    // Heads-up to the store inbox — best-effort.
    sendEmail({
      to: "contact@precisefumes.com",
      subject: `New influencer application — ${name} (${tier})`,
      html: `<h2>New influencer application</h2>
<p><strong>Name:</strong> ${String(name)}<br/>
<strong>Tier:</strong> ${tier}<br/>
<strong>WhatsApp:</strong> ${normalizedPhone}<br/>
<strong>Instagram:</strong> @${handle}<br/>
<strong>Followers:</strong> ${String(followers)}<br/>
<strong>Avg reel views:</strong> ${String(avgViews)}<br/>
<strong>Avg likes:</strong> ${avgLikes ? String(avgLikes) : "—"}<br/>
<strong>Email:</strong> ${email ? String(email) : "—"}</p>
<p>${pitch ? String(pitch) : ""}</p>
<p>Review it in Admin → Influencers.</p>`,
    }).catch(() => ({ sent: false }));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Influencer application error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
