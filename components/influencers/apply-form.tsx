"use client";

import { FormEvent, useState } from "react";

const TIERS = [
  { key: "collab", label: "Tier 1 · The Collab" },
  { key: "signature", label: "Tier 2 · Your Signature Perfume" },
  { key: "brand", label: "Tier 3 · Your Own Brand" },
];

export function InfluencerApplyForm() {
  const [tier, setTier] = useState("collab");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/influencers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          phone: fd.get("phone"),
          email: fd.get("email"),
          instagram: fd.get("instagram"),
          followers: fd.get("followers"),
          avgViews: fd.get("avgViews"),
          avgLikes: fd.get("avgLikes"),
          tier,
          pitch: fd.get("pitch"),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setDone(true);
      } else {
        setMessage({ type: "error", text: data.error || "Please try again." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error — please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-8 text-center md:p-10">
        <p className="font-serif text-3xl">Application received ✨</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-fg-soft">
          Thank you! We review every application personally and reply on
          WhatsApp within 1–2 days. Keep an eye on your messages.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-6 md:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="inf-name" className="pf-label mb-2 block">
            Full name
          </label>
          <input id="inf-name" name="name" required className="w-full" placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="inf-phone" className="pf-label mb-2 block">
            WhatsApp number
          </label>
          <input
            id="inf-phone"
            name="phone"
            type="tel"
            required
            className="w-full"
            placeholder="03XX XXXXXXX"
          />
        </div>
        <div>
          <label htmlFor="inf-insta" className="pf-label mb-2 block">
            Instagram handle
          </label>
          <input
            id="inf-insta"
            name="instagram"
            required
            className="w-full"
            placeholder="@yourhandle"
          />
        </div>
        <div>
          <label htmlFor="inf-email" className="pf-label mb-2 block">
            Email <span className="text-fg-faint">(optional)</span>
          </label>
          <input
            id="inf-email"
            name="email"
            type="email"
            className="w-full"
            placeholder="you@email.com"
          />
        </div>
        <div>
          <label htmlFor="inf-followers" className="pf-label mb-2 block">
            Followers
          </label>
          <input
            id="inf-followers"
            name="followers"
            required
            className="w-full"
            placeholder="e.g. 12,000"
          />
        </div>
        <div>
          <label htmlFor="inf-views" className="pf-label mb-2 block">
            Average reel views
          </label>
          <input
            id="inf-views"
            name="avgViews"
            required
            className="w-full"
            placeholder="e.g. 80,000"
          />
        </div>
        <div>
          <label htmlFor="inf-likes" className="pf-label mb-2 block">
            Average likes on reels
          </label>
          <input
            id="inf-likes"
            name="avgLikes"
            className="w-full"
            placeholder="e.g. 2,500"
          />
        </div>
        <div>
          <label className="pf-label mb-2 block">Applying for</label>
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            className="w-full"
          >
            {TIERS.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="inf-pitch" className="pf-label mb-2 block">
          Tell us about your audience{" "}
          <span className="text-fg-faint">(optional)</span>
        </label>
        <textarea
          id="inf-pitch"
          name="pitch"
          rows={3}
          className="w-full"
          placeholder="Your niche, your audience, and why you'd love to work with Precise Fumes."
        />
      </div>

      {message && (
        <p
          className={`mt-4 text-sm ${
            message.type === "error" ? "text-accent-rose" : "text-accent-deep"
          }`}
        >
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary mt-6 w-full justify-center disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Apply to the Programme"}
      </button>
      <p className="mt-3 text-center text-xs text-fg-faint">
        We reply on WhatsApp within 1–2 days.
      </p>
    </form>
  );
}
