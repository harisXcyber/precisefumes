import type { Metadata } from "next";
import Link from "next/link";
import { isAdmin } from "@/lib/admin-auth";
import { fetchOpenOrderCount } from "@/lib/admin-data";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminNav } from "@/components/admin/admin-nav";
import { LogoutButton } from "@/components/admin/logout-button";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdmin())) return <AdminLogin />;

  const openCount = await fetchOpenOrderCount();

  return (
    <div className="min-h-screen bg-bg text-fg lg:flex">
      {/* Sidebar — desktop */}
      <aside className="sticky top-0 z-40 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-bg-soft lg:flex">
        <div className="flex h-16 items-center border-b border-border px-5">
          <span className="font-serif text-lg">
            Precise Fumes<span className="text-accent"> · Admin</span>
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <AdminNav openCount={openCount} variant="sidebar" />
        </div>
        <div className="space-y-1 border-t border-border p-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-[var(--radius)] px-3 py-2 text-sm text-fg-soft transition-colors hover:bg-bg-elevated hover:text-fg"
          >
            View site ↗
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar — mobile */}
        <header className="sticky top-0 z-40 border-b border-border bg-bg/95 backdrop-blur-md lg:hidden">
          <div className="flex h-14 items-center justify-between px-4">
            <span className="font-serif text-base">
              Precise Fumes<span className="text-accent"> · Admin</span>
            </span>
            <LogoutButton />
          </div>
          <div className="overflow-x-auto border-t border-border px-2 py-2">
            <AdminNav openCount={openCount} variant="bar" />
          </div>
        </header>

        <main className="container-lux py-8 md:py-12">{children}</main>
      </div>
    </div>
  );
}
