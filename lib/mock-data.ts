import type { Product } from "@/types";

/** Placeholder catalog used until Supabase is connected.
 *  The shop/product pages read from here as a fallback so the
 *  site is fully browsable during development. */
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Noir Précis",
    slug: "noir-precis",
    tagline: "An intense, smoky signature",
    description:
      "A bold composition built around smoked oud and black leather, softened by a whisper of vanilla. Noir Précis is for the one who enters a room and is remembered long after they leave.",
    category: "Him",
    price: 8500,
    compareAtPrice: 10000,
    sizes: [
      { label: "50ml", price: 8500, stock: 12 },
      { label: "100ml", price: 14500, stock: 7 },
    ],
    notes: {
      top: ["Bergamot", "Black Pepper"],
      heart: ["Oud", "Leather", "Saffron"],
      base: ["Vanilla", "Amber", "Cedar"],
    },
    images: ["/logo-light.png"],
    stock: 19,
    featured: true,
    active: true,
  },
  {
    id: "2",
    name: "Rose Atelier",
    slug: "rose-atelier",
    tagline: "Velvet petals, modern elegance",
    description:
      "Damask rose layered over creamy sandalwood and a touch of lychee. Rose Atelier is contemporary femininity — graceful, confident, unforgettable.",
    category: "Her",
    price: 9000,
    sizes: [
      { label: "50ml", price: 9000, stock: 15 },
      { label: "100ml", price: 15000, stock: 9 },
    ],
    notes: {
      top: ["Lychee", "Pink Pepper"],
      heart: ["Damask Rose", "Peony"],
      base: ["Sandalwood", "White Musk"],
    },
    images: ["/logo-light.png"],
    stock: 24,
    featured: true,
    active: true,
  },
  {
    id: "3",
    name: "Aqua Lumière",
    slug: "aqua-lumiere",
    tagline: "Fresh, luminous, effortless",
    description:
      "A crisp aquatic built on sea salt, mint, and sun-warmed citrus. Aqua Lumière captures the clarity of morning light on water.",
    category: "Unisex",
    price: 7500,
    sizes: [
      { label: "50ml", price: 7500, stock: 20 },
      { label: "100ml", price: 12500, stock: 11 },
    ],
    notes: {
      top: ["Sea Salt", "Mint", "Lemon"],
      heart: ["Marine Accord", "Lavender"],
      base: ["Driftwood", "Ambergris"],
    },
    images: ["/logo-light.png"],
    stock: 31,
    featured: true,
    active: true,
  },
  {
    id: "4",
    name: "Oud Sovereign",
    slug: "oud-sovereign",
    tagline: "Regal warmth, lasting depth",
    description:
      "An opulent oriental of aged oud, honeyed tobacco, and dark resins. Oud Sovereign is luxury distilled — commanding and richly addictive.",
    category: "Him",
    price: 12000,
    sizes: [
      { label: "50ml", price: 12000, stock: 6 },
      { label: "100ml", price: 19500, stock: 4 },
    ],
    notes: {
      top: ["Cinnamon", "Plum"],
      heart: ["Oud", "Tobacco", "Rose"],
      base: ["Resins", "Patchouli", "Vanilla"],
    },
    images: ["/logo-light.png"],
    stock: 10,
    featured: true,
    active: true,
  },
  {
    id: "5",
    name: "Blanc Mystère",
    slug: "blanc-mystere",
    tagline: "Soft musk and white florals",
    description:
      "An airy veil of white musk, jasmine, and powdery iris. Blanc Mystère is the scent of clean silk and quiet sophistication.",
    category: "Her",
    price: 8000,
    sizes: [
      { label: "50ml", price: 8000, stock: 18 },
      { label: "100ml", price: 13500, stock: 10 },
    ],
    notes: {
      top: ["Aldehydes", "Pear"],
      heart: ["Jasmine", "Iris", "Lily"],
      base: ["White Musk", "Cashmere Wood"],
    },
    images: ["/logo-light.png"],
    stock: 28,
    featured: false,
    active: true,
  },
  {
    id: "6",
    name: "Vétiver Brut",
    slug: "vetiver-brut",
    tagline: "Earthy, green, masculine",
    description:
      "Smoked vetiver grounded by grapefruit and a mineral edge. Vétiver Brut is raw elegance — natural, textured, and effortlessly cool.",
    category: "Unisex",
    price: 8800,
    sizes: [
      { label: "50ml", price: 8800, stock: 14 },
      { label: "100ml", price: 14800, stock: 8 },
    ],
    notes: {
      top: ["Grapefruit", "Bergamot"],
      heart: ["Vetiver", "Nutmeg"],
      base: ["Cedar", "Tonka Bean"],
    },
    images: ["/logo-light.png"],
    stock: 22,
    featured: false,
    active: true,
  },
];

export function getMockProduct(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}
