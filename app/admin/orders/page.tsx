import { fetchOrders } from "@/lib/admin-data";
import { OrdersTable } from "@/components/admin/orders-table";

export default async function AdminOrders() {
  const orders = await fetchOrders();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-normal md:text-4xl">Orders</h1>
        <p className="mt-2 text-sm text-fg-soft">
          Every order is Cash on Delivery — collect the total shown when the
          parcel is handed over.
        </p>
      </div>
      <OrdersTable orders={orders} />
    </div>
  );
}
