import { NextRequest, NextResponse } from "next/server";

// Generate unique order reference
function generateOrderRef(): string {
  const prefix = "PF";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer, shipping, payment, affiliateCode, items, subtotal, total } =
      body;

    // Validation
    if (
      !customer?.name ||
      !customer?.email ||
      !customer?.phone ||
      !customer?.address ||
      !customer?.city
    ) {
      return NextResponse.json(
        { error: "Missing customer information" },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Create order (for now, just log and return mock response)
    // TODO: Store in Supabase when configured
    const orderId = generateOrderRef();
    console.log("Order created:", {
      orderId,
      customer,
      shipping,
      payment,
      affiliateCode,
      items,
      subtotal,
      total,
      createdAt: new Date().toISOString(),
    });

    // TODO: Send order confirmation email via Resend/SendGrid

    return NextResponse.json(
      {
        orderId,
        message: "Order placed successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Orders API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
