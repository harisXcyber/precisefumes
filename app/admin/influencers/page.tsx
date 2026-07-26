import { fetchInfluencerApplications } from "@/lib/admin-data";
import { InfluencersTable } from "@/components/admin/influencers-table";

export default async function AdminInfluencers() {
  const applications = await fetchInfluencerApplications();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-normal md:text-4xl">
          Influencers
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-fg-soft">
          Applications from /influencers. Every tier gets the 5-perfume gift
          set and owes one 30–60s reel (voice + face). Approve, then message
          them on WhatsApp to arrange the gift and their promo code.
        </p>
      </div>
      <InfluencersTable applications={applications} />
    </div>
  );
}
