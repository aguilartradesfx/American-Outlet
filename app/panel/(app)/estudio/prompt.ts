/**
 * Prompt maestro del Estudio IA de imágenes.
 *
 * Reproduce la LÍNEA GRÁFICA de American Outlet (carpeta Referencias): póster
 * sobre FONDO BLANCO con zonas verticales fijas — arriba logo+titular (zona
 * limpia, sin producto), en medio el producto real como héroe (en tarjeta o
 * escena), CTA en pill rojo y footer de ubicación/WhatsApp. El logo oficial se
 * compone aparte por código en la esquina superior izquierda; por eso se le
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

const ESTILO_MAESTRO = `You are the in-house creative engine for AMERICAN OUTLET — the premium liquidation outlet of Costa Rica (brands from the USA at outlet prices). Produce ONE finished marketing POSTER that follows this EXACT brand template and LAYOUT every time. Recreate the product(s) from the attached reference photo faithfully.

BACKGROUND: clean WHITE / whisper-light neutral, bright, airy, high-key. NEVER cream, beige or dark.

VERTICAL LAYOUT (top → bottom) — respect these zones like a professional flyer:
1. TOP BAND (upper ~30%), on plain white, with NO product in it:
   - Leave the very TOP-LEFT CORNER empty — the official logo is composited there separately. Do NOT draw any logo, wordmark or bag.
   - Small uppercase letter-spaced grey label in the top-right (e.g. "TODAS LAS SUCURSALES").
   - EYEBROW: a short RED (#df0e0b) horizontal dash + a small uppercase letter-spaced NAVY label.
   - HEADLINE: huge heavy UPPERCASE geometric sans-serif (Poppins-style ExtraBold/Black), NAVY #101d27, 1–3 lines, tight leading.
   - Optional single grey subhead line.
2. PRODUCT ZONE (middle ~50%): the REAL product as the hero — large, razor-sharp, catalog quality — either inside a soft ROUNDED-CORNER photo card or as a clean lifestyle scene on light surfaces. The product lives HERE, never up in the top band.
3. CTA: a rounded RED (#df0e0b) pill button with white bold text, in the lower third.
4. FOOTER (bottom): a thin hairline divider, then small grey cues — a location pin with "Tu sucursal más cercana" and a WhatsApp glyph with "CONSULTÁ POR WhatsApp".

PRODUCT FIDELITY: recreate the exact product from the reference photo — same shape, proportions, materials, real labels/logos on the product and real colors. Do NOT alter its identity; it must read as the SAME product.

NO LOGO — CRITICAL: do NOT draw, letter, illustrate or hint any logo, the words "American Outlet", or any shopping-bag/star icon ANYWHERE. The real logo is added afterwards in the empty top-left corner.

TEXT RULES: render provided text EXACTLY (same words, accents and ₡). Do not invent extra copy, do not misspell, no placeholder text. If a block is not provided, omit that element.

Accents: only NAVY and RED on white. Mood: premium yet accessible, bright, clean — a real outlet poster.`;

/**
 * Construye el prompt final: estilo + layout fijos de marca + el formato, la
 * escena, el titular, el CTA y los textos exactos que produce el director.
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
    ? `SCENE FOR THIS PRODUCT (build the product zone around this so it's obvious what the product is and how it's used):
${escena}`
    : `SCENE FOR THIS PRODUCT: a clean, bright hero shot of the product on a white editorial high-key setting that fits what it is.`;

  const titular = input.titular?.trim();
  const bloqueTitular = titular
    ? `HEADLINE TEXT (render verbatim, uppercase, Poppins-style bold navy, in the top band): "${titular}"`
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
PRICE PLACEMENT & STYLE: ${input.estiloTexto?.trim() || "Bold navy/red price badge with depth, near the product without covering it."}`
      : `PRICE/DISCOUNT TEXT: none. Do not add any price badge.`;

  return `${ESTILO_MAESTRO}

OUTPUT FORMAT: ${FORMATO_DESC[input.formato]} — compose the layout for this exact shape, edge to edge.

${bloqueEscena}

ART DIRECTION (the specific product and how to make it shine):
${input.direccionArte.trim() || "Showcase the product from the reference photo as the hero of the shot."}

${bloqueTitular}

${bloqueCta}

${bloquePrecio}`;
}
