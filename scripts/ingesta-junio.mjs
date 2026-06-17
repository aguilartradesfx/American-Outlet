/**
 * Carga el contenido de junio 2026 desde calendario-american-outlet-junio.md
 * al calendario del panel (tablas dias/piezas). Parser DETERMINISTA: extrae el
 * copy TAL CUAL del archivo (sin reescribir).
 *
 * Idempotente: borra las piezas existentes de junio y las reinserta.
 * Uso:  node --env-file=.env.local scripts/ingesta-junio.mjs
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("✗ Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const md = readFileSync("calendario-american-outlet-junio.md", "utf8");

// --- helpers ---------------------------------------------------------------
const strip = (s) =>
  (s ?? "").replace(/^[`"“”\s]+|[`"“”\s]+$/g, "").trim();

/** Limpia comillas (envuelven texto en pantalla) de una descripción de historia. */
const quitarComillas = (s) => (s ?? "").replace(/[`"“”]/g, "").trim();

/** Quita marcas markdown (negritas ** y backticks) del texto visible/copiable. */
const sinMarkdown = (s) => (s ?? "").replace(/\*\*/g, "").replace(/`/g, "").trim();

/** Normaliza un bloque multilínea (slides): quita backticks y reindenta. */
const tidy = (s) =>
  (s ?? "")
    .split("\n")
    .map((l) => l.replace(/`/g, "").trim())
    .filter(Boolean)
    .join("\n");

/** Título de día: quita anotaciones de producción (🔒/🔓, *itálicas*, ⚠️, PIEZA CLAVE…). */
const limpiarTitulo = (s) =>
  (s ?? "")
    .replace(/\*[^*]*\*/g, "") // notas en itálica *(...)* y *...*
    .replace(/🔒|🔓|⚠️/g, "") // alternación de emojis completos (no char-class: parte surrogates)
    .replace(/\bPIEZA CLAVE\b/gi, "")
    .replace(/[ÁA]ngulo fijo:/gi, "")
    .replace(/\bLibre\b/g, "")
    .replace(/\s*—\s*/g, " — ")
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

/**
 * Texto en pieza. Soporta el formato inline con labels:
 *   Gancho `X` · Titular `Y` · Bajada `Z` · Pie `W`
 * y el formato sin labels (anuncios de live): `SEG` · `SEG`.
 */
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

/**
 * Historias. Formato inline tras el header:
 *   **Historias (2):** `countdown` al 21 · `teaser` "..."
 * (también tolera el viejo formato con bullets "- `tipo` desc").
 */
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

// --- parseo de días --------------------------------------------------------
const DOW = "(?:LUN|MAR|MIÉ|JUE|VIE|SÁB|DOM)";
const bloques = md.split(/\n### /).map((b, i) => (i === 0 ? b : "### " + b));

const dias = [];
for (const block of bloques) {
  const head = block.match(new RegExp(`^### (${DOW})\\s+(\\d+)\\s+·([^\\n]*)`));
  if (!head) continue;
  const fecha = Number(head[2]);
  // título del día = todo lo que sigue al número (sin notas en itálica)
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
  // El encargo a tienda (qué producto poner) se antepone al contenido visual.
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
      ["A dónde apunta", grab(block, String.raw`\*\*A dónde apunta:\*\*`)],
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
    // POST (incluye anuncios de live)
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

  // Bloque LIVE (pieza aparte) — formato inline "**🔴 LIVE — 11am:** ..."
  // o el viejo "- **Contenido:** ..."
  if (esLive) {
    let contenido = grab(block, String.raw`\*\*🔴 LIVE[^*]*\*\*`);
    if (!contenido) contenido = grab(block, String.raw`\*\*Contenido:\*\*`);
    piezas.push({
      tipo: "live",
      orden: orden++,
      titulo: "Live · 11am",
      descripcion: strip(contenido),
    });
  }

  // Historias (intención nunca vacía — la BD exige not-null para historia)
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
if (dias.length !== 30) {
  console.warn(`⚠ Se esperaban 30 días, se parsearon ${dias.length}. Revisar el .md.`);
}

// --- inserción -------------------------------------------------------------
const db = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: mes, error: mesErr } = await db
  .from("meses")
  .select("id")
  .eq("anio", 2026)
  .eq("mes", 6)
  .single();
if (mesErr || !mes) {
  console.error("✗ No existe el mes junio 2026:", mesErr?.message);
  process.exit(1);
}

// Corregir el marco estratégico del mes (el escalado de % es INTERNO).
await db
  .from("meses")
  .update({
    bajada: "Plan de contenido · El Mes del Padre · 4 fases (escalado interno)",
    regla_oro_frase: "Lo que está hoy, no está mañana.",
    regla_oro_contexto:
      "El escalado de descuentos (10 → 15 → 20 → 25%) es INTERNO: el cliente nunca lo ve. La urgencia viene de la escasez visible y del Día del Padre (dom 21). El descuento es el cierre, no el titular. El único día que se nombra el % es el Gran Cierre.",
  })
  .eq("id", mes.id);

const fasesMeta = [
  { numero: 1, objetivo: "Abrimos el mes de papá. Esta semana hay la mayor variedad para escoger regalo.", logica: "Más stock = más variedad de regalo.", cita: "Esta semana hay de todo para el regalo." },
  { numero: 2, objetivo: "La semana antes del 21. Rampa de regalo; el reloj del Día del Padre manda.", logica: "Cuenta regresiva al 21. Escasez creciente.", cita: "Llegó la semana del regalo." },
  { numero: 3, objetivo: "Incluye el Día del Padre (dom 21). El pico emocional del mes.", logica: "Último finde para el regalo.", cita: "Llegó el finde de papá." },
  { numero: 4, objetivo: "El final. Acá SÍ se dice 'el descuento más alto del mes' — no hay nada después y el inventario es el más bajo.", logica: "Liquidación de lo último que queda.", cita: "Lo que ves es lo que queda." },
];
for (const f of fasesMeta) {
  await db
    .from("fases")
    .update({ objetivo: f.objetivo, logica: f.logica, cita: f.cita })
    .eq("mes_id", mes.id)
    .eq("numero", f.numero);
}

const { data: diasDb } = await db.from("dias").select("id, fecha").eq("mes_id", mes.id);
const idPorFecha = new Map((diasDb ?? []).map((d) => [d.fecha, d.id]));

// Limpiar piezas existentes de junio.
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
    // Reinserción fila por fila para identificar la pieza culpable.
    for (const f of filas) {
      const r = await db.from("piezas").insert([f]);
      if (r.error) console.error(`   ↳ falla pieza tipo=${f.tipo} orden=${f.orden}: ${r.error.message} | ${JSON.stringify(f).slice(0, 160)}`);
    }
  } else {
    total += filas.length;
    console.log(`✓ Día ${String(d.fecha).padStart(2)} · ${d.piezas.length} piezas · ${d.titulo}`);
  }
}

console.log(`\nListo. ${total} piezas insertadas en junio 2026.`);
