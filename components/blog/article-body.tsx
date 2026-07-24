import Link from "next/link";
import type { Block } from "@/lib/blog";
import type { Product } from "@/types";
import { ProductCard } from "@/components/shop/product-card";

/** Parse inline **bold**, *italic* and [text](/href) into React nodes. */
function inline(text: string, keyBase: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)|\*(.+?)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      nodes.push(<strong key={`${keyBase}-b${i}`}>{m[1]}</strong>);
    } else if (m[2] !== undefined && m[3] !== undefined) {
      nodes.push(
        <Link
          key={`${keyBase}-l${i}`}
          href={m[3]}
          className="link-underline text-fg"
        >
          {m[2]}
        </Link>
      );
    } else if (m[4] !== undefined) {
      nodes.push(<em key={`${keyBase}-i${i}`}>{m[4]}</em>);
    }
    last = re.lastIndex;
    i++;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function ArticleBody({
  blocks,
  productMap,
}: {
  blocks: Block[];
  productMap: Record<string, Product>;
}) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        const key = `b${i}`;
        if ("h2" in block) {
          return (
            <h2
              key={key}
              className="pt-4 font-serif text-2xl font-normal md:text-3xl"
            >
              {block.h2}
            </h2>
          );
        }
        if ("p" in block) {
          return (
            <p
              key={key}
              className="text-[15px] leading-relaxed text-fg-soft md:text-base"
            >
              {inline(block.p, key)}
            </p>
          );
        }
        if ("list" in block) {
          return (
            <ul key={key} className="space-y-2 pl-1">
              {block.list.map((item, j) => (
                <li
                  key={`${key}-${j}`}
                  className="flex gap-3 text-[15px] leading-relaxed text-fg-soft md:text-base"
                >
                  <span className="mt-1 text-accent" aria-hidden>
                    ✦
                  </span>
                  <span>{inline(item, `${key}-${j}`)}</span>
                </li>
              ))}
            </ul>
          );
        }
        if ("quote" in block) {
          return (
            <blockquote
              key={key}
              className="border-l-2 border-accent pl-5 font-serif text-xl italic text-fg"
            >
              {block.quote}
            </blockquote>
          );
        }
        if ("cta" in block) {
          return (
            <div key={key} className="py-2">
              <Link href={block.cta.href} className="btn-primary">
                {block.cta.text}
              </Link>
            </div>
          );
        }
        if ("product" in block) {
          const p = productMap[block.product];
          if (!p) return null;
          return (
            <div key={key} className="mx-auto max-w-[16rem] py-2">
              <ProductCard product={p} />
            </div>
          );
        }
        if ("products" in block) {
          const items = block.products
            .map((s) => productMap[s])
            .filter(Boolean) as Product[];
          if (items.length === 0) return null;
          return (
            <div
              key={key}
              className="grid grid-cols-2 gap-4 py-2 sm:grid-cols-3 lg:grid-cols-5"
            >
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
