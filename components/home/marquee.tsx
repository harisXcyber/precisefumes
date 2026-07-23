const NAMES = ["Rogue", "Royal Oud", "Bloom", "Blossom", "Legacy"];

/** Big scrolling scent-name strip — pure CSS animation (GPU-cheap). */
export function Marquee() {
  const row = [...NAMES, ...NAMES];
  return (
    <section
      aria-hidden
      className="overflow-hidden border-y border-border bg-bg py-6 md:py-8"
    >
      <div className="pf-marquee items-baseline gap-10 pr-10 md:gap-16 md:pr-16">
        {[0, 1].map((half) => (
          <div
            key={half}
            className="flex shrink-0 items-baseline gap-10 md:gap-16"
          >
            {row.map((name, i) => (
              <span
                key={`${half}-${i}`}
                className={`whitespace-nowrap font-serif text-5xl font-normal italic md:text-7xl ${
                  i % 2 === 0 ? "pf-outline-text" : "text-accent/80"
                }`}
              >
                {name}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
