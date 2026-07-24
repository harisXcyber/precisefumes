import { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import {
  waLink,
  WHATSAPP_DISPLAY,
  CONTACT_EMAIL,
  HOURS,
} from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact — WhatsApp Us",
  description:
    "Chat with Precise Fumes on WhatsApp for the fastest reply — orders, scents, delivery and more. WhatsApp 0317 2388450.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      {/* Hero */}
      <section className="bg-invert-bg text-invert-fg pt-40 pb-16 md:pt-44 md:pb-20">
        <div className="container-lux text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-normal">
            Get in Touch
          </h1>
          <p className="mt-4 text-invert-fg/80">
            The fastest way to reach us is WhatsApp — we reply in minutes.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container-lux py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-16 max-w-4xl mx-auto">
          {/* WhatsApp-first info */}
          <div>
            {/* Primary: WhatsApp */}
            <div className="rounded-[var(--radius-lg)] border-2 border-[#25D366]/40 bg-[#25D366]/5 p-6">
              <p className="pf-eyebrow !text-[#1a8a4a]">
                Preferred · Fastest reply
              </p>
              <h2 className="mt-2 font-serif text-2xl font-normal">
                Chat on WhatsApp
              </h2>
              <p className="mt-2 text-sm text-fg-soft">
                Message us to order, ask about a scent, or check your delivery.
                We&apos;re quickest here.
              </p>
              <a
                href={waLink(
                  "Hi Precise Fumes! I'd like to ask about your perfumes."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
              >
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp {WHATSAPP_DISPLAY}
              </a>
            </div>

            {/* Secondary: hours, location, email */}
            <div className="mt-8 space-y-6">
              <div>
                <h3 className="pf-eyebrow mb-2">Hours</h3>
                <p className="text-fg-soft">{HOURS}</p>
              </div>
              <div>
                <h3 className="pf-eyebrow mb-2">Location</h3>
                <p className="text-fg-soft">Karachi, Pakistan</p>
              </div>
              <div>
                <h3 className="pf-eyebrow mb-2">Email (slower)</h3>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-sm text-fg-soft link-underline"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </div>

          {/* Form — secondary */}
          <div>
            <h2 className="font-serif text-2xl font-normal mb-2">
              Prefer to write?
            </h2>
            <p className="mb-6 text-sm text-fg-soft">
              Leave a message and we&apos;ll get back to you — though WhatsApp is
              always faster.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
