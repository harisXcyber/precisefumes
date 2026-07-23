"use client";

import { FormEvent, useState, useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";

type ShippingOption = "karachi" | "nationwide";
type PaymentMethod = "cod" | "transfer";

export function CheckoutClient() {
  const { items, subtotal, total, getPromoInfo } = useCart();
  const [shippingOption, setShippingOption] = useState<ShippingOption>(
    "karachi"
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const subtotalAmount = subtotal();
  const promo = getPromoInfo();
  const cartTotal = total();
  const shippingFee = shippingOption === "karachi" ? 0 : 300;
  const shippingDays =
    shippingOption === "karachi" ? "2–5 working days" : "5–7 working days";
  const finalTotal = cartTotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-fg-soft mb-6">Your cart is empty.</p>
        <Link href="/shop" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    const formData = new FormData(e.currentTarget);
    const orderData = {
      customer: {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        city: formData.get("city"),
      },
      shipping: {
        option: shippingOption,
        fee: shippingFee,
      },
      payment: {
        method: paymentMethod,
        proofUrl: paymentMethod === "transfer" ? formData.get("proofUrl") : null,
      },
      affiliateCode: formData.get("affiliateCode") || null,
      items: items,
      subtotal: subtotalAmount,
      promoDiscount: promo.discountAmount,
      cartTotal: cartTotal,
      total: finalTotal,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        const { orderId } = await res.json();
        setSubmitMessage({
          type: "success",
          text: "Order placed successfully! Redirecting...",
        });
        setTimeout(() => {
          window.location.href = `/order-confirmation/${orderId}`;
        }, 1500);
      } else {
        setSubmitMessage({
          type: "error",
          text: "Failed to place order. Please try again.",
        });
      }
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-16">
      {/* Order Review */}
      <div className="md:order-2">
        <div className="sticky top-20">
          <h2 className="font-serif text-2xl font-light mb-6">Order Review</h2>

          {/* Items */}
          <div className="space-y-4 mb-6 pb-6 border-b border-border">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-fg-soft text-xs">
                    {item.size} × {item.quantity}
                  </p>
                </div>
                <p>PKR {formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-fg-soft">Subtotal</span>
              <span>PKR {formatPrice(subtotalAmount)}</span>
            </div>

            {promo.discountAmount > 0 && (
              <div className="flex justify-between text-accent">
                <span className="text-sm">{promo.description}</span>
                <span>−PKR {formatPrice(promo.discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-border">
              <span className="text-fg-soft">Cart Total</span>
              <span>PKR {formatPrice(cartTotal)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-fg-soft">
                Shipping ({shippingDays})
              </span>
              <span>{shippingFee === 0 ? "Free" : `PKR ${shippingFee}`}</span>
            </div>

            <div className="flex justify-between font-serif text-lg pt-4 border-t border-border">
              <span>Total</span>
              <span>PKR {formatPrice(finalTotal)}</span>
            </div>
          </div>

          {/* Payment Note */}
          <div className="bg-bg-soft p-4 rounded-[var(--radius)] text-xs text-fg-soft">
            {paymentMethod === "cod"
              ? "Payment will be collected upon delivery."
              : "Please arrange payment via the details provided after order placement."}
          </div>
        </div>
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="space-y-8 md:order-1">
        {/* Customer Info */}
        <fieldset className="space-y-4">
          <legend className="font-serif text-xl font-light mb-6">
            Delivery Information
          </legend>

          <div>
            <label htmlFor="name" className="block pf-label mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block pf-label mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block pf-label mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              placeholder="+92 300 1234567"
            />
          </div>

          <div>
            <label htmlFor="address" className="block pf-label mb-2">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              required
              placeholder="Street address"
            />
          </div>

          <div>
            <label htmlFor="city" className="block pf-label mb-2">
              City
            </label>
            <select id="city" name="city" required className="w-full">
              <option value="">Select your city</option>
              <option value="Karachi">Karachi (Free shipping)</option>
              <option value="Lahore">Lahore (PKR 300)</option>
              <option value="Islamabad">Islamabad (PKR 300)</option>
              <option value="Hyderabad">Hyderabad (PKR 300)</option>
              <option value="Peshawar">Peshawar (PKR 300)</option>
              <option value="Multan">Multan (PKR 300)</option>
              <option value="Other">Other (PKR 300)</option>
            </select>
          </div>
        </fieldset>

        {/* Shipping Option */}
        <fieldset className="space-y-4">
          <legend className="font-serif text-xl font-light mb-6">
            Shipping
          </legend>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="shipping"
              value="karachi"
              checked={shippingOption === "karachi"}
              onChange={(e) => setShippingOption(e.target.value as ShippingOption)}
              className="mt-1"
            />
            <div>
              <p className="font-medium">Karachi (Free)</p>
              <p className="text-xs text-fg-soft">2–5 working days</p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="shipping"
              value="nationwide"
              checked={shippingOption === "nationwide"}
              onChange={(e) => setShippingOption(e.target.value as ShippingOption)}
              className="mt-1"
            />
            <div>
              <p className="font-medium">Nationwide (PKR 300)</p>
              <p className="text-xs text-fg-soft">5–7 working days</p>
            </div>
          </label>
        </fieldset>

        {/* Payment Method */}
        <fieldset className="space-y-4">
          <legend className="font-serif text-xl font-light mb-6">
            Payment Method
          </legend>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="mt-1"
            />
            <div>
              <p className="font-medium">Cash on Delivery</p>
              <p className="text-xs text-fg-soft">
                Pay when your order arrives
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="transfer"
              checked={paymentMethod === "transfer"}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="mt-1"
            />
            <div>
              <p className="font-medium">Bank Transfer</p>
              <p className="text-xs text-fg-soft">
                EasyPaisa / JazzCash (details after order)
              </p>
            </div>
          </label>

          {paymentMethod === "transfer" && (
            <div className="bg-bg-soft p-4 rounded-[var(--radius)]">
              <label htmlFor="proofUrl" className="block pf-label mb-2">
                Proof of Payment (URL or upload)
              </label>
              <input
                type="text"
                id="proofUrl"
                name="proofUrl"
                placeholder="Link to proof of payment"
              />
              <p className="text-xs text-fg-soft mt-2">
                You can provide this after placing your order.
              </p>
            </div>
          )}
        </fieldset>

        {/* Affiliate Code */}
        <fieldset>
          <label htmlFor="affiliateCode" className="block pf-label mb-2">
            Affiliate / Bonus Code (Optional)
          </label>
          <input
            type="text"
            id="affiliateCode"
            name="affiliateCode"
            placeholder="Enter code for discount"
          />
          <p className="text-xs text-fg-soft mt-2">
            If you have a bonus code, enter it here for special pricing.
          </p>
        </fieldset>

        {submitMessage && (
          <div
            className={`text-sm p-4 rounded ${
              submitMessage.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {submitMessage.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full justify-center"
        >
          {isSubmitting ? "Placing Order..." : `Place Order – PKR ${formatPrice(finalTotal)}`}
        </button>

        <p className="text-xs text-fg-soft text-center">
          By placing this order, you agree to our{" "}
          <Link href="/terms" className="link-underline">
            terms of service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="link-underline">
            privacy policy
          </Link>
          .
        </p>
      </form>
    </div>
  );
}
