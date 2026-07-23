/** Per-scent colour identities — used for product card backdrops,
 *  detail-page glows, and hover shadows. Chosen to read well on
 *  both light and dark themes. */
export interface ScentTone {
  /** CSS gradient for card/detail backdrops */
  gradient: string;
  /** Glow shadow colour (rgba) */
  glow: string;
  /** Solid accent for small details */
  solid: string;
}

const TONES: Record<string, ScentTone> = {
  rogue: {
    gradient:
      "linear-gradient(150deg, rgba(160,82,45,0.28), rgba(80,42,28,0.42))",
    glow: "rgba(160, 82, 45, 0.35)",
    solid: "#a0522d",
  },
  "royal-oud": {
    gradient:
      "linear-gradient(150deg, rgba(138,111,184,0.26), rgba(64,48,96,0.42))",
    glow: "rgba(138, 111, 184, 0.35)",
    solid: "#8a6fb8",
  },
  bloom: {
    gradient:
      "linear-gradient(150deg, rgba(196,106,114,0.26), rgba(140,62,80,0.38))",
    glow: "rgba(196, 106, 114, 0.35)",
    solid: "#c46a72",
  },
  blossom: {
    gradient:
      "linear-gradient(150deg, rgba(233,150,122,0.28), rgba(160,80,70,0.4))",
    glow: "rgba(233, 150, 122, 0.35)",
    solid: "#e9967a",
  },
  legacy: {
    gradient:
      "linear-gradient(150deg, rgba(78,143,134,0.26), rgba(38,78,72,0.42))",
    glow: "rgba(78, 143, 134, 0.35)",
    solid: "#4e8f86",
  },
};

const FALLBACK: ScentTone = {
  gradient:
    "linear-gradient(150deg, rgba(201,154,78,0.24), rgba(110,80,40,0.4))",
  glow: "rgba(201, 154, 78, 0.35)",
  solid: "#c99a4e",
};

export function getScentTone(slug: string): ScentTone {
  return TONES[slug] ?? FALLBACK;
}
