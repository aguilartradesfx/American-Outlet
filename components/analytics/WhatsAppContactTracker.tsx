"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/track";

/**
 * Listener delegado: captura clics en cualquier enlace a WhatsApp (wa.me) del
 * sitio público — Fab, Header, Footer y botones de página — y los registra como
 * un único evento `contact`. Evita instrumentar 12+ enlaces uno por uno (muchos
 * viven en server components donde no se puede poner onClick).
 *
 * El form de contacto NO entra acá: usa window.open (no es un <a>), así que
 * empuja su propio evento y no hay doble conteo.
 */
export function WhatsAppContactTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const link = target?.closest<HTMLAnchorElement>('a[href*="wa.me"]');
      if (!link) return;
      trackEvent("contact", {
        contact_method: "whatsapp",
        contact_source: window.location.pathname,
        contact_label: (link.getAttribute("aria-label") || link.textContent || "")
          .trim()
          .slice(0, 80),
      });
    }
    // capture: corre antes de que el navegador abra el enlace.
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
