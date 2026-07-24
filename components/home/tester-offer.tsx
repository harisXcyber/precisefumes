import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";

const TESTER_IMAGE =
  "https://qjjdxxtfvrdrpwcvlwhb.supabase.co/storage/v1/object/public/product-images/site/testers.jpg";

/** Explains the free-5ml-tester offer with the real tester photography. */
export function TesterOffer() {
  return (
    <section className="pf-tint-cool pf-tint py-20 md:py-28">
      <div className="container-lux grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-border">
            <Image
              src={TESTER_IMAGE}
              alt="Precise Fumes 5ml testers — Legacy, Blossom, Royal Oud, Bloom and Rogue"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="pf-eyebrow">A gift in every order</p>
          <h2 className="mt-4 font-serif text-4xl font-normal leading-tight md:text-5xl">
            A free 5ml tester with{" "}
            <span className="italic text-accent-deep">every perfume</span>
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-fg-soft">
            Buy one perfume, choose a free 5ml tester of a scent you
            haven&apos;t tried. And because testers come with{" "}
            <strong className="text-fg">every</strong> perfume, our offers stack:
            a <strong className="text-fg">Buy 3 Get 1 Free</strong> order means
            four perfumes <em>and</em> four free testers. Want more? Extra
            testers are just PKR 200 each.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/shop" className="btn-primary">
              Shop &amp; Claim Your Tester
            </Link>
            <Link href="/faq" className="btn-ghost">
              How It Works
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
