import { fetchAffiliates } from "@/lib/admin-data";
import { AffiliatesTable } from "@/components/admin/affiliates-table";

export default async function AdminAffiliates() {
  const affiliates = await fetchAffiliates();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-normal md:text-4xl">
          Affiliates
        </h1>
        <p className="mt-2 text-sm text-fg-soft">
          Each earns PKR 300 per delivered order. Pay via the EasyPaisa or
          JazzCash number shown, then mark as paid.
        </p>
      </div>
      <AffiliatesTable affiliates={affiliates} />
    </div>
  );
}
