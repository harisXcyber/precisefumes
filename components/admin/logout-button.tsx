"use client";

export function LogoutButton() {
  return (
    <button
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        window.location.href = "/admin";
      }}
      className="text-xs uppercase tracking-[0.14em] text-fg-soft transition-colors hover:text-fg"
    >
      Sign Out
    </button>
  );
}
