/**
 * Catálogo de presentación de los tipos de pieza del panel.
 * Mapea el enum `tipo_pieza` de la BD → etiqueta + ícono SVG (componente <Icon>).
 * Sin emojis: estética limpia y monocroma.
 */
import type { Enums } from "@/lib/supabase/database.types";

export type TipoPieza = Enums<"tipo_pieza">;

type Meta = { label: string; abrev: string; icon: string };

export const tipoPiezaMeta: Record<TipoPieza, Meta> = {
  post: { label: "Post", abrev: "Post", icon: "image" },
  flyer: { label: "Flyer", abrev: "Flyer", icon: "image" },
  historia: { label: "Historia", abrev: "Historia", icon: "tech" },
  reel: { label: "Reel", abrev: "Reel", icon: "film" },
  live: { label: "Live", abrev: "Live", icon: "broadcast" },
  carrusel: { label: "Carrusel", abrev: "Carrusel", icon: "layers" },
  cinema: { label: "Cinema", abrev: "Cinema", icon: "video" },
  activacion: { label: "Activación", abrev: "Activación", icon: "bolt" },
  mantenimiento: { label: "Mantenimiento", abrev: "Mant.", icon: "calendar" },
};

/**
 * Grupo de responsabilidad por tipo de pieza (para auto-asignación):
 *  - estaticos  → post, flyer, carrusel  (producción en lote)
 *  - dinamicos  → historia, reel, live, cinema  (del momento)
 *  - null       → activacion, mantenimiento (administrativos, sin asignar)
 */
export const responsabilidadDeTipo: Record<
  TipoPieza,
  "estaticos" | "dinamicos" | null
> = {
  post: "estaticos",
  flyer: "estaticos",
  carrusel: "estaticos",
  historia: "dinamicos",
  reel: "dinamicos",
  live: "dinamicos",
  cinema: "dinamicos",
  activacion: null,
  mantenimiento: null,
};

/** Tipos que llevan caption copiable (formato post). */
export const tiposConCaption: TipoPieza[] = ["post", "flyer", "carrusel"];

/** Tipos que se expresan con "intención" (qué transmitir, sin guion). */
export const tiposConIntencion: TipoPieza[] = ["historia", "reel", "cinema"];

export const ordenTipos: TipoPieza[] = [
  "post",
  "flyer",
  "carrusel",
  "reel",
  "live",
  "cinema",
  "historia",
  "activacion",
  "mantenimiento",
];
