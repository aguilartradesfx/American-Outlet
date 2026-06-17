/**
 * Calendario operativo de contenido por tienda (manual del administrador).
 * Contenido de solo lectura, transcrito de los manuales operativos de cada tienda.
 * Patrón "contenido en código" (igual que content/plan-junio-2026.ts).
 *
 * ⚠️ Estos calendarios son INDEPENDIENTES por tienda. No se relacionan con el
 * calendario de fases/descuentos (meses/dias/piezas), que es el de Ciudad Quesada.
 */

/** Un segmento de cliente (ej. "Cliente A — dueño de Airbnb"). */
export type SegmentoCliente = {
  titulo: string;
  descripcion: string;
};

/** Bloque de la estructura diaria fija (ej. 35 fichas, 3 historias). */
export type BloqueDiario = {
  bloque: string;
  cantidad: number;
  que: string;
};

/** Una categoría dentro de las 35 fichas de producto diarias. */
export type CategoriaFicha = {
  n: number;
  categoria: string;
  porDia: number;
  ejemplos: string;
};

/** Plantilla de texto copiable para las fichas. */
export type PlantillaTexto = {
  titulo: string;
  texto: string;
};

/** Un formato disponible dentro de una historia interactiva (A, B, C...). */
export type FormatoHistoria = {
  letra: string;
  titulo: string;
  descripcion: string;
};

/** Una de las 3 historias interactivas diarias (BTS / PDV / Cliente). */
export type HistoriaInteractiva = {
  numero: number;
  titulo: string;
  proposito: string;
  formatos: FormatoHistoria[];
  instruccion: string;
};

/** Una fila del calendario semanal — foco por día. */
export type FocoDia = {
  dia: string;
  focoFichas: string;
  bts: string;
  pdv: string;
  cliente: string;
};

/** Estrategia por temporada. */
export type Temporada = {
  temporada: string;
  meses: string;
  foco: string;
};

/** Fecha especial y qué cambiar en el contenido. */
export type FechaEspecial = {
  fecha: string;
  cambio: string;
};

export type CalendarioOperativo = {
  tiendaSlug: string;
  tiendaNombre: string;
  /** Subtítulo del manual, ej. "Calendario Operativo de Contenido". */
  subtitulo: string;
  intro: string;

  cliente: {
    titulo: string;
    intro: string;
    segmentos: SegmentoCliente[];
    enComun?: string;
    mueve?: string;
    frena?: string;
  };

  estructuraDiaria: {
    totalPiezas: number;
    bloques: BloqueDiario[];
  };

  fichas: {
    queEs: string;
    instruccion: string;
    categorias: CategoriaFicha[];
    plantillas: PlantillaTexto[];
    reglasFoto: string[];
  };

  historias: {
    intro: string;
    items: HistoriaInteractiva[];
  };

  checklist: string[];
  focoSemanal: FocoDia[];
  temporadas: Temporada[];
  fechasEspeciales: FechaEspecial[];
  porQueFunciona: string[];
};
