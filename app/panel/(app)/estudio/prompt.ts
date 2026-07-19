/**
 * Prompt maestro del Estudio IA de imágenes.
 *
 * Reproduce la LÍNEA GRÁFICA de American Outlet (carpeta Referencias) como un
 * FLYER con esqueleto fijo: header (logo + label), bloque de titular, producto
 * dentro de una tarjeta redondeada, badge de precio en 3D, CTA en pill rojo y
 * footer estructurado (ubicación + WhatsApp). La estructura se mantiene; la
 * escena del producto, el copy y el badge varían. El logo oficial se compone
 * aparte por código en la esquina superior izquierda (reservada), por eso se le
 * PROHÍBE al modelo dibujar cualquier logo.
 *
 * En inglés a propósito: los modelos siguen mejor las direcciones en inglés.
 */

export type Formato = "1:1" | "3:4" | "9:16";

const FORMATO_DESC: Record<Formato, string> = {
  "1:1": "1:1 square feed post",
  "3:4": "3:4 vertical feed post",
  "9:16": "9:16 full vertical story",
};

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

/**
 * Construye el prompt final: esqueleto de marca + el formato, la escena, el
 * titular, el CTA y los textos exactos que produce el director.
 */
export function construirPrompt(input: {
  formato: Formato;
  escena?: string;
  direccionArte: string;
  titular?: string;
  cta?: string;
  textos: string[];
  estiloTexto?: string;
}): string {
  const escena = input.escena?.trim();
  const bloqueEscena = escena
    ? `SCENE INSIDE THE PRODUCT CARD (build the styled scene around this so it's obvious what the product is and how it's used):
${escena}`
    : `SCENE INSIDE THE PRODUCT CARD: a clean, bright hero shot of the product on a white editorial high-key setting that fits what it is.`;

  const titular = input.titular?.trim();
  const bloqueTitular = titular
    ? `HEADLINE TEXT (render verbatim, uppercase, Poppins-style bold navy, in the headline block below the header strip): "${titular}"`
    : `HEADLINE TEXT: none. Do not invent a headline.`;

  const cta = input.cta?.trim();
  const bloqueCta = cta
    ? `CTA TEXT (render verbatim inside the red pill button): "${cta}"`
    : `CTA: none. Do not invent a CTA.`;

  const textos = input.textos.map((t) => t.trim()).filter(Boolean);
  const bloquePrecio =
    textos.length > 0
      ? `PRICE/DISCOUNT TEXT (render verbatim, do not translate or alter):
${textos.map((t) => `  • "${t}"`).join("\n")}
PRICE STYLE: ${input.estiloTexto?.trim() || "Bold 3D extruded navy/red price badge with depth, highlight and a subtle gradient, overlapping the product card's lower-left."}`
      : `PRICE/DISCOUNT TEXT: none. Do not add any price badge.`;

  return `${ESTILO_MAESTRO}

OUTPUT FORMAT: ${FORMATO_DESC[input.formato]} — compose the whole skeleton for this exact shape, edge to edge.

${bloqueEscena}

ART DIRECTION (the specific product and how to make it shine):
${input.direccionArte.trim() || "Showcase the product from the reference photo as the hero of the card."}

${bloqueTitular}

${bloqueCta}

${bloquePrecio}`;
}
