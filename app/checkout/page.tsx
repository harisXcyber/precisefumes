import { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/checkout-client";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Precise Fumes order",
  robots: { index: false },
};

export default function Checkout() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <div className="container-lux py-12 md:py-20">
        <h1 className="font-serif text-4xl md:text-5xl font-light mb-12">
          Checkout
        </h1>
        <CheckoutClient />
      </div>
    </div>
  );
}
