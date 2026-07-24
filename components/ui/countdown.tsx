"use client";

import { useEffect, useState } from "react";

function parts(msLeft: number) {
  const s = Math.max(0, Math.floor(msLeft / 1000));
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

/** Live countdown to an ISO end time. Calls onExpire once when it hits 0. */
export function Countdown({
  endsAt,
  onExpire,
  className = "",
  compact = false,
}: {
  endsAt: string;
  onExpire?: () => void;
  className?: string;
  compact?: boolean;
}) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null) return null; // avoid SSR/clock mismatch
  const left = new Date(endsAt).getTime() - now;
  if (left <= 0) {
    onExpire?.();
    return null;
  }
  const { d, h, m, s } = parts(left);
  const pad = (n: number) => String(n).padStart(2, "0");

  if (compact) {
    return (
      <span className={`tabular-nums ${className}`}>
        {d > 0 ? `${d}d ` : ""}
        {pad(h)}:{pad(m)}:{pad(s)}
      </span>
    );
  }

  const cell = (val: number, label: string) => (
    <span className="flex flex-col items-center">
      <span className="font-serif text-2xl tabular-nums leading-none md:text-3xl">
        {pad(val)}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-[0.16em] opacity-70">
        {label}
      </span>
    </span>
  );

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {cell(d, "days")}
      <span className="text-xl opacity-40">:</span>
      {cell(h, "hrs")}
      <span className="text-xl opacity-40">:</span>
      {cell(m, "min")}
      <span className="text-xl opacity-40">:</span>
      {cell(s, "sec")}
    </div>
  );
}
