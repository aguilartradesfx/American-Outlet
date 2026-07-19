/**
 * Prompt maestro del Estudio IA de imágenes (Nano Banana Pro / gemini-3-pro-image).
 *
 * Reproduce la LÍNEA GRÁFICA de American Outlet (carpeta Referencias):
 * póster cuadrado 1:1 sobre FONDO BLANCO, titular Poppins bold navy, eyebrow con
 * guion rojo, producto real high-key como héroe, badge de precio en navy/rojo, CTA
 * en pill rojo y footer con ubicación/WhatsApp. El logo oficial se compone aparte
 * por código (overlay pixel-perfect), así que acá se deja el espacio arriba-izq.
 *
 * En inglés a propósito: los modelos siguen mejor las direcciones de estilo en inglés.
 */

export const ASPECT_RATIO = "1:1" as const;

const ESTILO_MAESTRO = `You are the in-house creative engine for AMERICAN OUTLET — the premium liquidation outlet of Costa Rica (brands from the USA at outlet prices). Produce ONE finished 1:1 SQUARE social-media poster that follows this EXACT brand template every time. Recreate the product(s) from the attached reference photo faithfully.

CANVAS & BACKGROUND:
- Clean WHITE background (pure #ffffff / whisper-light neutral). Bright, airy, high-key. NEVER cream, never beige, never dark.
- Square 1:1, edge to edge, generous negative space.

NO LOGO — CRITICAL:
- Do NOT draw, letter, illustrate or hint any logo, brand wordmark, the words "American Outlet", or any shopping-bag / star icon ANYWHERE in the image. The real official logo is composited separately afterwards.
- Leave the TOP-LEFT corner clean and empty (reserved for that logo). Do not place the headline in that exact corner.

THE PRODUCT IS THE HERO:
- Recreate the REAL product faithfully from the reference photo: same shape, proportions, materials, real brand logos/labels/text and real colors. Do NOT invent, restyle or alter the product identity. It must read as the SAME product, just placed in the scene.
- Product large, razor-sharp, catalog-quality, soft realistic shadow on a light surface. Build the scene around what the product IS and how it's used (see SCENE block).

BRAND CHROME (designed-poster layout, like a professional flyer):
- HEADLINE: heavy bold UPPERCASE geometric sans-serif (Poppins-style, ExtraBold/Black), color NAVY #101d27, tight leading, in the upper area but NOT in the very top-left corner (that corner stays empty for the logo).
- EYEBROW: a short RED (#df0e0b) horizontal dash followed by a small uppercase letter-spaced navy label, just above the headline.
- SUBHEAD (optional): one short line, medium weight, muted grey.
- CTA: a rounded RED (#df0e0b) pill button with white bold text near the lower area.
- FOOTER: a thin hairline divider near the bottom, then small grey cues: a location pin with "Tu sucursal más cercana" and a WhatsApp glyph with "CONSULTÁ POR WhatsApp".
- Accent colors ONLY navy and red on white. Keep it clean and premium.

TEXT RULES (critical):
- Render text EXACTLY as provided in the ART DIRECTION blocks (same words, accents, ₡ symbol). Do NOT invent extra copy, do NOT misspell, do NOT add lorem/placeholder text.
- If a block is not provided, omit that element rather than inventing it.
- Any PRICE/DISCOUNT: bold navy/red badge, high-impact, near the product without covering its key features.

MOOD: premium yet accessible, bright, clean — matching a professional outlet poster on white.
Output a single finished 1:1 image.`;

/**
 * Construye el prompt final: estilo fijo de marca + la escena, el titular, el CTA
 * y los textos exactos que produce el director (Claude).
 */
export function construirPrompt(input: {
  escena?: string;
  direccionArte: string;
  titular?: string;
  cta?: string;
  textos: string[];
  estiloTexto?: string;
}): string {
  const escena = input.escena?.trim();
  const bloqueEscena = escena
    ? `SCENE FOR THIS PRODUCT (build the whole environment around this so it's obvious what the product is and how it's used):
${escena}`
    : `SCENE FOR THIS PRODUCT: a clean, bright hero shot of the product as the star on a white editorial high-key setting that fits what it is.`;

  const titular = input.titular?.trim();
  const bloqueTitular = titular
    ? `HEADLINE TEXT (render verbatim, uppercase, Poppins-style bold navy): "${titular}"`
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

${bloqueEscena}

ART DIRECTION (the specific product and how to make it shine):
${input.direccionArte.trim() || "Showcase the product from the reference photo as the hero of the shot."}

${bloqueTitular}

${bloqueCta}

${bloquePrecio}`;
}
