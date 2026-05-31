export type ScentFamily = 'Oud' | 'Floral' | 'Citrus' | 'Amber' | 'Musk'

export type Product = {
  slug: string
  name: string
  family: ScentFamily
  mood: string
  notes: string[]
  size: string
  price: number
  tone: string // accent color used for the bottle visual
}

export const products: Product[] = [
  {
    slug: 'velvet-oud',
    name: 'Velvet Oud',
    family: 'Oud',
    mood: 'Opulent · Nocturnal',
    notes: ['Smoked Oud', 'Bulgarian Rose', 'Saffron', 'Patchouli'],
    size: '100ml',
    price: 248,
    tone: 'oklch(0.45 0.07 40)',
  },
  {
    slug: 'citrus-aura',
    name: 'Citrus Aura',
    family: 'Citrus',
    mood: 'Radiant · Effervescent',
    notes: ['Sicilian Bergamot', 'Neroli', 'Green Mandarin', 'White Musk'],
    size: '100ml',
    price: 186,
    tone: 'oklch(0.78 0.12 95)',
  },
  {
    slug: 'midnight-rose',
    name: 'Midnight Rose',
    family: 'Floral',
    mood: 'Romantic · Velvety',
    notes: ['Damask Rose', 'Black Currant', 'Peony', 'Cashmere Wood'],
    size: '100ml',
    price: 212,
    tone: 'oklch(0.52 0.12 12)',
  },
  {
    slug: 'amber-veil',
    name: 'Amber Veil',
    family: 'Amber',
    mood: 'Warm · Enveloping',
    notes: ['Golden Amber', 'Vanilla Bourbon', 'Tonka Bean', 'Labdanum'],
    size: '100ml',
    price: 224,
    tone: 'oklch(0.7 0.11 70)',
  },
  {
    slug: 'noir-precision',
    name: 'Noir Precision',
    family: 'Oud',
    mood: 'Sharp · Architectural',
    notes: ['Black Oud', 'Vetiver', 'Leather', 'Incense'],
    size: '100ml',
    price: 268,
    tone: 'oklch(0.32 0.02 60)',
  },
  {
    slug: 'crystal-musk',
    name: 'Crystal Musk',
    family: 'Musk',
    mood: 'Clean · Luminous',
    notes: ['White Musk', 'Iris', 'Ambrette Seed', 'Sandalwood'],
    size: '100ml',
    price: 198,
    tone: 'oklch(0.82 0.02 80)',
  },
]

export const scentFamilies: ScentFamily[] = [
  'Oud',
  'Floral',
  'Citrus',
  'Amber',
  'Musk',
]
