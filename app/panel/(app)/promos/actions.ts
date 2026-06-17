"use server";

import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { requireRol } from "@/lib/auth/guards";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import type { ActionResult } from "@/lib/panel/resultado";

const BUCKET = "promos";

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

function revalidar() {
  revalidatePath("/"); // banner público (home)
  revalidatePath("/panel/promos");
}

/**
 * SUPERADMIN. Recibe una imagen, la convierte a WebP, la sube al bucket público
 * `promos`, borra la imagen anterior de ese mes (si había) y hace upsert de la fila.
 */
export async function subirPromo(
  formData: FormData,
): Promise<ActionResult<{ url: string }>> {
  try {
    await requireRol("superadmin");
    const anio = Number(formData.get("anio"));
    const mes = Number(formData.get("mes"));
    const titulo = ((formData.get("titulo") as string) || "").trim() || null;
    const subtitulo = ((formData.get("subtitulo") as string) || "").trim() || null;
    const enlace = ((formData.get("enlace") as string) || "").trim() || null;
    const cta_texto = ((formData.get("cta_texto") as string) || "").trim() || null;
    const file = formData.get("file");

    if (!Number.isInteger(anio) || !Number.isInteger(mes) || mes < 1 || mes > 12)
      return fail("Mes/año inválidos.");
    if (!(file instanceof File) || file.size === 0)
      return fail("Subí una imagen para el banner.");
    if (file.size > 12 * 1024 * 1024) return fail("La imagen es muy grande (máx. 12 MB).");

    // Convertir a WebP (optimizada para web).
    const entrada = Buffer.from(await file.arrayBuffer());
    let webp: Buffer;
    try {
      webp = await sharp(entrada)
        .rotate() // respeta orientación EXIF
        .resize({ width: 2000, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
    } catch {
      return fail("No se pudo procesar la imagen. Probá con un JPG o PNG válido.");
    }

    const admin = createServiceRoleClient();

    // Imagen anterior de este mes (para borrarla después).
    const { data: previa } = await admin
      .from("promos")
      .select("imagen_path")
      .eq("anio", anio)
      .eq("mes", mes)
      .maybeSingle();

    const path = `${anio}-${String(mes).padStart(2, "0")}/banner-${Date.now()}.webp`;
    const { error: upErr } = await admin.storage
      .from(BUCKET)
      .upload(path, webp, { contentType: "image/webp", upsert: false });
    if (upErr) return fail(`Error subiendo la imagen: ${upErr.message}`);

    const { data: pub } = admin.storage.from(BUCKET).getPublicUrl(path);
    const imagen_url = pub.publicUrl;

    const { error: dbErr } = await admin
      .from("promos")
      .upsert(
        { anio, mes, titulo, subtitulo, enlace, cta_texto, imagen_path: path, imagen_url, activa: true },
        { onConflict: "anio,mes" },
      );
    if (dbErr) {
      // Revertir el archivo recién subido si falló la fila.
      await admin.storage.from(BUCKET).remove([path]);
      return fail(`Error guardando la promo: ${dbErr.message}`);
    }

    // Borrar la imagen anterior (revoca la vieja, queda la nueva).
    if (previa?.imagen_path && previa.imagen_path !== path) {
      await admin.storage.from(BUCKET).remove([previa.imagen_path]);
    }

    revalidar();
    return { ok: true, data: { url: imagen_url } };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}

/** SUPERADMIN. Edita metadatos (título, enlace, activa) sin tocar la imagen. */
export async function actualizarPromo(input: {
  id: string;
  titulo?: string;
  enlace?: string;
  activa?: boolean;
}): Promise<ActionResult> {
  try {
    await requireRol("superadmin");
    const admin = createServiceRoleClient();
    const { error } = await admin
      .from("promos")
      .update({
        titulo: input.titulo?.trim() || null,
        enlace: input.enlace?.trim() || null,
        activa: input.activa,
      })
      .eq("id", input.id);
    if (error) return fail(error.message);
    revalidar();
    return { ok: true, data: undefined };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}

/** SUPERADMIN. Elimina la promo y su imagen del Storage. */
export async function eliminarPromo(input: { id: string }): Promise<ActionResult> {
  try {
    await requireRol("superadmin");
    const admin = createServiceRoleClient();
    const { data: promo } = await admin
      .from("promos")
      .select("imagen_path")
      .eq("id", input.id)
      .maybeSingle();
    if (promo?.imagen_path) {
      await admin.storage.from(BUCKET).remove([promo.imagen_path]);
    }
    const { error } = await admin.from("promos").delete().eq("id", input.id);
    if (error) return fail(error.message);
    revalidar();
    return { ok: true, data: undefined };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}
