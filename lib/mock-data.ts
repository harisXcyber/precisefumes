import type { Product } from "@/types";

/** Placeholder catalog used until Supabase is connected.
 *  The shop/product pages read from here as a fallback so the
 *  site is fully browsable during development. */
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Rogue",
    slug: "rogue",
    tagline: "Bold. Daring. Unmistakable.",
    description:
      "A masterful composition of spiced notes and dark woods, Rogue is the signature of a man who refuses to be confined. Leather, cardamom, and a whisper of oud create a trail that lingers long after you've left the room.",
    category: "Him",
    price: 3000,
    compareAtPrice: null,
    sizes: [
      { label: "30ml", price: 3000, stock: 999 },
      { label: "50ml", price: 4500, stock: 999 },
      { label: "100ml", price: 7000, stock: 999 },
    ],
    notes: {
      top: ["Cardamom", "Black Pepper"],
      heart: ["Leather", "Geranium", "Oud"],
      base: ["Cedarwood", "Vetiver", "Musk"],
    },
    images: ["/rogue.jpg"],
    stock: 999,
    featured: true,
    active: true,
  },
  {
    id: "2",
    name: "Royal Oud",
    slug: "royal-oud",
    tagline: "Ancient. Regal. Timeless.",
    description:
      "A luxurious oriental built on the foundation of aged oud, Royal Oud speaks the language of tradition and sophistication. Notes of warm spices, honeyed amber, and precious resins create a symphony of warmth that evolves throughout the day.",
    category: "Him",
    price: 3000,
    compareAtPrice: null,
    sizes: [
      { label: "30ml", price: 3000, stock: 999 },
      { label: "50ml", price: 4500, stock: 999 },
      { label: "100ml", price: 7000, stock: 999 },
    ],
    notes: {
      top: ["Saffron", "Bergamot"],
      heart: ["Oud", "Rose", "Cinnamon"],
      base: ["Amber", "Patchouli", "Sandalwood"],
    },
    images: ["/royal-oud.jpg"],
    stock: 999,
    featured: true,
    active: true,
  },
  {
    id: "3",
    name: "Bloom",
    slug: "bloom",
    tagline: "Fresh. Luminous. Alive.",
    description:
      "Like stepping into a garden in full bloom, this fragrance captures the delicate beauty of spring florals touched by morning dew. A fleeting blend of peony, jasmine, and green notes that feels both timeless and undeniably modern.",
    category: "Her",
    price: 3000,
    compareAtPrice: null,
    sizes: [
      { label: "30ml", price: 3000, stock: 999 },
      { label: "50ml", price: 4500, stock: 999 },
      { label: "100ml", price: 7000, stock: 999 },
    ],
    notes: {
      top: ["Lemon Verbena", "Pink Pepper"],
      heart: ["Peony", "Jasmine", "Lily of the Valley"],
      base: ["White Musk", "Cedarwood"],
    },
    images: ["/bloom.jpg"],
    stock: 999,
    featured: true,
    active: true,
  },
  {
    id: "4",
    name: "Blossom",
    slug: "blossom",
    tagline: "Soft. Sensual. Unforgettable.",
    description:
      "Blossom is an interpretation of romance in fragrance form. Creamy florals meet soft vanillic notes to create a tender, enveloping scent that whispers rather than shouts. It's the fragrance equivalent of silk against skin.",
    category: "Her",
    price: 3000,
    compareAtPrice: null,
    sizes: [
      { label: "30ml", price: 3000, stock: 999 },
      { label: "50ml", price: 4500, stock: 999 },
      { label: "100ml", price: 7000, stock: 999 },
    ],
    notes: {
      top: ["Bergamot", "Neroli"],
      heart: ["Magnolia", "Red Rose", "Orchid"],
      base: ["Vanilla", "Tonka Bean", "Musk"],
    },
    images: ["/blossom.jpg"],
    stock: 999,
    featured: true,
    active: true,
  },
  {
    id: "5",
    name: "Legacy",
    slug: "legacy",
    tagline: "Timeless. Distinguished. Enduring.",
    description:
      "A refined aromatic that stands the test of time, Legacy is inspired by the classics while remaining distinctly contemporary. Crisp spices and clean woods form the backbone of a scent that is equally at home in the boardroom or on an evening out.",
    category: "Him",
    price: 3000,
    compareAtPrice: null,
    sizes: [
      { label: "30ml", price: 3000, stock: 999 },
      { label: "50ml", price: 4500, stock: 999 },
      { label: "100ml", price: 7000, stock: 999 },
    ],
    notes: {
      top: ["Grapefruit", "Coriander"],
      heart: ["Sage", "Lavender", "Cedar"],
      base: ["Vetiver", "Oakmoss", "White Musk"],
    },
    images: ["/legacy.jpg"],
    stock: 999,
    featured: false,
    active: true,
  },
];

export function getMockProduct(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}
