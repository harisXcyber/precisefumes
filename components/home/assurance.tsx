import { Reveal } from "@/components/ui/reveal";

const POINTS = [
  {
    title: "Extrait de Parfum",
    body: "The most concentrated form — richer, deeper, and made to last.",
  },
  {
    title: "12–14 Hours",
    body: "Premium oils that stay with you from morning through to midnight.",
  },
  {
    title: "Free 5ml Tester",
    body: "One free tester per perfume — buy 2 get 1 free means 3 free testers.",
  },
  {
    title: "Money-Back Guarantee",
    body: "Anything wrong on our side? Full refund or free replacement.",
  },
];

/** Trust band — the four reasons to buy, stated plainly. */
export function Assurance() {
  return (
    <section className="border-y border-border bg-bg-soft">
      <div className="container-lux grid grid-cols-2 gap-px overflow-hidden md:grid-cols-4">
        {POINTS.map((p, i) => (
          <Reveal
            key={p.title}
            delay={i * 0.08}
            className="bg-bg-soft px-5 py-10 text-center md:px-8"
          >
            <h3 className="font-serif text-lg md:text-xl">{p.title}</h3>
            <p className="mx-auto mt-2 max-w-[16rem] text-xs leading-relaxed text-fg-soft md:text-sm">
              {p.body}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
