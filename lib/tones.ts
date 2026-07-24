/** Per-scent colour identities, taken from the actual bottle glass:
 *  Rogue emerald, Royal Oud black-gold, Bloom violet, Blossom crimson,
 *  Legacy sapphire. Used for hover glows, hero tiles and accents. */
export interface ScentTone {
  /** CSS gradient for tiles and fallback backdrops */
  gradient: string;
  /** Glow shadow colour (rgba) */
  glow: string;
  /** Solid accent for small details */
  solid: string;
}

const TONES: Record<string, ScentTone> = {
  rogue: {
    gradient:
      "linear-gradient(155deg, rgba(16,74,54,0.92), rgba(9,38,29,0.96))",
    glow: "rgba(22, 122, 88, 0.45)",
    solid: "#167a58",
  },
  "royal-oud": {
    gradient:
      "linear-gradient(155deg, rgba(32,26,18,0.95), rgba(12,10,8,0.97))",
    glow: "rgba(201, 154, 78, 0.45)",
    solid: "#c99a4e",
  },
  bloom: {
    gradient:
      "linear-gradient(155deg, rgba(74,32,102,0.92), rgba(34,14,48,0.96))",
    glow: "rgba(138, 79, 176, 0.45)",
    solid: "#8a4fb0",
  },
  blossom: {
    gradient:
      "linear-gradient(155deg, rgba(120,18,44,0.92), rgba(56,10,24,0.96))",
    glow: "rgba(186, 40, 70, 0.45)",
    solid: "#ba2846",
  },
  legacy: {
    gradient:
      "linear-gradient(155deg, rgba(18,48,110,0.92), rgba(9,20,48,0.96))",
    glow: "rgba(38, 92, 190, 0.45)",
    solid: "#265cbe",
  },
};

const FALLBACK: ScentTone = {
  gradient:
    "linear-gradient(155deg, rgba(201,154,78,0.24), rgba(110,80,40,0.4))",
  glow: "rgba(201, 154, 78, 0.35)",
  solid: "#c99a4e",
};

export function getScentTone(slug: string): ScentTone {
  return TONES[slug] ?? FALLBACK;
}
