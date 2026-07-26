import Link from "next/link";

/** Branded 404 — the default framework page is a dead end with no way
 *  back into the store. */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center text-fg">
      <p className="tracking-luxe text-xs text-accent">Error 404</p>
      <h1 className="mt-4 font-serif text-5xl font-normal md:text-6xl">
        This page has faded
      </h1>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-fg-soft">
        Like a scent that&apos;s moved on, the page you&apos;re looking for
        isn&apos;t here. The collection, however, is very much alive.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/shop" className="btn-primary">
          Explore the Collection
        </Link>
        <Link href="/track" className="btn-ghost">
          Track an Order
        </Link>
      </div>
      <Link
        href="/"
        className="mt-6 text-xs uppercase tracking-[0.16em] text-fg-soft underline-offset-4 hover:text-fg hover:underline"
      >
        Back to Home
      </Link>
    </div>
  );
}
