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
const ESTILO_MAESTRO = `Create a marketing FLYER for AMERICAN OUTLET (the premium liquidation outlet of Costa Rica — brands from the USA at outlet prices). Follow this EXACT layout SKELETON every time — this is the brand's graphic line. Keep the STRUCTURE identical; only the product scene, the copy and the badge style may vary between posters.

CANVAS: bright WHITE / very-light neutral background with generous clean margins. Palette STRICTLY NAVY (#101d27 / #004a70) + RED (#df0e0b) on white. Bold Poppins-style typography.

LAYOUT ZONES (top → bottom), like a clean professional flyer — respect them:
1. HEADER STRIP (the top ~14% of the image height) — reserved for branding ONLY: keep the TOP-LEFT corner completely EMPTY (the logo is composited there later — absolutely nothing in it, no text, no dash, no graphic). Put ONLY a small uppercase letter-spaced grey label in the TOP-RIGHT (e.g. "TODAS LAS SUCURSALES"). No eyebrow, headline, product or badge in this strip.
2. HEADLINE BLOCK — must START BELOW that top header strip (below ~15% from the top), left-aligned on plain white: a short RED horizontal dash + a small uppercase NAVY eyebrow label; then a BIG bold UPPERCASE NAVY headline (1–2 lines, tight leading); then a short 1–2 line grey subhead. Nothing from this block may enter the top-left logo corner.
3. PRODUCT CARD (middle-lower): a LARGE ROUNDED-CORNER photo card/panel (soft rounded rectangle) filling most of the width, containing the REAL product from the reference photo as the hero inside a tasteful styled scene. The product stays INSIDE this card — it must not bleed into the headline area or the footer.
4. OVERLAY CALLOUTS on the product card's lower-left: an optional small white rounded info card OR a bold 3D navy/red price badge (extruded, with real depth, highlight and a subtle gradient), plus a rounded RED PILL CTA button with white bold text and a small circular icon.
5. FOOTER (bottom, on white): a thin full-width hairline divider, then a structured row of small grey cues — a location pin with branch/hours text on the LEFT, and a WhatsApp glyph with "CONSULTÁ POR WhatsApp" on the RIGHT.

VARIATION: keep this exact skeleton EVERY time; only vary the product-card scene/angle, the copy and the badge so posters share the brand line without being identical.

NO LOGO: do NOT draw any American Outlet logo, wordmark, shopping-bag or star icon anywhere — keep the top-left corner clean for the composited logo.

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
  const margen = Math.round(W * 0.045);
  const logoW = Math.round(W * 0.2);
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
