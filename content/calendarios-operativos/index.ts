import type { CalendarioOperativo } from "./tipos";
import { fortuna } from "./fortuna";
import { florencia } from "./florencia";

/**
 * Registro de calendarios operativos por slug de tienda.
 *
 * ⚠️ Ciudad Quesada NO está aquí a propósito: su calendario es el de
 * fases/descuentos (meses/dias/piezas) y se deja intacto. Estos calendarios
 * son independientes y solo aplican a Fortuna y Florencia.
 */
export const calendariosOperativos: Record<string, CalendarioOperativo> = {
  fortuna,
  florencia,
};

/** Slugs con calendario operativo, en orden de presentación. */
export const slugsOperativos = ["fortuna", "florencia"] as const;

export function getCalendarioOperativo(
  slug: string | null | undefined,
): CalendarioOperativo | null {
  if (!slug) return null;
  return calendariosOperativos[slug] ?? null;
}

export function tieneCalendarioOperativo(slug: string | null | undefined): boolean {
  return !!slug && slug in calendariosOperativos;
}

export type { CalendarioOperativo } from "./tipos";
