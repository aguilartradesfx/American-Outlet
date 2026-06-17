/** Tipos de vista (serializables) para los componentes cliente del panel. */
import type { Tables } from "@/lib/supabase/database.types";

export type PiezaVista = Tables<"piezas">;

export type FaseVista = Pick<
  Tables<"fases">,
  "numero" | "nombre" | "descuento" | "color_acento" | "color_texto"
>;

export type DiaVista = {
  id: string;
  fecha: number;
  dia_semana: number | null;
  fase: FaseVista | null;
  piezas: PiezaVista[];
};
