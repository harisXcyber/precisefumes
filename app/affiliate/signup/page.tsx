import { Metadata } from "next";
import { AffiliateSignupForm } from "@/components/affiliate/signup-form";

export const metadata: Metadata = {
  title: "Become an Affiliate",
  description:
    "Join the Precise Fumes affiliate program and earn PKR 300 per sale.",
};

export default function AffiliateSignup() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      {/* Hero */}
      <section className="bg-invert-bg text-invert-fg pt-40 pb-16 md:pt-44 md:pb-20">
        <div className="container-lux text-center max-w-2xl mx-auto">
          <h1 className="font-serif text-5xl md:text-6xl font-light mb-6">
            Become an Affiliate
          </h1>
          <p className="text-lg text-invert-fg/80">
            Earn PKR 300 commission on every sale you refer. Share Precise Fumes
            with your network and get rewarded.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="container-lux py-16 md:py-20 max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl font-light mb-12 text-center">
          Why Join Our Affiliate Program?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="mb-4 text-4xl">💰</div>
            <h3 className="font-serif text-xl font-light mb-3">Earn Per Sale</h3>
            <p className="text-sm text-fg-soft">
              Get PKR 300 commission for every fragrance sold through your unique
              bonus code.
            </p>
          </div>

          <div className="text-center">
            <div className="mb-4 text-4xl">🎁</div>
            <h3 className="font-serif text-xl font-light mb-3">Exclusive Code</h3>
            <p className="text-sm text-fg-soft">
              Your referral code gives customers PKR 2,500 pricing on single
              fragrances — a real incentive to share.
            </p>
          </div>

          <div className="text-center">
            <div className="mb-4 text-4xl">💳</div>
            <h3 className="font-serif text-xl font-light mb-3">Easy Payouts</h3>
            <p className="text-sm text-fg-soft">
              Get paid via EasyPaisa or JazzCash. No hassle, no delays.
            </p>
          </div>
        </div>

        <div className="bg-bg-soft p-8 rounded-[var(--radius)] mb-12">
          <h3 className="font-serif text-2xl font-light mb-4">How It Works</h3>
          <ol className="space-y-4 text-fg-soft">
            <li className="flex gap-4">
              <span className="font-serif text-lg text-accent">1.</span>
              <div>
                <p className="font-medium">Sign Up</p>
                <p className="text-sm">
                  Complete the form below with your details and banking info.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-serif text-lg text-accent">2.</span>
              <div>
                <p className="font-medium">Verify Email</p>
                <p className="text-sm">
                  Check your email for a verification link to activate your account.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-serif text-lg text-accent">3.</span>
              <div>
                <p className="font-medium">Get Your Code</p>
                <p className="text-sm">
                  Receive your unique bonus code and start sharing with your network.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-serif text-lg text-accent">4.</span>
              <div>
                <p className="font-medium">Earn & Track</p>
                <p className="text-sm">
                  Monitor your sales and commissions in your affiliate dashboard.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* Signup Form */}
      <section className="container-lux py-16 md:py-20 max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl font-light mb-12 text-center">
          Get Started
        </h2>
        <AffiliateSignupForm />
      </section>
    </div>
  );
}
