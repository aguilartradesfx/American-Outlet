/**
 * Calendario instruccional COMPARTIDO por las tiendas operativas (Fortuna y
 * Florencia). Mes tipo (día 1–31) que se repite cada mes: no dice el contenido
 * exacto, solo el encargo general (qué acción, qué canal, qué tema). La gente
 * de tienda solo hace historias y distribución — no posts de feed.
 *
 * La grilla se construye desde un ciclo de 7 días. Para afinar un día puntual,
 * agregá una entrada en `ajustes` (por número de día).
 */
import type {
  AccionMeta,
  CalendarioInstruccional,
  DiaInstruccional,
} from "./tipos";

const acciones: AccionMeta[] = [
  {
    tipo: "historias",
    label: "Historias (IG/FB)",
    icon: "film",
    color: "#004a70",
    descripcion:
      "Subí historias sobre el tema del día: descuentos vigentes, inventario con +15 días, línea blanca, muebles. Es el pilar diario.",
  },
  {
    tipo: "bnb",
    label: "Grupos B&B / Airbnb",
    icon: "home",
    color: "#1f7a4d",
    descripcion:
      "Ofrecé producto en grupos de anfitriones y B&B de la zona (WhatsApp o Facebook): lo que sirve para equipar una propiedad.",
  },
  {
    tipo: "marketplace",
    label: "Facebook Marketplace",
    icon: "tag",
    color: "#b8551f",
    descripcion:
      "Subí productos al Marketplace de Facebook desde la cuenta de la tienda. Foto real + precio claro.",
  },
  {
    tipo: "grupos-locales",
    label: "Grupos locales",
    icon: "chat",
    color: "#6b3fa0",
    descripcion:
      "Publicá en grupos de compra-venta y comunidad de la zona.",
  },
];

/** Ciclo semanal (7 posiciones) que se repite a lo largo del mes. */
const ciclo: Omit<DiaInstruccional, "dia">[] = [
  {
    tipo: "historias",
    meta: "4–6 historias",
    tema: "Descuentos vigentes",
    instruccion:
      "Arrancá la semana mostrando lo que está en oferta hoy. Historias con el producto y el beneficio del día. Contá lo que hay en piso.",
  },
  {
    tipo: "historias",
    meta: "3 historias",
    tema: "Productos con +15 días",
    instruccion:
      "Elegí productos con más de 15 días en tienda y dales salida en historias. Mostralos como oportunidad: sigue acá y hay que moverlo.",
  },
  {
    tipo: "marketplace",
    meta: "5–8 publicaciones",
    tema: "Lo de mayor rotación",
    instruccion:
      "Subí productos al Marketplace de Facebook desde la cuenta de la tienda. Priorizá línea blanca y muebles. Foto real + precio claro.",
  },
  {
    tipo: "bnb",
    meta: "1 ronda",
    tema: "Anfitriones / B&B",
    instruccion:
      "Ofrecé en los grupos de B&B y Airbnb de la zona lo que sirve para equipar una propiedad: línea blanca, muebles, menaje. Mensaje corto + fotos.",
  },
  {
    tipo: "historias",
    meta: "4–6 historias",
    tema: "Empujón de fin de semana",
    instruccion:
      "Mostrá lo nuevo que entró y lo que quedó bueno para el finde. Historias con energía de 'vení hoy'.",
  },
  {
    tipo: "grupos-locales",
    meta: "3–5 grupos",
    tema: "Compra-venta local",
    instruccion:
      "Publicá en grupos de compra-venta y comunidad de la zona. Aprovechá para recordar la atención/activación en tienda del sábado.",
  },
  {
    tipo: "historias",
    meta: "1–2 historias",
    tema: "Ubicación y horario",
    instruccion:
      "Día suave: recordá dónde está la tienda y el horario. Una historia de ubicación (sticker de mapa) y una de cierre de semana.",
  },
];

/** Ajustes puntuales por número de día (opcional). Vacío por defecto. */
const ajustes: Record<number, Partial<Omit<DiaInstruccional, "dia">>> = {};

const dias: DiaInstruccional[] = Array.from({ length: 31 }, (_, i) => {
  const dia = i + 1;
  return { dia, ...ciclo[i % 7], ...(ajustes[dia] ?? {}) };
});

export const plantillaInstruccional = {
  subtitulo: "Calendario de acciones — qué hacer cada día",
  intro:
    "Esta es tu guía diaria. Vos no hacés posts de feed (eso lo maneja el equipo central): tu trabajo es subir historias y mover producto por tus canales — grupos de B&B, Marketplace y grupos locales. Cada día te dice qué acción toca y sobre qué tema, con lo que ya tenés en tienda. El contenido exacto lo elegís vos.",
  acciones,
  dias,
  notas: [
    "Historias es el pilar: todos los días hay al menos una. Las acciones de distribución (Marketplace, B&B, grupos) se intercalan.",
    "No inventes precios ni descuentos que no estén confirmados: hablá de 'oferta' y del producto, no de números que no manejás.",
    "Priorizá siempre el inventario con más días en tienda: eso es lo que hay que mover.",
    "Foto real del producto disponible ese día. Si algo se vendió, reemplazalo por otro parecido.",
  ],
} satisfies Omit<CalendarioInstruccional, "tiendaSlug" | "tiendaNombre">;
