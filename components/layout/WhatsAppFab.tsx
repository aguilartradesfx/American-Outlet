"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { waLink, site } from "@/content/site";

/**
 * Botón flotante de WhatsApp — canal de venta principal.
 * Persistente pero no intrusivo: aparece tras un pequeño scroll.
 */
export function WhatsAppFab() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Escríbenos por WhatsApp al ${site.whatsapp.display}`}
      className={`group fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-full bg-[#1fae54] py-3.5 pl-3.5 pr-4 text-white shadow-[0_14px_38px_-10px_rgba(31,174,84,0.85)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#1a9b4a] ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#1fae54] opacity-20" />
      <Icon name="whatsapp" className="h-6 w-6" />
      <span className="hidden text-sm font-medium sm:block">Escríbenos</span>
    </a>
  );
}
