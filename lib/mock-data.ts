import type { Product } from "@/types";

/** Precise Fumes catalog: 5 luxury fragrances.
 *  Offline fallback — the live catalog lives in the Supabase
 *  `products` table and is managed from the admin panel. Keep this
 *  in sync so the storefront still renders if the DB is unreachable. */
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Rogue",
    slug: "rogue",
    tagline: "Fresh. Spicy. Magnetic.",
    description:
      "A radiant, spicy-fresh signature — bright bergamot and cracked pepper settling into warm amber woods. Rogue is effortlessly versatile: clean enough for the office, magnetic enough for the night. A bold, modern crowd-pleaser that turns heads without ever trying too hard.",
    category: "Him",
    price: 3000,
    compareAtPrice: undefined,
    sizes: [{ label: "50ml", price: 3000, stock: 999 }],
    notes: {
      top: ["Bergamot", "Sichuan Pepper"],
      heart: ["Lavender", "Geranium", "Star Anise"],
      base: ["Amberwood", "Cedar", "Ambergris"],
    },
    images: ["/rogue.jpg"],
    stock: 999,
    featured: true,
    active: true,
    concentration: "Extrait de Parfum",
    longevity: "12-14 hours",
  },
  {
    id: "2",
    name: "Royal Oud",
    slug: "royal-oud",
    tagline: "Rich. Smoky. Regal.",
    description:
      "An opulent Arabian-style oriental built on aged oud, warmed by saffron, rose and sweet resins. Royal Oud is deep, smoky and unmistakably luxurious — a commanding, long-lasting scent for those who want to be remembered. Endlessly rich and sophisticated.",
    category: "Him",
    price: 3000,
    compareAtPrice: undefined,
    sizes: [{ label: "50ml", price: 3000, stock: 999 }],
    notes: {
      top: ["Saffron", "Bergamot"],
      heart: ["Oud", "Rose", "Cinnamon"],
      base: ["Amber", "Patchouli", "Sandalwood"],
    },
    images: ["/royal-oud.jpg"],
    stock: 999,
    featured: true,
    active: true,
    concentration: "Extrait de Parfum",
    longevity: "12-14 hours",
  },
  {
    id: "3",
    name: "Bloom",
    slug: "bloom",
    tagline: "Soft. Fresh. Feminine.",
    description:
      "A soft, fresh feminine floral — delicate jasmine and freesia lifted by a dewy green brightness. Bloom is pretty without ever feeling heavy, the kind of gentle, elegant scent that feels effortless every single day. Clean, romantic and quietly captivating.",
    category: "Her",
    price: 3000,
    compareAtPrice: undefined,
    sizes: [{ label: "50ml", price: 3000, stock: 999 }],
    notes: {
      top: ["Bergamot", "Green Notes"],
      heart: ["Jasmine", "Freesia", "Rose"],
      base: ["White Musk", "Soft Woods"],
    },
    images: ["/bloom.jpg"],
    stock: 999,
    featured: true,
    active: true,
    concentration: "Extrait de Parfum",
    longevity: "12-14 hours",
  },
  {
    id: "4",
    name: "Blossom",
    slug: "blossom",
    tagline: "Romantic. Floral. Radiant.",
    description:
      "A radiant rose-and-peony bouquet — a bright, romantic floral that blooms on the skin. Blossom is feminine and joyful, a fresh garden of petals wrapped in soft musk. Elegant, uplifting and made to be noticed, morning to night.",
    category: "Her",
    price: 3000,
    compareAtPrice: undefined,
    sizes: [{ label: "50ml", price: 3000, stock: 999 }],
    notes: {
      top: ["Citrus", "Pink Pepper"],
      heart: ["Rose", "Peony", "Osmanthus"],
      base: ["White Musk", "Sandalwood"],
    },
    images: ["/blossom.jpg"],
    stock: 999,
    featured: true,
    active: true,
    concentration: "Extrait de Parfum",
    longevity: "12-14 hours",
  },
  {
    id: "5",
    name: "Legacy",
    slug: "legacy",
    tagline: "Bold. Fruity. Iconic.",
    description:
      "A bold, fruity-smoky powerhouse — juicy pineapple and blackcurrant over a signature smoky birch and musk. Legacy is confident and prestigious, the scent of someone who owns the room. Rich, fresh and unmistakably premium.",
    category: "Him",
    price: 3000,
    compareAtPrice: undefined,
    sizes: [{ label: "50ml", price: 3000, stock: 999 }],
    notes: {
      top: ["Pineapple", "Bergamot", "Blackcurrant"],
      heart: ["Birch", "Patchouli", "Rose"],
      base: ["Musk", "Oakmoss", "Ambergris"],
    },
    images: ["/legacy.jpg"],
    stock: 999,
    featured: false,
    active: true,
    concentration: "Extrait de Parfum",
    longevity: "12-14 hours",
  },
];

export function getMockProduct(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}
