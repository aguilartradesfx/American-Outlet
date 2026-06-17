/**
 * Prompt maestro del Estudio IA de imágenes (Nano Banana / Gemini 2.5 Flash Image).
 *
 * Define el "sello" visual de American Outlet: high-key editorial, luminoso,
 * paleta neutra con acentos azul marino + rojo, producto real como héroe y el
 * precio/descuento en tipografía 3D. La ESCENA ya NO es fija: se adapta a cada
 * producto y a su uso (patines patinando, licuadora en cocina, etc.). El estilo
 * de marca y el formato (9:16 vertical full) salen siempre iguales; la escena,
 * el detalle del producto y el texto los aporta la dirección de arte.
 *
 * Está en inglés a propósito: los modelos de imagen siguen mejor las direcciones
 * de estilo en inglés.
 */

export const ASPECT_RATIO = "9:16" as const;

const ESTILO_MAESTRO = `You are the in-house creative engine for AMERICAN OUTLET — the premium discount outlet of Costa Rica. Recreate the product(s) from the attached reference photo as a polished marketing image. Keep this EXACT brand signature every single time, but ADAPT THE SCENE to each product (see the SCENE and ART DIRECTION blocks below):

THE PRODUCT IS THE HERO:
- Recreate the real product faithfully: respect its true shape, proportions, materials, logos, text and real colors from the reference photo. Do not invent or alter the product identity.
- The product is always large, razor-sharp, with a luxury-catalog finish, and clearly the focal point of the frame.

SCENE & COMPOSITION (adaptive — NOT a fixed template):
- Build the environment and supporting elements around what the product IS and HOW IT IS USED, following the SCENE block below. The viewer should instantly recognize the product and its purpose (e.g. roller skates gliding on a smooth floor with subtle motion cues; a blender on a bright kitchen counter with fresh fruit; sneakers on an athletic track surface).
- Do NOT default to a product-bursting-out-of-a-box scene unless the SCENE block explicitly asks for it (reserve that outlet motif for generic assortments with no clear use).
- Full-frame vertical 9:16 composition, edge to edge, dynamic and energetic.

BRAND LOOK (constant across every scene):
- High-key lighting: soft, even, bright and optimistic. Never moody, never heavy contrast, no dark zones, no heavy vignette.
- Luminous, airy feel. Backgrounds stay bright (white / light gray / soft contextual tones), softly blurred where helpful (gentle bokeh).
- Color palette: bright neutral base (whites, light grays, warm beige) with brand accents of NAVY BLUE and RED used with intent. Never let the accents overpower the luminous base.
- Mood: premium yet accessible, aspirational, clean, full of light.

PRICE / DISCOUNT TEXT (3D, only when provided):
- Only render on-image text when the ART DIRECTION provides it; render it EXACTLY as written (same words, accents and characters such as ₡). Never misspell, never add text that was not provided.
- Render any PRICE or DISCOUNT as a BOLD 3D display element: chunky extruded three-dimensional typography with real depth and a crisp highlight, in brand colors (navy blue and/or red), like a premium floating sticker/badge. High impact and instantly readable — the second focal point after the product — without covering the product's key features.
- Any non-price promo line stays as a clean, modern badge in the same brand style.

HARD RULES:
- No people unless the art direction explicitly asks for them.
- No watermarks or logos other than any provided promo text and AMERICAN OUTLET branding.
- Output a single finished image in the style above.`;

/**
 * Construye el prompt final combinando el estilo fijo de marca con la escena y
 * la dirección de arte que produce Claude, más los textos exactos a renderizar.
 */
export function construirPrompt(input: {
  escena?: string;
  direccionArte: string;
  textos: string[];
  estiloTexto?: string;
}): string {
  const escena = input.escena?.trim();
  const bloqueEscena = escena
    ? `SCENE FOR THIS PRODUCT (build the whole environment around this so it's obvious what the product is and how it's used):
${escena}`
    : `SCENE FOR THIS PRODUCT: a clean, bright hero shot of the product as the star, in an editorial high-key setting that fits what it is.`;

  const textos = input.textos.map((t) => t.trim()).filter(Boolean);
  const bloqueTexto =
    textos.length > 0
      ? `TEXT TO RENDER ON THE IMAGE (verbatim, exactly as written — do not translate or alter):
${textos.map((t) => `  • "${t}"`).join("\n")}
TEXT PLACEMENT & STYLE: ${input.estiloTexto?.trim() || "Bold 3D price/discount badge in brand style (navy/red with depth), placed near the product without covering it."}`
      : `TEXT TO RENDER ON THE IMAGE: none. Do not add any text or badges.`;

  return `${ESTILO_MAESTRO}

${bloqueEscena}

ART DIRECTION (the specific product and how to make it shine):
${input.direccionArte.trim() || "Showcase the product from the reference photo as the hero of the shot."}

${bloqueTexto}`;
}
