"use server";

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { GoogleGenAI } from "@google/genai";
import Anthropic from "@anthropic-ai/sdk";
import sharp from "sharp";
import { requireSesion } from "@/lib/auth/guards";
import { cloudinary } from "@/lib/cloudinary";
import type { ActionResult } from "@/lib/panel/resultado";
import { construirPrompt, ASPECT_RATIO } from "./prompt";

/** Compone el logo oficial (SVG) arriba-izquierda de la imagen generada. */
async function componerLogo(base: Buffer): Promise<Buffer> {
  try {
    const meta = await sharp(base).metadata();
    const W = meta.width ?? 1024;
    const margen = Math.round(W * 0.05);
    const logoW = Math.round(W * 0.26);
    const svg = await readFile(join(process.cwd(), "public/brand/logo-poster.svg"));
    const logoPng = await sharp(svg, { density: 400 })
      .resize({ width: logoW })
      .png()
      .toBuffer();
    return await sharp(base)
      .composite([{ input: logoPng, top: margen, left: margen }])
      .png()
      .toBuffer();
  } catch {
    return base; // si el overlay falla, no bloqueamos la generación
  }
}

// Nano Banana Pro = modelo de imágenes de Google (mejor texto/fidelidad).
const MODELO = "gemini-3-pro-image";
// Director creativo: interpreta la nota del operador antes de generar.
const MODELO_DIRECTOR = "claude-sonnet-4-6";
const CARPETA = "american-outlet/estudio-ia";
const MIME_ENTRADA_OK = new Set(["image/jpeg", "image/png", "image/webp"]);

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

const SISTEMA_DIRECTOR = `Sos el director creativo de American Outlet, el outlet liquidador de Costa Rica (marcas de USA a precio de outlet). El operador te manda info de un producto: una nota informal en español de Costa Rica y, a veces, datos de precio (anterior, actual y/o % de descuento). Vos la convertís en la dirección de arte de un PÓSTER 1:1 sobre FONDO BLANCO con la línea gráfica de la marca.

El modelo ya tiene fijo el SELLO DE MARCA (fondo blanco, 1:1, producto real high-key como héroe, titular Poppins bold navy, eyebrow con guion rojo, CTA en pill rojo, footer de ubicación/WhatsApp; el logo se compone aparte). Vos aportás SOLO lo específico de ESTE producto.

Con la herramienta dirigir_imagen devolvé:
1. escena (inglés): entorno/contexto que deja claro QUÉ es el producto y PARA QUÉ se usa, adaptado al producto real (NO siempre el mismo), sobre fondo blanco/claro. Ej: licuadora → "blender on a bright white kitchen counter with fresh fruit"; tenis → "sneakers on a light studio surface".
2. direccion_arte (inglés): el producto concreto + énfasis visual. Corto. NO inventes características que no estén en la info.
3. titular (español): un titular corto y potente para el póster, en MAYÚSCULAS, voz de liquidador (directo, seco). Ej: "SOMOS LIQUIDADORES", "MARCAS DE USA, PRECIO DE OUTLET", "LO ÚLTIMO DE LA CARGA". Máx ~4 palabras.
4. cta (español): un call to action corto para el botón rojo. Ej: "Vení a verlo esta semana.", "Consultá por WhatsApp.".
5. textos (lista, español): SOLO el precio/descuento EXACTO a renderizar, si vienen datos o gancho de venta. % → "15% OFF"; actual → "AHORA ₡124.990"; con anterior, ambos: "ANTES ₡149.990" y "AHORA ₡124.990". Respetá ₡ y tildes. Si no hay precio, lista vacía.
6. estilo_texto (inglés): cómo colocar el badge de precio (navy/red), sin tapar el producto.

Voz de marca: español de Costa Rica, voseo, directa y seca. Producto y marca al frente; el precio cierra.`;

const HERRAMIENTA_DIRECTOR = {
  name: "dirigir_imagen",
  description:
    "Devuelve la escena adaptada al producto, la dirección de arte específica y el texto promocional exacto a renderizar.",
  input_schema: {
    type: "object" as const,
    properties: {
      escena: {
        type: "string",
        description:
          "Inglés. Entorno/contexto que deja claro qué es el producto y para qué se usa. Adaptado al producto, NO siempre el mismo.",
      },
      direccion_arte: {
        type: "string",
        description: "Inglés. Producto concreto + énfasis visual para esta toma.",
      },
      titular: {
        type: "string",
        description:
          "Español. Titular corto en MAYÚSCULAS para el póster (voz de liquidador, máx ~4 palabras).",
      },
      cta: {
        type: "string",
        description: "Español. Call to action corto para el botón rojo.",
      },
      textos: {
        type: "array",
        items: { type: "string" },
        description:
          "Español. Líneas de texto EXACTAS a renderizar (precio/descuento). Vacío si no hay gancho promocional.",
      },
      estilo_texto: {
        type: "string",
        description: "Inglés. Colocación y estilo del badge de precio en 3D de marca.",
      },
    },
    required: ["escena", "direccion_arte", "titular", "cta", "textos"],
    additionalProperties: false,
  },
};

type DireccionArte = {
  escena?: string;
  direccionArte: string;
  titular?: string;
  cta?: string;
  textos: string[];
  estiloTexto?: string;
};

export type DatosProducto = {
  info: string;
  precioAnterior?: string;
  precioActual?: string;
  descuento?: string;
};

/** Antepone ₡ a un valor numérico de precio si no trae ya un símbolo de moneda. */
function precio(v?: string): string {
  const s = (v ?? "").trim();
  if (!s) return "";
  return /^[\d]/.test(s) && !/[₡$]/.test(s) ? `₡${s}` : s;
}

/** Textos de precio/descuento deterministas para el fallback (sin IA). */
function textosDesdePrecios(d: DatosProducto): string[] {
  const out: string[] = [];
  const desc = d.descuento?.trim();
  if (desc) out.push(/%|off/i.test(desc) ? desc.toUpperCase() : `${desc}% OFF`);
  if (d.precioAnterior?.trim()) out.push(`ANTES ${precio(d.precioAnterior)}`);
  if (d.precioActual?.trim()) out.push(`AHORA ${precio(d.precioActual)}`);
  return out;
}

/** Compone la nota que ve el director a partir de la info libre + datos de precio. */
function notaParaDirector(d: DatosProducto): string {
  return [
    d.info.trim() ? `Nota del operador:\n${d.info.trim()}` : "",
    d.precioAnterior?.trim() ? `Precio anterior: ${precio(d.precioAnterior)}` : "",
    d.precioActual?.trim() ? `Precio actual: ${precio(d.precioActual)}` : "",
    d.descuento?.trim() ? `Descuento: ${d.descuento.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

/** Llama a Claude para interpretar la info. Si falla o no hay key, arma un fallback razonable. */
async function dirigirConIA(d: DatosProducto): Promise<DireccionArte> {
  const fallback: DireccionArte = {
    direccionArte: d.info,
    textos: textosDesdePrecios(d),
  };
  const nota = notaParaDirector(d);
  if (!process.env.ANTHROPIC_API_KEY || !nota) return fallback;
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const resp = await client.messages.create({
      model: MODELO_DIRECTOR,
      max_tokens: 1000,
      system: [
        { type: "text", text: SISTEMA_DIRECTOR, cache_control: { type: "ephemeral" } },
      ],
      tools: [HERRAMIENTA_DIRECTOR],
      tool_choice: { type: "tool", name: "dirigir_imagen" },
      messages: [{ role: "user", content: nota }],
    });
    const bloque = resp.content.find((c) => c.type === "tool_use");
    if (!bloque || bloque.type !== "tool_use") return fallback;
    const raw = bloque.input as {
      escena?: string;
      direccion_arte?: string;
      titular?: string;
      cta?: string;
      textos?: string[];
      estilo_texto?: string;
    };
    return {
      escena: raw.escena?.trim() || undefined,
      direccionArte: raw.direccion_arte?.trim() || d.info,
      titular: raw.titular?.trim() || undefined,
      cta: raw.cta?.trim() || undefined,
      textos: Array.isArray(raw.textos)
        ? raw.textos.filter((t) => typeof t === "string")
        : fallback.textos,
      estiloTexto: raw.estilo_texto?.trim() || undefined,
    };
  } catch {
    return fallback;
  }
}

export type ResultadoGeneracion = {
  /** Data URI listo para previsualizar en un <img> (PNG sin comprimir del modelo). */
  dataUri: string;
  /** Texto promocional que el director decidió poner en la imagen (para mostrar en UI). */
  textos: string[];
};

/**
 * Genera una imagen cinemática con el estilo maestro fijo a partir de una foto
 * de referencia + la info variable del usuario. NO la guarda todavía.
 */
export async function generarImagen(input: {
  imagenBase64: string; // base64 puro (sin el prefijo data:)
  mimeType: string;
  info: string;
  precioAnterior?: string;
  precioActual?: string;
  descuento?: string;
}): Promise<ActionResult<ResultadoGeneracion>> {
  try {
    await requireSesion();
    if (!process.env.GEMINI_API_KEY) {
      return fail("Falta GEMINI_API_KEY en el servidor. Agregala a .env.local.");
    }
    if (!input.imagenBase64) return fail("Subí una foto de referencia primero.");
    if (!MIME_ENTRADA_OK.has(input.mimeType)) {
      return fail("Formato no soportado. Usá JPG, PNG o WEBP.");
    }

    // Paso 1: Claude interpreta la info, decide la escena, la dirección de arte y los textos.
    const direccion = await dirigirConIA({
      info: input.info,
      precioAnterior: input.precioAnterior,
      precioActual: input.precioActual,
      descuento: input.descuento,
    });

    // Paso 2: Nano Banana renderiza con el estilo fijo + lo interpretado.
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const resp = await ai.models.generateContent({
      model: MODELO,
      contents: [
        {
          role: "user",
          parts: [
            { text: construirPrompt(direccion) },
            { inlineData: { mimeType: input.mimeType, data: input.imagenBase64 } },
          ],
        },
      ],
      // Estilo y formato fijos: 9:16 vertical full.
      config: {
        imageConfig: { aspectRatio: ASPECT_RATIO },
      },
    });

    const partes = resp.candidates?.[0]?.content?.parts ?? [];
    const imagen = partes.find((p) => p.inlineData?.data);
    if (!imagen?.inlineData?.data) {
      // A veces el modelo responde solo texto (p. ej. rechazo o aclaración).
      const texto = partes.find((p) => p.text)?.text;
      return fail(
        texto
          ? `El modelo no devolvió imagen: ${texto.slice(0, 200)}`
          : "El modelo no devolvió una imagen. Probá de nuevo o ajustá la info.",
      );
    }

    // Overlay del logo oficial (pixel-perfect) arriba-izquierda.
    const conLogo = await componerLogo(Buffer.from(imagen.inlineData.data, "base64"));
    return {
      ok: true,
      data: {
        dataUri: `data:image/png;base64,${conLogo.toString("base64")}`,
        textos: direccion.textos,
      },
    };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error generando la imagen.");
  }
}

export type ResultadoGuardado = {
  url: string;
  publicId: string;
  width: number;
  height: number;
};

/**
 * Comprime la imagen generada (JPG) y la sube a Cloudinary, reusando el flujo
 * de assets del proyecto. Devuelve la URL lista para usar.
 */
export async function guardarEnCloudinary(input: {
  dataUri: string;
  nombre?: string;
}): Promise<ActionResult<ResultadoGuardado>> {
  try {
    await requireSesion();
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return fail("Faltan credenciales de Cloudinary en el servidor.");
    }
    const base64 = input.dataUri.split(",")[1];
    if (!base64) return fail("No hay imagen para guardar.");

    const entrada = Buffer.from(base64, "base64");
    const jpg = await sharp(entrada)
      .resize({ width: 1280, withoutEnlargement: true }) // 9:16 → 1280×2276 aprox.
      .jpeg({ quality: 88, mozjpeg: true })
      .toBuffer();

    const slug =
      (input.nombre || "imagen")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 40) || "imagen";
    const publicId = `${slug}-${Date.now()}`;

    const res = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${jpg.toString("base64")}`,
      {
        folder: CARPETA,
        public_id: publicId,
        overwrite: false,
        resource_type: "image",
      },
    );

    return {
      ok: true,
      data: {
        url: res.secure_url,
        publicId: res.public_id,
        width: res.width,
        height: res.height,
      },
    };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error subiendo a Cloudinary.");
  }
}
