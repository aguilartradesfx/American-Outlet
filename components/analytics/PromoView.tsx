"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/track";

/**
 * Dispara `view_promo` una vez al montar — para detectar cuándo alguien entra
 * a ver una promo (landing /promo y ruleta /papa). No renderiza nada.
 */
export function PromoView({
  promoNombre,
  promoOrigen,
}: {
  promoNombre: string;
  promoOrigen: string;
}) {
  useEffect(() => {
    trackEvent("view_promo", {
      promo_nombre: promoNombre,
      promo_origen: promoOrigen,
    });
  }, [promoNombre, promoOrigen]);

  return null;
}
