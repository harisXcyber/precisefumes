"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  Tag,
  Share2,
  MessageSquare,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Item = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  external?: boolean;
  badge?: number;
};

export function AdminNav({
  openCount = 0,
  variant = "sidebar",
}: {
  openCount?: number;
  variant?: "sidebar" | "bar";
}) {
  const pathname = usePathname();

  const items: Item[] = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag, badge: openCount },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/offers", label: "Offers", icon: Tag },
    { href: "/admin/affiliates", label: "Affiliates", icon: Share2 },
    { href: "/admin/messages", label: "Messages", icon: MessageSquare },
    { href: "/finances", label: "Finances", icon: Wallet, external: true },
  ];

  const isActive = (item: Item) =>
    !item.external &&
    (item.exact ? pathname === item.href : pathname.startsWith(item.href));

  const bar = variant === "bar";

  return (
    <nav className={cn(bar ? "flex gap-1.5" : "flex flex-col gap-1")}>
      {items.map((item) => {
        const active = isActive(item);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            {...(item.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className={cn(
              "group flex shrink-0 items-center gap-2.5 rounded-[var(--radius)] text-sm transition-colors",
              bar ? "px-3 py-2" : "px-3 py-2.5",
              active
                ? "bg-accent/15 font-medium text-accent-deep"
                : "text-fg-soft hover:bg-bg-elevated hover:text-fg"
            )}
          >
            <Icon
              className={cn(
                "h-[18px] w-[18px] shrink-0",
                item.external && "text-accent-deep"
              )}
              strokeWidth={1.7}
            />
            <span className="whitespace-nowrap">{item.label}</span>
            {item.badge && item.badge > 0 ? (
              <span
                className={cn(
                  "rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold leading-none text-on-accent tabular-nums",
                  bar ? "ml-1" : "ml-auto"
                )}
              >
                {item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
