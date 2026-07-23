# Performance & SEO Optimization Guide

## Image Optimization

### Current Setup
- Next.js Image component is used throughout (`ProductCard`, `hero`, `CartDrawer`, `layout`)
- Images use responsive sizing with `sizes` prop for different breakpoints
- `priority` prop set on above-fold images (hero, featured products)

### Recommended Actions

**1. Generate WebP/AVIF Variants**
```bash
# For each product image, create optimized variants:
cwebp -q 80 rogue.jpg -o rogue.webp
cwebp -q 80 rogue.jpg -o rogue-thumb.webp
```

**2. Logo Optimization**
- Current: logo-dark.png (604KB), logo-light.png (792KB)
- Action: Export as SVG or use next/image with formats="avif,webp"

**3. OG Image**
- Dynamically generated via `app/opengraph-image.tsx`
- Size optimized to 1200×630 per standard

### Image Sizes Configuration
```tsx
// Product cards (mobile: 50vw, tablet: 33vw, desktop: 25vw)
sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"

// Full-width sections
sizes="100vw"

// Small icons/buttons
sizes="(max-width: 768px) 40px, 48px"
```

---

## Caching Strategy

### Static Generation (ISG)
- Product detail pages use `generateStaticParams` for SSG
- Homepage components cache featured products server-side
- Policy pages are fully static

### Dynamic Pages
- Checkout, Order Confirmation, Affiliate Dashboard = client/dynamic
- Contact form submissions = dynamic API route
- Cart state = client-side (Zustand + localStorage)

### HTTP Caching
```
# Recommended headers (configure in next.config.js)
- Static assets: max-age=31536000 (1 year)
- API routes: no-cache (validation required)
- Pages: max-age=3600 (1 hour, revalidate at-request-time)
```

---

## Core Web Vitals

### Font Optimization
✅ Already configured:
- `display: "swap"` on all Google Fonts imports (Cormorant, Inter)
- Prevents layout shift during font load
- Preload via next/font

### Layout Stability (CLS)
- No unexpected layout shifts with Framer Motion components
- `animate` uses explicit pixel values, not percentages
- Images use aspect-ratio or fixed dimensions

### First Input Delay (FID)
- Lightweight dependencies (Zustand, Lucide)
- No third-party scripts in critical path
- Cart state updates are instant (client-side)

### Largest Contentful Paint (LCP)
- Hero image/text loads with `priority={true}` in next/image
- Above-fold CSS inlined in critical stylesheet
- Server-side rendering for Featured products section

---

## SEO Best Practices

### Currently Implemented
✅ `robots.txt` - Controls crawler access
✅ `sitemap.xml` - Dynamically generated from products + pages
✅ Open Graph meta tags - For social sharing
✅ JSON-LD schemas:
  - Organization (name, logo, contact)
  - LocalBusiness (Karachi, hours, address)
✅ Canonical URLs - Set via metadataBase
✅ Meta descriptions - All pages have descriptions

### Page-Level SEO
- Title template: `"%s · Precise Fumes"` for consistency
- Unique descriptions on every page
- No indexing on private pages (order confirmation, affiliate dashboard)

### Structured Data for Products (TODO)
When connected to Supabase, add Product + Offer schemas to `/shop/[slug]`:
```json
{
  "@type": "Product",
  "name": "Rogue",
  "description": "...",
  "brand": { "@type": "Brand", "name": "Precise Fumes" },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "PKR",
    "price": "3000",
    "availability": "InStock"
  }
}
```

### Mobile Optimization
✅ Viewport meta tag configured
✅ Touch-friendly buttons (48px minimum)
✅ Responsive images with srcset via next/image
✅ Mobile-first CSS design

---

## Performance Monitoring

### Lighthouse Checklist
Target scores (mobile):
- Performance: ≥85
- Accessibility: ≥90
- Best Practices: ≥90
- SEO: ≥100

### Real User Monitoring (TODO)
- Install Vercel Web Analytics (free tier: 2,500 events/mo)
- Configure in next.config.js: `{ analyticsId: "..." }`
- Track Core Web Vitals automatically

---

## Build Optimization

### Code Splitting
- Each route is code-split automatically
- Client components isolated from server components
- Dynamic imports on cart/checkout to reduce main bundle

### Tree Shaking
- Lucide icons imported individually (not whole library)
- Tailwind CSS auto-purges unused classes in production
- No dead code in final bundle

### Production Build
```bash
npm run build  # Creates .next/ directory
npm start      # Starts server (production mode)
```

Expected bundle sizes:
- Main JS: <150KB
- CSS: <50KB (with Tailwind purge)
- Server functions: <100KB

---

## Deployment Checklist (Vercel)

- [ ] Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` env vars
- [ ] Set `RESEND_API_KEY` for emails
- [ ] Enable automatic deployments from GitHub
- [ ] Configure custom domain + SSL
- [ ] Set up Web Analytics (optional)
- [ ] Enable Advanced Security (optional, paid feature)
- [ ] Test all Core Web Vitals post-deploy via Vercel Analytics

---

## Resources

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Web Vitals Guide](https://web.dev/vitals/)
- [JSON-LD Generator](https://www.json-ld.org/playground/)
- [Lighthouse Report](https://developers.google.com/web/tools/lighthouse)

