/** Tipos del preview de la ingesta con IA (compartidos cliente/servidor). */
import type { TipoPieza } from "@/lib/panel/piezas";

export type PiezaIngesta = {
  tipo: TipoPieza;
  orden?: number;
  gancho?: string;
  titulo?: string;
  descripcionVisual?: string;
  cta?: string;
  caption?: string;
  intencion?: string;
  descripcion?: string;
};

export type DiaIngesta = {
  fecha: number;
  piezas: PiezaIngesta[];
};

export type PreviewIngesta = {
  dias: DiaIngesta[];
};
