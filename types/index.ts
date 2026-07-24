/* ============================================
   PRECISE FUMES — Shared domain types
   ============================================ */

/** A fragrance size variant (e.g. 50ml / 100ml) with its own price + stock. */
export interface ProductSize {
  label: string; // "50ml"
  price: number; // PKR
  stock: number;
}

/** Olfactory notes pyramid. */
export interface ScentNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline?: string; // short evocative line
  description: string;
  category: string; // "Him" | "Her"
  /** Base price shown when no size selected (usually cheapest size). */
  price: number;
  /** Optional compare-at price for showing discounts. */
  compareAtPrice?: number;
  sizes: ProductSize[];
  notes?: ScentNotes;
  /** Storage paths / public URLs of product images. First is primary. */
  images: string[];
  stock: number; // aggregate stock fallback
  featured: boolean;
  active: boolean; // hidden from storefront when false
  /** e.g. "Eau de Parfum" */
  concentration?: string;
  /** e.g. "8-12 hours" */
  longevity?: string;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

/** A line in the cart. */
export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  size: string; // size label
  price: number; // unit price for chosen size
  quantity: number;
}

export type PaymentMethod = "cod" | "bank_transfer";

export type OrderStatus =
  | "pending" // placed, awaiting confirmation / payment
  | "confirmed" // payment verified / COD confirmed
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderCustomer {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  province?: string;
  postalCode?: string;
  notes?: string;
}

export interface OrderLine {
  productId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  ref: string; // human-friendly PF-XXXXX
  customer: OrderCustomer;
  items: OrderLine[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  /** For bank transfers: customer's payment proof / reference. */
  paymentReference?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Bank account shown at checkout for bank-transfer payments. */
export interface BankAccount {
  bankName: string; // "Meezan Bank"
  accountTitle: string; // "Precise Fumes"
  accountNumber: string;
  iban?: string;
  branch?: string;
}

/** Theme customization the admin can tweak at runtime. */
export interface ThemeConfig {
  accent: string; // hex
  accentSoft: string;
  radius: string; // "2px"
  defaultMode: "light" | "dark" | "system";
}

/** Site-wide settings, single row in `settings` table. */
export interface Settings {
  id: string;
  brandName: string;
  tagline: string;
  contactEmail?: string;
  contactPhone?: string;
  whatsapp?: string;
  instagram?: string;
  /** Free-shipping threshold; 0 disables. */
  freeShippingThreshold: number;
  shippingFee: number; // flat fee
  bankAccounts: BankAccount[];
  theme: ThemeConfig;
  announcement?: string; // top bar message
}
