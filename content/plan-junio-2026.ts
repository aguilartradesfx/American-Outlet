/**
 * American Outlet — Plan de contenido · Junio 2026
 * ============================================================================
 * DATA del plan, separada por completo de la presentación. Editar este archivo
 * no toca ningún layout. Las 3 tiendas comparten exactamente este mismo plan
 * (data única y global, no por tienda).
 *
 * Fuente: ao-calendario-junio-2026-contenido.md
 * ============================================================================
 */

export type TipoPieza =
  | "reel"
  | "flyer"
  | "carrusel"
  | "live"
  | "cinema"
  | "activacion"
  | "mantenimiento";

export type FaseId = 1 | 2 | 3;

// ----------------------------------------------------------------------------
// Identidad del plan
// ----------------------------------------------------------------------------
export const plan = {
  marca: "American Outlet",
  bajada: "Plan de contenido · Junio 2026 · 3 fases · Bralto",
  marco: "3 fases · 30 días",
  mes: "Junio 2026",
  reglaDeOro: {
    frase: "Entre más esperás, más barato. Pero también menos queda.",
    contexto:
      "La lógica del mes: el descuento sube y el inventario baja en paralelo. Esa tensión es la mecánica de todo junio.",
  },
  voz: "Español de Costa Rica, voseo, tono directo y seco. El inventario es el protagonista narrativo.",
} as const;

// ----------------------------------------------------------------------------
// Totales de producción del mes (objetivo de cuadre)
// ----------------------------------------------------------------------------
export const totales = {
  reel: 3,
  flyer: 8,
  carrusel: 3,
  live: 7,
  cinema: 2,
  activacion: 4,
  historias: 150,
} as const;

// ----------------------------------------------------------------------------
// Catálogo de tipos de pieza (etiqueta + emoji + acento de marca)
// ----------------------------------------------------------------------------
// `icon` apunta a un nombre del componente <Icon> (SVG monocromo). El emoji se
// conserva por compatibilidad, pero el panel usa el icono limpio.
export const tiposPieza: Record<
  TipoPieza,
  { label: string; emoji: string; abrev: string; icon: string }
> = {
  reel: { label: "Reel", emoji: "🎬", abrev: "Reel", icon: "film" },
  flyer: { label: "Flyer / Post estático", emoji: "🖼️", abrev: "Flyer", icon: "image" },
  carrusel: { label: "Carrusel", emoji: "📖", abrev: "Carrusel", icon: "layers" },
  live: { label: "Live", emoji: "🔴", abrev: "Live", icon: "broadcast" },
  cinema: { label: "Cinema", emoji: "🎥", abrev: "Cinema", icon: "video" },
  activacion: { label: "Activación", emoji: "⚡", abrev: "Activación", icon: "bolt" },
  mantenimiento: { label: "Mantenimiento", emoji: "📆", abrev: "Mant.", icon: "calendar" },
};

// ----------------------------------------------------------------------------
// Las 3 Fases
// ----------------------------------------------------------------------------
export type Fase = {
  id: FaseId;
  nombre: string;
  fechas: string;
  rango: { desde: number; hasta: number };
  descuento: number;
  objetivo: string;
  cita: string;
  logica: string;
  piezas: Partial<Record<TipoPieza, number>>;
  // Acento de color por fase (suben de intensidad con el descuento).
  color: { acento: string; suave: string; texto: string };
};

export const fases: Fase[] = [
  {
    id: 1,
    nombre: "Apertura",
    fechas: "Jun 1 → Jun 10",
    rango: { desde: 1, hasta: 10 },
    descuento: 15,
    objetivo:
      "Stock alto. Urgencia baja. Pedagogía alta. Empezamos: esto es lo que hay, así funciona.",
    cita: "Empezamos. Esto es lo que hay. Así funciona.",
    logica:
      "Más opciones, menor descuento. El cliente que entra primero tiene donde elegir.",
    piezas: { reel: 1, flyer: 2, carrusel: 1, live: 2, cinema: 1, activacion: 1 },
    color: { acento: "#004a70", suave: "rgba(0,74,112,0.10)", texto: "#004a70" },
  },
  {
    id: 2,
    nombre: "Mitad de mes",
    fechas: "Jun 11 → Jun 20",
    rango: { desde: 11, hasta: 20 },
    descuento: 20,
    objetivo:
      "Evidencia visual de movimiento. Tarimas con menos producto. Subió, y ya hay huecos en piso.",
    cita: "Subió. Y ya hay huecos en piso.",
    logica:
      "El descuento subió pero ya hay huecos. La evidencia visual hace el trabajo.",
    piezas: { reel: 1, flyer: 3, carrusel: 1, live: 3, cinema: 1, activacion: 1 },
    color: { acento: "#9a3324", suave: "rgba(154,51,36,0.10)", texto: "#9a3324" },
  },
  {
    id: 3,
    nombre: "Gran cierre",
    fechas: "Jun 21 → Jun 30",
    rango: { desde: 21, hasta: 30 },
    descuento: 25,
    objetivo:
      "Tono directo. Urgencia real. El inventario hace el trabajo. Lo que ves es lo que queda.",
    cita: "Lo que ves es lo que queda.",
    logica:
      "El mejor precio, pero lo que ves en piso es lo que queda. FOMO máximo.",
    piezas: { reel: 1, flyer: 3, carrusel: 1, live: 2, activacion: 2 },
    color: { acento: "#df0e0b", suave: "rgba(223,14,11,0.10)", texto: "#df0e0b" },
  },
];

export function faseDeDia(dia: number): Fase {
  return fases.find((f) => dia >= f.rango.desde && dia <= f.rango.hasta) ?? fases[0];
}

// ----------------------------------------------------------------------------
// Guía de Historias — 6 playbooks (H1–H5) por tipo de día
// ----------------------------------------------------------------------------
export type Historia = { id: string; momento?: string; texto: string };
export type Playbook = {
  tipo: TipoPieza;
  emoji: string;
  titulo: string;
  subtitulo: string;
  historias: Historia[];
};

export const playbooks: Playbook[] = [
  {
    tipo: "reel",
    emoji: "🎬",
    titulo: "Día con Reel",
    subtitulo: "apertura de fase",
    historias: [
      {
        id: "H1",
        texto:
          'Repost del Reel con sticker "NUEVO" encima. Texto: "Míralo completo." Sin más copy, que el sticker haga el trabajo.',
      },
      {
        id: "H2",
        texto:
          "Foto del PDV abierto ese mismo día. Texto grande: ACÁ ESTAMOS. / Texto pequeño: \"hoy arranca el mes.\" Sin filtros, real.",
      },
      {
        id: "H3",
        texto:
          "Gráfico simple de las 3 fases: 15%→20%→25%. Texto superpuesto: GUARDÁ ESTO. Sticker de guardar habilitado.",
      },
      {
        id: "H4",
        texto:
          "Sticker de ubicación (mapa IG) con la dirección del PDV. Debajo: horario del día en texto blanco. Simple.",
      },
      {
        id: "H5",
        texto:
          'Poll sticker. Pregunta: "¿QUÉ BUSCÁS ESTE MES?" Opción A: Línea blanca. Opción B: Muebles. Opción C: Electros.',
      },
    ],
  },
  {
    tipo: "flyer",
    emoji: "🖼️",
    titulo: "Día con Flyer / Post estático",
    subtitulo: "producto en piso",
    historias: [
      {
        id: "H1",
        texto:
          'Repost del flyer con flecha apuntando hacia abajo. Texto: "↓ MIRÁ ESTO" o simplemente repostear sin texto extra.',
      },
      {
        id: "H2",
        texto:
          'Foto del producto del flyer en el piso del PDV. Nombre del producto en texto grande. Sub: "todavía en piso."',
      },
      {
        id: "H3",
        texto:
          "Foto de detalle: zoom al sello de garantía, a la etiqueta, o al empaque. Un dato útil encima: capacidad, voltaje, dimensiones.",
      },
      {
        id: "H4",
        texto:
          'Poll sencillo relacionado al producto. Ejemplo: "¿Ya la tenés en casa?" — Sí / No, la necesito.',
      },
      {
        id: "H5",
        texto: "Sticker de ubicación + horario del día. Fondo: foto del PDV.",
      },
    ],
  },
  {
    tipo: "carrusel",
    emoji: "📖",
    titulo: "Día con Carrusel",
    subtitulo: "manual del mes",
    historias: [
      {
        id: "H1",
        texto:
          'Repost del slide 1 del carrusel. Texto superpuesto: "GUARDÁ ESTO" con sticker de guardar. Contexto: "manual del mes."',
      },
      {
        id: "H2",
        texto:
          'Repost del slide 2. Texto: "LAS 3 FASES" / subtexto: "cómo funciona junio."',
      },
      {
        id: "H3",
        texto:
          'Frase ancla sola, fondo negro, tipografía limpia: "ENTRE MÁS ESPERÁS / MÁS BARATO." Sub: "pero también menos queda."',
      },
      {
        id: "H4",
        texto:
          'Sticker de compartir habilitado. Texto: "MANDÁSELO A QUIEN ESTÁ BUSCANDO."',
      },
      {
        id: "H5",
        texto: 'Ubicación + horario. Pie: "el carrusel queda fijado en el perfil."',
      },
    ],
  },
  {
    tipo: "live",
    emoji: "🔴",
    titulo: "Día con Live",
    subtitulo: "secuencia de transmisión",
    historias: [
      {
        id: "H1",
        momento: "mañana",
        texto:
          "Texto grande: HOY EN VIVO. Subtexto: tema del live. Sticker countdown configurado hasta la hora exacta.",
      },
      {
        id: "H2",
        momento: "1h antes",
        texto:
          "Texto: EN UNA HORA. Sub: descripción corta. Sticker de recordatorio activable (para que la gente lo guarde).",
      },
      {
        id: "H3",
        momento: "justo antes",
        texto:
          'Texto: ESTAMOS LISTOS. Sub: "entrá al perfil y dale al live." Sin stickers extra — limpiar para la acción.',
      },
      {
        id: "H4",
        momento: "durante",
        texto:
          'Clip corto de 5–10 seg del live ya corriendo. Texto: "EN VIVO AHORA." Enlace al live si IG lo permite.',
      },
      {
        id: "H5",
        momento: "post-live",
        texto:
          'Clip del mejor momento (15 seg). Texto: "si te lo perdiste, pasá al PDV mañana."',
      },
    ],
  },
  {
    tipo: "cinema",
    emoji: "🎥",
    titulo: "Día con Cinema",
    subtitulo: "la estética es el mensaje",
    historias: [
      {
        id: "H1",
        texto:
          "Repost del cinema. Sin texto superpuesto. Sin stickers. Que respire. La estética es el mensaje.",
      },
      {
        id: "H2",
        texto:
          "Fotograma fijo del cinema (un cuadro que funcione solo como foto). Sin texto. Solo imagen.",
      },
      {
        id: "H3",
        texto:
          'Fondo negro puro. Tipografía blanca: "ESTO ES AMERICAN OUTLET." Sin logo. Sin nada más.',
      },
      { id: "H4", texto: "Sticker de ubicación + horario. Fondo oscuro." },
      {
        id: "H5",
        texto:
          'Sticker de pregunta abierta. Pregunta: "¿qué te llevarías hoy?" Guardar las respuestas para usarlas después.',
      },
    ],
  },
  {
    tipo: "mantenimiento",
    emoji: "📆",
    titulo: "Día sin contenido principal",
    subtitulo: "mantenimiento",
    historias: [
      {
        id: "H1",
        texto:
          'Texto sobre fondo de color de fase: "SEGUIMOS AL [%]". Sin más. Que sea limpio.',
      },
      {
        id: "H2",
        texto:
          "Producto del día: foto + nombre en texto + un dato (capacidad, uso, precio). Rotar lo que no ha salido en posts.",
      },
      {
        id: "H3",
        texto:
          'Screenshot anonimizado de DM o reseña de cliente. Texto: "esto nos llegó esta semana." No publicar si no está anonimizado.',
      },
      {
        id: "H4",
        texto:
          'Poll liviano: "¿qué te falta en la casa?" Opciones: refri · lavadora · TV · muebles.',
      },
      {
        id: "H5",
        texto:
          "Ubicación + horario. Siempre. Es lo más visto de las historias.",
      },
    ],
  },
];

export function playbookDe(tipo: TipoPieza): Playbook | undefined {
  return playbooks.find((p) => p.tipo === tipo);
}

// ----------------------------------------------------------------------------
// Cuadrícula del mes — 30 días (LUN–DOM)
// ----------------------------------------------------------------------------
// ⚠️ PENDIENTE (§6 del doc): la asignación día-por-día (qué pieza concreta cae
// cada fecha) todavía no se pudo extraer del despliegue original. La estructura
// queda lista y parametrizada: cuando se tengan los datos, basta con poner
// `pieza` y `tema` en cada día — el panel valida el cuadre automáticamente y
// la secuencia de historias H1–H5 se deriva sola del tipo de día.

export const diasSemana = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"] as const;

export type Dia = {
  fecha: number; // 1–30
  diaSemana: (typeof diasSemana)[number];
  fase: FaseId;
  pieza: TipoPieza | null; // null = por asignar (pendiente)
  tema: string | null;
};

// Junio 2026 arranca un LUNES (Jun 1), así que la cuadrícula calza sin huecos.
export const dias: Dia[] = Array.from({ length: 30 }, (_, i): Dia => {
  const fecha = i + 1;
  return {
    fecha,
    diaSemana: diasSemana[i % 7],
    fase: faseDeDia(fecha).id,
    pieza: null, // ⚠️ por asignar — ver §6
    tema: null,
  };
});

// ----------------------------------------------------------------------------
// Validación de cuadre — cuenta lo asignado vs. el objetivo del mes
// ----------------------------------------------------------------------------
export type CuadreFila = {
  tipo: Exclude<TipoPieza, "mantenimiento">;
  objetivo: number;
  asignado: number;
};

export function calcularCuadre(diasPlan: Dia[] = dias): {
  filas: CuadreFila[];
  diasAsignados: number;
  diasPendientes: number;
  cuadra: boolean;
} {
  const tipos: CuadreFila["tipo"][] = [
    "reel",
    "flyer",
    "carrusel",
    "live",
    "cinema",
    "activacion",
  ];
  const filas = tipos.map((tipo) => ({
    tipo,
    objetivo: totales[tipo],
    asignado: diasPlan.filter((d) => d.pieza === tipo).length,
  }));
  const diasAsignados = diasPlan.filter((d) => d.pieza !== null).length;
  return {
    filas,
    diasAsignados,
    diasPendientes: diasPlan.length - diasAsignados,
    cuadra: filas.every((f) => f.asignado === f.objetivo),
  };
}
