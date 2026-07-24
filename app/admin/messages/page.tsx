import { fetchMessages } from "@/lib/admin-data";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function AdminMessages() {
  const { messages, subscribers } = (await fetchMessages()) as any;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-3xl font-normal md:text-4xl">
          Messages
        </h1>
        <p className="mt-2 text-sm text-fg-soft">
          Contact form enquiries and newsletter signups.
        </p>
      </div>

      <section>
        <h2 className="mb-4 font-serif text-2xl font-normal">
          Enquiries ({messages.length})
        </h2>
        {messages.length === 0 ? (
          <p className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-8 text-center text-sm text-fg-soft">
            No messages yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {messages.map((m: any) => (
              <li
                key={m.id}
                className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-medium">
                    {m.name}{" "}
                    <a
                      href={`mailto:${m.email}`}
                      className="text-sm font-normal text-accent-deep hover:underline"
                    >
                      {m.email}
                    </a>
                  </p>
                  <p className="text-xs text-fg-faint">
                    {new Date(m.created_at).toLocaleString()}
                  </p>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm text-fg-soft">
                  {m.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-serif text-2xl font-normal">
          Newsletter ({subscribers.length})
        </h2>
        {subscribers.length === 0 ? (
          <p className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-8 text-center text-sm text-fg-soft">
            No subscribers yet.
          </p>
        ) : (
          <div className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-5">
            <p className="mb-3 text-xs text-fg-soft">
              Copy this list into your email tool when you announce the special
              edition.
            </p>
            <textarea
              readOnly
              rows={Math.min(10, subscribers.length + 1)}
              className="w-full resize-y font-mono text-xs"
              value={subscribers.map((s: any) => s.email).join(", ")}
            />
          </div>
        )}
      </section>
    </div>
  );
}
