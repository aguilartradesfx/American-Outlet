/**
 * Carga el contenido de julio 2026 desde calendario-american-outlet-julio.md al
 * calendario del panel (tablas meses/fases/dias/piezas). Parser DETERMINISTA:
 * extrae el copy TAL CUAL del archivo (sin reescribir).
 *
 * A diferencia de la ingesta de junio, este script TAMBIÉN crea el mes, sus 4
 * fases y los 31 días si no existen (replica lo que hace el panel de
 * planificación, pero con service-role). Es idempotente: reusa el mes/fases/días
 * si ya están y reinserta las piezas.
 *
 * Uso:
 *   node --env-file=.env.local scripts/ingesta-julio.mjs           # crea/actualiza en borrador
 *   node --env-file=.env.local scripts/ingesta-julio.mjs --publicar # además publica el mes
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("✗ Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const PUBLICAR = process.argv.includes("--publicar");
const DRY = process.argv.includes("--dry");
const ANIO = 2026;
const MES = 7;

const md = readFileSync("calendario-american-outlet-julio.md", "utf8");

// --- helpers ---------------------------------------------------------------
const strip = (s) => (s ?? "").replace(/^[`"“”\s]+|[`"“”\s]+$/g, "").trim();
const quitarComillas = (s) => (s ?? "").replace(/[`"“”]/g, "").trim();
const sinMarkdown = (s) => (s ?? "").replace(/\*\*/g, "").replace(/`/g, "").trim();
const tidy = (s) =>
  (s ?? "")
    .split("\n")
    .map((l) => l.replace(/`/g, "").trim())
    .filter(Boolean)
    .join("\n");

/** Título de día: quita anotaciones de producción y marcadores de julio. */
const limpiarTitulo = (s) =>
  (s ?? "")
    .replace(/\*[^*]*\*/g, "") // notas en itálica *(...)*
    .replace(/🔒|🔓|⚠️|🏠|🔑|🛋️|📦|🔴/g, "") // emojis de anotación/track
    .replace(/\bPIEZA CLAVE\b/gi, "")
    .replace(/[ÁA]ngulo fijo:/gi, "")
    .replace(/\bLIVE\b[^—·]*$/i, "") // cola "· 🔴 LIVE ..." ya sin emoji
    .replace(/\bsin producto\b/gi, "")
    .replace(/\bmueble libre\b/gi, "")
    .replace(/\s*—\s*/g, " — ")
    .replace(/·/g, " ")
    .replace(/^[\s—·-]+|[\s—·-]+$/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

/** Captura el valor de un campo **Label:** hasta el próximo label/sección. */
function grab(block, labelRe) {
  const re = new RegExp(
    labelRe + String.raw`\s*([\s\S]*?)(?=\n\s*-?\s*\*\*[^*]|\n#{1,3}\s|\n---|$)`,
  );
  const m = block.match(re);
  return m ? m[1].trim() : "";
}

/** Texto en pieza: formato inline con labels Gancho/Titular/Número/Bajada/Pie. */
function parseTextoEnPieza(raw) {
  const out = { gancho: "", titular: "", numero: "", lineas: [] };
  const labelRe = /(Gancho|Titular|N[úu]mero|Bajada|Pie)\b[^`]*`([^`]*)`/gi;
  let m;
  let hasLabels = false;
  while ((m = labelRe.exec(raw)) !== null) {
    hasLabels = true;
    const label = m[1];
    const key = label.toLowerCase();
    const val = strip(m[2]);
    out.lineas.push(`${label}: ${val}`);
    if (key.startsWith("gancho")) out.gancho = val;
    else if (key.startsWith("titular")) out.titular = val;
    else if (key.startsWith("número") || key.startsWith("numero")) out.numero = val;
  }
  if (!hasLabels) {
    const segs = [...raw.matchAll(/`([^`]+)`/g)].map((x) => x[1].trim());
    const inline = segs.length ? segs.join(" · ") : raw.replace(/`/g, "").trim();
    out.gancho = inline;
    if (inline) out.lineas.push(inline);
  }
  return out;
}

/** Historias inline: **Historias (2):** `tipo` desc · `tipo` desc */
function parseHistorias(block) {
  const m = block.match(/\*\*Historias[^\n]*\*\*([\s\S]*?)(?=\n---|\n#{1,3}\s|$)/);
  if (!m) return [];
  const out = [];
  for (const seg of m[1].split("\n")) {
    const line = seg.replace(/^-\s*/, "").trim();
    if (!line) continue;
    const re = /`([^`]+)`\s*([^`]*?)(?=\s*·\s*`|$)/g;
    let mm;
    let found = false;
    while ((mm = re.exec(line)) !== null) {
      found = true;
      out.push({ tipo: mm[1].trim(), desc: quitarComillas(mm[2]) });
    }
    if (!found) out.push({ tipo: "", desc: quitarComillas(line) });
  }
  return out.filter((h) => h.desc || h.tipo);
}

/** Etiqueta del live (para el título de la pieza): "apertura de semana", etc. */
function parseLiveLabel(block) {
  const m = block.match(/\*\*🔴 LIVE\s*—\s*([^*]+?)\*\*/);
  if (!m) return "";
  return m[1]
    .replace(/\([^)]*\)/g, "") // quita "(11am)", "(TikTok)"
    .replace(/[`"“”]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// --- parseo de días --------------------------------------------------------
const DOW = "(?:LUN|MAR|MIÉ|JUE|VIE|SÁB|DOM)";
const bloques = md.split(/\n### /).map((b, i) => (i === 0 ? b : "### " + b));

const dias = [];
for (const block of bloques) {
  const head = block.match(new RegExp(`^### (${DOW})\\s+(\\d+)\\s+·([^\\n]*)`));
  if (!head) continue;
  const fecha = Number(head[2]);
  const titulo = limpiarTitulo(head[3]) || `Día ${fecha}`;

  const feedM = block.match(/\*\*Feed — ([^*]+)\*\*/);
  const feedRaw = feedM ? feedM[1].toUpperCase() : "POST";
  const esLive = /\*\*🔴 LIVE —/.test(block);

  const piezas = [];
  let orden = 0;

  const direccionVisualRaw = strip(sinMarkdown(grab(block, String.raw`\*\*Dirección visual:\*\*`)));
  const cta = strip(grab(block, String.raw`\*\*CTA en pieza:\*\*`));
  const caption = strip(sinMarkdown(grab(block, String.raw`\*\*Caption(?: sugerido)?:\*\*`)));
  const encargo = strip(sinMarkdown(grab(block, String.raw`\*\*Encargo para tienda:\*\*`)));
  const direccionVisual = encargo
    ? `Encargo a tienda: ${encargo}${direccionVisualRaw ? `\n\n${direccionVisualRaw}` : ""}`
    : direccionVisualRaw;

  if (feedRaw.includes("CARRUSEL")) {
    const slides = tidy(grab(block, String.raw`\*\*Slides:\*\*`));
    piezas.push({
      tipo: "carrusel",
      orden: orden++,
      titulo,
      descripcion: slides,
      descripcion_visual: direccionVisual,
      caption,
    });
  } else if (feedRaw.includes("REEL")) {
    const brief = [
      ["Qué transmitir", grab(block, String.raw`\*\*Qué transmitir:\*\*`)],
      ["Contexto", grab(block, String.raw`\*\*Contexto:\*\*`)],
      ["Tono", grab(block, String.raw`\*\*Tono[^:*]*:\*\*`)],
      ["Duración", grab(block, String.raw`\*\*Duración:\*\*`)],
      ["NO queremos", grab(block, String.raw`\*\*[^*]*NO queremos:\*\*`)],
    ]
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${strip(v)}`);
    if (caption) brief.push(`Caption sugerido: ${caption}`);
    piezas.push({
      tipo: "reel",
      orden: orden++,
      titulo,
      intencion: brief.join("\n") || titulo,
    });
  } else {
    const tep = parseTextoEnPieza(grab(block, String.raw`\*\*Texto en pieza:\*\*`));
    piezas.push({
      tipo: "post",
      orden: orden++,
      gancho: tep.gancho,
      titulo: tep.titular || titulo,
      descripcion: tep.lineas.join("\n"),
      descripcion_visual: direccionVisual,
      cta,
      caption,
    });
  }

  if (esLive) {
    let contenido = grab(block, String.raw`\*\*🔴 LIVE[^*]*\*\*`);
    if (!contenido) contenido = grab(block, String.raw`\*\*Contenido:\*\*`);
    const label = parseLiveLabel(block);
    const contenidoLimpio = strip(
      sinMarkdown(contenido)
        .replace(/\*/g, "") // itálicas sueltas *(...)*
        .replace(/^\s*\([^)]*\)\s*:?\s*/, ""), // nota inicial "(TikTok · hora):"
    );
    piezas.push({
      tipo: "live",
      orden: orden++,
      titulo: label ? `Live · ${label}` : "Live",
      descripcion: contenidoLimpio,
    });
  }

  for (const h of parseHistorias(block)) {
    piezas.push({
      tipo: "historia",
      orden: orden++,
      titulo: h.tipo || "Historia",
      intencion: h.desc || h.tipo || "Historia",
    });
  }

  dias.push({ fecha, titulo, piezas });
}

console.log(`Parseados ${dias.length} días, ${dias.reduce((n, d) => n + d.piezas.length, 0)} piezas.`);
if (dias.length !== 31) {
  console.warn(`⚠ Se esperaban 31 días, se parsearon ${dias.length}. Revisar el .md.`);
}

if (DRY) {
  const conteo = {};
  for (const d of dias)
    for (const p of d.piezas) conteo[p.tipo] = (conteo[p.tipo] ?? 0) + 1;
  console.log("Conteo por tipo:", conteo);
  for (const d of [dias[0], dias[1], dias.find((x) => x.fecha === 27), dias[dias.length - 1]]) {
    if (!d) continue;
    console.log(`\n── Día ${d.fecha} · ${d.titulo}`);
    for (const p of d.piezas)
      console.log(`   [${p.tipo}] ${(p.titulo || p.gancho || p.intencion || "").slice(0, 70)}`);
  }
  process.exit(0);
}

// --- identidad del mes y fases (desde el MD) --------------------------------
const MES_META = {
  titulo: "Julio 2026",
  bajada: "Plan de contenido · Renová tu Espacio · Liquidación de Muebles · 4 fases (escalado interno)",
  regla_oro_frase: "Lo que está hoy, no está mañana — y hoy podés amueblar todo de una.",
  regla_oro_contexto:
    "El escalado de descuentos (10 → 15 → 20 → 25%) es INTERNO: el cliente nunca lo ve. La urgencia viene de la escasez visible (\"lo que se va, no vuelve\"), del volumen (\"amueblás completo en una vuelta\") y del reloj de la temporada alta para anfitriones. Producto y espacio al frente; el descuento es el cierre, no el titular. El único día que se nombra el % más alto es el Gran Cierre.",
  voz: "Español de Costa Rica, voseo, directo y seco. El espacio y el mueble son el protagonista narrativo; el descuento es el cierre, no el titular.",
};

const FASES_META = [
  {
    numero: 1,
    nombre: "Apertura",
    descuento: 10,
    dia_desde: 1,
    dia_hasta: 12,
    objetivo:
      "Apertura. La semana con más muebles del mes — el momento de amueblar completo. Establece ambos tracks (Hogar + Airbnb).",
    cita: "Hoy hay tanto que amueblás todo de una.",
    logica: "Más stock = más variedad y amueblar completo en una vuelta.",
    color_acento: "#004a70",
    color_suave: "rgba(0,74,112,0.10)",
    color_texto: "#004a70",
  },
  {
    numero: 2,
    nombre: "Escasez sube",
    descuento: 15,
    dia_desde: 13,
    dia_hasta: 19,
    objetivo:
      "La escasez sube. Reforzamos el héroe (amueblá completo) y el ROI del anfitrión. La variedad ya empezó a bajar.",
    cita: "Lo que ves hoy es lo que queda.",
    logica: "El descuento sube y la evidencia visual del movimiento hace el trabajo.",
    color_acento: "#9a3324",
    color_suave: "rgba(154,51,36,0.10)",
    color_texto: "#9a3324",
  },
  {
    numero: 3,
    nombre: "Semana de Guanacaste",
    descuento: 20,
    dia_desde: 20,
    dia_hasta: 26,
    objetivo:
      "Fin de semana de Guanacaste (sáb 25). Momento puntual de feriado: jueves 23 live pre-feriado + activación el sábado.",
    cita: "Aprovechá el feriado para renovar sin apuro.",
    logica: "Empujón de feriado largo + escasez creciente.",
    color_acento: "#c0341d",
    color_suave: "rgba(192,52,29,0.10)",
    color_texto: "#c0341d",
  },
  {
    numero: 4,
    nombre: "Gran Cierre",
    descuento: 25,
    dia_desde: 27,
    dia_hasta: 31,
    objetivo:
      "El final. Acá SÍ se dice 'el descuento más alto del mes' — no hay nada después y el inventario es el más bajo.",
    cita: "Lo que ves hoy es lo último.",
    logica: "Liquidación final de lo que queda. FOMO máximo.",
    color_acento: "#df0e0b",
    color_suave: "rgba(223,14,11,0.10)",
    color_texto: "#df0e0b",
  },
];

// --- inserción -------------------------------------------------------------
const db = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// 1) Mes (crea si no existe; siempre refresca el marco estratégico).
let { data: mes } = await db
  .from("meses")
  .select("id, estado")
  .eq("anio", ANIO)
  .eq("mes", MES)
  .maybeSingle();

if (!mes) {
  const { data, error } = await db
    .from("meses")
    .insert({ anio: ANIO, mes: MES, titulo: MES_META.titulo, estado: "borrador" })
    .select("id, estado")
    .single();
  if (error) {
    console.error("✗ No se pudo crear el mes julio 2026:", error.message);
    process.exit(1);
  }
  mes = data;
  console.log("✓ Mes julio 2026 creado (borrador).");
} else {
  console.log("• Mes julio 2026 ya existía, se reutiliza.");
}

await db
  .from("meses")
  .update({
    titulo: MES_META.titulo,
    bajada: MES_META.bajada,
    regla_oro_frase: MES_META.regla_oro_frase,
    regla_oro_contexto: MES_META.regla_oro_contexto,
    voz: MES_META.voz,
  })
  .eq("id", mes.id);

// 2) Fases (reemplazo total).
await db.from("fases").delete().eq("mes_id", mes.id);
{
  const { error } = await db.from("fases").insert(
    FASES_META.map((f) => ({ ...f, mes_id: mes.id })),
  );
  if (error) {
    console.error("✗ Error insertando fases:", error.message);
    process.exit(1);
  }
  console.log("✓ 4 fases insertadas.");
}

// 3) Días 1..31 (upsert) + relink a fases por rango.
const diasEnMes = new Date(ANIO, MES, 0).getDate(); // 31
const filasDias = Array.from({ length: diasEnMes }, (_, i) => {
  const fecha = i + 1;
  return { mes_id: mes.id, fecha, dia_semana: new Date(ANIO, MES - 1, fecha).getDay() };
});
{
  const { error } = await db
    .from("dias")
    .upsert(filasDias, { onConflict: "mes_id,fecha" });
  if (error) {
    console.error("✗ Error generando días:", error.message);
    process.exit(1);
  }
}
{
  const { data: fasesDb } = await db
    .from("fases")
    .select("id, dia_desde, dia_hasta")
    .eq("mes_id", mes.id);
  for (const f of fasesDb ?? []) {
    await db
      .from("dias")
      .update({ fase_id: f.id })
      .eq("mes_id", mes.id)
      .gte("fecha", f.dia_desde)
      .lte("fecha", f.dia_hasta);
  }
  console.log(`✓ ${diasEnMes} días generados y vinculados a sus fases.`);
}

// 4) Piezas (reinserción idempotente).
const { data: diasDb } = await db.from("dias").select("id, fecha").eq("mes_id", mes.id);
const idPorFecha = new Map((diasDb ?? []).map((d) => [d.fecha, d.id]));
const diaIds = (diasDb ?? []).map((d) => d.id);
await db.from("piezas").delete().in("dia_id", diaIds);

let total = 0;
for (const d of dias) {
  const diaId = idPorFecha.get(d.fecha);
  if (!diaId) {
    console.warn(`⚠ No hay día ${d.fecha} en la BD, se omite.`);
    continue;
  }
  const filas = d.piezas.map((p) => ({
    dia_id: diaId,
    tipo: p.tipo,
    orden: p.orden,
    gancho: p.gancho || null,
    titulo: p.titulo || null,
    descripcion_visual: p.descripcion_visual || null,
    cta: p.cta || null,
    caption: p.caption || null,
    intencion: p.intencion || null,
    descripcion: p.descripcion || null,
  }));
  const { error } = await db.from("piezas").insert(filas);
  if (error) {
    console.error(`✗ Día ${d.fecha}: ${error.message}`);
    for (const f of filas) {
      const r = await db.from("piezas").insert([f]);
      if (r.error)
        console.error(
          `   ↳ falla pieza tipo=${f.tipo} orden=${f.orden}: ${r.error.message} | ${JSON.stringify(f).slice(0, 160)}`,
        );
    }
  } else {
    total += filas.length;
    console.log(`✓ Día ${String(d.fecha).padStart(2)} · ${d.piezas.length} piezas · ${d.titulo}`);
  }
}

// 5) Publicar (opcional).
if (PUBLICAR) {
  const { error } = await db
    .from("meses")
    .update({ estado: "publicado", publicado_en: new Date().toISOString() })
    .eq("id", mes.id);
  if (error) console.error("✗ No se pudo publicar:", error.message);
  else console.log("✓ Mes julio 2026 PUBLICADO.");
}

console.log(`\nListo. ${total} piezas insertadas en julio 2026${PUBLICAR ? " (publicado)" : " (borrador)"}.`);
