/** Central SEO config — keywords, boilerplate, and JSON-LD builders.
 *  Targets: buying perfume online in Pakistan, free delivery in Karachi,
 *  the buy-2-get-1-free / 2-for-5000 promotions, and quality/long-lasting
 *  fragrance intent. */

export const SITE_URL = "https://precisefumes.com";
export const SITE_NAME = "Precise Fumes";

export const KEYWORDS = [
  // core intent
  "perfumes",
  "perfumes online",
  "buy perfume online",
  "order perfume online",
  "perfumes online Pakistan",
  "buy perfume online Pakistan",
  "quality perfumes",
  "premium perfumes",
  "luxury perfumes Pakistan",
  "long lasting perfume",
  "extrait de parfum",
  "perfume for men",
  "perfume for women",
  "mens perfume Pakistan",
  "womens perfume Pakistan",
  // delivery intent
  "free delivery",
  "free delivery perfume",
  "free delivery in Karachi",
  "perfume free delivery Karachi",
  "cash on delivery perfume",
  "perfume home delivery Pakistan",
  "perfume delivery Karachi",
  // promotion intent
  "buy 3 get 1 free perfume",
  "perfume deals Pakistan",
  "perfume offers Pakistan",
  "perfume sale Pakistan",
  "2 perfumes deal",
  // brand
  "Precise Fumes",
  "precisefumes",
  "Rogue perfume",
  "Royal Oud perfume",
  "Bloom perfume",
  "Blossom perfume",
  "Legacy perfume",
];

/** One-line selling proposition reused across descriptions. */
export const USP =
  "Premium Extrait de Parfum, 12–14 hour wear, free 5ml tester in every order. Buy 2 for PKR 5,000 or Buy 3 Get 1 Free — 4 perfumes for PKR 9,000. Free delivery in Karachi, cash on delivery across Pakistan.";

/* ── JSON-LD builders ─────────────────────────────────────── */

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo-dark.png`,
    description:
      "Precise Fumes — premium long-lasting perfumes in Pakistan. Free delivery in Karachi, cash on delivery nationwide.",
    email: "contact@precisefumes.com",
    sameAs: [
      "https://instagram.com/precisefumes",
      "https://facebook.com/precisefumes",
      "https://linkedin.com/company/precisefumes",
    ],
    areaServed: { "@type": "Country", name: "Pakistan" },
  };
}

export function storeLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${SITE_URL}/#store`,
    name: SITE_NAME,
    image: `${SITE_URL}/logo-dark.png`,
    url: SITE_URL,
    description:
      "Buy premium perfumes online in Pakistan. Free delivery in Karachi, cash on delivery nationwide, buy 3 get 1 free.",
    email: "contact@precisefumes.com",
    telephone: "+92 317 2388450",
    priceRange: "PKR 3,000",
    currenciesAccepted: "PKR",
    paymentAccepted: "Cash on Delivery",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+92 317 2388450",
      contactType: "customer service",
      contactOption: "TollFree",
      availableLanguage: ["Urdu", "English"],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Karachi",
      addressCountry: "PK",
    },
    areaServed: { "@type": "Country", name: "Pakistan" },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "10:00",
        closes: "19:00",
      },
    ],
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

interface ProductLdInput {
  name: string;
  slug: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  inStock: boolean;
}

export function productLd(p: ProductLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${p.name} — Precise Fumes Perfume`,
    description: p.description,
    image: p.image ? [p.image] : undefined,
    sku: p.slug,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: p.category === "Her" ? "Women's Perfume" : "Men's Perfume",
    audience: {
      "@type": "PeopleAudience",
      suggestedGender: p.category === "Her" ? "female" : "male",
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/shop/${p.slug}`,
      priceCurrency: "PKR",
      price: String(p.price),
      availability: p.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      areaServed: { "@type": "Country", name: "Pakistan" },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "PKR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "PK",
          addressRegion: "Karachi",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 5,
            unitCode: "DAY",
          },
        },
      },
    },
  };
}

export function breadcrumbLd(
  trail: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${t.path}`,
    })),
  };
}

export function faqLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Small helper to drop a JSON-LD <script> into a server component. */
export function jsonLdScript(data: object) {
  return {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  };
}
