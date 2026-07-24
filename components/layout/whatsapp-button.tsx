"use client";

import { waLink } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

export function WhatsAppButton() {
  return (
    <a
      href={waLink("Hi Precise Fumes! I have a question about your perfumes.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-[55] flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.7)] transition-transform duration-300 hover:scale-105"
    >
      <WhatsAppIcon className="h-6 w-6" />
      <span className="hidden text-sm font-medium sm:inline">Chat with us</span>
    </a>
  );
}
