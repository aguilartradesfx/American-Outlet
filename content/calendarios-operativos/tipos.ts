/**
 * Tipos del calendario instruccional por tienda (contenido en código, solo
 * lectura). Define el "mes tipo" de acciones que ejecutan las tiendas
 * operativas (Fortuna y Florencia).
 *
 * ⚠️ Es INDEPENDIENTE del calendario de fases/descuentos (meses/dias/piezas),
 * que es el de Ciudad Quesada.
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
