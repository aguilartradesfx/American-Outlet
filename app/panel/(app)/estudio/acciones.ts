"use server";

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { GoogleGenAI } from "@google/genai";
import OpenAI, { toFile } from "openai";
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

// Proveedor de imágenes: "openai" = GPT Image 2 · "gemini" = Nano Banana Pro.
// Cambiá esta constante para alternar y comparar resultados.
const PROVEEDOR: "openai" | "gemini" = "openai";
const MODELO_GEMINI = "gemini-3-pro-image";
const MODELO_OPENAI = "gpt-image-2";
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

/** Genera la imagen base (sin logo) con GPT Image 2 (image-to-image). */
async function generarConOpenAI(
  prompt: string,
  base64: string,
  mime: string,
): Promise<Buffer> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const ext = mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
  const file = await toFile(Buffer.from(base64, "base64"), `producto.${ext}`, {
    type: mime,
  });
  const resp = await openai.images.edit({
    model: MODELO_OPENAI,
    image: file,
    prompt,
    size: "1024x1024",
    quality: "high",
  });
  const b64 = resp.data?.[0]?.b64_json;
  if (!b64) throw new Error("El modelo no devolvió una imagen.");
  return Buffer.from(b64, "base64");
}

/** Genera la imagen base (sin logo) con Nano Banana Pro (Gemini). */
async function generarConGemini(
  prompt: string,
  base64: string,
  mime: string,
): Promise<Buffer> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const resp = await ai.models.generateContent({
    model: MODELO_GEMINI,
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }, { inlineData: { mimeType: mime, data: base64 } }],
      },
    ],
    config: { imageConfig: { aspectRatio: ASPECT_RATIO } },
  });
  const partes = resp.candidates?.[0]?.content?.parts ?? [];
  const img = partes.find((p) => p.inlineData?.data);
  if (!img?.inlineData?.data) {
    const texto = partes.find((p) => p.text)?.text;
    throw new Error(
      texto
        ? `El modelo no devolvió imagen: ${texto.slice(0, 200)}`
        : "El modelo no devolvió una imagen. Probá de nuevo o ajustá la info.",
    );
  }
  return Buffer.from(img.inlineData.data, "base64");
}

/**
 * Genera una imagen con el estilo maestro fijo a partir de una foto de
 * referencia + la info variable del usuario. NO la guarda todavía.
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
    const faltaKey =
      PROVEEDOR === "openai"
        ? !process.env.OPENAI_API_KEY
        : !process.env.GEMINI_API_KEY;
    if (faltaKey) {
      return fail(`Falta la API key de imágenes (${PROVEEDOR}) en el servidor.`);
    }
    if (!input.imagenBase64) return fail("Subí una foto de referencia primero.");
    if (!MIME_ENTRADA_OK.has(input.mimeType)) {
      return fail("Formato no soportado. Usá JPG, PNG o WEBP.");
    }

    // Paso 1: Claude interpreta la info → escena, dirección de arte, titular, CTA, textos.
    const direccion = await dirigirConIA({
      info: input.info,
      precioAnterior: input.precioAnterior,
      precioActual: input.precioActual,
      descuento: input.descuento,
    });
    const prompt = construirPrompt(direccion);

    // Paso 2: el proveedor elegido genera la imagen (image-to-image, sin logo).
    let base: Buffer;
    try {
      base =
        PROVEEDOR === "openai"
          ? await generarConOpenAI(prompt, input.imagenBase64, input.mimeType)
          : await generarConGemini(prompt, input.imagenBase64, input.mimeType);
    } catch (e) {
      return fail(e instanceof Error ? e.message : "No se pudo generar la imagen.");
    }

    // Paso 3: overlay del logo oficial (pixel-perfect) arriba-izquierda.
    const conLogo = await componerLogo(base);
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
