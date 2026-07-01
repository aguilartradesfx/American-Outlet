/**
 * Genera el banner de la promo de julio 2026 (campaña "Renová tu espacio ·
 * Liquidación de muebles") con Nano Banana Pro (Gemini 3 Pro Image) y — con el
 * flag --subir — lo sube al bucket público `promos` de Supabase Storage y hace
 * upsert del registro de la promo, igual que el panel /panel/promos.
 *
 * Escena LIMPIA sin texto: el sitio superpone título/subtítulo/CTA sobre la
 * imagen (con un degradado navy desde la izquierda), así que el sujeto pesa a la
 * DERECHA y la izquierda queda tranquila.
 *
 * Uso:
 *   node --env-file=.env.local scripts/generar-banner-julio.mjs           # solo genera _banner-julio.png (para revisar)
 *   node --env-file=.env.local scripts/generar-banner-julio.mjs --subir   # genera + sube a Storage + upsert promo
 */
import { writeFileSync } from "node:fs";
import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) {
  console.error("✗ Falta GEMINI_API_KEY en .env.local");
  process.exit(1);
}
// El usuario pidió expresamente Nano Banana Pro con GEMINI_API_KEY. El SDK
// prioriza GOOGLE_API_KEY si está en el entorno, así que la quitamos para que
// use sin ambigüedad la key indicada.
delete process.env.GOOGLE_API_KEY;
const SUBIR = process.argv.includes("--subir");
const MODELO = "gemini-3-pro-image";
const ANIO = 2026;
const MES = 7;
const BUCKET = "promos";

const PROMO = {
  titulo: "Renová tu espacio",
  subtitulo:
    "Liquidación de muebles para tu casa o tu Airbnb. Registrate y llevate tu cupón de 10% para usar en tienda.",
  cta_texto: "Registrate y llevate tu cupón",
  enlace: "/promo",
};

const PROMPT = `You are the in-house creative engine for AMERICAN OUTLET — the premium discount outlet of Costa Rica. Create a wide landscape (16:9) hero banner for a FURNITURE & HOME liquidation campaign ("renová tu espacio · liquidación de muebles").

SCENE:
- A beautifully styled, warm living room fully furnished, as the hero: a plush fabric sofa with cushions, a solid wood coffee table, a soft textured area rug, a floor lamp casting warm light, a leafy potted plant, and tasteful decor. It should feel like a real, cozy Costa Rican home on a calm rainy afternoon.
- Soft, warm daylight coming from a window (rainy-season mood but bright and inviting, never dark).
- The furniture grouping sits in the RIGHT two-thirds of the frame. The LEFT third stays calmer and less busy (an airy softly-lit wall / open floor) so headline text can be overlaid there later. Keep the left side visually quiet.

BRAND LOOK:
- High-key lighting: soft, even, bright, optimistic. Luminous and airy. Never moody, no heavy shadows, no dark vignette.
- Color palette: bright neutral base (warm whites, soft beige, light greige, natural wood tones) with intentional but restrained brand accents of NAVY BLUE and a touch of RED (e.g. a navy throw cushion or blanket, a small red accent object). Accents never overpower the luminous neutral base.
- Mood: premium yet accessible, aspirational, clean, editorial interior-design magazine quality, full of light.

HARD RULES:
- NO text, NO typography, NO price badges, NO logos, NO watermarks anywhere in the image.
- NO people.
- Photorealistic, sharp, professional interior photography. Output a single finished 16:9 image.`;

// --- 1) generar ------------------------------------------------------------
console.log(`Generando banner con ${MODELO} (16:9)…`);
const ai = new GoogleGenAI({ apiKey: KEY });
const resp = await ai.models.generateContent({
  model: MODELO,
  contents: [{ role: "user", parts: [{ text: PROMPT }] }],
  config: { imageConfig: { aspectRatio: "16:9" } },
});

const partes = resp.candidates?.[0]?.content?.parts ?? [];
const imagen = partes.find((p) => p.inlineData?.data);
if (!imagen?.inlineData?.data) {
  const texto = partes.find((p) => p.text)?.text;
  console.error("✗ El modelo no devolvió imagen." + (texto ? ` Texto: ${texto.slice(0, 300)}` : ""));
  process.exit(1);
}

const pngBuf = Buffer.from(imagen.inlineData.data, "base64");
writeFileSync("_banner-julio.png", pngBuf);
const meta = await sharp(pngBuf).metadata();
console.log(`✓ Imagen generada: ${meta.width}×${meta.height}. Guardada en _banner-julio.png`);

if (!SUBIR) {
  console.log("\n(revisá _banner-julio.png; corré de nuevo con --subir para publicarla)");
  process.exit(0);
}

// --- 2) webp + subir a Storage + upsert promo ------------------------------
const webp = await sharp(pngBuf)
  .resize({ width: 2000, withoutEnlargement: true })
  .webp({ quality: 82 })
  .toBuffer();
writeFileSync("_banner-julio.webp", webp);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const db = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

// Imagen previa de julio (para borrarla si la hubiera).
const { data: previa } = await db
  .from("promos")
  .select("imagen_path")
  .eq("anio", ANIO)
  .eq("mes", MES)
  .maybeSingle();

const path = `${ANIO}-${String(MES).padStart(2, "0")}/banner-${Date.now()}.webp`;
const { error: upErr } = await db.storage
  .from(BUCKET)
  .upload(path, webp, { contentType: "image/webp", upsert: false });
if (upErr) {
  console.error("✗ Error subiendo a Storage:", upErr.message);
  process.exit(1);
}
const { data: pub } = db.storage.from(BUCKET).getPublicUrl(path);
const imagen_url = pub.publicUrl;

const { error: dbErr } = await db.from("promos").upsert(
  {
    anio: ANIO,
    mes: MES,
    titulo: PROMO.titulo,
    subtitulo: PROMO.subtitulo,
    enlace: PROMO.enlace,
    cta_texto: PROMO.cta_texto,
    imagen_path: path,
    imagen_url,
    activa: true,
  },
  { onConflict: "anio,mes" },
);
if (dbErr) {
  await db.storage.from(BUCKET).remove([path]);
  console.error("✗ Error guardando la promo:", dbErr.message);
  process.exit(1);
}

if (previa?.imagen_path && previa.imagen_path !== path) {
  await db.storage.from(BUCKET).remove([previa.imagen_path]);
}

console.log(`✓ Banner subido y promo de julio activada.\n  URL: ${imagen_url}`);
