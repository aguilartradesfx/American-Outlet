/**
 * Calendario operativo de contenido por tienda (manual del administrador).
 * Contenido de solo lectura, transcrito de los manuales operativos de cada tienda.
 * Patrón "contenido en código" (igual que content/plan-junio-2026.ts).
 *
 * ⚠️ Estos calendarios son INDEPENDIENTES por tienda. No se relacionan con el
 * calendario de fases/descuentos (meses/dias/piezas), que es el de Ciudad Quesada.
 */

// ---------------------------------------------------------------------------
// Calendario instruccional (mes tipo que se repite). Reemplaza al manual rico.
// ---------------------------------------------------------------------------

/** Tipo de acción que ejecuta la tienda por sus propios canales. */
export type TipoAccion = "historias" | "bnb" | "marketplace" | "grupos-locales";

/** Metadatos de un tipo de acción (para la leyenda y los chips). */
export type AccionMeta = {
  tipo: TipoAccion;
  label: string;
  icon: string; // nombre de <Icon>
  color: string; // hex del acento
  descripcion: string;
};

/** Un día del mes tipo con su encargo general (NO contenido exacto). */
export type DiaInstruccional = {
  dia: number; // 1..31
  tipo: TipoAccion;
  meta?: string; // ej. "3 historias"
  tema?: string; // ej. "productos con +15 días"
  instruccion: string;
};

/** Calendario instruccional resuelto para una tienda. */
export type CalendarioInstruccional = {
  tiendaSlug: string;
  tiendaNombre: string;
  subtitulo: string;
  intro: string;
  acciones: AccionMeta[];
  dias: DiaInstruccional[];
  notas: string[];
};
