"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export interface ProductFormValues {
  id?: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: "Him" | "Her";
  price: number;
  compareAtPrice: number | "";
  sizes: { label: string; price: number; stock: number }[];
  notes: { top: string[]; heart: string[]; base: string[] };
  images: string[];
  concentration: string;
  longevity: string;
  stock: number;
  featured: boolean;
  active: boolean;
  sortOrder: number;
}

export const EMPTY_PRODUCT: ProductFormValues = {
  slug: "",
  name: "",
  tagline: "",
  description: "",
  category: "Him",
  price: 3000,
  compareAtPrice: "",
  sizes: [{ label: "50ml", price: 3000, stock: 999 }],
  notes: { top: [], heart: [], base: [] },
  images: [],
  concentration: "Eau de Parfum",
  longevity: "12-14 hours",
  stock: 999,
  featured: false,
  active: true,
  sortOrder: 99,
};

const IMAGE_HINTS = [
  "Front of bottle",
  "Side / angle",
  "With box",
  "Lifestyle shot",
];

export function ProductForm({
  initial,
  isNew,
}: {
  initial: ProductFormValues;
  isNew: boolean;
}) {
  const router = useRouter();
  const [v, setV] = useState<ProductFormValues>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const set = <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K]
  ) => setV((p) => ({ ...p, [key]: value }));

  async function uploadFiles(files: FileList) {
    setUploading(true);
    setMsg(null);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("slug", v.slug || "product");
      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (res.ok && data.url) urls.push(data.url);
        else setMsg({ ok: false, text: data.error ?? "Upload failed." });
      } catch {
        setMsg({ ok: false, text: "Upload failed." });
      }
    }
    if (urls.length) set("images", [...v.images, ...urls]);
    setUploading(false);
  }

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= v.images.length) return;
    const next = [...v.images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    set("images", next);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const payload = {
      ...v,
      slug: v.slug || v.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      compareAtPrice: v.compareAtPrice === "" ? null : v.compareAtPrice,
      sizes: v.sizes.length
        ? v.sizes
        : [{ label: "50ml", price: v.price, stock: v.stock }],
    };

    try {
      const res = await fetch(
        isNew ? "/api/admin/products" : `/api/admin/products/${v.id}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMsg({ ok: true, text: "Saved." });
        router.push("/admin/products");
        router.refresh();
      } else {
        setMsg({ ok: false, text: data.error ?? "Could not save." });
      }
    } catch {
      setMsg({ ok: false, text: "Could not save." });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!v.id) return;
    if (!confirm(`Delete "${v.name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/products/${v.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    }
  }

  const notesField = (key: "top" | "heart" | "base", label: string) => (
    <div>
      <label className="pf-label mb-2 block">{label} notes</label>
      <input
        type="text"
        value={v.notes[key].join(", ")}
        onChange={(e) =>
          set("notes", {
            ...v.notes,
            [key]: e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          })
        }
        className="w-full"
        placeholder="Comma separated, e.g. Bergamot, Saffron"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Basics */}
      <section className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-6">
        <h2 className="mb-5 font-serif text-xl font-normal">Basics</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="pf-label mb-2 block">Name</label>
            <input
              value={v.name}
              onChange={(e) => set("name", e.target.value)}
              required
              className="w-full"
              placeholder="Rogue"
            />
          </div>
          <div>
            <label className="pf-label mb-2 block">URL slug</label>
            <input
              value={v.slug}
              onChange={(e) => set("slug", e.target.value)}
              className="w-full"
              placeholder="rogue"
            />
            <p className="mt-1 text-xs text-fg-soft">
              precisefumes.com/shop/{v.slug || "…"}
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="pf-label mb-2 block">Tagline</label>
            <input
              value={v.tagline}
              onChange={(e) => set("tagline", e.target.value)}
              className="w-full"
              placeholder="Bold. Daring. Unmistakable."
            />
          </div>
          <div className="md:col-span-2">
            <label className="pf-label mb-2 block">Description</label>
            <textarea
              value={v.description}
              onChange={(e) => set("description", e.target.value)}
              rows={5}
              className="w-full resize-y"
              placeholder="How the fragrance opens, develops and settles…"
            />
          </div>
          <div>
            <label className="pf-label mb-2 block">Category</label>
            <select
              value={v.category}
              onChange={(e) =>
                set("category", e.target.value as "Him" | "Her")
              }
              className="w-full"
            >
              <option value="Him">For Him (male)</option>
              <option value="Her">For Her (female)</option>
            </select>
          </div>
          <div>
            <label className="pf-label mb-2 block">Display order</label>
            <input
              type="number"
              value={v.sortOrder}
              onChange={(e) => set("sortOrder", Number(e.target.value))}
              className="w-full"
            />
            <p className="mt-1 text-xs text-fg-soft">
              Lower numbers appear first.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-6">
        <h2 className="mb-5 font-serif text-xl font-normal">Price & stock</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="pf-label mb-2 block">Price (PKR)</label>
            <input
              type="number"
              value={v.price}
              onChange={(e) => {
                const price = Number(e.target.value);
                set("price", price);
                // keep the single size row in sync with the headline price
                if (v.sizes.length === 1) {
                  set("sizes", [{ ...v.sizes[0], price }]);
                }
              }}
              required
              className="w-full"
            />
            <p className="mt-1 text-xs text-fg-soft">
              PKR 3,000 keeps the launch-bonus badge and the 2-for-5,000 bundle
              working.
            </p>
          </div>
          <div>
            <label className="pf-label mb-2 block">
              Compare-at price (optional)
            </label>
            <input
              type="number"
              value={v.compareAtPrice}
              onChange={(e) =>
                set(
                  "compareAtPrice",
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              className="w-full"
              placeholder="Shows a struck-through price"
            />
          </div>
          <div>
            <label className="pf-label mb-2 block">Stock</label>
            <input
              type="number"
              value={v.stock}
              onChange={(e) => set("stock", Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Sizes */}
        <div className="mt-6">
          <label className="pf-label mb-2 block">Sizes</label>
          <div className="space-y-3">
            {v.sizes.map((s, i) => (
              <div key={i} className="flex flex-wrap items-center gap-3">
                <input
                  value={s.label}
                  onChange={(e) => {
                    const next = [...v.sizes];
                    next[i] = { ...s, label: e.target.value };
                    set("sizes", next);
                  }}
                  className="w-28"
                  placeholder="50ml"
                />
                <input
                  type="number"
                  value={s.price}
                  onChange={(e) => {
                    const next = [...v.sizes];
                    next[i] = { ...s, price: Number(e.target.value) };
                    set("sizes", next);
                  }}
                  className="w-32"
                  placeholder="Price"
                />
                <input
                  type="number"
                  value={s.stock}
                  onChange={(e) => {
                    const next = [...v.sizes];
                    next[i] = { ...s, stock: Number(e.target.value) };
                    set("sizes", next);
                  }}
                  className="w-28"
                  placeholder="Stock"
                />
                {v.sizes.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      set("sizes", v.sizes.filter((_, j) => j !== i))
                    }
                    className="text-xs uppercase tracking-wider text-accent-rose hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              set("sizes", [
                ...v.sizes,
                { label: "", price: v.price, stock: 999 },
              ])
            }
            className="mt-3 text-xs uppercase tracking-[0.14em] text-accent-deep hover:underline"
          >
            + Add another size
          </button>
        </div>
      </section>

      {/* Images */}
      <section className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-6">
        <h2 className="font-serif text-xl font-normal">Images</h2>
        <p className="mt-1 text-sm text-fg-soft">
          Upload as many angles as you like — front, side, with box, lifestyle.
          The first image is the one shown on cards and search results; drag
          order with the arrows.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {v.images.map((url, i) => (
            <div
              key={url}
              className="overflow-hidden rounded-[var(--radius)] border border-border bg-bg"
            >
              <div className="relative aspect-square">
                <Image
                  src={url}
                  alt={`Image ${i + 1}`}
                  fill
                  sizes="200px"
                  className="object-contain p-2"
                  unoptimized
                />
                {i === 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[10px] uppercase tracking-wider text-on-accent">
                    Primary
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-1 border-t border-border p-2 text-xs">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveImage(i, i - 1)}
                    disabled={i === 0}
                    className="px-1.5 py-0.5 text-fg-soft hover:text-fg disabled:opacity-30"
                    aria-label="Move earlier"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(i, i + 1)}
                    disabled={i === v.images.length - 1}
                    className="px-1.5 py-0.5 text-fg-soft hover:text-fg disabled:opacity-30"
                    aria-label="Move later"
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    set("images", v.images.filter((_, j) => j !== i))
                  }
                  className="text-accent-rose hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--radius)] border border-dashed border-fg-faint p-4 text-center text-xs text-fg-soft transition-colors hover:border-accent hover:text-fg">
            <span className="text-2xl">＋</span>
            {uploading ? "Uploading…" : "Add images"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && uploadFiles(e.target.files)}
            />
          </label>
        </div>

        <p className="mt-4 text-xs text-fg-faint">
          Suggested set: {IMAGE_HINTS.join(" · ")}. JPG, PNG or WebP, up to
          10 MB each.
        </p>
      </section>

      {/* Scent detail */}
      <section className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-6">
        <h2 className="mb-5 font-serif text-xl font-normal">Scent detail</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {notesField("top", "Top")}
          {notesField("heart", "Heart")}
          {notesField("base", "Base")}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="pf-label mb-2 block">Concentration</label>
            <input
              value={v.concentration}
              onChange={(e) => set("concentration", e.target.value)}
              className="w-full"
              placeholder="Eau de Parfum"
            />
          </div>
          <div>
            <label className="pf-label mb-2 block">Longevity</label>
            <input
              value={v.longevity}
              onChange={(e) => set("longevity", e.target.value)}
              className="w-full"
              placeholder="12-14 hours"
            />
          </div>
        </div>
      </section>

      {/* Visibility */}
      <section className="rounded-[var(--radius-lg)] border border-border bg-bg-soft p-6">
        <h2 className="mb-5 font-serif text-xl font-normal">Visibility</h2>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={v.active}
              onChange={(e) => set("active", e.target.checked)}
            />
            Live on the storefront
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={v.featured}
              onChange={(e) => set("featured", e.target.checked)}
            />
            Featured on the homepage
          </label>
        </div>
      </section>

      {msg && (
        <p
          className={`text-sm ${msg.ok ? "text-accent-deep" : "text-accent-rose"}`}
        >
          {msg.text}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={saving || uploading}
          className="btn-primary disabled:opacity-60"
        >
          {saving ? "Saving…" : isNew ? "Create product" : "Save changes"}
        </button>
        {!isNew && (
          <button
            type="button"
            onClick={handleDelete}
            className="text-xs uppercase tracking-[0.14em] text-accent-rose hover:underline"
          >
            Delete product
          </button>
        )}
        <p className="text-xs text-fg-faint">
          Changes appear on the storefront within an hour, or instantly on the
          next deploy.
        </p>
      </div>
    </form>
  );
}
