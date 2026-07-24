import { fetchAllOffers } from "@/lib/admin-data";
import { OffersManager } from "@/components/admin/offers-manager";

export default async function AdminOffers() {
  const offers = (await fetchAllOffers()) as any[];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-normal md:text-4xl">Offers</h1>
        <p className="mt-2 text-sm text-fg-soft">
          The two pricing offers apply automatically at checkout while active
          and before their end date. Extend, pause, or expire them here, and
          add your own promotional offers.
        </p>
      </div>
      <OffersManager offers={offers} />
    </div>
  );
}
