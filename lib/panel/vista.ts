/** Tipos de vista (serializables) para los componentes cliente del panel. */
import type { Tables } from "@/lib/supabase/database.types";

export type PiezaVista = Tables<"piezas">;

export type FaseVista = Pick<
  Tables<"fases">,
  "numero" | "nombre" | "descuento" | "color_acento" | "color_texto"
>;

export type EntregaVista = Pick<
  Tables<"entregas_dia">,
  "id" | "url" | "nota" | "subido_por_id" | "subido_por_nombre" | "creado_en"
>;

export type DiaVista = {
  id: string;
  fecha: number;
  dia_semana: number | null;
  fase: FaseVista | null;
  piezas: PiezaVista[];
  entregas: EntregaVista[];
};
