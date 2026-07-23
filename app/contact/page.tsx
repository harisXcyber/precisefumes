import { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Precise Fumes. We'd love to hear from you.",
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      {/* Hero */}
      <section className="bg-invert-bg text-invert-fg py-20 md:py-24">
        <div className="container-lux text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-light">
            Get in Touch
          </h1>
          <p className="mt-4 text-invert-fg/80">
            Questions or feedback? We're here to help.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container-lux py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-16 max-w-4xl mx-auto">
          {/* Info */}
          <div>
            <h2 className="font-serif text-3xl font-light mb-12">
              Contact Details
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="pf-eyebrow mb-2">Email</h3>
                <a
                  href="mailto:contact@precisefumes.com"
                  className="text-lg link-underline"
                >
                  contact@precisefumes.com
                </a>
              </div>

              <div>
                <h3 className="pf-eyebrow mb-2">Hours</h3>
                <p className="text-fg-soft">
                  Monday – Saturday
                  <br />
                  10:00 – 19:00 PKT
                </p>
              </div>

              <div>
                <h3 className="pf-eyebrow mb-2">Location</h3>
                <p className="text-fg-soft">
                  Karachi
                  <br />
                  Pakistan
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="font-serif text-3xl font-light mb-8">
              Send us a Message
            </h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
