import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  robots: { index: false },
};

export default function Privacy() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <div className="container-lux py-20 max-w-3xl">
        <h1 className="font-serif text-5xl font-light mb-12">Privacy Policy</h1>

        <div className="prose prose-invert max-w-none space-y-8 text-base leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl font-light mb-4">
              Introduction
            </h2>
            <p className="text-fg-soft">
              At Precise Fumes, we are committed to protecting your privacy and
              ensuring you have a positive experience on our website. This
              Privacy Policy explains how we collect, use, and protect your
              personal information.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light mb-4">
              Information We Collect
            </h2>
            <p className="text-fg-soft">
              We collect information you provide directly to us when you:
            </p>
            <ul className="list-disc list-inside text-fg-soft space-y-2 mt-4">
              <li>Place an order on our website</li>
              <li>Create an account</li>
              <li>Sign up for our newsletter</li>
              <li>Contact us with inquiries</li>
              <li>Join our affiliate program</li>
            </ul>
            <p className="text-fg-soft mt-4">
              This information may include your name, email address, phone
              number, mailing address, and payment information.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light mb-4">
              How We Use Your Information
            </h2>
            <p className="text-fg-soft">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc list-inside text-fg-soft space-y-2 mt-4">
              <li>To process and fulfill your orders</li>
              <li>To send order updates and shipping notifications</li>
              <li>To respond to your inquiries and provide customer support</li>
              <li>To send promotional emails (with your consent)</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light mb-4">
              Data Protection
            </h2>
            <p className="text-fg-soft">
              We implement appropriate security measures to protect your
              personal information from unauthorized access, alteration,
              disclosure, or destruction. However, no method of transmission
              over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light mb-4">
              Third-Party Sharing
            </h2>
            <p className="text-fg-soft">
              We do not sell, trade, or rent your personal information to third
              parties. We may share your information only with service providers
              who assist us in operating our website and conducting our business,
              subject to confidentiality agreements.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light mb-4">
              Cookies and Tracking
            </h2>
            <p className="text-fg-soft">
              Our website may use cookies and similar tracking technologies to
              enhance your browsing experience and analyze site usage. You can
              control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light mb-4">
              Your Rights
            </h2>
            <p className="text-fg-soft">
              You have the right to access, correct, or delete your personal
              information at any time. To do so, please contact us at{" "}
              <a href="mailto:contact@precisefumes.com" className="link-underline">
                contact@precisefumes.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light mb-4">
              Policy Updates
            </h2>
            <p className="text-fg-soft">
              We may update this Privacy Policy periodically. Any changes will
              be posted on this page with an updated effective date. Your
              continued use of our website constitutes your acceptance of the
              updated policy.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light mb-4">Contact Us</h2>
            <p className="text-fg-soft">
              If you have questions about this Privacy Policy or our privacy
              practices, please contact us at{" "}
              <a href="mailto:contact@precisefumes.com" className="link-underline">
                contact@precisefumes.com
              </a>
              .
            </p>
          </section>

          <p className="text-xs text-fg-faint pt-8">
            Last updated: July 2026
          </p>
        </div>
      </div>
    </div>
  );
}
