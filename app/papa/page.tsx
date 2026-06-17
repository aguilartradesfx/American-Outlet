import type { Metadata } from "next";
import { getPromoActiva } from "@/lib/panel/promos";
import { RuletaLanding } from "./RuletaLanding";
import { PromoView } from "@/components/analytics/PromoView";

export const metadata: Metadata = {
  title: "Girá y ganá tu descuento · Día del Padre",
  description:
    "Girá la ruleta del Día del Padre en American Outlet y ganá tu descuento al instante. Solo por tiempo limitado.",
  // Landing para campañas pagadas: no debe indexarse ni competir con el sitio.
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export const revalidate = 300;

export default async function PapaRuletaPage() {
  const promo = await getPromoActiva();
  return (
    <>
      <PromoView promoNombre="ruleta_papa" promoOrigen="ruleta-papa-ads" />
      <RuletaLanding fondo={promo?.imagen_url ?? null} />
    </>
  );
}
