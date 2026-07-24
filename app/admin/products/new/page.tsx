import Link from "next/link";
import { ProductForm, EMPTY_PRODUCT } from "@/components/admin/product-form";

export default function NewProduct() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="text-xs uppercase tracking-[0.14em] text-fg-soft hover:text-fg"
        >
          ← Products
        </Link>
        <h1 className="mt-3 font-serif text-3xl font-normal md:text-4xl">
          New product
        </h1>
      </div>
      <ProductForm initial={EMPTY_PRODUCT} isNew />
    </div>
  );
}
