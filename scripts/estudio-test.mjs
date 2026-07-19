/**
 * Harness de pruebas del Estudio IA — para iterar el prompt maestro sin pasar
 * por el panel. Dirección de arte FIJA (aísla la variable), prompt maestro
 * editable acá arriba → gpt-image-2 (image-to-image) → overlay del logo →
 * guarda en Referencias/.
 *
 * Uso: node --env-file=.env.local scripts/estudio-test.mjs <version> <formato>
 *   version: sufijo del archivo (ej. v1)
 *   formato: 1:1 | 3:4 | 9:16   (default 1:1)
 */
import { readFile, writeFile } from "node:fs/promises";
import OpenAI, { toFile } from "openai";
import sharp from "sharp";

const version = process.argv[2] || "v1";
const formato = process.argv[3] || "1:1";
const TAM = { "1:1": "2048x2048", "3:4": "1536x2048", "9:16": "1152x2048" };
const FMT_DESC = {
  "1:1": "1:1 square feed post",
  "3:4": "3:4 vertical feed post",
  "9:16": "9:16 full vertical story",
};

// ---- Dirección de arte FIJA (harías el "director" acá) --------------------
const DIRECCION = {
  titular: "CAMINADORA DE USA",
  cta: "Vení a verla esta semana.",
  escena:
    "the compact foldable walking treadmill unfolded on a light wood floor in a bright, airy modern living room; a hint of the folded-flat version nearby to show how easy it stores; energetic, aspirational, lots of white light",
  direccionArte:
    "compact foldable walking pad / treadmill: dark charcoal running deck, orange safety end-caps, slim upright folding handlebar. Emphasize how compact, modern and easy to fold & store it is. Keep it the exact same product from the reference photo.",
  textos: ["ANTES ₡149.900", "AHORA ₡84.900"],
  estiloTexto:
    "bold 3D extruded price tag / sticker with depth, highlight and a subtle navy→deep-navy gradient; ANTES struck-through smaller, AHORA large in red; premium floating badge",
};

// ---- PROMPT MAESTRO (editá esto para iterar) -------------------------------
const ESTILO_MAESTRO = `You are the in-house creative engine for AMERICAN OUTLET — the premium liquidation outlet of Costa Rica (brands from the USA at outlet prices). Create ONE polished, eye-catching marketing poster for the product in the attached photo.

BE CREATIVE WITH THE COMPOSITION — the layout must feel fresh and specific to THIS product, NOT a fixed template. Vary product placement, angle, scale and where the text blocks sit so posters never look identical. Surprise me while staying on-brand.

ALWAYS keep the AMERICAN OUTLET BRAND SYSTEM:
- BACKGROUND: bright, mostly WHITE / very light neutral, high-key and airy. No dark or cream backgrounds.
- PALETTE: strictly NAVY (#101d27 / #004a70) + RED (#df0e0b) accents on white. Nothing off-palette.
- TYPOGRAPHY: bold UPPERCASE Poppins-style headline in NAVY; a short RED dash "eyebrow" label; clean modern sans-serif.
- 3D / DEPTH: render PRICE/DISCOUNT as bold CHUNKY 3D extruded typography or a floating tag/sticker with real depth, a crisp highlight and subtle gradients, in navy/red — high impact, premium. Use tasteful gradients and soft realistic shadows so elements feel three-dimensional (like premium outlet flyers).
- CTA: a rounded RED pill button with white bold text.
- FOOTER cue when it fits: tiny grey location + WhatsApp hints at the very bottom.
- PRODUCT: recreate the REAL product from the photo faithfully (shape, materials, parts, colors). It is the hero — large, razor-sharp, catalog quality.

NO LOGO + RESERVED CORNER (this is CRITICAL, follow exactly):
- Do NOT draw any American Outlet logo, wordmark, or shopping-bag/star icon anywhere.
- Keep the TOP-LEFT CORNER completely EMPTY: a clean blank rectangle of about the top-left 32% of the width × 17% of the height must contain NOTHING — no headline, no letters, no product, no graphic, just clean white space. The real logo is composited into that empty corner afterwards.
- Therefore place the HEADLINE clearly BELOW that reserved corner, or centered, or to the right — never let any text or product enter that top-left rectangle.

TEXT: render the provided HEADLINE, CTA and PRICE EXACTLY as given (same words, accents, ₡). Do not invent extra copy, do not misspell.`;

function construirPrompt() {
  return `${ESTILO_MAESTRO}

OUTPUT FORMAT: ${FMT_DESC[formato]} — compose for this exact shape, edge to edge.

SCENE: ${DIRECCION.escena}

ART DIRECTION: ${DIRECCION.direccionArte}

HEADLINE TEXT (verbatim, uppercase, navy): "${DIRECCION.titular}"
CTA TEXT (verbatim, inside red pill): "${DIRECCION.cta}"
PRICE TEXT (verbatim): ${DIRECCION.textos.map((t) => `"${t}"`).join(" and ")}
PRICE STYLE: ${DIRECCION.estiloTexto}`;
}

// ---- overlay del logo ------------------------------------------------------
async function componerLogo(base) {
  const meta = await sharp(base).metadata();
  const W = meta.width ?? 2048;
  const margen = Math.round(W * 0.05);
  const logoW = Math.round(W * 0.24);
  const svg = await readFile("public/brand/logo-poster.svg");
  const logo = await sharp(svg, { density: 500 }).resize({ width: logoW }).png().toBuffer();
  return sharp(base).composite([{ input: logo, top: margen, left: margen }]).png().toBuffer();
}

// ---- run -------------------------------------------------------------------
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const prompt = construirPrompt();

const src = await readFile("Referencias/caminadora.jpg");
const file = await toFile(src, "caminadora.jpg", { type: "image/jpeg" });

console.log(`Generando ${version} (${formato}, ${TAM[formato]})…`);
console.time("gen");
const resp = await openai.images.edit({
  model: "gpt-image-2",
  image: file,
  prompt,
  size: TAM[formato],
  quality: "medium",
});
console.timeEnd("gen");

const b64 = resp.data?.[0]?.b64_json;
if (!b64) {
  console.error("✗ Sin imagen:", JSON.stringify(resp).slice(0, 300));
  process.exit(1);
}
const conLogo = await componerLogo(Buffer.from(b64, "base64"));
const out = `Referencias/caminadora-gen-${version}.png`;
await writeFile(out, conLogo);
console.log(`✓ ${out} · usage:`, JSON.stringify(resp.usage || {}));
