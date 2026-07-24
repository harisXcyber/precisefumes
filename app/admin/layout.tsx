import type { Metadata } from "next";
import Link from "next/link";
import { isAdmin } from "@/lib/admin-auth";
import { AdminLogin } from "@/components/admin/admin-login";
import { LogoutButton } from "@/components/admin/logout-button";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/affiliates", label: "Affiliates" },
  { href: "/admin/messages", label: "Messages" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdmin())) return <AdminLogin />;

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-border bg-bg/95 backdrop-blur-md">
        <div className="container-lux flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6 overflow-x-auto">
            <span className="shrink-0 font-serif text-lg">
              Precise Fumes<span className="text-accent"> · Admin</span>
            </span>
            <nav className="flex items-center gap-4 md:gap-6">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="shrink-0 text-xs uppercase tracking-[0.14em] text-fg-soft transition-colors hover:text-fg"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <Link
              href="/"
              className="hidden text-xs uppercase tracking-[0.14em] text-fg-soft hover:text-fg sm:block"
            >
              View Site ↗
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="container-lux py-8 md:py-12">{children}</main>
    </div>
  );
}
