/**
 * Optimizador de imágenes 100% en el navegador (canvas). NO consume tokens ni
 * llama a ninguna API: redimensiona y recomprime la foto antes de enviarla, así
 * una imagen pesada (p. ej. > 10 MB de un celular) nunca da error de subida.
 *
 * Estrategia: limita el lado más largo a LADO_MAX px y baja la calidad de forma
 * iterativa hasta quedar por debajo de OBJETIVO_BYTES. Devuelve siempre un
 * formato soportado por el modelo (WEBP, o JPEG si el navegador no exporta WEBP).
 */

export type FotoOptimizada = {
  dataUri: string;
  base64: string;
  mime: string;
  nombre: string;
};

const LADO_MAX = 2048; // lado más largo en px: suficiente para el render 9:16
const OBJETIVO_BYTES = 4 * 1024 * 1024; // ~4 MB: liviano y rápido para el modelo
const CALIDAD_INICIAL = 0.9;
const CALIDAD_MIN = 0.5;

function cargarImagen(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer la imagen."));
    };
    img.src = url;
  });
}

function canvasABlob(
  canvas: HTMLCanvasElement,
  mime: string,
  calidad: number,
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, mime, calidad));
}

function blobAFoto(blob: Blob, nombre: string): Promise<FotoOptimizada> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUri = String(reader.result);
      resolve({
        dataUri,
        base64: dataUri.split(",")[1] ?? "",
        mime: blob.type,
        nombre,
      });
    };
    reader.onerror = () => reject(new Error("No se pudo procesar la imagen."));
    reader.readAsDataURL(blob);
  });
}

/**
 * Devuelve la foto lista para enviar, siempre dentro del objetivo de tamaño.
 * Si por alguna razón no se puede recomprimir (navegador sin canvas, etc.),
 * cae al archivo original.
 */
export async function optimizarImagen(file: File): Promise<FotoOptimizada> {
  const img = await cargarImagen(file);

  const escala = Math.min(1, LADO_MAX / Math.max(img.width, img.height));
  const ancho = Math.max(1, Math.round(img.width * escala));
  const alto = Math.max(1, Math.round(img.height * escala));

  const canvas = document.createElement("canvas");
  canvas.width = ancho;
  canvas.height = alto;
  const ctx = canvas.getContext("2d");
  if (!ctx) return blobAFoto(file, file.name);

  // Fondo blanco por si la imagen original tiene transparencia (PNG → JPEG/WEBP).
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, ancho, alto);
  ctx.drawImage(img, 0, 0, ancho, alto);

  // WEBP comprime mejor; si el navegador no lo exporta, usamos JPEG.
  const soportaWebp = canvas
    .toDataURL("image/webp")
    .startsWith("data:image/webp");
  const mime = soportaWebp ? "image/webp" : "image/jpeg";

  let calidad = CALIDAD_INICIAL;
  let blob = await canvasABlob(canvas, mime, calidad);
  while (blob && blob.size > OBJETIVO_BYTES && calidad > CALIDAD_MIN) {
    calidad = Math.round((calidad - 0.1) * 100) / 100;
    blob = await canvasABlob(canvas, mime, calidad);
  }

  if (!blob) return blobAFoto(file, file.name);

  const baseNombre = file.name.replace(/\.[^.]+$/, "");
  const ext = mime === "image/webp" ? "webp" : "jpg";
  return blobAFoto(blob, `${baseNombre}.${ext}`);
}
