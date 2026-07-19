/**
 * Prompt maestro del Estudio IA de imágenes.
 *
 * Reproduce la LÍNEA GRÁFICA de American Outlet (carpeta Referencias) pero con
 * composición CREATIVA/variada por producto — no una plantilla fija. Mantiene la
 * paleta (navy/rojo/blanco), los badges de precio en 3D con degradados, el CTA en
 * pill rojo y el producto real como héroe. El logo oficial se compone aparte por
 * código en la esquina superior izquierda; por eso se reserva ese rincón y se le
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

TEXT: render the provided HEADLINE, CTA and PRICE EXACTLY as given (same words, accents, ₡). Do not invent extra copy, do not misspell, no placeholder text. If a block is not provided, omit that element.`;

/**
 * Construye el prompt final: estilo + reglas de marca + el formato, la escena, el
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
    ? `SCENE FOR THIS PRODUCT (build the environment around this so it's obvious what the product is and how it's used):
${escena}`
    : `SCENE FOR THIS PRODUCT: a clean, bright hero shot of the product on a white editorial high-key setting that fits what it is.`;

  const titular = input.titular?.trim();
  const bloqueTitular = titular
    ? `HEADLINE TEXT (render verbatim, uppercase, Poppins-style bold navy, NOT in the reserved top-left corner): "${titular}"`
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
PRICE PLACEMENT & STYLE: ${input.estiloTexto?.trim() || "Bold 3D extruded navy/red price badge with depth, highlight and subtle gradient, near the product without covering it."}`
      : `PRICE/DISCOUNT TEXT: none. Do not add any price badge.`;

  return `${ESTILO_MAESTRO}

OUTPUT FORMAT: ${FORMATO_DESC[input.formato]} — compose for this exact shape, edge to edge.

${bloqueEscena}

ART DIRECTION (the specific product and how to make it shine):
${input.direccionArte.trim() || "Showcase the product from the reference photo as the hero of the shot."}

${bloqueTitular}

${bloqueCta}

${bloquePrecio}`;
}
