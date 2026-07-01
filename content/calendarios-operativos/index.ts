import type { CalendarioInstruccional } from "./tipos";
import { plantillaInstruccional } from "./instruccional";

/**
 * Tiendas operativas y su nombre. El contenido del calendario instruccional es
 * COMPARTIDO (misma plantilla para todas); solo cambia el nombre del encabezado.
 *
 * ⚠️ Ciudad Quesada NO está aquí: su calendario es el de fases/descuentos.
 */
const nombresPorSlug: Record<string, string> = {
  fortuna: "American Outlet La Fortuna",
  florencia: "American Outlet Florencia",
};

/** Slugs con calendario operativo, en orden de presentación. */
export const slugsOperativos = ["fortuna", "florencia"] as const;

export function getCalendarioOperativo(
  slug: string | null | undefined,
): CalendarioInstruccional | null {
  if (!slug || !(slug in nombresPorSlug)) return null;
  return {
    tiendaSlug: slug,
    tiendaNombre: nombresPorSlug[slug],
    ...plantillaInstruccional,
  };
}

export type { CalendarioInstruccional } from "./tipos";
