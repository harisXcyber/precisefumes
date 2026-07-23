import { NextRequest, NextResponse } from "next/server";
import { adminConfigured, createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, contactNotificationEmail } from "@/lib/email";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const isNewsletter = name === "Newsletter";

    if (adminConfigured()) {
      const supabase = createAdminClient();
      if (isNewsletter) {
        await supabase
          .from("newsletter_subscribers")
          .upsert({ email: email.toLowerCase() }, { onConflict: "email" });
      } else {
        await supabase
          .from("contact_messages")
          .insert({ name, email, message });
      }
    } else {
      console.log("Contact form (no DB):", { name, email, message });
    }

    // Notify the house inbox — best-effort.
    if (!isNewsletter) {
      await sendEmail({
        to: "contact@precisefumes.com",
        subject: `New message from ${name}`,
        html: contactNotificationEmail(name, email, message),
      }).catch(() => ({ sent: false }));
    }

    return NextResponse.json({ message: "Received" }, { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
