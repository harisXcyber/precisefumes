/** Blog content — articles as structured data. Bodies use a small block
 *  model rendered by components/blog/article-body.tsx. Paragraph text
 *  supports inline **bold** and [links](/path). */

const IMG =
  "https://qjjdxxtfvrdrpwcvlwhb.supabase.co/storage/v1/object/public/product-images";

export type Block =
  | { h2: string }
  | { p: string }
  | { list: string[] }
  | { product: string } // slug
  | { products: string[] } // slugs — grid
  | { quote: string }
  | { cta: { text: string; href: string } };

export interface Article {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
  date: string; // ISO
  readMinutes: number;
  hero: string;
  body: Block[];
}

export const ARTICLES: Article[] = [
  {
    slug: "best-long-lasting-perfumes-in-pakistan",
    title: "Best Long-Lasting Perfumes in Pakistan (2026)",
    description:
      "Looking for the best long-lasting perfumes in Pakistan? These five premium Extrait de Parfum scents last 12–14 hours, cost PKR 3,000, and ship free in Karachi with cash on delivery.",
    keywords: [
      "best long lasting perfume in pakistan",
      "best perfume in pakistan",
      "long lasting perfume",
      "premium perfume pakistan",
    ],
    category: "Guides",
    date: "2026-07-24",
    readMinutes: 6,
    hero: `${IMG}/site/collection-bottles.jpg`,
    body: [
      {
        p: "If you have ever sprayed a perfume in the morning only to find it gone by lunch, you already know the single most important quality in a fragrance: **longevity**. In Pakistan's warm climate, a scent has to work harder — which is exactly why every Precise Fumes fragrance is an **Extrait de Parfum**, the most concentrated form of perfume, built to last **12 to 14 hours** on the skin.",
      },
      {
        p: "Below are our five signature scents. Each is 50ml, priced at **PKR 3,000**, and comes with a **free 5ml tester** of another scent so you can explore the house. Here is how to choose.",
      },
      { h2: "1. Royal Oud — for lovers of rich, smoky depth" },
      {
        p: "If you want a fragrance that announces itself, **Royal Oud** is the one. Built on aged oud and warmed with saffron, rose and sweet resins, it is deep, smoky and unmistakably luxurious — an Arabian-style oriental that lingers for hours and turns heads at every gathering.",
      },
      { product: "royal-oud" },
      { h2: "2. Legacy — bold, fruity and prestigious" },
      {
        p: "**Legacy** opens with juicy pineapple and blackcurrant, then settles into a signature smoky birch and musk. It is confident, fresh and premium — the kind of scent that owns a room without ever feeling heavy. If you like a fragrance that is both fruity and powerful, this is your signature.",
      },
      { product: "legacy" },
      { h2: "3. Rogue — the versatile crowd-pleaser" },
      {
        p: "**Rogue** is the everyday hero: a spicy-fresh blend of bright bergamot and cracked pepper over warm amber woods. Clean enough for the office, magnetic enough for a night out, it is the safe-blind-buy that almost everyone loves.",
      },
      { product: "rogue" },
      { h2: "4. Blossom — a radiant, romantic floral" },
      {
        p: "For a bright feminine scent, **Blossom** is a radiant rose-and-peony bouquet wrapped in soft musk. It is joyful, elegant and made to be noticed — a garden of petals that lasts from morning to night.",
      },
      { product: "blossom" },
      { h2: "5. Bloom — soft, fresh and effortless" },
      {
        p: "**Bloom** is the gentle everyday floral: delicate jasmine and freesia lifted by a dewy green brightness. Pretty without ever feeling heavy, it is clean, romantic and quietly captivating — perfect for the office or daytime wear.",
      },
      { product: "bloom" },
      { h2: "Why Precise Fumes lasts longer" },
      {
        p: "The secret is concentration. Most high-street perfumes are Eau de Toilette, which fades fast. Ours are **Extrait de Parfum** — a higher percentage of premium fragrance oils — so a few sprays carry you through a full day and into the evening. Pair that with our [guide to making perfume last even longer](/blog/how-to-make-perfume-last-longer) and you will rarely need to re-apply.",
      },
      { h2: "Simple pricing, real offers" },
      {
        list: [
          "Every 50ml bottle is PKR 3,000.",
          "Any 2 perfumes for PKR 5,000 — save PKR 1,000.",
          "Buy 2 Get 1 Free — add three, the cheapest is on us.",
          "A free 5ml tester with every perfume (so Buy 2 Get 1 Free earns 3 free testers).",
          "Free delivery in Karachi, cash on delivery across Pakistan.",
        ],
      },
      {
        cta: { text: "Shop the full collection", href: "/shop" },
      },
    ],
  },

  {
    slug: "best-perfumes-for-men-in-pakistan",
    title: "Best Perfumes for Men in Pakistan",
    description:
      "The best perfumes for men in Pakistan — three premium, long-lasting Extrait de Parfum signatures for every personality. PKR 3,000 each, free tester, free Karachi delivery, cash on delivery.",
    keywords: [
      "best perfume for men in pakistan",
      "perfume for men",
      "mens perfume pakistan",
      "long lasting perfume for men",
    ],
    category: "For Him",
    date: "2026-07-24",
    readMinutes: 5,
    hero: `${IMG}/rogue/2-bottle-box.jpg`,
    body: [
      {
        p: "A man's fragrance is part of his signature — it should last all day and suit the moment, whether that is a boardroom, a wedding, or a late dinner. These are the **best perfumes for men in Pakistan** from the Precise Fumes house: three premium **Extrait de Parfum** scents that last **12 to 14 hours**, each PKR 3,000 with a free 5ml tester.",
      },
      { h2: "Rogue — versatile, fresh and magnetic" },
      {
        p: "If you want one fragrance that does everything, choose **Rogue**. Bright bergamot and cracked pepper give way to warm amber woods — fresh, spicy and effortlessly versatile. It is the ultimate crowd-pleaser: appropriate for work, magnetic for the evening, and loved by almost everyone who smells it.",
      },
      { product: "rogue" },
      { h2: "Royal Oud — rich, smoky and commanding" },
      {
        p: "For occasions that call for presence, **Royal Oud** delivers. Aged oud, saffron, rose and sweet resins create a deep, smoky, luxurious oriental in the Arabian tradition. It is bold, long-lasting and unmistakably premium — a scent for weddings, winters and nights you want to be remembered. See our full guide to [oud perfumes in Pakistan](/blog/best-oud-perfumes-in-pakistan).",
      },
      { product: "royal-oud" },
      { h2: "Legacy — bold, fruity and prestigious" },
      {
        p: "**Legacy** is the confident powerhouse: juicy pineapple and blackcurrant over a signature smoky birch and musk. Fresh yet commanding, it is the scent of someone who owns the room — perfect for the ambitious man who wants a fragrance as distinctive as he is.",
      },
      { product: "legacy" },
      { h2: "How to choose" },
      {
        list: [
          "Want one bottle for everything? Go with Rogue.",
          "Love rich, oud-forward, traditional scents? Royal Oud.",
          "Prefer bold, fruity and modern? Legacy.",
          "Still deciding? Order any two — you'll get a free tester of the third to try.",
        ],
      },
      {
        p: "Every men's fragrance is PKR 3,000, ships **free in Karachi** and is available **cash on delivery** across Pakistan — with a full money-back guarantee on anything that is our fault.",
      },
      { cta: { text: "Shop perfumes for him", href: "/shop?category=Him" } },
    ],
  },

  {
    slug: "best-perfumes-for-women-in-pakistan",
    title: "Best Perfumes for Women in Pakistan",
    description:
      "The best perfumes for women in Pakistan — two premium, long-lasting floral Extrait de Parfum signatures. PKR 3,000 each, free tester, free Karachi delivery, cash on delivery.",
    keywords: [
      "best perfume for women in pakistan",
      "perfume for women",
      "womens perfume pakistan",
      "floral perfume pakistan",
    ],
    category: "For Her",
    date: "2026-07-24",
    readMinutes: 4,
    hero: `${IMG}/site/for-her.jpg`,
    body: [
      {
        p: "The right perfume is a woman's quiet signature — soft enough to feel personal, lasting enough to carry through a full day. These are the **best perfumes for women in Pakistan** from Precise Fumes: two premium floral **Extrait de Parfum** scents that last **12 to 14 hours**, each PKR 3,000 with a free 5ml tester.",
      },
      { h2: "Blossom — radiant, romantic and joyful" },
      {
        p: "**Blossom** is a bright rose-and-peony bouquet wrapped in soft musk — a radiant, romantic floral that blooms beautifully on the skin. It is feminine and uplifting, elegant enough for a wedding yet joyful enough for everyday. If you love florals that feel alive, this is your scent.",
      },
      { product: "blossom" },
      { h2: "Bloom — soft, fresh and effortless" },
      {
        p: "**Bloom** is the gentle everyday floral: delicate jasmine and freesia lifted by a dewy green freshness. Pretty without ever feeling heavy, it is clean, soft and quietly captivating — the kind of elegant scent that feels effortless at the office or on a daytime outing.",
      },
      { product: "bloom" },
      { h2: "Which one is you?" },
      {
        list: [
          "Love bold, romantic, rose-forward florals? Choose Blossom.",
          "Prefer soft, fresh and understated? Choose Bloom.",
          "Can't decide? Order both as a bundle for PKR 5,000 and save PKR 1,000 — plus free testers.",
        ],
      },
      {
        p: "Both fragrances are PKR 3,000, ship **free in Karachi**, and are available **cash on delivery** nationwide, backed by our money-back guarantee.",
      },
      { cta: { text: "Shop perfumes for her", href: "/shop?category=Her" } },
    ],
  },

  {
    slug: "best-oud-perfumes-in-pakistan",
    title: "Best Oud Perfumes in Pakistan",
    description:
      "Oud is the heart of Eastern perfumery. Discover Royal Oud by Precise Fumes — a rich, smoky, long-lasting Extrait de Parfum oud fragrance. PKR 3,000, free tester, free Karachi delivery.",
    keywords: [
      "best oud perfume in pakistan",
      "oud perfume",
      "oud perfume pakistan",
      "arabian oud perfume",
    ],
    category: "Guides",
    date: "2026-07-24",
    readMinutes: 4,
    hero: `${IMG}/royal-oud/1-bottle.jpg`,
    body: [
      {
        p: "Few scents carry the heritage of **oud**. Prized across the Middle East and South Asia for centuries, oud — the resinous heartwood of the agar tree — is deep, warm and instantly luxurious. In Pakistan, an oud fragrance is the scent of celebration: weddings, Eid, winter evenings and every occasion that calls for presence.",
      },
      { h2: "Royal Oud — our tribute to the tradition" },
      {
        p: "**Royal Oud** is Precise Fumes' interpretation of the classic Arabian oud. Aged oud sits at its heart, warmed by saffron and rose and grounded in amber, patchouli and sandalwood. The result is rich, smoky and regal — a fragrance that opens boldly and lingers for **12 to 14 hours**, evolving beautifully as the day goes on.",
      },
      { product: "royal-oud" },
      { h2: "What makes a good oud perfume?" },
      {
        list: [
          "Depth: real oud character, not just sweetness.",
          "Longevity: oud should last — ours is Extrait de Parfum, 12–14 hours.",
          "Balance: saffron and rose keep it refined rather than harsh.",
          "Sillage: it should leave a memorable trail without overwhelming.",
        ],
      },
      {
        p: "Royal Oud delivers all four, at **PKR 3,000** for a 50ml bottle — a fraction of what imported Arabian ouds cost, with the same commanding presence. Every order includes a free 5ml tester of another scent, ships **free in Karachi**, and is available cash on delivery nationwide.",
      },
      {
        p: "Prefer something fresher or fruitier? Explore our full range of the [best long-lasting perfumes in Pakistan](/blog/best-long-lasting-perfumes-in-pakistan).",
      },
      { cta: { text: "Shop Royal Oud", href: "/shop/royal-oud" } },
    ],
  },

  {
    slug: "how-to-make-perfume-last-longer",
    title: "How to Make Your Perfume Last Longer (12–14 Hour Guide)",
    description:
      "Simple, proven tips to make your perfume last all day — where to spray, how to store it, and why concentration matters. A Precise Fumes fragrance guide.",
    keywords: [
      "how to make perfume last longer",
      "long lasting perfume",
      "perfume tips",
      "make perfume last all day",
    ],
    category: "Guides",
    date: "2026-07-24",
    readMinutes: 5,
    hero: `${IMG}/site/testers.jpg`,
    body: [
      {
        p: "A great perfume should stay with you from morning to midnight — but even the finest fragrance fades faster if you apply or store it wrong. Here is how to get the most out of every bottle, and why some perfumes simply last longer than others.",
      },
      { h2: "1. Choose the right concentration" },
      {
        p: "This is the biggest factor by far. **Eau de Toilette** has a low oil concentration and fades in a few hours. **Extrait de Parfum** — the most concentrated form — can last **12 to 14 hours**. Every Precise Fumes fragrance is an Extrait de Parfum for exactly this reason. If longevity matters to you, always check the concentration before buying.",
      },
      { h2: "2. Apply to pulse points" },
      {
        p: "Spray where the skin is warm: the inner wrists, the base of the throat, behind the ears, and the inner elbows. Body heat gently diffuses the scent throughout the day, making it last longer and project better.",
      },
      { h2: "3. Moisturise first" },
      {
        p: "Fragrance clings to hydrated skin and evaporates quickly from dry skin. Apply an unscented moisturiser or a little petroleum jelly to your pulse points before spraying — the oils lock the scent in for hours longer.",
      },
      { h2: "4. Don't rub your wrists" },
      {
        p: "It is a common habit, but rubbing your wrists together crushes the top notes and makes the fragrance fade faster. Spray, and let it dry naturally.",
      },
      { h2: "5. Spray on clothes and hair too" },
      {
        p: "Fabric holds scent far longer than skin. A light spray on your shirt collar or scarf — and even a mist over your hairbrush — extends the trail well into the evening.",
      },
      { h2: "6. Store it properly" },
      {
        p: "Heat, light and humidity break fragrance down. Keep your bottle in a cool, dark place — a drawer or cupboard, not a sunny bathroom shelf — and it will smell as good on the last spray as the first.",
      },
      { h2: "The easy shortcut" },
      {
        p: "Start with a fragrance that is built to last. Every Precise Fumes scent is a 12–14 hour Extrait de Parfum, PKR 3,000, with a free 5ml tester so you can find your signature before committing. Not sure where to begin? See the [best long-lasting perfumes in Pakistan](/blog/best-long-lasting-perfumes-in-pakistan).",
      },
      { cta: { text: "Find your long-lasting scent", href: "/shop" } },
    ],
  },

  {
    slug: "the-precise-fumes-story",
    title: "The Precise Fumes Story: Precision, Delivered",
    description:
      "Why we built Precise Fumes — premium, long-lasting perfumes at an honest price, with free testers, real offers, and free delivery in Karachi. Our approach to fragrance, and to you.",
    keywords: [
      "precise fumes",
      "premium perfume brand pakistan",
      "affordable luxury perfume pakistan",
    ],
    category: "Our House",
    date: "2026-07-24",
    readMinutes: 4,
    hero: `${IMG}/site/collection-boxes.jpg`,
    body: [
      {
        p: "Precise Fumes began with a simple frustration: in Pakistan, a genuinely long-lasting, beautifully made perfume almost always meant paying imported-luxury prices — and even then, you were buying blind, hoping the scent suited you. We thought fragrance should be better than that. More precise. More honest. So we built it.",
      },
      { h2: "Precision in every bottle" },
      {
        p: "The name is a promise. Every Precise Fumes scent is composed as an **Extrait de Parfum** — the most concentrated form of fragrance — and balanced to last **12 to 14 hours** in Pakistan's climate. Five signatures, each with its own character, from the fresh-spicy versatility of **Rogue** to the rich, smoky depth of **Royal Oud**. No filler, no compromise — just premium oils, precisely blended.",
      },
      { products: ["rogue", "royal-oud", "legacy", "bloom", "blossom"] },
      { h2: "An honest price" },
      {
        p: "Every 50ml bottle is **PKR 3,000** — premium quality without the premium markup. And our offers are real, not gimmicks: **any two perfumes for PKR 5,000**, or **Buy 2 Get 1 Free** when you take three.",
      },
      { h2: "Try before you commit" },
      {
        p: "Fragrance is personal, so we take the guesswork out of it. **Every perfume comes with a free 5ml tester** of a different scent — and because that applies to every bottle, a Buy 2 Get 1 Free order (three perfumes) earns you **three free testers**. Explore the whole house before deciding on your signature. Want more testers? They are just PKR 200 each.",
      },
      { h2: "Delivered to your door" },
      {
        p: "We deliver **free in Karachi** within 2–5 working days, and anywhere in Pakistan for PKR 300 within 5–7 days. Pay with **cash on delivery** — no advance payment, no risk. And if anything is ever wrong on our side, our **money-back guarantee** means a full refund or a free replacement, no arguments.",
      },
      { h2: "This is just the beginning" },
      {
        p: "Five scents today, with a special edition already taking shape in our atelier. Precise Fumes is a young house with a clear belief: that everyone deserves a fragrance that lasts, that suits them, and that they can buy with total confidence. Welcome — we are glad you are here.",
      },
      { cta: { text: "Explore the collection", href: "/shop" } },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function articleDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[m - 1]} ${d}, ${y}`;
}
