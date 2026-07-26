"use client";

import { useState } from "react";
import { toWaNumber } from "@/lib/contact";
import type { InfluencerApplication } from "@/lib/admin-data";

const STATUSES = ["new", "contacted", "approved", "rejected"] as const;

const STATUS_STYLE: Record<string, string> = {
  new: "bg-accent/20 text-accent-deep",
  contacted: "bg-accent-teal/20 text-accent-teal",
  approved: "bg-green-500/15 text-green-700 dark:text-green-400",
  rejected: "bg-accent-rose/20 text-accent-rose",
};

const TIER_LABEL: Record<string, string> = {
  collab: "T1 · Collab",
  signature: "T2 · Signature",
  brand: "T3 · Brand",
};

const TZ = "Asia/Karachi";
function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: TZ,
  });
}

export function InfluencersTable({
  applications,
}: {
  applications: InfluencerApplication[];
}) {
  const [rows, setRows] = useState(applications);
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [saving, setSaving] = useState<string | null>(null);

  async function setStatus(id: string, status: string) {
    setSaving(id);
    try {
      const res = await fetch(`/api/admin/influencers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setRows((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
      }
    } finally {
      setSaving(null);
    }
  }

  const visible = rows.filter(
    (r) => filter === "all" || r.status === filter
  );

  if (rows.length === 0) {
    return (
      <p className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-10 text-center text-sm text-fg-soft">
        No applications yet. Creators apply at /influencers — they&apos;ll show
        up here.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {["all", ...STATUSES].map((s) => {
          const count =
            s === "all" ? rows.length : rows.filter((r) => r.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.12em] transition-colors ${
                filter === s
                  ? "border-accent bg-accent text-on-accent"
                  : "border-border text-fg-soft hover:border-fg-faint"
              }`}
            >
              {s} ({count})
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-border">
        <table className="w-full min-w-[56rem] text-sm">
          <thead className="bg-bg-soft">
            <tr className="text-left">
              <th className="pf-label p-3">Applicant</th>
              <th className="pf-label p-3">Instagram</th>
              <th className="pf-label p-3">Reach</th>
              <th className="pf-label p-3">Tier</th>
              <th className="pf-label p-3">Applied</th>
              <th className="pf-label p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((a) => {
              const isOpen = openId === a.id;
              const wa = toWaNumber(a.phone);
              return (
                <>
                  <tr
                    key={a.id}
                    onClick={() => setOpenId(isOpen ? null : a.id)}
                    className="cursor-pointer border-t border-border transition-colors hover:bg-bg-soft"
                  >
                    <td className="p-3 font-medium">
                      {a.name}
                      <span className="block text-xs font-normal text-fg-soft">
                        {a.phone}
                      </span>
                    </td>
                    <td className="p-3">
                      <a
                        href={`https://instagram.com/${a.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-accent-deep hover:underline"
                      >
                        @{a.instagram}
                      </a>
                    </td>
                    <td className="p-3 text-fg-soft">
                      <span className="block text-xs">
                        {a.followers} followers
                      </span>
                      <span className="block text-xs">
                        {a.avg_views} views{a.avg_likes ? ` · ${a.avg_likes} likes` : ""}
                      </span>
                    </td>
                    <td className="p-3">{TIER_LABEL[a.tier] ?? a.tier}</td>
                    <td className="p-3 whitespace-nowrap text-fg-soft">
                      {fmtDate(a.created_at)}
                    </td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs capitalize ${
                          STATUS_STYLE[a.status] ?? "bg-bg-soft"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr key={`${a.id}-d`} className="border-t border-border bg-bg-soft">
                      <td colSpan={6} className="p-5">
                        <div className="grid gap-5 md:grid-cols-3">
                          <div className="md:col-span-2">
                            <p className="pf-eyebrow mb-1">Pitch</p>
                            <p className="text-sm leading-relaxed text-fg-soft">
                              {a.pitch || "—"}
                            </p>
                            {a.email && (
                              <p className="mt-3 text-sm">
                                <span className="pf-eyebrow mr-2">Email</span>
                                <a
                                  href={`mailto:${a.email}`}
                                  className="text-accent-deep hover:underline"
                                >
                                  {a.email}
                                </a>
                              </p>
                            )}
                          </div>
                          <div>
                            {wa && (
                              <a
                                href={`https://wa.me/${wa}?text=${encodeURIComponent(
                                  `Assalam-o-Alaikum ${a.name}! This is Precise Fumes — thank you for applying to our influencer programme (${TIER_LABEL[a.tier] ?? a.tier}). Let's talk!`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mb-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
                              >
                                Message on WhatsApp
                              </a>
                            )}
                            <p className="pf-eyebrow mb-2">Status</p>
                            <div className="flex flex-wrap gap-2">
                              {STATUSES.map((s) => (
                                <button
                                  key={s}
                                  disabled={saving === a.id || a.status === s}
                                  onClick={() => setStatus(a.id, s)}
                                  className={`rounded-full border px-3 py-1.5 text-xs capitalize transition-colors disabled:opacity-40 ${
                                    a.status === s
                                      ? "border-accent bg-accent text-on-accent"
                                      : "border-border hover:border-accent"
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
