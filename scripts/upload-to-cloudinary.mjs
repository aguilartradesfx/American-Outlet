#!/usr/bin/env node
/**
 * Comprime/convierte una imagen con sharp y la sube a Cloudinary.
 *
 * Uso:
 *   node --env-file=.env.local scripts/upload-to-cloudinary.mjs <input> [opciones]
 *
 * Opciones:
 *   --to <jpg|webp|avif|png>   Formato de salida        (default: jpg)
 *   --quality <1-100>          Calidad de compresión    (default: 80)
 *   --max-width <px>           Ancho máximo (mantiene proporción)  (default: 2000)
 *   --folder <ruta>            Carpeta en Cloudinary     (default: american-outlet)
 *   --id <public_id>           Nombre/ID del asset       (default: nombre del archivo)
 *   --keep-temp                No borra el archivo comprimido temporal
 *
 * Ejemplo (hero):
 *   node --env-file=.env.local scripts/upload-to-cloudinary.mjs ~/Desktop/hero.png \
 *     --to jpg --quality 82 --max-width 2400 --folder american-outlet/home --id hero
 */
import { readFile, writeFile, unlink } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { tmpdir } from "node:os";
import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";

// ---- args -----------------------------------------------------------------
const [, , input, ...rest] = process.argv;
if (!input) {
  console.error("✗ Falta la ruta de la imagen.\n  node --env-file=.env.local scripts/upload-to-cloudinary.mjs <input> [--to jpg --quality 80 ...]");
  process.exit(1);
}
const opt = (name, def) => {
  const i = rest.indexOf(`--${name}`);
  return i !== -1 && rest[i + 1] ? rest[i + 1] : def;
};
const flag = (name) => rest.includes(`--${name}`);

const to = opt("to", "jpg").toLowerCase();
const quality = parseInt(opt("quality", "80"), 10);
const maxWidth = parseInt(opt("max-width", "2000"), 10);
const folder = opt("folder", "american-outlet");
const publicId = opt("id", basename(input, extname(input)));

// ---- cloudinary config ----------------------------------------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.error("✗ Faltan credenciales. Corré con: node --env-file=.env.local ...");
  process.exit(1);
}

// ---- comprimir / convertir ------------------------------------------------
const srcBytes = (await readFile(input)).length;
let pipeline = sharp(input).resize({ width: maxWidth, withoutEnlargement: true });

const ext = to === "jpeg" ? "jpg" : to;
switch (ext) {
  case "jpg":  pipeline = pipeline.jpeg({ quality, mozjpeg: true }); break;
  case "webp": pipeline = pipeline.webp({ quality }); break;
  case "avif": pipeline = pipeline.avif({ quality }); break;
  case "png":  pipeline = pipeline.png({ compressionLevel: 9 }); break;
  default:
    console.error(`✗ Formato no soportado: ${to}`);
    process.exit(1);
}

const tmpPath = join(tmpdir(), `ao-${publicId}.${ext}`);
const outBuf = await pipeline.toBuffer();
await writeFile(tmpPath, outBuf);

const fmt = (n) => (n / 1024).toFixed(0) + " KB";
const saved = (100 - (outBuf.length / srcBytes) * 100).toFixed(0);
console.log(`• ${basename(input)}  ${fmt(srcBytes)} → ${fmt(outBuf.length)} (${saved}% menos, ${ext}, máx ${maxWidth}px, q${quality})`);

// ---- subir ----------------------------------------------------------------
try {
  const res = await cloudinary.uploader.upload(tmpPath, {
    folder,
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
  });
  console.log("\n✓ Subida lista");
  console.log("  public_id :", res.public_id);
  console.log("  dimensión :", `${res.width}×${res.height}`);
  console.log("  URL       :", res.secure_url);
} catch (err) {
  console.error("✗ Error al subir:", err?.message || err);
  process.exitCode = 1;
} finally {
  if (!flag("keep-temp")) await unlink(tmpPath).catch(() => {});
}
